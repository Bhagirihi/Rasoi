import { db, DbError } from '@/lib/db';
import { getAutoTrialWriteForNewUser, getAutoTrialWriteIfEligible } from '@/lib/auto-trial';
import { getDefaultPantryIngredients } from '@/lib/app-settings';
import { signToken } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { assertAllowedEmail } from '@/lib/identity-validation';
import { validateFavoriteCuisines } from '@/lib/kitchen-styles';
import { CURRENT_TERMS_VERSION } from '@/lib/legal-version';
import { enforceRateLimit } from '@/lib/rate-limit';
import { createSupabaseAdmin } from '@/lib/supabase-admin';
import { supabaseSyncSchema } from '@/lib/validators';
import { serializeUser } from '@/lib/serializers';
import type { User } from '@/lib/db/types';
import type { NextRequest } from 'next/server';

function getBearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at <= 1) return '***';
  return `${email.slice(0, 2)}***${email.slice(at)}`;
}

async function findConflictingRegisteredUser(
  email: string,
  phone: string | undefined,
  excludeUserId?: string,
): Promise<User | null> {
  return db.user.findFirst({
    where: {
      id: excludeUserId ? { not: excludeUserId } : undefined,
      isGuest: false,
      OR: [{ email }, ...(phone ? [{ phone }] : [])],
    },
  });
}

async function verifyGuestLinkOwnership(
  linkGuestUserId: string,
  supabaseUserId: string,
): Promise<boolean> {
  const guest = await db.user.findUnique({ where: { id: linkGuestUserId } });
  return Boolean(guest?.isGuest && guest.supabaseUserId === supabaseUserId);
}

export async function POST(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, 'auth-supabase-sync', 30, 60_000);
    if (!limited.ok) {
      return jsonError('Too many requests. Try again shortly.', 429);
    }

    const accessToken = getBearerToken(request);
    if (!accessToken) {
      console.error('[supabase-sync] missing bearer token');
      return jsonError('Missing Supabase access token', 401);
    }

    console.log('[supabase-sync] verifying token', { tokenLength: accessToken.length });

    let supabase;
    try {
      supabase = createSupabaseAdmin();
    } catch (error) {
      console.error('[supabase-sync] admin client not configured', {
        message: error instanceof Error ? error.message : String(error),
      });
      return jsonError('Email login is temporarily unavailable. Please try again later.', 503);
    }

    const [authResult, body] = await Promise.all([
      supabase.auth.getUser(accessToken),
      request.json(),
    ]);

    const {
      data: { user: authUser },
      error: authError,
    } = authResult;

    if (authError || !authUser?.email) {
      console.error('[supabase-sync] invalid supabase session', {
        message: authError?.message,
        hasUser: Boolean(authUser),
        hasEmail: Boolean(authUser?.email),
      });
      return jsonError('Invalid or expired email verification', 401);
    }

    try {
      assertAllowedEmail(authUser.email);
    } catch (error) {
      return jsonError(
        error instanceof Error ? error.message : 'Temporary email addresses are not allowed',
        400,
      );
    }

    const input = supabaseSyncSchema.parse(body);

    if (input.linkGuestUserId) {
      const ownsGuest = await verifyGuestLinkOwnership(input.linkGuestUserId, authUser.id);
      if (!ownsGuest) {
        return jsonError('Invalid guest account link', 403);
      }
    }

    if (input.onboarding) {
      await validateFavoriteCuisines(input.onboarding.favoriteCuisines);
    }

    if (input.phoneVerified) {
      const { error: metaError } = await supabase.auth.admin.updateUserById(authUser.id, {
        user_metadata: {
          ...(typeof authUser.user_metadata === 'object' && authUser.user_metadata
            ? authUser.user_metadata
            : {}),
          ...(input.phone ? { phone: input.phone } : {}),
          phone_verified: true,
          phone_verified_at: new Date().toISOString(),
        },
      });
      if (metaError) {
        console.warn('[supabase-sync] phone metadata update failed', {
          message: metaError.message,
          userId: authUser.id.slice(0, 8),
        });
      }
    }

    const onboardingData = input.onboarding
      ? {
          hasCompletedOnboarding: true,
          dietPreference: input.onboarding.dietPreference,
          dietChoice: input.onboarding.dietChoice,
          regionalCuisine: input.onboarding.regionalCuisine,
          favoriteCuisines: JSON.stringify(input.onboarding.favoriteCuisines),
          notificationsEnabled: input.onboarding.notificationsEnabled,
        }
      : {};

    const [existingBySupabase, guestByLink, existingByEmail, existingByPhone] = await Promise.all([
      db.user.findUnique({
        where: { supabaseUserId: authUser.id },
      }),
      input.linkGuestUserId
        ? db.user.findFirst({
            where: { id: input.linkGuestUserId, isGuest: true },
          })
        : Promise.resolve(null),
      db.user.findUnique({
        where: { email: authUser.email },
      }),
      input.phone
        ? db.user.findFirst({
            where: { phone: input.phone },
          })
        : Promise.resolve(null),
    ]);

    const existing =
      existingBySupabase ?? guestByLink ?? existingByEmail ?? existingByPhone ?? null;

    if (existing && !existing.isActive) {
      return jsonError('This account has been deactivated.', 403);
    }

    const needsTerms =
      !existing ||
      (!existing.termsAcceptedAt && (existing.isGuest || !existingBySupabase));

    if (needsTerms && !input.acceptedTerms) {
      return jsonError('Terms and Privacy Policy must be accepted', 400);
    }

    const upgradingGuest = Boolean(existing?.isGuest);

    if (upgradingGuest && existing) {
      const conflict = await findConflictingRegisteredUser(
        authUser.email,
        input.phone,
        existing.id,
      );
      if (conflict) {
        return jsonError('This email or phone is already registered to another account', 409);
      }
    }

    console.log('[supabase-sync] upserting user', {
      email: maskEmail(authUser.email),
      phoneLength: input.phone?.length ?? 0,
      nameLength: input.name.trim().length,
      upgradingGuest,
      supabaseUserId: authUser.id.slice(0, 8),
    });

    const termsUpdate =
      input.acceptedTerms && !existing?.termsAcceptedAt
        ? {
            termsAcceptedAt: new Date(),
            termsAcceptedVersion: CURRENT_TERMS_VERSION,
          }
        : {};

    const trialUpdate = existing
      ? await getAutoTrialWriteIfEligible(existing)
      : await getAutoTrialWriteForNewUser();

    const defaultPantry = existing ? null : await getDefaultPantryIngredients();

    let user;
    if (existing) {
      user = await db.user.update({
          where: { id: existing.id },
          data: {
            name: input.name,
            phone: input.phone ?? existing.phone,
            email: authUser.email,
            isGuest: false,
            supabaseUserId: authUser.id,
            ...(input.gender ? { gender: input.gender } : {}),
            ...termsUpdate,
            ...(!existing.hasCompletedOnboarding ? onboardingData : {}),
            ...trialUpdate,
          },
        });
    } else {
      try {
        user = await db.user.create({
          data: {
            name: input.name,
            phone: input.phone ?? null,
            email: authUser.email,
            isGuest: false,
            supabaseUserId: authUser.id,
            ...(input.gender ? { gender: input.gender } : {}),
            pantryIngredients: JSON.stringify(defaultPantry ?? []),
            termsAcceptedAt: new Date(),
            termsAcceptedVersion: CURRENT_TERMS_VERSION,
            ...onboardingData,
            ...trialUpdate,
          },
        });
      } catch (error) {
        // Concurrent signups can both pass the conflict pre-checks above; the
        // DB unique constraints on email/phone are the real gate. Surface a
        // clean 409 instead of a raw 500.
        if (error instanceof DbError && error.code === '23505') {
          return jsonError(
            'This email or phone is already registered. Please log in instead.',
            409,
          );
        }
        throw error;
      }
    }

    const token = await signToken({ sub: user.id, type: 'user' });

    console.log('[supabase-sync] success', {
      userId: user.id.slice(0, 8),
      email: maskEmail(authUser.email),
      created: !existing,
      upgradedGuest: upgradingGuest,
      onboardingDone: user.hasCompletedOnboarding,
    });

    return jsonOk({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error('[supabase-sync] failed', {
      message: error instanceof Error ? error.message : String(error),
    });
    return handleApiError(error);
  }
}
