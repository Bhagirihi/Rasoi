import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { createSupabaseAdmin } from '@/lib/supabase-admin';
import { supabaseSyncSchema } from '@/lib/validators';
import { serializeUser } from '@/lib/serializers';

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

export async function POST(request: Request) {
  try {
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
      return jsonError('Email login is not configured on the server', 503);
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

    const input = supabaseSyncSchema.parse(body);

    let existing = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    if (!existing && input.phone) {
      existing = await prisma.user.findFirst({
        where: { phone: input.phone },
      });
    }

    if (!existing && !input.acceptedTerms) {
      return jsonError('Terms and Privacy Policy must be accepted', 400);
    }

    console.log('[supabase-sync] upserting user', {
      email: maskEmail(authUser.email),
      phoneLength: input.phone?.length ?? 0,
      nameLength: input.name.trim().length,
    });

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: input.name,
            phone: input.phone ?? existing.phone,
            email: authUser.email,
            isGuest: false,
            termsAcceptedAt:
              existing.termsAcceptedAt ?? (input.acceptedTerms ? new Date() : undefined),
          },
        })
      : await prisma.user.create({
          data: {
            name: input.name,
            phone: input.phone ?? null,
            email: authUser.email,
            isGuest: false,
            termsAcceptedAt: new Date(),
          },
        });

    const token = await signToken({ sub: user.id, type: 'user' });

    console.log('[supabase-sync] success', {
      userId: user.id.slice(0, 8),
      email: maskEmail(authUser.email),
      created: !existing,
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
