import 'dotenv/config';

import { Pool } from 'pg';

import { getDirectDatabaseUrl, getPooledDatabaseUrl } from '@/lib/database-url';

function hostFrom(url: string) {
  return new URL(url.replace(/^postgresql:/, 'http:')).host;
}

async function tryUrl(label: string, url: string) {
  console.log(`\n→ ${label} (${hostFrom(url)})`);
  const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 10_000, max: 1 });
  try {
    const result = await pool.query('SELECT 1 AS ok');
    console.log('  ✓ connected', result.rows[0]);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
    console.log('  ✗', message);
    return false;
  } finally {
    await pool.end();
  }
}

async function main() {
  console.log('Supabase DB connectivity check');
  console.log('Project ref:', process.env.SUPABASE_PROJECT_REF ?? '(missing)');
  console.log('DATABASE_URL set:', Boolean(process.env.DATABASE_URL?.trim()));
  console.log('SUPABASE_POOLER_HOST:', process.env.SUPABASE_POOLER_HOST?.trim() ?? '(not set)');

  const pooledOk = await tryUrl('pooled (runtime)', getPooledDatabaseUrl());
  const directOk = await tryUrl('direct (migrations)', getDirectDatabaseUrl());

  if (!pooledOk) {
    console.log(`
Hint: db.<project-ref>.supabase.co is often IPv6-only from local networks.
Copy the "Transaction pooler" URI from Supabase → Connect and set DATABASE_URL in .env.
Or set SUPABASE_POOLER_HOST to the exact pooler hostname shown in the dashboard.`);
    process.exit(1);
  }

  if (!directOk) {
    console.log('\nPooled works; direct failed (migrations may need DIRECT_URL from dashboard).');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
