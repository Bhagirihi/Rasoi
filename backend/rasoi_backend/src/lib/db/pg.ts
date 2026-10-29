import { Pool, type QueryResultRow } from 'pg';

import { getPooledDatabaseUrl } from '@/lib/database-url';

let pool: Pool | null = null;

export function getPgPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: getPooledDatabaseUrl(),
      max: 5,
      idleTimeoutMillis: 30_000,
    });
  }
  return pool;
}

export async function queryPg<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<T[]> {
  const client = getPgPool();
  const result = await client.query<T>(text, values);
  return result.rows;
}
