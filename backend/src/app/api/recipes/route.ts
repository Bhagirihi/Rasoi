import { NextRequest } from 'next/server';

import { requireAdmin } from '@/lib/admin';
import { jsonOk, handleApiError } from '@/lib/api';
import { db } from '@/lib/db';
import { buildPaginationMeta, parsePaginationParams } from '@/lib/pagination';
import { buildRecipeWhere } from '@/lib/recipe-filters';
import { serializeRecipe, serializeRecipeListItem } from '@/lib/serializers';
import { recipeCreateSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const where = buildRecipeWhere({
      region: searchParams.get('region') ?? undefined,
      dietChoice: searchParams.get('dietChoice') ?? searchParams.get('diet') ?? undefined,
      dietType: searchParams.get('dietType') ?? undefined,
      tag: searchParams.get('tag') ?? searchParams.get('fastFilter') ?? undefined,
      difficulty: searchParams.get('difficulty') ?? undefined,
      published: searchParams.get('published') ?? undefined,
    });

    const view = searchParams.get('view')?.trim().toLowerCase();
    const serialize =
      view === 'list' || view === 'mobile' ? serializeRecipeListItem : serializeRecipe;

    const { limit, offset } = parsePaginationParams(searchParams, {
      defaultLimit: 45,
      maxLimit: 200,
    });

    const [recipes, total] = await Promise.all([
      db.recipe.findMany({
        where,
        orderBy: [{ popularityScore: 'desc' }, { title: 'asc' }],
        take: limit,
        skip: offset,
      }),
      db.recipe.count({ where }),
    ]);

    const items = recipes.map(serialize);

    return jsonOk({
      items,
      pagination: buildPaginationMeta(limit, offset, total, items.length),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    const input = recipeCreateSchema.parse(body);

    const recipe = await db.recipe.create({
      data: {
        title: input.title,
        prepTime: input.prepTime,
        calories: input.calories,
        region: input.region,
        kitchenStyleId: input.kitchenStyleId,
        dietType: input.dietType,
        difficulty: input.difficulty,
        descriptionHi: input.descriptionHi?.trim() || null,
        imageUrl: input.imageUrl,
        ingredients: JSON.stringify(input.ingredients),
        steps: input.steps ? JSON.stringify(input.steps) : null,
        stepsHi: input.stepsHi?.length ? JSON.stringify(input.stepsHi) : null,
        published: input.published,
      },
    });

    return jsonOk(serializeRecipe(recipe), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
