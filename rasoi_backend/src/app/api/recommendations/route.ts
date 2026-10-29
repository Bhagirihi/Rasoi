import { NextRequest } from 'next/server';

import { getUserFromRequest } from '@/lib/auth';
import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { db } from '@/lib/db';
import { getLocalTimeParts } from '@/lib/meal-time';
import { getUserRecommendations } from '@/lib/recommendations';
import {
  buildSeasonalRailPicks,
  getSeasonalRailConfig,
} from '@/lib/seasonal-rail';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return jsonError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';
    if (force) {
      // force=true bypasses the recommendation cache and re-scores the whole
      // catalog — the most expensive thing an authenticated user can trigger.
      const limited = enforceRateLimit(request, `recommendations-force:${user.id}`, 6, 600_000);
      if (!limited.ok) {
        return jsonError('Too many regeneration requests. Please try again shortly.', 429);
      }
    }
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

    const { month, day } = getLocalTimeParts(timezone);
    const seasonalConfig = getSeasonalRailConfig(month, day);
    let seasonalRail: {
      id: string;
      title: string;
      subtitle: string;
      picks: ReturnType<typeof buildSeasonalRailPicks>;
    } | null = null;

    if (seasonalConfig) {
      const recipes = await db.recipe.findMany({
        where: { published: true },
        orderBy: { popularityScore: 'desc' },
        take: 500,
      });
      const picks = buildSeasonalRailPicks(user, recipes, seasonalConfig, 3);
      if (picks.length > 0) {
        seasonalRail = {
          id: seasonalConfig.id,
          title: seasonalConfig.title,
          subtitle: seasonalConfig.subtitle,
          picks,
        };
      }
    }

    return jsonOk({
      algorithmVersion: result.primary.algorithmVersion,
      mealSlot: result.primary.mealSlot,
      windowKey: result.primary.windowKey,
      dayKey: result.primary.dayKey,
      picks: result.primary.picks,
      lateNightPick: result.lateNight?.picks[0],
      seasonalRail,
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
