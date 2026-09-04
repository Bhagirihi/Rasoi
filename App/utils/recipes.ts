import { DietType, Recipe } from '@/data/mockRecipes';
import { isJainSafeRecipe } from '@/utils/jainSafe';
import {
  buildPantryKeySet,
  pantryHasIngredientInSet,
} from '@/utils/pantryCanonical';
import { getRecipeMainIngredients } from '@/utils/recipeMainIngredients';
import { getMealQuickReasonSuffix, scoreRecipeForMealSlot, type MealSlot } from '@/utils/mealTime';

import { recipeContainsAllergen } from '@/utils/allergyFilter';
import {
  countMatchableIngredients,
  isPantryMatchExcluded,
} from '@/utils/assumedAtHomeIngredients';
import { recipeMatchesSearchQuery } from '@/utils/recipeSearchLocal';
import {
  isBudgetFriendlyRecipe,
  isKidsFriendlyRecipe,
  isSmallPortionRecipe,
} from '@/utils/recipeKids';

export type FastFilter = 'all' | 'under20' | 'leftover' | 'kids' | 'budget' | 'smallPortions';
export type ToggleableFastFilter = Exclude<FastFilter, 'all'>;
export type PantryMatchMode = 'any' | 'full';

export function isRecipeFullyStocked(
  recipe: Recipe,
  pantryIngredients: string[],
  pantryKeys?: Set<string>,
): boolean {
  if (pantryIngredients.length === 0) return false;
  const keys = pantryKeys ?? buildPantryKeySet(pantryIngredients);
  const matchable = getRecipeMainIngredients(recipe).filter(
    (name) => name && !isPantryMatchExcluded(name),
  );
  if (matchable.length === 0) return true;
  return matchable.every((name) => pantryHasIngredientInSet(keys, name));
}

export function countFullyStockedRecipes(
  recipes: Recipe[],
  options: {
    dietPreference: DietType;
    regionalCuisine: string;
    pantryIngredients: string[];
    favoriteCuisines?: string[];
    allergyExclusions?: string[];
  },
): number {
  return filterRecipes(recipes, {
    ...options,
    fastFilters: [],
    requirePantryMatch: true,
    pantryMatchMode: 'full',
  }).length;
}

export function getRegionalMatchPercent(
  recipeRegion: string,
  preferredRegion: string,
): number {
  if (!preferredRegion || preferredRegion === 'All India') return 100;
  if (recipeRegion === preferredRegion) return 100;

  const adjacentRegions: Record<string, string[]> = {
    North: ['West', 'East'],
    South: ['West', 'East'],
    East: ['North', 'South'],
    West: ['North', 'South'],
    Central: ['North', 'West'],
  };

  const neighbors = adjacentRegions[preferredRegion] ?? [];
  return neighbors.includes(recipeRegion) ? 72 : 48;
}

export function recipeMatchesFavoriteCuisines(
  recipe: Recipe,
  favoriteCuisines: string[],
): boolean {
  if (favoriteCuisines.length === 0) return true;

  const styleIds =
    recipe.kitchenStyleIds?.length
      ? recipe.kitchenStyleIds
      : recipe.kitchenStyleId
        ? [recipe.kitchenStyleId]
        : [];

  return styleIds.some((styleId) => favoriteCuisines.includes(styleId));
}

export function recipeMatchesSearch(recipe: Recipe, query: string): boolean {
  return recipeMatchesSearchQuery(recipe, query);
}

export function filterRecipes(
  recipes: Recipe[],
  options: {
    dietPreference: DietType;
    dietChoice?: string;
    regionalCuisine: string;
    favoriteCuisines?: string[];
    pantryIngredients: string[];
    fastFilters?: FastFilter[];
    /** @deprecated Use fastFilters */
    fastFilter?: FastFilter;
    requirePantryMatch?: boolean;
    pantryMatchMode?: PantryMatchMode;
    allergyExclusions?: string[];
  },
): Recipe[] {
  const {
    dietPreference,
    dietChoice,
    regionalCuisine,
    favoriteCuisines = [],
    pantryIngredients,
    fastFilters,
    fastFilter,
    requirePantryMatch = false,
    pantryMatchMode = 'full',
    allergyExclusions = [],
  } = options;

  const activeFastFilters: ToggleableFastFilter[] = fastFilters?.length
    ? fastFilters.filter((filter): filter is ToggleableFastFilter => filter !== 'all')
    : fastFilter && fastFilter !== 'all'
      ? [fastFilter]
      : [];

  // Build once — pantryHasIngredient rebuilds this set per ingredient otherwise.
  const pantryKeys =
    requirePantryMatch && pantryIngredients.length > 0
      ? buildPantryKeySet(pantryIngredients)
      : null;

  return recipes.filter((recipe) => {
    if (recipe.dietType !== dietPreference) return false;

    if (dietChoice === 'Jain' && !isJainSafeRecipe(recipe)) return false;

    if (allergyExclusions.length > 0 && recipeContainsAllergen(recipe, allergyExclusions)) {
      return false;
    }

    if (!recipeMatchesFavoriteCuisines(recipe, favoriteCuisines)) return false;

    if (
      regionalCuisine &&
      regionalCuisine !== 'All India' &&
      regionalCuisine !== 'Central' &&
      recipe.region !== regionalCuisine
    ) {
      return false;
    }

    const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
    if (activeFastFilters.includes('under20') && recipe.prepTime > 20) return false;
    if (activeFastFilters.includes('leftover') && !tags.includes('leftover')) return false;
    if (activeFastFilters.includes('kids') && !isKidsFriendlyRecipe(recipe)) return false;
    if (activeFastFilters.includes('budget') && !isBudgetFriendlyRecipe(recipe)) return false;
    if (activeFastFilters.includes('smallPortions') && !isSmallPortionRecipe(recipe)) return false;

    if (pantryKeys) {
      if (pantryMatchMode === 'full') {
        if (!isRecipeFullyStocked(recipe, pantryIngredients, pantryKeys)) return false;
      } else {
        const hasMatch = getRecipeMainIngredients(recipe).some(
          (name) =>
            Boolean(name) &&
            !isPantryMatchExcluded(name) &&
            pantryHasIngredientInSet(pantryKeys, name),
        );
        if (!hasMatch) return false;
      }
    }

    return true;
  });
}

export function partitionIngredients(
  recipe: Recipe,
  pantryIngredients: string[],
  pantryKeys?: Set<string>,
): { available: string[]; missing: string[] } {
  const available: string[] = [];
  const missing: string[] = [];
  const keys = pantryKeys ?? buildPantryKeySet(pantryIngredients);

  for (const name of getRecipeMainIngredients(recipe)) {
    if (!name || isPantryMatchExcluded(name)) continue;
    if (pantryHasIngredientInSet(keys, name)) {
      available.push(name);
    } else {
      missing.push(name);
    }
  }

  return { available, missing };
}

/** Same ingredient set used by partitionIngredients / getPantryMatchPercent. */
export { countMatchableIngredients };

export function getPantryMatchPercent(
  recipe: Recipe,
  pantryIngredients: string[],
  pantryKeys?: Set<string>,
): number {
  const { available, missing } = partitionIngredients(recipe, pantryIngredients, pantryKeys);
  const total = available.length + missing.length;
  if (total === 0) return 0;
  return Math.round((available.length / total) * 100);
}

/** Recipes tab: highest pantry match first (stable title tie-break). */
export function sortRecipesByPantryMatch(
  recipes: Recipe[],
  pantryIngredients: string[],
): Recipe[] {
  const pantryKeys = buildPantryKeySet(pantryIngredients);
  return [...recipes].sort((a, b) => {
    const diff =
      getPantryMatchPercent(b, pantryIngredients, pantryKeys) -
      getPantryMatchPercent(a, pantryIngredients, pantryKeys);
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  });
}

export function scoreRecipeForTonight(
  recipe: Recipe,
  options: {
    regionalCuisine: string;
    pantryIngredients: string[];
    pantryKeys?: Set<string>;
  },
): number {
  const pantryScore = getPantryMatchPercent(
    recipe,
    options.pantryIngredients,
    options.pantryKeys,
  );
  const regionalScore = getRegionalMatchPercent(recipe.region, options.regionalCuisine);
  let score = pantryScore * 0.65 + regionalScore * 0.25;
  if (recipe.prepTime <= 20) score += 8;
  if (recipe.tags.includes('leftover')) score += 4;
  return score;
}

export function sortRecipesForTonight(
  recipes: Recipe[],
  options: {
    regionalCuisine: string;
    pantryIngredients: string[];
    mealSlot?: MealSlot;
  },
): Recipe[] {
  const mealSlot = options.mealSlot ?? 'dinner';
  const pantryKeys = buildPantryKeySet(options.pantryIngredients);
  const scored = recipes.map((recipe) => ({
    recipe,
    score:
      scoreRecipeForTonight(recipe, { ...options, pantryKeys }) +
      scoreRecipeForMealSlot(recipe, mealSlot) * 0.4,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.recipe);
}

export function getRecipePickReason(
  recipe: Recipe,
  options: {
    regionalCuisine: string;
    pantryIngredients: string[];
    dietChoice?: string;
    mealSlot?: MealSlot;
  },
): string {
  const parts: string[] = [];

  if (recipe.prepTime <= 20) {
    parts.push(getMealQuickReasonSuffix(options.mealSlot ?? 'dinner'));
  }

  if (parts.length === 0) {
    return `Matches your ${options.dietChoice ?? recipe.dietType} filter`;
  }

  return parts.slice(0, 2).join(' · ');
}
