import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { db } from '@/lib/db';
import { plannerProfileSchema } from '@/lib/validators';

/**
 * Planner profile fields (household size, servings, calorie target,
 * max prep time, allergies, dislikes). Stored on User next to the existing
 * diet / region / pantry fields; arrays are JSON strings, matching the
 * pantryIngredients convention.
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const body = await request.json();
    const input = plannerProfileSchema.parse(body);

    const data: {
      householdSize?: number;
      servingsDefault?: number;
      dailyCalorieTarget?: number | null;
      maxPrepTimeMin?: number | null;
      allergies?: string;
      dislikedIngredients?: string;
    } = {};
    if (input.householdSize !== undefined) data.householdSize = input.householdSize;
    if (input.servingsDefault !== undefined) data.servingsDefault = input.servingsDefault;
    if (input.dailyCalorieTarget !== undefined) data.dailyCalorieTarget = input.dailyCalorieTarget;
    if (input.maxPrepTimeMin !== undefined) data.maxPrepTimeMin = input.maxPrepTimeMin;
    if (input.allergies !== undefined) data.allergies = JSON.stringify(input.allergies);
    if (input.dislikedIngredients !== undefined) {
      data.dislikedIngredients = JSON.stringify(input.dislikedIngredients);
    }

    const updated = await db.user.update({ where: { id: user.id }, data });
    return jsonOk({
      householdSize: updated.householdSize,
      servingsDefault: updated.servingsDefault,
      dailyCalorieTarget: updated.dailyCalorieTarget,
      maxPrepTimeMin: updated.maxPrepTimeMin,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
