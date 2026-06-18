import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'rasoi-dev-secret-change-in-production',
);

export type TokenPayload = {
  sub: string;
  type: 'user' | 'admin';
  /** Admin display name — avoids a DB round-trip on every /admin page when present. */
  name?: string;
};

export async function signToken(payload: TokenPayload, expiresIn = '30d') {
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

export async function getUserFromRequest(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'user') return null;

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) return null;
  return user;
}

export async function getAdminFromRequest(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'admin') return null;

  return prisma.admin.findUnique({ where: { id: payload.sub } });
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

  return prisma.admin.findUnique({ where: { id: payload.sub } });
}
