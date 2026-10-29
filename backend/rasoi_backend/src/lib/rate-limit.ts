import type { NextRequest } from 'next/server';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Bound the map: without eviction a long-lived instance grows forever.
// NOTE: this limiter is per-process. On Vercel serverless each instance has its
// own bucket set, so this is a coarse abuse brake, not a hard global limit.
// For strict distributed limiting (auth, billing, expensive endpoints), move
// to Upstash Redis / Vercel KV.
const MAX_BUCKETS = 10_000;

function evictExpired(now: number): void {
  if (buckets.size <= MAX_BUCKETS) return;
  for (const [key, entry] of buckets) {
    if (now > entry.resetAt) buckets.delete(key);
    if (buckets.size <= MAX_BUCKETS) break;
  }
}

export function getClientIp(request: NextRequest | Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip')?.trim() ?? 'unknown';
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  evictExpired(now);
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true };
}

export function enforceRateLimit(
  request: NextRequest,
  routeKey: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const ip = getClientIp(request);
  return rateLimit(`${routeKey}:${ip}`, limit, windowMs);
}
