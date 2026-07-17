import type { Recipe } from '@/data/mockRecipes';
import { ingredientKey } from '@/utils/recipeIngredients';

function isStapleInRecipe(recipe: Recipe, name: string): boolean {
  const match = recipe.ingredients.find(
    (item) => ingredientKey(item.name) === ingredientKey(name),
  );
  return match?.isStaple ?? false;
}

/** Prefer a non-staple missing item that appears in the recipe title. */
function pickHeroMissing(recipe: Recipe, missing: string[]): string | null {
  const titleLower = recipe.title.toLowerCase();
  for (const name of missing) {
    if (isStapleInRecipe(recipe, name)) continue;
    if (titleLower.includes(name.toLowerCase())) return name;
  }
  for (const name of missing) {
    if (!isStapleInRecipe(recipe, name)) return name;
  }
  return missing[0] ?? null;
}

/** Hero and distinctive items first; everyday staples last. */
export function sortShoppingMissingItems(
  missing: string[],
  recipe?: Recipe | null,
): string[] {
  if (missing.length <= 1) return [...missing];
  if (!recipe) return [...missing];

  const hero = pickHeroMissing(recipe, missing);
  const others: string[] = [];
  const staples: string[] = [];

  for (const name of missing) {
    if (name === hero) continue;
    if (isStapleInRecipe(recipe, name)) staples.push(name);
    else others.push(name);
  }

  return [...(hero ? [hero] : []), ...others, ...staples];
}
