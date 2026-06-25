import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';

type IngredientLike = { name: string };

export function recipeContainsAllergen(
  ingredients: IngredientLike[],
  allergyExclusions: string[],
): boolean {
  if (allergyExclusions.length === 0) return false;

  const blocked = new Set(
    allergyExclusions.map((item) => canonicalizeIngredientName(item).toLowerCase()),
  );

  return ingredients.some((ingredient) => {
    const canonical = canonicalizeIngredientName(ingredient.name).toLowerCase();
    return blocked.has(canonical);
  });
}
