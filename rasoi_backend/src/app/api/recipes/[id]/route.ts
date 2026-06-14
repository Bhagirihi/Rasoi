import { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { getAdminFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { recipeUpdateSchema } from '@/lib/validators';
import { serializeRecipe } from '@/lib/serializers';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const recipe = await prisma.recipe.findUnique({ where: { id } });

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
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) return jsonError('Recipe not found', 404);

    const body = await request.json();
    const input = recipeUpdateSchema.parse(body);

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title: input.title,
        prepTime: input.prepTime,
        calories: input.calories,
        region: input.region,
        kitchenStyleId: input.kitchenStyleId,
        dietType: input.dietType,
        difficulty: input.difficulty,
        description: input.description,
        imageUrl: input.imageUrl,
        tags: input.tags ? JSON.stringify(input.tags) : undefined,
        ingredients: input.ingredients ? JSON.stringify(input.ingredients) : undefined,
        steps: input.steps ? JSON.stringify(input.steps) : undefined,
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
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) return jsonError('Recipe not found', 404);

    await prisma.recipe.delete({ where: { id } });

    return jsonOk({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
