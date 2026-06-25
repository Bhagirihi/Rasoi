import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { dismissRecipeRecommendation } from '@/lib/recommendations';
import { getScheduledMealWindowForTimezone } from '@/lib/meal-time';
import { z } from 'zod';

const bodySchema = z.object({
  recipeId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = bodySchema.parse(await request.json());
    const timezone = user.timezone || 'Asia/Kolkata';
    const mealWindow = getScheduledMealWindowForTimezone(timezone);

    await dismissRecipeRecommendation(user.id, body.recipeId, mealWindow.slot);

    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
