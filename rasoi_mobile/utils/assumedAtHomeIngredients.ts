import type { Recipe } from '@/data/mockRecipes';
import { canonicalizeIngredientName } from '@/constants/ingredientCanonical';
import { getRecipeMainIngredients } from '@/utils/recipeMainIngredients';

/** Free utilities — belong in steps, not pantry match or grocery cart. */
const TRACKED_LIQUID_KEYS = new Set(['pani', 'water', 'ice', 'free tap water']);

/**
 * Rule 4 — assumed at home: base seasonings, fats, and aromatics that should not
 * block cooking or drive "Order missing" / pantry match %.
 */
const ASSUMED_AT_HOME_CANONICAL = new Set([
  'Namak',
  'Haldi',
  'Jeera',
  'Rai',
  'Lal Mirch Powder',
  'Dhania Powder',
  'Hing',
  'Garam Masala',
  'Kali Mirch',
  'Chini',
  'Tel',
  'Ghee',
  'Butter',
]);

function ingredientLookupKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isTrackedLiquid(name: string): boolean {
  const canonical = canonicalizeIngredientName(name);
  const key = ingredientLookupKey(canonical);
  if (TRACKED_LIQUID_KEYS.has(key)) return true;
  return TRACKED_LIQUID_KEYS.has(ingredientLookupKey(name));
}

export function isAssumedAtHome(name: string): boolean {
  if (isTrackedLiquid(name)) return true;
  const canonical = canonicalizeIngredientName(name);
  if (ASSUMED_AT_HOME_CANONICAL.has(canonical)) return true;
  const key = ingredientLookupKey(canonical);
  for (const assumed of ASSUMED_AT_HOME_CANONICAL) {
    if (ingredientLookupKey(assumed) === key) return true;
  }
  return false;
}

/** Ingredients excluded from pantry match % and "Need to buy" UI (Rule 4). */
export function isPantryMatchExcluded(name: string | undefined | null): boolean {
  if (!name?.trim()) return true;
  return isAssumedAtHome(name);
}

export function getMatchableIngredients(recipe: Recipe) {
  return getRecipeMainIngredients(recipe).filter(
    (name) => name.trim() && !isPantryMatchExcluded(name),
  );
}

export function countMatchableIngredients(recipe: Recipe): number {
  return getMatchableIngredients(recipe).length;
}
