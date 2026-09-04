import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Recipe } from '@/data/mockRecipes';
import { scoreRecipeForMealSlot, type MealSlot } from '@/utils/mealTime';

const STORAGE_KEY = '@rasoi/home_meal_picks_v5';
const LEGACY_STORAGE_KEY = '@rasoi/home_meal_picks_v4';
const HOME_PICK_COUNT = 4;
const MAX_CACHE_ENTRIES = 12;

type CachedHomePicksStore = {
  entries: Record<string, string[]>;
};

type LegacyCachedHomePicks = {
  windowKey: string;
  profileKey: string;
  recipeIds: string[];
};

type PickOptions = {
  windowKey: string;
  profileKey: string;
  mealSlot: MealSlot;
  count?: number;
  excludeRecipeIds?: Set<string>;
};

function buildCacheKey(windowKey: string, profileKey: string): string {
  return `${windowKey}|${profileKey}`;
}

export function getRecipeCategoryKey(recipe: Recipe): string {
  return getRecipeStyleKeys(recipe)[0] ?? `region:${recipe.region}`;
}

function getRecipeStyleKeys(recipe: Recipe): string[] {
  const ids =
    (recipe.kitchenStyleIds?.length ?? 0) > 0
      ? [...new Set(recipe.kitchenStyleIds)]
      : recipe.kitchenStyleId
        ? [recipe.kitchenStyleId]
        : [];

  if (ids.length === 0) {
    return [`region:${recipe.region}`];
  }

  return ids.map((id) => `style:${id}`);
}

export function dedupeHomePicks(
  picks: Recipe[],
  lateNightPick?: Recipe,
): { picks: Recipe[]; lateNightPick?: Recipe } {
  const seen = new Set<string>();
  const uniquePicks = picks.filter((recipe) => {
    if (seen.has(recipe.id)) return false;
    seen.add(recipe.id);
    return true;
  });
  const late =
    lateNightPick && !seen.has(lateNightPick.id) ? lateNightPick : undefined;
  return { picks: uniquePicks, lateNightPick: late };
}

export function buildHomePicksProfileKey(input: {
  dietChoice: string;
  regionalCuisine: string;
  favoriteCuisines: string[];
  userId?: string | null;
}): string {
  const cuisines = [...input.favoriteCuisines].sort().join(',');
  return [input.userId ?? 'guest', input.dietChoice, input.regionalCuisine, cuisines].join('|');
}

function hashString(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) | 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scoreRecipe(recipe: Recipe, mealSlot: MealSlot, random: () => number): number {
  return scoreRecipeForMealSlot(recipe, mealSlot) + random() * 8;
}

/** One recipe per kitchen-style category when possible; always targets `count` picks. */
export function pickHomeMealRecipes(recipes: Recipe[], options: PickOptions): Recipe[] {
  const { windowKey, profileKey, mealSlot, count = HOME_PICK_COUNT, excludeRecipeIds } = options;
  if (recipes.length === 0) return [];

  const random = mulberry32(hashString(`${windowKey}|${profileKey}`));
  const picked: Recipe[] = [];
  const seenRecipeIds = new Set(excludeRecipeIds ?? []);
  const usedCategories = new Set<string>();

  const styleKeys = new Set<string>();
  for (const recipe of recipes) {
    for (const key of getRecipeStyleKeys(recipe)) {
      styleKeys.add(key);
    }
  }

  const orderedStyles = [...styleKeys].sort((left, right) => {
    const leftRank = hashString(`${windowKey}|${profileKey}|${left}`);
    const rightRank = hashString(`${windowKey}|${profileKey}|${right}`);
    return leftRank - rightRank;
  });

  for (const styleKey of orderedStyles) {
    if (picked.length >= count) break;
    if (usedCategories.has(styleKey)) continue;

    const candidates = recipes.filter((recipe) => {
      if (seenRecipeIds.has(recipe.id)) return false;
      return getRecipeStyleKeys(recipe).includes(styleKey);
    });
    if (candidates.length === 0) continue;

    const best = candidates
      .map((recipe) => ({
        recipe,
        score: scoreRecipe(recipe, mealSlot, random),
      }))
      .sort((left, right) => right.score - left.score)[0]?.recipe;

    if (!best) continue;
    picked.push(best);
    seenRecipeIds.add(best.id);
    usedCategories.add(styleKey);
  }

  if (picked.length < count) {
    const remaining = recipes
      .filter((recipe) => !seenRecipeIds.has(recipe.id))
      .map((recipe) => ({
        recipe,
        score: scoreRecipe(recipe, mealSlot, random),
      }))
      .sort((left, right) => right.score - left.score);

    for (const entry of remaining) {
      if (picked.length >= count) break;
      picked.push(entry.recipe);
      seenRecipeIds.add(entry.recipe.id);
    }
  }

  return picked.slice(0, count);
}

function fillHomeMealPicks(
  existing: Recipe[],
  recipes: Recipe[],
  options: PickOptions,
): Recipe[] {
  const exclude = new Set(options.excludeRecipeIds ?? []);
  const filtered = existing.filter((recipe) => !exclude.has(recipe.id));
  const seenIds = new Set([...exclude, ...filtered.map((recipe) => recipe.id)]);
  const needed = (options.count ?? HOME_PICK_COUNT) - filtered.length;
  if (needed <= 0) return filtered.slice(0, options.count ?? HOME_PICK_COUNT);

  const more = pickHomeMealRecipes(recipes, {
    ...options,
    count: needed,
    excludeRecipeIds: seenIds,
  });

  return [...filtered, ...more].slice(0, options.count ?? HOME_PICK_COUNT);
}

async function loadCachedHomePicksStore(): Promise<CachedHomePicksStore> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CachedHomePicksStore;
      if (parsed?.entries && typeof parsed.entries === 'object') {
        return parsed;
      }
    }

    const legacyRaw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyRaw) return { entries: {} };

    const legacy = JSON.parse(legacyRaw) as LegacyCachedHomePicks;
    if (!legacy?.windowKey || !legacy?.profileKey || !Array.isArray(legacy.recipeIds)) {
      return { entries: {} };
    }

    return {
      entries: {
        [buildCacheKey(legacy.windowKey, legacy.profileKey)]: legacy.recipeIds,
      },
    };
  } catch {
    return { entries: {} };
  }
}

async function loadCachedRecipeIds(
  windowKey: string,
  profileKey: string,
): Promise<string[] | null> {
  const store = await loadCachedHomePicksStore();
  const recipeIds = store.entries[buildCacheKey(windowKey, profileKey)];
  return Array.isArray(recipeIds) && recipeIds.length > 0 ? recipeIds : null;
}

async function saveCachedRecipeIds(
  windowKey: string,
  profileKey: string,
  recipeIds: string[],
): Promise<void> {
  const store = await loadCachedHomePicksStore();
  const key = buildCacheKey(windowKey, profileKey);
  const entries: Record<string, string[]> = {
    ...store.entries,
    [key]: recipeIds,
  };

  const keys = Object.keys(entries);
  if (keys.length > MAX_CACHE_ENTRIES) {
    const keep = new Set(keys.slice(-MAX_CACHE_ENTRIES));
    for (const entryKey of keys) {
      if (!keep.has(entryKey)) {
        delete entries[entryKey];
      }
    }
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ entries }));
}

function restoreCachedRecipes(
  recipeIds: string[],
  recipeById: Map<string, Recipe>,
  excludeIds?: Set<string>,
): Recipe[] {
  return recipeIds
    .map((id) => recipeById.get(id))
    .filter((recipe): recipe is Recipe => Boolean(recipe))
    .filter((recipe) => !excludeIds?.has(recipe.id));
}

export async function resolveHomeMealPicks(input: {
  recipes: Recipe[];
  windowKey: string;
  profileKey: string;
  mealSlot: MealSlot;
  count?: number;
  excludeRecipeIds?: string[];
  forceRegenerate?: boolean;
}): Promise<Recipe[]> {
  const {
    recipes,
    windowKey,
    profileKey,
    mealSlot,
    count = HOME_PICK_COUNT,
    excludeRecipeIds,
    forceRegenerate = false,
  } = input;
  const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const excludeIds = excludeRecipeIds?.length ? new Set(excludeRecipeIds) : undefined;
  const pickOptions: PickOptions = { windowKey, profileKey, mealSlot, count, excludeRecipeIds: excludeIds };

  const cachedRecipeIds = forceRegenerate
    ? null
    : await loadCachedRecipeIds(windowKey, profileKey);
  if (cachedRecipeIds) {
    const restored = restoreCachedRecipes(cachedRecipeIds, recipeById, excludeIds);

    if (restored.length === count) {
      return restored;
    }

    if (restored.length > 0) {
      const filled = fillHomeMealPicks(restored, recipes, pickOptions);
      if (filled.length > 0) {
        await saveCachedRecipeIds(
          windowKey,
          profileKey,
          filled.map((recipe) => recipe.id),
        );
        return filled;
      }
    }
  }

  const picked = pickHomeMealRecipes(recipes, pickOptions);
  if (picked.length > 0) {
    await saveCachedRecipeIds(
      windowKey,
      profileKey,
      picked.map((recipe) => recipe.id),
    );
  }

  return picked;
}
