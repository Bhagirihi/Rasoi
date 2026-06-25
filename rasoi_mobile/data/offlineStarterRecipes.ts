/** Offline starter bundle — enough recipes for first launch without network. */
import { SCREENSHOT_RECIPES, type Recipe } from '@/data/mockRecipes';

export const OFFLINE_STARTER_RECIPES: Recipe[] = SCREENSHOT_RECIPES.slice(0, 12);

export function mergeOfflineStarterRecipes(existing: Recipe[]): Recipe[] {
  if (existing.length >= OFFLINE_STARTER_RECIPES.length) return existing;
  const byId = new Map(existing.map((recipe) => [recipe.id, recipe]));
  for (const recipe of OFFLINE_STARTER_RECIPES) {
    if (!byId.has(recipe.id)) byId.set(recipe.id, recipe);
  }
  return [...byId.values()];
}
