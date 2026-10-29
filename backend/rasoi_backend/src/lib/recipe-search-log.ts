import { Pool } from 'pg';

import { getPooledDatabaseUrl } from '@/lib/database-url';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: getPooledDatabaseUrl() });
  }
  return pool;
}

export async function logRecipeSearch(input: {
  userId?: string | null;
  query: string;
  sourceScreen?: string;
  resultCount?: number;
}): Promise<string> {
  const client = getPool();
  const result = await client.query<{ id: string }>(
    `
      INSERT INTO public.recipe_searches (user_id, query, source_screen, result_count)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
    [
      input.userId ?? null,
      input.query.trim(),
      input.sourceScreen ?? 'home',
      input.resultCount ?? null,
    ],
  );

  return result.rows[0]?.id ?? '';
}
