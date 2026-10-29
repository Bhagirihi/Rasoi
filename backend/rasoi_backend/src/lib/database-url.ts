/**
 * Build Supabase Postgres URLs with URL-encoded passwords (safe if password contains @, #, etc.).
 *
 * Copy pooler hostname from Supabase → Connect → Connection string (do not guess aws-0 region).
 */
function allowPlaceholderDatabaseUrl(): boolean {
  return (
    process.argv.some((arg) => arg === 'generate' || arg.endsWith('/generate')) ||
    process.env.NEXT_PHASE === 'phase-production-build'
  );
}

function requirePassword(): string {
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (password) return password;

  if (allowPlaceholderDatabaseUrl()) {
    return 'placeholder';
  }

  throw new Error(
    'Set SUPABASE_DB_PASSWORD in .env (database password only — not the full connection URI).',
  );
}

function projectRef(): string {
  return process.env.SUPABASE_PROJECT_REF?.trim() ?? 'ehrwhepgdrgbvjknyaeb';
}

/** Prisma CLI / migrations — direct Postgres host (recommended). */
export function getDirectDatabaseUrl(): string {
  const explicit = process.env.DIRECT_URL?.trim();
  if (
    explicit &&
    !explicit.includes('[YOUR') &&
    !explicit.startsWith('file:')
  ) {
    return explicit;
  }

  const ref = projectRef();
  const password = requirePassword();
  if (password === 'placeholder') {
    return 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';
  }
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
}

/** App runtime — pooled Supabase connection (required on Vercel/serverless). */
export function getPooledDatabaseUrl(): string {
  const explicit = process.env.DATABASE_URL?.trim();
  if (explicit && !explicit.startsWith('file:') && !explicit.includes('[YOUR')) {
    return explicit;
  }

  const ref = projectRef();
  const password = requirePassword();
  if (password === 'placeholder') {
    return 'postgresql://postgres:postgres@127.0.0.1:5432/postgres';
  }
  const encoded = encodeURIComponent(password);

  const poolerHost = process.env.SUPABASE_POOLER_HOST?.trim();
  if (poolerHost) {
    return `postgresql://postgres.${ref}:${encoded}@${poolerHost}:6543/postgres?pgbouncer=true`;
  }

  // Shared pooler on the project DB host. Direct :5432 is IPv6-only and fails on Vercel.
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:6543/postgres?pgbouncer=true`;
}
