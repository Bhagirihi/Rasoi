import type { NextRequest } from 'next/server';

/**
 * Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
 * In development, allow unauthenticated calls for local testing.
 */
export function isAuthorizedCronRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();

  if (!secret) {
    return process.env.NODE_ENV === 'development';
  }

  const authorization = request.headers.get('authorization');
  return authorization === `Bearer ${secret}`;
}
