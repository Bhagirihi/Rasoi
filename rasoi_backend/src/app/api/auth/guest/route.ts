import { NextRequest } from 'next/server';
import { z } from 'zod';

import { db } from '@/lib/db';
import { getAutoTrialWriteForNewUser, getAutoTrialWriteIfEligible } from '@/lib/auto-trial';
import { signToken } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { CURRENT_TERMS_VERSION } from '@/lib/legal-version';
import { enforceRateLimit } from '@/lib/rate-limit';
import { createSupabaseAdmin } from '@/lib/supabase-admin';
import { serializeUser } from '@/lib/serializers';

const guestSchema = z.object({
  acceptedTerms: z.literal(true),
  termsVersion: z.string().trim().min(1).optional(),
  name: z.string().trim().min(2).max(80).optional(),
});

function getBearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

function isAnonymousAuthUser(user: {
  is_anonymous?: boolean;
  app_metadata?: Record<string, unknown>;
}): boolean {
  if (user.is_anonymous === true) return true;
  const provider = user.app_metadata?.provider;
  return provider === 'anonymous';
}

export async function POST(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, 'auth-guest', 20, 60_000);
    if (!limited.ok) {
      return jsonError('Too many requests. Try again shortly.', 429);
    }

    const body = await request.json();
    const input = guestSchema.parse(body);

    const accessToken = getBearerToken(request);
    let supabaseUserId: string | null = null;

    if (accessToken) {
      try {
        const supabase = createSupabaseAdmin();
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser(accessToken);

        if (!error && authUser?.id && isAnonymousAuthUser(authUser)) {
          supabaseUserId = authUser.id;

          const existing = await db.user.findUnique({
            where: { supabaseUserId: authUser.id },
          });

          if (existing) {
            const token = await signToken({ sub: existing.id, type: 'user' });
            const trialUpdate = await getAutoTrialWriteIfEligible(existing);
            if (input.name && input.name !== existing.name) {
              const updated = await db.user.update({
                where: { id: existing.id },
                data: {
                  name: input.name,
                  ...trialUpdate,
                },
              });
              return jsonOk({
                token,
                user: serializeUser(updated),
              });
            }
            if (Object.keys(trialUpdate).length > 0) {
              const updated = await db.user.update({
                where: { id: existing.id },
                data: trialUpdate,
              });
              return jsonOk({
                token,
                user: serializeUser(updated),
              });
            }
            return jsonOk({
              token,
              user: serializeUser(existing),
            });
          }
        }
      } catch {
        // Fall back to guest without Supabase link when admin client is unavailable.
      }
    }

    const autoTrial = await getAutoTrialWriteForNewUser();

    const user = await db.user.create({
      data: {
        name: input.name?.trim() || 'Guest',
        isGuest: true,
        supabaseUserId,
        termsAcceptedAt: new Date(),
        termsAcceptedVersion: input.termsVersion ?? CURRENT_TERMS_VERSION,
        ...autoTrial,
      },
    });

    const token = await signToken({ sub: user.id, type: 'user' });

    return jsonOk({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
