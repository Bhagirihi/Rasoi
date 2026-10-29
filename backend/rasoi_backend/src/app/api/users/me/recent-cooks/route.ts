import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { db } from '@/lib/db';
import { serializeRecipeListItem } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 10) || 10, 20);

    const cooked = await db.userRecipeCooked.findMany({
      where: { userId: user.id },
      orderBy: { cookedAt: 'desc' },
      take: limit,
    });

    if (cooked.length === 0) {
      return jsonOk({ items: [] });
    }

    const recipeIds = cooked.map((row) => row.recipeId);
    const recipes = await db.recipe.findMany({
      where: { id: { in: recipeIds }, published: true },
    });
    const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));

    const items = cooked
      .map((row) => {
        const recipe = byId.get(row.recipeId);
        if (!recipe) return null;
        return {
          recipe: serializeRecipeListItem(recipe),
          cookedAt: row.cookedAt.toISOString(),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item != null);

    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
