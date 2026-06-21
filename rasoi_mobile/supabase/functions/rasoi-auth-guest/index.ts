import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

import {
  autoTrialWriteForNewUser,
  readPaymentsEnabled,
  trialWriteIfEligible,
} from '../_shared/autoTrial.ts';
import { corsHeaders, fail, ok } from '../_shared/http.ts';
import { isAnonymousAuthUser, serializeUser } from '../_shared/serializeUser.ts';

const CURRENT_TERMS_VERSION = Deno.env.get('RASOI_TERMS_VERSION') ?? '2025-06-01';

type GuestBody = {
  acceptedTerms: true;
  termsVersion?: string;
  name?: string;
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

  let body: GuestBody;
  try {
    body = (await request.json()) as GuestBody;
  } catch {
    return fail('Invalid request body', 400);
  }

  if (body.acceptedTerms !== true) {
    return fail('Terms and Privacy Policy must be accepted', 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return fail('Guest login is temporarily unavailable', 503);
  }

  const accessToken = getBearerToken(request);
  const guestName = body.name?.trim();
  const resolvedName = guestName && guestName.length >= 2 ? guestName : 'Guest';
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }).schema('rasoi');

  const paymentsEnabled = await readPaymentsEnabled(db);
  const now = new Date().toISOString();
  const autoTrial = await autoTrialWriteForNewUser(db, now);

  if (accessToken) {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const {
      data: { user: authUser },
      error,
    } = await userClient.auth.getUser();

    if (!error && authUser?.id && isAnonymousAuthUser(authUser)) {
      const { data: existing } = await db
        .from('User')
        .select('*')
        .eq('supabaseUserId', authUser.id)
        .maybeSingle();

      if (existing) {
        const trialUpdate = trialWriteIfEligible(existing as Record<string, unknown>, paymentsEnabled, now);
        if (guestName && guestName !== existing.name) {
          const { data: updated, error: updateError } = await db
            .from('User')
            .update({ name: guestName, updatedAt: now, ...trialUpdate })
            .eq('id', existing.id)
            .select('*')
            .single();

          if (updateError || !updated) {
            return fail(updateError?.message ?? 'Could not update guest profile', 500);
          }

          return ok({ user: serializeUser(updated as Record<string, unknown>) });
        }

        if (Object.keys(trialUpdate).length > 0) {
          const { data: updated, error: updateError } = await db
            .from('User')
            .update({ ...trialUpdate, updatedAt: now })
            .eq('id', existing.id)
            .select('*')
            .single();

          if (updateError || !updated) {
            return fail(updateError?.message ?? 'Could not update guest profile', 500);
          }

          return ok({ user: serializeUser(updated as Record<string, unknown>) });
        }

        return ok({ user: serializeUser(existing as Record<string, unknown>) });
      }

      const { data: created, error: createError } = await db
        .from('User')
        .insert({
          name: resolvedName,
          isGuest: true,
          supabaseUserId: authUser.id,
          termsAcceptedAt: now,
          termsAcceptedVersion: body.termsVersion ?? CURRENT_TERMS_VERSION,
          ...autoTrial,
        })
        .select('*')
        .single();

      if (createError || !created) {
        return fail(createError?.message ?? 'Could not create guest profile', 500);
      }

      return ok({ user: serializeUser(created as Record<string, unknown>) });
    }
  }

  const { data: created, error: createError } = await db
    .from('User')
    .insert({
      name: resolvedName,
      isGuest: true,
      supabaseUserId: null,
      termsAcceptedAt: now,
      termsAcceptedVersion: body.termsVersion ?? CURRENT_TERMS_VERSION,
      ...autoTrial,
    })
    .select('*')
    .single();

  if (createError || !created) {
    return fail(createError?.message ?? 'Could not create guest profile', 500);
  }

  return ok({ user: serializeUser(created as Record<string, unknown>) });
});
