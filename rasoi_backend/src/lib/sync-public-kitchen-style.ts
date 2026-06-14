import { Pool } from 'pg';

import type { KitchenStyle } from '@/generated/prisma/client';
import { getPooledDatabaseUrl } from '@/lib/database-url';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: getPooledDatabaseUrl() });
  }
  return pool;
}

/**
 * Keeps legacy `public.cuisines` aligned with Prisma `rasoi.KitchenStyle`.
 * Admin/API use `rasoi`; Supabase Table Editor shows `public.cuisines`.
 */
export async function syncPublicKitchenStyle(style: KitchenStyle): Promise<void> {
  const client = getPool();

  await client.query(
    `
      INSERT INTO public.cuisines (
        id,
        label,
        tagline,
        mood,
        region,
        hero_image,
        sort_order,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label,
        tagline = EXCLUDED.tagline,
        mood = EXCLUDED.mood,
        region = EXCLUDED.region,
        hero_image = EXCLUDED.hero_image,
        sort_order = EXCLUDED.sort_order
    `,
    [
      style.id,
      style.label,
      style.tagline,
      style.mood,
      style.region,
      style.heroImage,
      style.sortOrder,
      style.createdAt,
    ],
  );
}

export async function deletePublicKitchenStyle(id: string): Promise<void> {
  const client = getPool();
  await client.query('DELETE FROM public.cuisines WHERE id = $1', [id]);
}
