import { recipeContainsAllergen } from '@/lib/allergy-filter';
import { db } from '@/lib/db';
import { parseKitchenPreferences } from '@/lib/kitchen-preferences';
import type { Recipe, User } from '@/lib/db/types';
import { isJainSafeRecipe } from '@/lib/jain-safe';
import { dietChoiceToDietType } from '@/lib/recipe-filters';
import {
  getLocalTimeParts,
  getScheduledMealWindowForTimezone,
  isWeekend,
  scoreRecipeForMealSlot,
  windowKeyForMealSlot,
  type MealSlot,
  type ScheduledMealWindow,
} from '@/lib/meal-time';
import { getRecipeCuisineIds, getDiversityIngredientKey, resolvePrimaryIngredient } from '@/lib/primary-ingredient';
import {
  HOME_PICK_COUNT,
  RECENT_COOKED_EXCLUDE_DAYS,
  RECENT_SAVE_EXCLUDE_DAYS,
  RECENT_VIEW_EXCLUDE_DAYS,
  RECOMMENDATION_ALGORITHM_VERSION,
  RECOMMENDATION_HISTORY_EXCLUDE_DAYS,
} from '@/lib/recommendation-config';
import { cuisineOrderSeed, recipeTieBreakSeed } from '@/lib/recommendation-hash';
import { getPantryMatchPercent, scoreRecipeForUser } from '@/lib/recipe-ranking';
import { serializeRecipeListItem } from '@/lib/serializers';
import { parseJson } from '@/lib/serializers';
import type { CuisineId, RecipeResponse } from '@/lib/types';

export type RecommendationUser = Pick<
  User,
  | 'id'
  | 'dietChoice'
  | 'regionalCuisine'
  | 'favoriteCuisines'
  | 'pantryIngredients'
  | 'kitchenPreferences'
  | 'timezone'
  | 'savedRecipeIds'
>;

export type RecommendationPick = {
  recipe: RecipeResponse;
  reason: string;
};

export type RecommendationBundle = {
  algorithmVersion: string;
  mealSlot: MealSlot;
  windowKey: string;
  dayKey: string;
  picks: RecommendationPick[];
  lateNightPick?: RecommendationPick;
  generatedAt: string;
  fromCache: boolean;
};

type GenerateOptions = {
  user: RecommendationUser;
  mealSlot: MealSlot;
  windowKey: string;
  dayKey: string;
  count?: number;
  excludeRecipeIds?: string[];
  forceRegenerate?: boolean;
  timezone?: string;
};

type ScoredCandidate = {
  recipe: Recipe;
  score: number;
  cuisines: string[];
  primaryIngredient: string;
  reason: string;
};

function daysAgo(date: Date, days: number): Date {
  const cutoff = new Date(date);
  cutoff.setDate(cutoff.getDate() - days);
  return cutoff;
}

function buildPreferenceSnapshot(user: RecommendationUser) {
  return {
    dietChoice: user.dietChoice,
    regionalCuisine: user.regionalCuisine,
    favoriteCuisines: parseJson<CuisineId[]>(user.favoriteCuisines, []),
  };
}

function buildReason(
  recipe: Recipe,
  mealSlot: MealSlot,
  matchedCuisine: string | null,
  pantryPercent: number,
  isWeekendDay: boolean,
): string {
  if (matchedCuisine) {
    return `Based on your ${matchedCuisine} cuisine preference`;
  }
  if (pantryPercent >= 80) {
    return 'Matches most of your pantry';
  }
  if (recipe.prepTime <= 20 && !isWeekendDay) {
    return `Quick ${mealSlot} recipe under 20 minutes`;
  }
  if (isWeekendDay && recipe.prepTime >= 40) {
    return 'Special weekend recipe';
  }
  if ((recipe.popularityScore ?? 50) >= 70) {
    return `Popular ${mealSlot} recipe`;
  }
  return `Great for ${mealSlot}`;
}

function filterRecipeRows(
  recipes: Recipe[],
  options: {
    dietChoice: string;
    regionalCuisine: string;
    favoriteCuisines: CuisineId[];
    allergyExclusions?: string[];
  },
): Recipe[] {
  const dietType = dietChoiceToDietType(options.dietChoice);
  if (!dietType) return [];

  const allergyExclusions = options.allergyExclusions ?? [];

  return recipes.filter((recipe) => {
    if (recipe.dietType !== dietType) return false;

    if (options.dietChoice === 'Jain' && !isJainSafeRecipe(recipe)) return false;

    if (allergyExclusions.length > 0) {
      const ingredients = parseJson<{ name: string }[]>(recipe.ingredients, []);
      if (recipeContainsAllergen(ingredients, allergyExclusions)) return false;
    }

    // Regional + favorite cuisines are soft-weighted in scoring, not hard-filtered.
    return true;
  });
}

function scoreCandidate(
  recipe: Recipe,
  options: {
    user: RecommendationUser;
    mealSlot: MealSlot;
    dayKey: string;
    isWeekendDay: boolean;
    matchedCuisine: string | null;
    pantryIngredients: string[];
  },
): ScoredCandidate {
  const serialized = serializeRecipeListItem(recipe);
  const tags = serialized.tags;

  let score =
    scoreRecipeForUser(serialized, {
      regionalCuisine: options.user.regionalCuisine,
      pantryIngredients: options.pantryIngredients,
      mealSlot: options.mealSlot,
    }) *
      0.7 +
    scoreRecipeForMealSlot(serialized, options.mealSlot) * 0.3;

  score += (recipe.popularityScore ?? 50) * 0.15 + (recipe.qualityScore ?? 50) * 0.1;

  if (!options.isWeekendDay) {
    if (recipe.prepTime <= 30) score += 10;
    if (recipe.prepTime > 45) score -= 12;
  } else if (recipe.prepTime >= 35 || tags.includes('festive')) {
    score += 8;
  }

  const pantryPercent = getPantryMatchPercent(serialized, options.pantryIngredients);
  const favoriteCuisines = parseJson<CuisineId[]>(options.user.favoriteCuisines, []);
  if (
    options.matchedCuisine &&
    favoriteCuisines.length > 0 &&
    favoriteCuisines.includes(options.matchedCuisine as CuisineId)
  ) {
    score += 10;
  }

  const tieBreak =
    recipeTieBreakSeed(
      options.user.id,
      options.dayKey,
      options.mealSlot,
      recipe.id,
      RECOMMENDATION_ALGORITHM_VERSION,
    ) / 1_000_000_000_000;

  score += tieBreak;

  return {
    recipe,
    score,
    cuisines: getRecipeCuisineIds(recipe),
    primaryIngredient: resolvePrimaryIngredient(recipe),
    reason: buildReason(recipe, options.mealSlot, options.matchedCuisine, pantryPercent, options.isWeekendDay),
  };
}

async function loadExcludedRecipeIds(userId: string, mealSlot: MealSlot, now: Date): Promise<Set<string>> {
  const exclude = new Set<string>();
  const historyCutoff = daysAgo(now, RECOMMENDATION_HISTORY_EXCLUDE_DAYS);
  const viewCutoff = daysAgo(now, RECENT_VIEW_EXCLUDE_DAYS);
  const cookedCutoff = daysAgo(now, RECENT_COOKED_EXCLUDE_DAYS);

  const [history, views, cooked] = await Promise.all([
    db.userRecommendationHistory.findMany({
      where: { userId, shownAt: { gte: historyCutoff } },
      take: 500,
    }),
    db.userRecipeView.findMany({
      where: { userId, viewedAt: { gte: viewCutoff } },
      take: 200,
    }),
    db.userRecipeCooked.findMany({
      where: { userId, cookedAt: { gte: cookedCutoff } },
      take: 200,
    }),
  ]);

  for (const row of history) exclude.add(row.recipeId);
  for (const row of views) exclude.add(row.recipeId);
  for (const row of cooked) exclude.add(row.recipeId);

  void RECENT_SAVE_EXCLUDE_DAYS;
  void mealSlot;
  return exclude;
}

function pickDiverseRecipes(
  candidates: ScoredCandidate[],
  options: {
    user: RecommendationUser;
    mealSlot: MealSlot;
    dayKey: string;
    count: number;
    excludeRecipeIds: Set<string>;
    favoriteCuisines: CuisineId[];
  },
): ScoredCandidate[] {
  const picked: ScoredCandidate[] = [];
  const usedRecipeIds = new Set(options.excludeRecipeIds);
  const usedCuisines = new Set<string>();
  const usedIngredients = new Set<string>();

  const cuisinePool =
    options.favoriteCuisines.length > 0
      ? [...options.favoriteCuisines]
      : [...new Set(candidates.flatMap((c) => c.cuisines))];

  const orderedCuisines = cuisinePool.sort(
    (a, b) =>
      cuisineOrderSeed(options.user.id, options.dayKey, options.mealSlot, a, RECOMMENDATION_ALGORITHM_VERSION) -
      cuisineOrderSeed(options.user.id, options.dayKey, options.mealSlot, b, RECOMMENDATION_ALGORITHM_VERSION),
  );

  const findBest = (filter: (c: ScoredCandidate) => boolean): ScoredCandidate | null => {
    const pool = candidates
      .filter((c) => !usedRecipeIds.has(c.recipe.id) && filter(c))
      .sort((a, b) => b.score - a.score);
    return pool[0] ?? null;
  };

  for (const cuisineId of orderedCuisines) {
    if (picked.length >= options.count) break;
    if (usedCuisines.has(cuisineId) && cuisinePool.length >= options.count) continue;

    const best = findBest(
      (c) =>
        c.cuisines.includes(cuisineId) &&
        !usedIngredients.has(getDiversityIngredientKey(c.primaryIngredient)),
    );
    if (!best) continue;

    picked.push(best);
    usedRecipeIds.add(best.recipe.id);
    usedCuisines.add(cuisineId);
    usedIngredients.add(getDiversityIngredientKey(best.primaryIngredient));
  }

  if (options.favoriteCuisines.length > 0 && picked.length < options.count) {
    const explorationCuisines = [
      ...new Set(candidates.flatMap((candidate) => candidate.cuisines)),
    ].filter((id) => !options.favoriteCuisines.includes(id as CuisineId));

    for (const cuisineId of explorationCuisines) {
      if (picked.length >= options.count) break;
      const best = findBest(
        (candidate) =>
          candidate.cuisines.includes(cuisineId) &&
          !usedIngredients.has(getDiversityIngredientKey(candidate.primaryIngredient)),
      );
      if (!best) continue;
      picked.push(best);
      usedRecipeIds.add(best.recipe.id);
      usedCuisines.add(cuisineId);
      usedIngredients.add(getDiversityIngredientKey(best.primaryIngredient));
    }
  }

  if (picked.length < options.count) {
    for (const cuisineId of orderedCuisines) {
      if (picked.length >= options.count) break;
      const best = findBest((c) => c.cuisines.includes(cuisineId));
      if (!best) continue;
      picked.push(best);
      usedRecipeIds.add(best.recipe.id);
      usedCuisines.add(cuisineId);
      usedIngredients.add(getDiversityIngredientKey(best.primaryIngredient));
    }
  }

  if (picked.length < options.count) {
    const remaining = candidates
      .filter(
        (c) =>
          !usedRecipeIds.has(c.recipe.id) &&
          !usedIngredients.has(getDiversityIngredientKey(c.primaryIngredient)),
      )
      .sort((a, b) => b.score - a.score);
    for (const entry of remaining) {
      if (picked.length >= options.count) break;
      picked.push(entry);
      usedRecipeIds.add(entry.recipe.id);
      usedIngredients.add(getDiversityIngredientKey(entry.primaryIngredient));
    }
  }

  if (picked.length < options.count) {
    const remaining = candidates
      .filter((c) => !usedRecipeIds.has(c.recipe.id))
      .sort((a, b) => b.score - a.score);
    for (const entry of remaining) {
      if (picked.length >= options.count) break;
      picked.push(entry);
      usedRecipeIds.add(entry.recipe.id);
    }
  }

  return picked.slice(0, options.count);
}

async function loadPublishedRecipes(): Promise<Recipe[]> {
  return db.recipe.findMany({
    where: { published: true },
    orderBy: { popularityScore: 'desc' },
    take: 5000,
  });
}

async function readCache(userId: string, windowKey: string) {
  return db.userRecommendationCache.findUnique({
    where: {
      userId_windowKey_algorithmVersion: {
        userId,
        windowKey,
        algorithmVersion: RECOMMENDATION_ALGORITHM_VERSION,
      },
    },
  });
}

async function writeCache(input: {
  userId: string;
  dayKey: string;
  mealSlot: MealSlot;
  windowKey: string;
  recipeIds: string[];
  reasons: string[];
  preferenceSnapshot: Record<string, unknown>;
}) {
  await db.userRecommendationCache.upsert({
    where: {
      userId_windowKey_algorithmVersion: {
        userId: input.userId,
        windowKey: input.windowKey,
        algorithmVersion: RECOMMENDATION_ALGORITHM_VERSION,
      },
    },
    create: {
      userId: input.userId,
      dayKey: input.dayKey,
      mealSlot: input.mealSlot,
      windowKey: input.windowKey,
      algorithmVersion: RECOMMENDATION_ALGORITHM_VERSION,
      recipeIds: JSON.stringify(input.recipeIds),
      reasons: JSON.stringify(input.reasons),
      preferenceSnapshot: JSON.stringify(input.preferenceSnapshot),
      generatedAt: new Date(),
    },
    update: {
      recipeIds: JSON.stringify(input.recipeIds),
      reasons: JSON.stringify(input.reasons),
      preferenceSnapshot: JSON.stringify(input.preferenceSnapshot),
      generatedAt: new Date(),
    },
  });
}

async function recordHistory(userId: string, mealSlot: MealSlot, recipeIds: string[]) {
  const now = new Date();
  await Promise.all(
    recipeIds.map((recipeId) =>
      db.userRecommendationHistory.create({
        data: {
          userId,
          recipeId,
          mealSlot,
          shownAt: now,
        },
      }),
    ),
  );
}

async function recipesFromIds(recipeIds: string[], reasons: string[]): Promise<RecommendationPick[]> {
  if (recipeIds.length === 0) return [];
  const recipes = await db.recipe.findMany({
    where: { id: { in: recipeIds }, published: true },
  });
  const byId = new Map(recipes.map((r) => [r.id, r]));
  return recipeIds
    .map((id, index) => {
      const recipe = byId.get(id);
      if (!recipe) return null;
      return {
        recipe: serializeRecipeListItem(recipe),
        reason: reasons[index] ?? 'Picked for you',
      };
    })
    .filter((p): p is RecommendationPick => Boolean(p));
}

export async function generateRecommendationsForWindow(
  options: GenerateOptions,
): Promise<RecommendationBundle> {
  const count = options.count ?? HOME_PICK_COUNT;
  const timezone = options.timezone ?? options.user.timezone ?? 'Asia/Kolkata';
  const now = new Date();
  const { dayOfWeek } = getLocalTimeParts(timezone, now);
  const isWeekendDay = isWeekend(dayOfWeek);

  if (!options.forceRegenerate) {
    const cached = await readCache(options.user.id, options.windowKey);
    if (cached) {
      const recipeIds = parseJson<string[]>(cached.recipeIds, []);
      const reasons = parseJson<string[]>(cached.reasons, []);
      const picks = await recipesFromIds(recipeIds, reasons);
      if (picks.length === recipeIds.length && picks.length > 0) {
        return {
          algorithmVersion: RECOMMENDATION_ALGORITHM_VERSION,
          mealSlot: options.mealSlot,
          windowKey: options.windowKey,
          dayKey: options.dayKey,
          picks,
          generatedAt: cached.generatedAt.toISOString(),
          fromCache: true,
        };
      }
    }
  }

  const favoriteCuisines = parseJson<CuisineId[]>(options.user.favoriteCuisines, []);
  const pantryIngredients = parseJson<string[]>(options.user.pantryIngredients, []);
  const autoExclude = await loadExcludedRecipeIds(options.user.id, options.mealSlot, now);
  const manualExclude = new Set(options.excludeRecipeIds ?? []);
  const exclude = new Set([...autoExclude, ...manualExclude]);

  const allRecipes = await loadPublishedRecipes();
  const dietType = dietChoiceToDietType(options.user.dietChoice);
  const allergyExclusions =
    parseKitchenPreferences(options.user.kitchenPreferences).allergyExclusions ?? [];
  const filtered = filterRecipeRows(allRecipes, {
    dietChoice: options.user.dietChoice,
    regionalCuisine: options.user.regionalCuisine,
    favoriteCuisines,
    allergyExclusions,
  }).filter((r) => !exclude.has(r.id));

  const pool = filtered.length > 0 ? filtered : allRecipes.filter((r) => r.dietType === dietType && !exclude.has(r.id));
  const fallbackPool = pool.length > 0 ? pool : allRecipes.filter((r) => !exclude.has(r.id));

  const scored = fallbackPool.map((recipe) => {
    const cuisines = getRecipeCuisineIds(recipe);
    const matchedCuisine =
      favoriteCuisines.find((c) => cuisines.includes(c)) ?? cuisines[0] ?? null;
    return scoreCandidate(recipe, {
      user: options.user,
      mealSlot: options.mealSlot,
      dayKey: options.dayKey,
      isWeekendDay,
      matchedCuisine,
      pantryIngredients,
    });
  });

  const selected = pickDiverseRecipes(scored, {
    user: options.user,
    mealSlot: options.mealSlot,
    dayKey: options.dayKey,
    count,
    excludeRecipeIds: exclude,
    favoriteCuisines,
  });

  const recipeIds = selected.map((s) => s.recipe.id);
  const reasons = selected.map((s) => s.reason);
  const preferenceSnapshot = buildPreferenceSnapshot(options.user);

  await writeCache({
    userId: options.user.id,
    dayKey: options.dayKey,
    mealSlot: options.mealSlot,
    windowKey: options.windowKey,
    recipeIds,
    reasons,
    preferenceSnapshot,
  });

  if (recipeIds.length > 0) {
    await recordHistory(options.user.id, options.mealSlot, recipeIds);
  }

  return {
    algorithmVersion: RECOMMENDATION_ALGORITHM_VERSION,
    mealSlot: options.mealSlot,
    windowKey: options.windowKey,
    dayKey: options.dayKey,
    picks: selected.map((s) => ({
      recipe: serializeRecipeListItem(s.recipe),
      reason: s.reason,
    })),
    generatedAt: now.toISOString(),
    fromCache: false,
  };
}

export async function getUserRecommendations(
  user: RecommendationUser,
  options?: { forceRegenerate?: boolean; timezone?: string; excludeRecipeIds?: string[] },
): Promise<{
  primary: RecommendationBundle;
  lateNight?: RecommendationBundle;
  mealWindow: ScheduledMealWindow;
}> {
  const timezone = options?.timezone ?? user.timezone ?? 'Asia/Kolkata';
  const mealWindow = getScheduledMealWindowForTimezone(timezone);
  const manualExclude = options?.excludeRecipeIds ?? [];

  if (mealWindow.isOvernightDual && mealWindow.tomorrowBreakfastWindowKey) {
    const lateNight = await generateRecommendationsForWindow({
      user,
      mealSlot: 'lateNight',
      windowKey: mealWindow.windowKey,
      dayKey: mealWindow.dayKey,
      count: 1,
      excludeRecipeIds: manualExclude,
      forceRegenerate: options?.forceRegenerate,
      timezone,
    });

    const breakfast = await generateRecommendationsForWindow({
      user,
      mealSlot: 'breakfast',
      windowKey: mealWindow.tomorrowBreakfastWindowKey,
      dayKey: mealWindow.dayKey,
      count: HOME_PICK_COUNT,
      excludeRecipeIds: [
        ...manualExclude,
        ...(lateNight.picks[0] ? [lateNight.picks[0].recipe.id] : []),
      ],
      forceRegenerate: options?.forceRegenerate,
      timezone,
    });

    return {
      primary: breakfast,
      lateNight,
      mealWindow,
    };
  }

  const primary = await generateRecommendationsForWindow({
    user,
    mealSlot: mealWindow.slot,
    windowKey: mealWindow.windowKey,
    dayKey: mealWindow.dayKey,
    excludeRecipeIds: manualExclude,
    forceRegenerate: options?.forceRegenerate,
    timezone,
  });

  return { primary, mealWindow };
}

/** Top recipe for push notifications — uses the same engine as home picks. */
export async function pickPushRecipeForUser(
  user: RecommendationUser,
  mealSlot: MealSlot,
  dayKey: string,
  excludeRecipeIds: string[],
): Promise<RecommendationPick | null> {
  const timezone = user.timezone ?? 'Asia/Kolkata';
  const windowKey = windowKeyForMealSlot(dayKey, mealSlot);

  const cached = await readCache(user.id, windowKey);
  if (cached) {
    const recipeIds = parseJson<string[]>(cached.recipeIds, []);
    const reasons = parseJson<string[]>(cached.reasons, []);
    const exclude = new Set(excludeRecipeIds);
    const availableId = recipeIds.find((id) => !exclude.has(id));
    if (availableId) {
      const picks = await recipesFromIds([availableId], reasons);
      return picks[0] ?? null;
    }
  }

  const bundle = await generateRecommendationsForWindow({
    user,
    mealSlot,
    windowKey,
    dayKey,
    count: HOME_PICK_COUNT,
    excludeRecipeIds,
    timezone,
  });

  const exclude = new Set(excludeRecipeIds);
  return bundle.picks.find((pick) => !exclude.has(pick.recipe.id)) ?? bundle.picks[0] ?? null;
}

export async function logRecipeView(userId: string, recipeId: string): Promise<void> {
  await db.userRecipeView.upsert({
    where: { userId_recipeId: { userId, recipeId } },
    create: { userId, recipeId, viewedAt: new Date() },
    update: { viewedAt: new Date() },
  });
}

export async function logRecipeCooked(userId: string, recipeId: string): Promise<void> {
  await db.userRecipeCooked.upsert({
    where: { userId_recipeId: { userId, recipeId } },
    create: { userId, recipeId, cookedAt: new Date() },
    update: { cookedAt: new Date() },
  });
}

/** Hide a pick from suggestions for the standard history window. */
export async function dismissRecipeRecommendation(
  userId: string,
  recipeId: string,
  mealSlot: MealSlot,
): Promise<void> {
  await recordHistory(userId, mealSlot, [recipeId]);
}
