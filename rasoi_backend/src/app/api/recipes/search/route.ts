import { NextRequest } from 'next/server';

import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { db } from '@/lib/db';
import { isJainSafeRecipe } from '@/lib/jain-safe';
import { buildPaginationMeta, parsePaginationParams } from '@/lib/pagination';
import { dietChoiceToDietType } from '@/lib/recipe-filters';
import { recipeMatchesSearchQuery } from '@/lib/recipe-search-query';
import { serializeRecipeListItem } from '@/lib/serializers';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, 'recipes-search', 60, 60_000);
    if (!limited.ok) {
      return jsonError('Too many requests. Please try again shortly.', 429);
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() ?? '';
    if (query.length < 2) {
      return jsonOk({
        items: [],
        pagination: buildPaginationMeta(0, 0, 0, 0),
      });
    }

    const dietChoice = searchParams.get('dietChoice') ?? searchParams.get('diet') ?? undefined;
    const region = searchParams.get('region') ?? undefined;
    const dietType = dietChoice ? dietChoiceToDietType(dietChoice) : undefined;

    const { limit, offset } = parsePaginationParams(searchParams, {
      defaultLimit: 40,
      maxLimit: 80,
    });

    const where: {
      published: boolean;
      dietType?: string;
      region?: string;
    } = { published: true };

    if (dietType) where.dietType = dietType;
    if (region && region !== 'all' && region !== 'All India') {
      where.region = region;
    }

    // Candidate set is intentionally bounded: full recipe rows (steps/ingredients
    // JSON) are scored in JS, so pulling thousands per request is the main
    // cost. Long-term this belongs in Postgres (trigram index on a searchable
    // text column — see the migration adding one).
    const candidates = await db.recipe.findMany({
      where,
      orderBy: [{ popularityScore: 'desc' }, { title: 'asc' }],
      take: 1000,
    });

    let matched = candidates.filter((recipe) =>
      recipeMatchesSearchQuery(
        {
          title: recipe.title,
          description: '',
          region: recipe.region,
          dietType: recipe.dietType,
          tags: [],
          ingredients: recipe.ingredients,
        },
        query,
      ),
    );

    if (dietChoice === 'Jain') {
      matched = matched.filter((recipe) => isJainSafeRecipe(recipe));
    }

    const total = matched.length;
    const page = matched.slice(offset, offset + limit);
    const items = page.map(serializeRecipeListItem);

    return jsonOk({
      items,
      pagination: buildPaginationMeta(limit, offset, total, items.length),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
