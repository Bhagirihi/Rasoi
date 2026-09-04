import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { logRecipeView } from '@/lib/recommendations';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const { id: recipeId } = await context.params;
    if (!recipeId?.trim()) return jsonError('Recipe id required', 400);

    await logRecipeView(user.id, recipeId.trim());
    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
