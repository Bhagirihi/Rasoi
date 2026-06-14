import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { savedRecipesSchema } from '@/lib/validators';
import { parseJson, serializeUser } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    return jsonOk({
      recipeIds: parseJson<string[]>(user.savedRecipeIds, []),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = savedRecipesSchema.parse(body);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { savedRecipeIds: JSON.stringify(input.recipeIds) },
    });

    return jsonOk(serializeUser(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
