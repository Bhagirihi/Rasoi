import { db } from '@/lib/db';
import { buildPaginationMeta, type PaginatedItems } from '@/lib/pagination';
import type { Recipe } from '@/lib/db/types';

const RECIPE_PAGE_SIZE = 500;

/** Load every recipe row, working around PostgREST's 1000-row cap per request. */
export async function fetchAllRecipesBatched(
  args: {
    where?: Record<string, unknown>;
    orderBy?: { createdAt: 'asc' | 'desc' };
  } = {},
): Promise<Recipe[]> {
  const orderBy = args.orderBy ?? { createdAt: 'desc' as const };
  const total = await db.recipe.count({ where: args.where });
  if (total === 0) return [];

  const rows: Recipe[] = [];
  for (let offset = 0; offset < total; offset += RECIPE_PAGE_SIZE) {
    const batch = await db.recipe.findMany({
      where: args.where,
      orderBy,
      take: RECIPE_PAGE_SIZE,
      skip: offset,
    });
    rows.push(...batch);
    if (batch.length < RECIPE_PAGE_SIZE) break;
  }

  return rows;
}

export async function fetchRecipesPage(
  args: {
    where?: Record<string, unknown>;
    orderBy?: { createdAt: 'asc' | 'desc' };
    limit: number;
    offset: number;
  },
): Promise<PaginatedItems<Recipe>> {
  const orderBy = args.orderBy ?? { createdAt: 'desc' as const };
  const [items, total] = await Promise.all([
    db.recipe.findMany({
      where: args.where,
      orderBy,
      take: args.limit,
      skip: args.offset,
    }),
    db.recipe.count({ where: args.where }),
  ]);

  return {
    items,
    pagination: buildPaginationMeta(args.limit, args.offset, total, items.length),
  };
}
