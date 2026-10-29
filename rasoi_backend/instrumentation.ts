// Next.js server instrumentation: backend error monitoring via Sentry.
// No-op unless SENTRY_DSN is set, so local dev and existing deploys are
// unaffected. Set SENTRY_DSN in Vercel env vars to enable.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const dsn = process.env.SENTRY_DSN?.trim();
  if (!dsn) return;

  const Sentry = await import('@sentry/nextjs');
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}
