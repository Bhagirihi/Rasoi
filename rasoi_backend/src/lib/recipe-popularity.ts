import { db } from '@/lib/db';
import { queryPg } from '@/lib/db/pg';

type PopularitySignals = {
  recipeId: string;
  views: number;
  cooks: number;
  searches: number;
};

/**
 * Recompute popularityScore (0–100) from engagement signals.
 * Base 50 + views (cap 20) + cooks×3 (cap 30) + searches (cap 10).
 */
export async function updateRecipePopularityScores(): Promise<{
  recipesUpdated: number;
}> {
  const since = new Date();
  since.setDate(since.getDate() - 90);

  const [views, cooks, searchRows] = await Promise.all([
    db.userRecipeView.findMany({
      where: { viewedAt: { gte: since } },
      select: { recipeId: true },
      take: 50_000,
    }),
    db.userRecipeCooked.findMany({
      where: { cookedAt: { gte: since } },
      select: { recipeId: true },
      take: 50_000,
    }),
    queryPg<{ recipe_id: string; search_count: string }>(
      `
        SELECT matched_recipe_id AS recipe_id, COUNT(*)::text AS search_count
        FROM (
          SELECT DISTINCT ON (rs.id)
            rs.id,
            r.id AS matched_recipe_id
          FROM public.recipe_searches rs
          JOIN rasoi."Recipe" r ON LOWER(r.title) LIKE '%' || LOWER(TRIM(rs.query)) || '%'
          WHERE rs.created_at >= $1
            AND LENGTH(TRIM(rs.query)) >= 3
            AND r.published = true
          ORDER BY rs.id, r."popularityScore" DESC
        ) matched
        GROUP BY matched_recipe_id
      `,
      [since.toISOString()],
    ),
  ]);

  const signals = new Map<string, PopularitySignals>();

  for (const row of views) {
    const current = signals.get(row.recipeId) ?? {
      recipeId: row.recipeId,
      views: 0,
      cooks: 0,
      searches: 0,
    };
    current.views += 1;
    signals.set(row.recipeId, current);
  }

  for (const row of cooks) {
    const current = signals.get(row.recipeId) ?? {
      recipeId: row.recipeId,
      views: 0,
      cooks: 0,
      searches: 0,
    };
    current.cooks += 1;
    signals.set(row.recipeId, current);
  }

  for (const row of searchRows) {
    const recipeId = row.recipe_id;
    const count = Number(row.search_count) || 0;
    const current = signals.get(recipeId) ?? {
      recipeId,
      views: 0,
      cooks: 0,
      searches: 0,
    };
    current.searches += count;
    signals.set(recipeId, current);
  }

  let recipesUpdated = 0;

  for (const entry of signals.values()) {
    const viewBoost = Math.min(entry.views, 20);
    const cookBoost = Math.min(entry.cooks * 3, 30);
    const searchBoost = Math.min(entry.searches, 10);
    const popularityScore = Math.min(100, Math.max(1, 50 + viewBoost + cookBoost + searchBoost));

    await db.recipe.update({
      where: { id: entry.recipeId },
      data: { popularityScore },
    });
    recipesUpdated += 1;
  }

  return { recipesUpdated };
}
