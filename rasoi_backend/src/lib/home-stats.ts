import { unstable_cache } from 'next/cache';

import { prisma } from '@/lib/prisma';

export const getPublishedRecipeCount = unstable_cache(
  async () => prisma.recipe.count({ where: { published: true } }),
  ['published-recipe-count'],
  { revalidate: 300 },
);
