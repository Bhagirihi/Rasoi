import { unstable_cache } from 'next/cache';

import { db } from '@/lib/db';

export const getPublishedRecipeCount = unstable_cache(
  async () => db.recipe.count({ where: { published: true } }),
  ['published-recipe-count'],
  { revalidate: 300 },
);
