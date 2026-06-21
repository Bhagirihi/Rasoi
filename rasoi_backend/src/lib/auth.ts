import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { getJwtSecretBytes } from '@/lib/env';
import { db } from '@/lib/db';
import { createSupabaseAdmin } from '@/lib/supabase-admin';

const JWT_SECRET = getJwtSecretBytes();

export type TokenPayload = {
  sub: string;
  type: 'user' | 'admin';
  /** Admin display name — avoids a DB round-trip on every /admin page when present. */
  name?: string;
};

/** Long-lived until explicit logout; Supabase sessions refresh independently on mobile. */
export async function signToken(payload: TokenPayload, expiresIn = '400d') {
  return new SignJWT({
    type: payload.type,
    ...(payload.name ? { name: payload.name } : {}),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const sub = payload.sub;
    if (!sub || typeof sub !== 'string') return null;
    const type = payload.type;
    if (type !== 'user' && type !== 'admin') return null;
    const name = payload.name;
    return {
      sub,
      type,
      name: typeof name === 'string' ? name : undefined,
    };
  } catch {
    return null;
  }
}

export function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim();
}

async function getUserFromSupabaseToken(token: string) {
  try {
    const supabase = createSupabaseAdmin();
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !authUser?.id) {
      return null;
    }

    return db.user.findFirst({
      where: {
        supabaseUserId: authUser.id,
        isActive: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) return null;

  const supabaseUser = await getUserFromSupabaseToken(token);
  if (supabaseUser) {
    return supabaseUser;
  }

  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'user') return null;

  const user = await db.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) return null;
  return user;
}

export async function getAdminFromRequest(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'admin') return null;

  return db.admin.findUnique({ where: { id: payload.sub } });
}

export async function getAdminFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rasoi_admin_token')?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'admin') return null;

  if (payload.name) {
    return { id: payload.sub, name: payload.name, email: '' };
  }

  return db.admin.findUnique({ where: { id: payload.sub } });
}
