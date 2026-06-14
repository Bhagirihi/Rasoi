import { dietChoiceToDietType } from '@/lib/recipe-filters';
import { scoreRecipeForMealSlot, type MealSlot } from '@/lib/meal-time';
import type { DietType, RecipeResponse } from '@/lib/types';

export function getRegionalMatchPercent(recipeRegion: string, preferredRegion: string): number {
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

export function getPantryMatchPercent(recipe: RecipeResponse, pantryIngredients: string[]): number {
  if (recipe.ingredients.length === 0 || pantryIngredients.length === 0) return 0;

  const pantrySet = new Set(pantryIngredients.map((item) => item.toLowerCase()));
  const available = recipe.ingredients.filter((ingredient) =>
    pantrySet.has(ingredient.name.toLowerCase()),
  ).length;

  return Math.round((available / recipe.ingredients.length) * 100);
}

export function scoreRecipeForUser(
  recipe: RecipeResponse,
  options: {
    regionalCuisine: string;
    pantryIngredients: string[];
    mealSlot: MealSlot;
  },
): number {
  const pantryScore = getPantryMatchPercent(recipe, options.pantryIngredients);
  const regionalScore = getRegionalMatchPercent(recipe.region, options.regionalCuisine);
  let score = pantryScore * 0.65 + regionalScore * 0.25;
  if (recipe.prepTime <= 20) score += 8;
  if (recipe.tags.includes('leftover')) score += 4;
  return score + scoreRecipeForMealSlot(recipe, options.mealSlot) * 0.4;
}

export function filterRecipesForUser(
  recipes: RecipeResponse[],
  options: {
    dietChoice: string;
    regionalCuisine: string;
    favoriteCuisines: string[];
  },
): RecipeResponse[] {
  const dietType = dietChoiceToDietType(options.dietChoice);
  if (!dietType) return [];

  return recipes.filter((recipe) => {
    if (recipe.dietType !== dietType) return false;

    if (
      options.regionalCuisine &&
      options.regionalCuisine !== 'All India' &&
      options.regionalCuisine !== 'Central' &&
      recipe.region !== options.regionalCuisine
    ) {
      return false;
    }

    if (options.favoriteCuisines.length > 0 && !options.favoriteCuisines.includes(recipe.kitchenStyleId)) {
      return false;
    }

    return true;
  });
}

export function pickTopRecipeForMeal(
  recipes: RecipeResponse[],
  options: {
    dietChoice: string;
    regionalCuisine: string;
    favoriteCuisines: string[];
    pantryIngredients: string[];
    mealSlot: MealSlot;
    excludeRecipeIds?: string[];
  },
): RecipeResponse | null {
  const exclude = new Set(options.excludeRecipeIds ?? []);

  const filtered = filterRecipesForUser(recipes, options).filter((r) => !exclude.has(r.id));
  if (filtered.length === 0) return null;

  const ranked = [...filtered].sort(
    (a, b) =>
      scoreRecipeForUser(b, {
        regionalCuisine: options.regionalCuisine,
        pantryIngredients: options.pantryIngredients,
        mealSlot: options.mealSlot,
      }) -
      scoreRecipeForUser(a, {
        regionalCuisine: options.regionalCuisine,
        pantryIngredients: options.pantryIngredients,
        mealSlot: options.mealSlot,
      }),
  );

  return ranked[0] ?? null;
}

export function formatDifficultyLabel(difficulty: string): string {
  return difficulty.toLowerCase();
}

export function buildMealNotificationBody(recipe: RecipeResponse): string {
  return `${recipe.title} · ${recipe.prepTime} min · ${formatDifficultyLabel(recipe.difficulty)}`;
}
