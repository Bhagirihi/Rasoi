import type { Recipe } from '@/data/mockRecipes';
import { canonicalizeIngredientName } from '@/constants/ingredientCanonical';
import { isPantryMatchExcluded } from '@/utils/assumedAtHomeIngredients';
import { ingredientKey } from '@/utils/recipeIngredients';

/** Comma-separated DB text or API string[] → canonical main ingredient names. */
export function parseMainIngredients(raw: string | string[] | null | undefined): string[] {
  const parts = Array.isArray(raw)
    ? raw
    : raw?.trim()
      ? raw.split(',')
      : [];

  const names: string[] = [];
  const seen = new Set<string>();

  for (const part of parts) {
    const name = canonicalizeIngredientName(String(part).trim());
    const key = ingredientKey(name);
    if (!name || seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }

  return names;
}

/** Strip quantity suffix from display ingredient names (fallback when mainIngredients missing). */
export function stripQuantityFromIngredientName(name: string): string {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s*[—–-]\s+/);
  if (parts.length >= 2) {
    const tail = parts[1].trim();
    if (
      /^[\d½¼¾/.]+/.test(tail) ||
      /\b(g|kg|ml|l|tsp|tbsp|cup|cups|pinch|piece|pieces|leaves|leaf)\b/i.test(tail)
    ) {
      return canonicalizeIngredientName(parts[0].trim());
    }
  }
  return canonicalizeIngredientName(trimmed);
}

/** Pantry match / missing lists use main ingredients; fallback derives from full ingredient names. */
export function getRecipeMainIngredients(
  recipe: Pick<Recipe, 'mainIngredients' | 'ingredients'>,
): string[] {
  const fromMain = (recipe.mainIngredients ?? [])
    .map((name) => canonicalizeIngredientName(name.trim()))
    .filter((name) => name && !isPantryMatchExcluded(name));

  if (fromMain.length > 0) {
    return fromMain;
  }

  return recipe.ingredients
    .map((ingredient) => stripQuantityFromIngredientName(ingredient.name))
    .filter((name) => name && !isPantryMatchExcluded(name));
}

export function ingredientMatchesMainName(displayName: string, mainName: string): boolean {
  const displayKey = ingredientKey(stripQuantityFromIngredientName(displayName));
  const mainKey = ingredientKey(canonicalizeIngredientName(mainName));
  return displayKey === mainKey;
}
