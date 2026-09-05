import { NextRequest } from 'next/server';

import { jsonOk, handleApiError } from '@/lib/api';
import { db } from '@/lib/db';
import { isJainSafeRecipe } from '@/lib/jain-safe';
import { buildPaginationMeta, parsePaginationParams } from '@/lib/pagination';
import { dietChoiceToDietType } from '@/lib/recipe-filters';
import { recipeMatchesSearchQuery } from '@/lib/recipe-search-query';
import { localizeRecipeTitleToHindi } from '@/lib/recipe-content-hi';
import { serializeRecipeListItem } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
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

    const candidates = await db.recipe.findMany({
      where,
      orderBy: [{ popularityScore: 'desc' }, { title: 'asc' }],
      take: 3000,
    });

    let matched = candidates.filter((recipe) =>
      recipeMatchesSearchQuery(
        {
          title: recipe.title,
          titleHi: localizeRecipeTitleToHindi(recipe.title),
          description: '',
          descriptionHi: recipe.descriptionHi,
          stepsHi: recipe.stepsHi,
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
