import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { isProduction } from '@/lib/env';

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: message, details }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const details = isProduction()
      ? { formErrors: error.flatten().formErrors }
      : error.flatten();
    return jsonError('Validation failed', 400, details);
  }

  console.error(error);
  // Backend error monitoring: forwards to Sentry when SENTRY_DSN is set
  // (see instrumentation.ts). Fire-and-forget — never breaks the response.
  if (process.env.SENTRY_DSN) {
    import('@sentry/nextjs')
      .then((Sentry) => Sentry.captureException(error))
      .catch(() => {});
  }
  return jsonError('Internal server error', 500);
}
