import { NextRequest } from 'next/server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { getAdminFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { recipeUpdateSchema } from '@/lib/validators';
import { serializeRecipe } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const recipe = await db.recipe.findUnique({ where: { id } });

    if (!recipe) return jsonError('Recipe not found', 404);

    const admin = await getAdminFromRequest(request);
    if (!recipe.published && !admin) {
      return jsonError('Recipe not found', 404);
    }

    return jsonOk(serializeRecipe(recipe));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await context.params;
    const existing = await db.recipe.findUnique({ where: { id } });
    if (!existing) return jsonError('Recipe not found', 404);

    const body = await request.json();
    const input = recipeUpdateSchema.parse(body);

    const recipe = await db.recipe.update({
      where: { id },
      data: {
        title: input.title,
        prepTime: input.prepTime,
        calories: input.calories,
        region: input.region,
        kitchenStyleId: input.kitchenStyleId,
        dietType: input.dietType,
        difficulty: input.difficulty,
        descriptionHi:
          input.descriptionHi !== undefined ? input.descriptionHi.trim() || null : undefined,
        imageUrl: input.imageUrl,
        ingredients: input.ingredients ? JSON.stringify(input.ingredients) : undefined,
        steps: input.steps ? JSON.stringify(input.steps) : undefined,
        stepsHi:
          input.stepsHi !== undefined
            ? input.stepsHi.length > 0
              ? JSON.stringify(input.stepsHi)
              : null
            : undefined,
        published: input.published,
      },
    });

    return jsonOk(serializeRecipe(recipe));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await context.params;
    const existing = await db.recipe.findUnique({ where: { id } });
    if (!existing) return jsonError('Recipe not found', 404);

    await db.recipe.delete({ where: { id } });

    return jsonOk({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
