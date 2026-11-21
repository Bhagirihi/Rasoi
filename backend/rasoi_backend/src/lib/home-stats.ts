import { unstable_cache } from 'next/cache';

import { db } from '@/lib/db';

/** Marketing pages show this static count; admin uses live DB count.
 *  Verified 2026-11-20 via live Supabase rasoi.Recipe: 7,938 rows, all
 *  published=true. Label rounds down to 7,900+ so it stays true as the
 *  daily recipe adds grow the catalog. */
export const MARKETING_RECIPE_COUNT = 7900;

export const getPublishedRecipeCount = unstable_cache(
  async () => db.recipe.count({ where: { published: true } }),
  ['published-recipe-count'],
  { revalidate: 300 },
);
