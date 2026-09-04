import { isJainSafeRecipe } from '@/lib/jain-safe';
import { dietChoiceToDietType } from '@/lib/recipe-filters';
import { canonicalizeIngredientName, expandIngredientAliasKeys } from '@/lib/ingredient-canonical';
import { scoreRecipeForMealSlot, type MealSlot } from '@/lib/meal-time';
import type { RecipeResponse } from '@/lib/types';

function pantryHasIngredient(pantryIngredients: string[], ingredientName: string): boolean {
  const needed = expandIngredientAliasKeys(canonicalizeIngredientName(ingredientName));
  const pantryKeys = new Set<string>();
  for (const item of pantryIngredients) {
    for (const alias of expandIngredientAliasKeys(canonicalizeIngredientName(item))) {
      pantryKeys.add(alias);
    }
  }
  return [...needed].some((key) => pantryKeys.has(key));
}

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

  const available = recipe.ingredients.filter((ingredient) => {
    const name = ingredient.name?.trim();
    return name && pantryHasIngredient(pantryIngredients, name);
  }).length;

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

    if (options.dietChoice === 'Jain' && !isJainSafeRecipe(recipe)) return false;

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

export function getMissingIngredientNames(
  recipe: RecipeResponse,
  pantryIngredients: string[],
  maxItems = 6,
): string[] {
  const seen = new Set<string>();
  const missing: string[] = [];

  for (const ingredient of recipe.ingredients) {
    const rawName = ingredient.name?.trim();
    if (!rawName || pantryHasIngredient(pantryIngredients, rawName)) continue;

    const label = canonicalizeIngredientName(rawName);
    const key = label.toLowerCase();
    if (!key || seen.has(key)) continue;

    seen.add(key);
    missing.push(label);
    if (missing.length >= maxItems) break;
  }

  return missing;
}

export function buildMealNotificationBody(
  recipe: RecipeResponse,
  pantryIngredients: string[],
): string {
  const missing = getMissingIngredientNames(recipe, pantryIngredients, 6);

  if (missing.length === 0) {
    if (pantryIngredients.length === 0) {
      return 'Add pantry items in the app to see what you need.';
    }
    return 'You have all ingredients in your pantry.';
  }

  const preview = missing.slice(0, 4);
  const hidden = missing.length - preview.length;
  const list = preview.join(', ') + (hidden > 0 ? ` +${hidden} more` : '');

  return `Missing: ${list}`;
}
