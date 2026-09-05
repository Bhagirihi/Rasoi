import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Recipe } from '@/data/mockRecipes';
import { authApiFetch } from '@/utils/api';
import { dietChoiceToDietType } from '@/utils/recipeFilters';
import { normalizeRecipeIngredients } from '@/utils/recipeIngredients';
import type { CuisineId } from '@/constants/theme';

const OFFLINE_CACHE_KEY = '@rasoi/recommendations_offline_v2';

type ApiRecipeRow = {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId: string;
  kitchenStyleIds: CuisineId[];
  dietType: Recipe['dietType'];
  difficulty: Recipe['difficulty'];
  description: string;
  imageUrl: string;
  tags: Recipe['tags'];
  ingredients: unknown;
  mainIngredients?: string[];
};

export type RecommendationPickResponse = {
  recipe: ApiRecipeRow;
  reason: string;
};

export type RecommendationsResponse = {
  algorithmVersion: string;
  mealSlot: string;
  windowKey: string;
  dayKey: string;
  picks: RecommendationPickResponse[];
  lateNightPick?: RecommendationPickResponse;
  mealWindow: {
    slot: string;
    windowKey: string;
    dayKey: string;
    isOvernightDual: boolean;
    isTomorrowBreakfast: boolean;
    tomorrowBreakfastWindowKey?: string;
    anchorTimeLabel: string;
  };
  generatedAt: string;
  fromCache: boolean;
  seasonalRail?: {
    id: string;
    title: string;
    subtitle: string;
    picks: RecommendationPickResponse[];
  };
};

function mapApiRecipe(row: ApiRecipeRow): Recipe {
  const kitchenStyleIds =
    row.kitchenStyleIds?.length > 0 ? row.kitchenStyleIds : [row.kitchenStyleId as CuisineId];

  return {
    id: row.id,
    title: row.title,
    prepTime: row.prepTime,
    calories: row.calories,
    region: row.region,
    kitchenStyleId: row.kitchenStyleId as CuisineId,
    kitchenStyleIds,
    dietType: row.dietType,
    difficulty: row.difficulty,
    description: row.description,
    imageUrl: row.imageUrl,
    tags: Array.isArray(row.tags) ? row.tags : [],
    ingredients: normalizeRecipeIngredients(row.ingredients),
    mainIngredients: row.mainIngredients,
    steps: [],
  };
}

export function mapRecommendationPicks(response: RecommendationsResponse): {
  picks: Recipe[];
  reasons: string[];
  lateNightPick?: Recipe;
  lateNightReason?: string;
} {
  const picks = response.picks.map((p) => mapApiRecipe(p.recipe));
  const reasons = response.picks.map((p) => p.reason);
  const lateNightPick = response.lateNightPick
    ? mapApiRecipe(response.lateNightPick.recipe)
    : undefined;

  return {
    picks,
    reasons,
    lateNightPick,
    lateNightReason: response.lateNightPick?.reason,
  };
}

export async function saveOfflineRecommendations(
  windowKey: string,
  payload: RecommendationsResponse,
): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_CACHE_KEY);
    const store = raw ? (JSON.parse(raw) as Record<string, RecommendationsResponse>) : {};
    store[windowKey] = { ...payload, seasonalRail: undefined };
    const keys = Object.keys(store);
    if (keys.length > 16) {
      for (const key of keys.slice(0, keys.length - 16)) {
        delete store[key];
      }
    }
    await AsyncStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(store));
  } catch {
    // non-fatal
  }
}

export async function loadOfflineRecommendations(
  windowKey: string,
): Promise<RecommendationsResponse | null> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_CACHE_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw) as Record<string, RecommendationsResponse>;
    return store[windowKey] ?? null;
  } catch {
    return null;
  }
}

export async function fetchRecommendations(options?: {
  force?: boolean;
  timezone?: string;
  excludeRecipeIds?: string[];
}): Promise<RecommendationsResponse> {
  const params = new URLSearchParams();
  if (options?.force) params.set('force', 'true');
  if (options?.timezone) params.set('timezone', options.timezone);
  if (options?.excludeRecipeIds?.length) {
    params.set('exclude', options.excludeRecipeIds.join(','));
  }
  const query = params.toString();

  return authApiFetch<RecommendationsResponse>(
    `/api/recommendations${query ? `?${query}` : ''}`,
  );
}

export async function logRecipeView(recipeId: string): Promise<void> {
  try {
    await authApiFetch(`/api/recipes/${encodeURIComponent(recipeId)}/view`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch {
    // non-fatal
  }
}

export async function logRecipeCooked(recipeId: string): Promise<void> {
  try {
    await authApiFetch(`/api/recipes/${encodeURIComponent(recipeId)}/cooked`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  } catch {
    // non-fatal
  }
}

export async function dismissRecommendation(recipeId: string): Promise<void> {
  await authApiFetch('/api/recommendations/dismiss', {
    method: 'POST',
    body: JSON.stringify({ recipeId }),
  });
}

export type RecentCookItem = {
  recipe: Recipe;
  cookedAt: string;
};

export async function fetchRecentCooks(limit = 8): Promise<RecentCookItem[]> {
  const response = await authApiFetch<{
    items: Array<{ recipe: ApiRecipeRow; cookedAt: string }>;
  }>(`/api/users/me/recent-cooks?limit=${limit}`);
  return response.items.map((item) => ({
    recipe: mapApiRecipe(item.recipe),
    cookedAt: item.cookedAt,
  }));
}

// Re-export for filter fallback compatibility
export { dietChoiceToDietType };
