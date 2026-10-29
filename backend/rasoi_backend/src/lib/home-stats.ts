import { unstable_cache } from 'next/cache';

import { db } from '@/lib/db';

/** Marketing pages show this static count; admin uses live DB count. */
export const MARKETING_RECIPE_COUNT = 5388;

export const getPublishedRecipeCount = unstable_cache(
  async () => db.recipe.count({ where: { published: true } }),
  ['published-recipe-count'],
  { revalidate: 300 },
);
