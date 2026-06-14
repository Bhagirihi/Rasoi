import { DietType, Recipe } from '@/data/mockRecipes';
import { getMealQuickReasonSuffix, scoreRecipeForMealSlot, type MealSlot } from '@/utils/mealTime';

export type FastFilter = 'all' | 'under20' | 'leftover' | 'kids';
export type PantryMatchMode = 'any' | 'full';

export function isRecipeFullyStocked(recipe: Recipe, pantryIngredients: string[]): boolean {
  if (pantryIngredients.length === 0) return false;
  const pantrySet = new Set(pantryIngredients.map((item) => item.toLowerCase()));
  return recipe.ingredients.every((ingredient) =>
    pantrySet.has(ingredient.name.toLowerCase()),
  );
}

export function countFullyStockedRecipes(
  recipes: Recipe[],
  options: {
    dietPreference: DietType;
    regionalCuisine: string;
    pantryIngredients: string[];
  },
): number {
  return filterRecipes(recipes, {
    ...options,
    fastFilter: 'all',
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

export function filterRecipes(
  recipes: Recipe[],
  options: {
    dietPreference: DietType;
    regionalCuisine: string;
    favoriteCuisines?: string[];
    pantryIngredients: string[];
    fastFilter: FastFilter;
    requirePantryMatch?: boolean;
    pantryMatchMode?: PantryMatchMode;
  },
): Recipe[] {
  const {
    dietPreference,
    regionalCuisine,
    favoriteCuisines = [],
    pantryIngredients,
    fastFilter,
    requirePantryMatch = false,
    pantryMatchMode = 'full',
  } = options;

  return recipes.filter((recipe) => {
    if (recipe.dietType !== dietPreference) return false;

    if (!recipeMatchesFavoriteCuisines(recipe, favoriteCuisines)) return false;

    if (
      regionalCuisine &&
      regionalCuisine !== 'All India' &&
      regionalCuisine !== 'Central' &&
      recipe.region !== regionalCuisine
    ) {
      return false;
    }

    if (fastFilter === 'under20' && recipe.prepTime > 20) return false;
    if (fastFilter === 'leftover' && !recipe.tags.includes('leftover')) return false;
    if (fastFilter === 'kids' && !recipe.tags.includes('kids')) return false;

    if (requirePantryMatch && pantryIngredients.length > 0) {
      if (pantryMatchMode === 'full') {
        if (!isRecipeFullyStocked(recipe, pantryIngredients)) return false;
      } else {
        const pantrySet = new Set(pantryIngredients.map((item) => item.toLowerCase()));
        const hasMatch = recipe.ingredients.some((ingredient) =>
          pantrySet.has(ingredient.name.toLowerCase()),
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
): { available: string[]; missing: string[] } {
  const pantrySet = new Set(pantryIngredients.map((item) => item.toLowerCase()));

  const available: string[] = [];
  const missing: string[] = [];

  recipe.ingredients.forEach((ingredient) => {
    if (pantrySet.has(ingredient.name.toLowerCase())) {
      available.push(ingredient.name);
    } else {
      missing.push(ingredient.name);
    }
  });

  return { available, missing };
}

export function getPantryMatchPercent(recipe: Recipe, pantryIngredients: string[]): number {
  if (recipe.ingredients.length === 0) return 0;
  if (pantryIngredients.length === 0) return 0;
  const { available } = partitionIngredients(recipe, pantryIngredients);
  return Math.round((available.length / recipe.ingredients.length) * 100);
}

export function scoreRecipeForTonight(
  recipe: Recipe,
  options: {
    regionalCuisine: string;
    pantryIngredients: string[];
  },
): number {
  const pantryScore = getPantryMatchPercent(recipe, options.pantryIngredients);
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
  return [...recipes].sort((a, b) => {
    const scoreA =
      scoreRecipeForTonight(a, options) + scoreRecipeForMealSlot(a, mealSlot) * 0.4;
    const scoreB =
      scoreRecipeForTonight(b, options) + scoreRecipeForMealSlot(b, mealSlot) * 0.4;
    return scoreB - scoreA;
  });
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
  const pantryPct = getPantryMatchPercent(recipe, options.pantryIngredients);
  const regionalPct = getRegionalMatchPercent(recipe.region, options.regionalCuisine);
  const parts: string[] = [];

  if (pantryPct >= 80) {
    parts.push(`${pantryPct}% pantry match`);
  } else if (pantryPct >= 50) {
    parts.push(`${pantryPct}% ingredients at home`);
  } else if (options.pantryIngredients.length > 0) {
    parts.push(`uses ${pantryPct}% of your pantry`);
  }

  if (regionalPct >= 100 && options.regionalCuisine !== 'All India') {
    parts.push(`fits your ${options.regionalCuisine} preference`);
  } else if (regionalPct >= 72) {
    parts.push('close to your regional taste');
  }

  if (recipe.prepTime <= 20) {
    parts.push(getMealQuickReasonSuffix(options.mealSlot ?? 'dinner'));
  }

  if (parts.length === 0) {
    return `Matches your ${options.dietChoice ?? recipe.dietType} filter`;
  }

  return parts.slice(0, 2).join(' · ');
}
