import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { logRecipeCooked } from '@/lib/recommendations';
import {
  getCookingStreak,
  recordCookDay,
  resolveTimezone,
} from '@/lib/cooking-streak';
import { getLocalTimeParts } from '@/lib/meal-time';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const { id: recipeId } = await context.params;
    if (!recipeId?.trim()) return jsonError('Recipe id required', 400);

    await logRecipeCooked(user.id, recipeId.trim());

    // Streak day: same TEXT day-key convention as MealNotificationLog, in
    // the user's timezone. Upsert makes repeat cooks on one day idempotent.
    const timezone = resolveTimezone(user.timezone);
    const { dayKey } = getLocalTimeParts(timezone, new Date());
    await recordCookDay(user.id, dayKey);

    const streak = await getCookingStreak(user.id, timezone);
    return jsonOk({ ok: true, streak });
  } catch (error) {
    return handleApiError(error);
  }
}
