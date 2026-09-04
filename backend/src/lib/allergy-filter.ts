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
    if (!ingredient.name?.trim()) return false;
    const canonical = canonicalizeIngredientName(ingredient.name).toLowerCase();
    return canonical && blocked.has(canonical);
  });
}
