import { NextRequest } from 'next/server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { jsonOk, handleApiError } from '@/lib/api';
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

    const recipes = await db.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return jsonOk(recipes.map(serialize));
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
        kitchenStyleIds: JSON.stringify(
          input.kitchenStyleIds?.length ? input.kitchenStyleIds : [input.kitchenStyleId],
        ),
        dietType: input.dietType,
        difficulty: input.difficulty,
        description: input.description,
        imageUrl: input.imageUrl,
        tags: JSON.stringify(input.tags),
        ingredients: JSON.stringify(input.ingredients),
        steps: input.steps ? JSON.stringify(input.steps) : null,
        published: input.published,
      },
    });

    return jsonOk(serializeRecipe(recipe), 201);
  } catch (error) {
    return handleApiError(error);
  }
}
