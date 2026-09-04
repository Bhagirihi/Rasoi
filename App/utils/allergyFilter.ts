import type { Recipe } from '@/data/mockRecipes';
import { canonicalizeIngredientName } from '@/constants/ingredientCanonical';

export function recipeContainsAllergen(recipe: Recipe, allergyExclusions: string[]): boolean {
  if (allergyExclusions.length === 0) return false;

  const blocked = new Set(
    allergyExclusions.map((item) => canonicalizeIngredientName(item).toLowerCase()),
  );

  return recipe.ingredients.some((ingredient) => {
    const canonical = canonicalizeIngredientName(ingredient.name).toLowerCase();
    return blocked.has(canonical);
  });
}
