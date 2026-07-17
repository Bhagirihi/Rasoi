import type { Recipe } from '@/data/mockRecipes';

/** Returns a loadable recipe hero URL, or null when missing / invalid. */
export function getRecipeImageUrl(recipe: Pick<Recipe, 'imageUrl'>): string | null {
  const url = recipe.imageUrl?.trim();
  if (!url || !/^https?:\/\//i.test(url)) return null;
  return url;
}

export function hasRecipeImage(recipe: Pick<Recipe, 'imageUrl'>): boolean {
  return getRecipeImageUrl(recipe) != null;
}
