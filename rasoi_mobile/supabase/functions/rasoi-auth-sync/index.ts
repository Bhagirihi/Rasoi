import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

import {
  autoTrialWriteForNewUser,
  trialWriteIfEligible,
  readPaymentsEnabled,
} from '../_shared/autoTrial.ts';
import { corsHeaders, fail, ok } from '../_shared/http.ts';
import {
  getDisposableEmailError,
  getDummyPhoneError,
  isDisposableEmail,
  isDummyIndianPhone,
} from '../_shared/identityValidation.ts';
import { normalizePhone, serializeUser } from '../_shared/serializeUser.ts';

const CURRENT_TERMS_VERSION = Deno.env.get('RASOI_TERMS_VERSION') ?? '2025-06-01';

type SyncBody = {
  name?: string;
  phone?: string;
  acceptedTerms?: true;
  linkGuestUserId?: string;
  onboarding?: {
    dietPreference: string;
    dietChoice: string;
    regionalCuisine: string;
    favoriteCuisines: string[];
    notificationsEnabled: boolean;
  };
};

function getBearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return fail('Method not allowed', 405);
  }

  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return fail('Missing Supabase access token', 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return fail('Auth sync is temporarily unavailable', 503);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user: authUser },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !authUser?.email) {
    return fail('Invalid or expired email verification', 401);
  }

  if (isDisposableEmail(authUser.email)) {
    return fail(getDisposableEmailError(), 400);
  }

  let body: SyncBody;
  try {
    body = (await request.json()) as SyncBody;
  } catch {
    return fail('Invalid request body', 400);
  }

  const name = body.name?.trim();
  if (!name || name.length < 2) {
    return fail('Name is required', 400);
  }

  const phone = normalizePhone(body.phone);
  if (phone && isDummyIndianPhone(phone)) {
    return fail(getDummyPhoneError(), 400);
  }
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const db = admin.schema('rasoi');

  if (body.linkGuestUserId) {
    const { data: guestRow } = await db
      .from('User')
      .select('id, isGuest, supabaseUserId')
      .eq('id', body.linkGuestUserId)
      .maybeSingle();

    if (!guestRow?.isGuest || guestRow.supabaseUserId !== authUser.id) {
      return fail('Invalid guest account link', 403);
    }
  }

  const onboardingData = body.onboarding
    ? {
        hasCompletedOnboarding: true,
        dietPreference: body.onboarding.dietPreference,
        dietChoice: body.onboarding.dietChoice,
        regionalCuisine: body.onboarding.regionalCuisine,
        favoriteCuisines: JSON.stringify(body.onboarding.favoriteCuisines ?? []),
        notificationsEnabled: body.onboarding.notificationsEnabled,
      }
    : {};

  const lookups = await Promise.all([
    db.from('User').select('*').eq('supabaseUserId', authUser.id).maybeSingle(),
    body.linkGuestUserId
      ? db.from('User').select('*').eq('id', body.linkGuestUserId).eq('isGuest', true).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    db.from('User').select('*').eq('email', authUser.email).maybeSingle(),
    phone
      ? db.from('User').select('*').eq('phone', phone).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const existing =
    lookups[0].data ?? lookups[1].data ?? lookups[2].data ?? lookups[3].data ?? null;

  const needsTerms =
    !existing || (!existing.termsAcceptedAt && (existing.isGuest || !lookups[0].data));

  if (needsTerms && !body.acceptedTerms) {
    return fail('Terms and Privacy Policy must be accepted', 400);
  }

  if (existing?.isGuest) {
    const { data: emailConflict } = await db
      .from('User')
      .select('id')
      .eq('isGuest', false)
      .eq('email', authUser.email)
      .neq('id', existing.id)
      .limit(1);

    if (emailConflict && emailConflict.length > 0) {
      return fail('This email or phone is already registered to another account', 409);
    }

    if (phone) {
      const { data: phoneConflict } = await db
        .from('User')
        .select('id')
        .eq('isGuest', false)
        .eq('phone', phone)
        .neq('id', existing.id)
        .limit(1);

      if (phoneConflict && phoneConflict.length > 0) {
        return fail('This email or phone is already registered to another account', 409);
      }
    }
  }

  const now = new Date().toISOString();
  const termsUpdate =
    body.acceptedTerms && !existing?.termsAcceptedAt
      ? {
          termsAcceptedAt: now,
          termsAcceptedVersion: CURRENT_TERMS_VERSION,
        }
      : {};

  const paymentsEnabled = await readPaymentsEnabled(db);
  const trialUpdate = existing
    ? trialWriteIfEligible(existing as Record<string, unknown>, paymentsEnabled, now)
    : await autoTrialWriteForNewUser(db, now);

  let savedRow: Record<string, unknown> | null = null;

  if (existing) {
    const updatePayload = {
      name,
      phone: phone ?? existing.phone,
      email: authUser.email,
      isGuest: false,
      supabaseUserId: authUser.id,
      updatedAt: now,
      ...termsUpdate,
      ...(existing.hasCompletedOnboarding ? {} : onboardingData),
      ...trialUpdate,
    };

    const { data, error } = await db
      .from('User')
      .update(updatePayload)
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error || !data) {
      return fail(error?.message ?? 'Could not update user profile', 500);
    }
    savedRow = data as Record<string, unknown>;
  } else {
    const { data, error } = await db
      .from('User')
      .insert({
        name,
        phone: phone ?? null,
        email: authUser.email,
        isGuest: false,
        supabaseUserId: authUser.id,
        termsAcceptedAt: now,
        termsAcceptedVersion: CURRENT_TERMS_VERSION,
        ...onboardingData,
        ...trialUpdate,
      })
      .select('*')
      .single();

    if (error || !data) {
      return fail(error?.message ?? 'Could not create user profile', 500);
    }
    savedRow = data as Record<string, unknown>;
  }

  return ok({ user: serializeUser(savedRow) });
});
