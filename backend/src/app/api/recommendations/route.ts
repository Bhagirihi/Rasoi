import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { getUserRecommendations } from '@/lib/recommendations';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';
    const timezone = searchParams.get('timezone')?.trim() || user.timezone || 'Asia/Kolkata';
    const excludeRecipeIds =
      searchParams
        .get('exclude')
        ?.split(',')
        .map((id) => id.trim())
        .filter(Boolean) ?? [];

    const result = await getUserRecommendations(user, {
      forceRegenerate: force,
      timezone,
      excludeRecipeIds,
    });

    return jsonOk({
      algorithmVersion: result.primary.algorithmVersion,
      mealSlot: result.primary.mealSlot,
      windowKey: result.primary.windowKey,
      dayKey: result.primary.dayKey,
      picks: result.primary.picks,
      lateNightPick: result.lateNight?.picks[0],
      seasonalRail: null,
      mealWindow: {
        slot: result.mealWindow.slot,
        windowKey: result.mealWindow.windowKey,
        dayKey: result.mealWindow.dayKey,
        isOvernightDual: result.mealWindow.isOvernightDual,
        isTomorrowBreakfast: result.mealWindow.isTomorrowBreakfast,
        tomorrowBreakfastWindowKey: result.mealWindow.tomorrowBreakfastWindowKey,
        anchorTimeLabel: result.mealWindow.anchorTimeLabel,
      },
      generatedAt: result.primary.generatedAt,
      fromCache: result.primary.fromCache,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
