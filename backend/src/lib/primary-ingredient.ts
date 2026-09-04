import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import { parseJson } from '@/lib/serializers';
import type { Recipe } from '@/lib/db/types';
import type { RecipeIngredient } from '@/lib/types';

const TITLE_PRIMARY_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\bpaneer\b/i, key: 'paneer' },
  { pattern: /\bchicken\b/i, key: 'chicken' },
  { pattern: /\bmutton\b|\bgosht\b/i, key: 'mutton' },
  { pattern: /\bfish\b|\bmachhi\b/i, key: 'fish' },
  { pattern: /\begg\b|\banda\b|\bbhurji\b/i, key: 'egg' },
  { pattern: /\baloo\b|\bpotato\b/i, key: 'aloo' },
  { pattern: /\bdal\b|\blentil\b/i, key: 'dal' },
  { pattern: /\bchole\b|\bchana\b/i, key: 'chole' },
  { pattern: /\brajma\b/i, key: 'rajma' },
  { pattern: /\bmushroom\b/i, key: 'mushroom' },
  { pattern: /\btofu\b/i, key: 'tofu' },
  { pattern: /\bpoha\b/i, key: 'poha' },
  { pattern: /\bidli\b/i, key: 'idli' },
  { pattern: /\bdosa\b/i, key: 'dosa' },
  { pattern: /\bparatha\b/i, key: 'paratha' },
  { pattern: /\bbiryani\b|\bpulao\b|\brice\b/i, key: 'rice' },
];

const STAPLE_INGREDIENT_KEYS = new Set([
  'namak',
  'tel',
  'haldi',
  'jeera',
  'rai',
  'hing',
  'garam masala',
  'lal mirch powder',
  'dhania powder',
  'pyaaz',
  'tamatar',
  'adrak',
  'lahsun',
  'hari mirch',
]);

function ingredientStorageKey(name: string): string {
  return canonicalizeIngredientName(name).trim().toLowerCase();
}

function primaryFromTitle(title: string): string | null {
  for (const { pattern, key } of TITLE_PRIMARY_PATTERNS) {
    if (pattern.test(title)) return key;
  }
  return null;
}

function primaryFromIngredients(ingredients: RecipeIngredient[]): string | null {
  for (const ingredient of ingredients) {
    if (!ingredient.name?.trim()) continue;
    const key = ingredientStorageKey(ingredient.name);
    if (!key || STAPLE_INGREDIENT_KEYS.has(key)) continue;
    return key.replace(/\s+/g, '_');
  }
  return null;
}

/** Collapse near-duplicate primary keys so Home picks don't repeat dal/paneer variants. */
export function getDiversityIngredientKey(primaryIngredient: string): string {
  const key = primaryIngredient.trim().toLowerCase();
  if (key.includes('dal') || key.includes('lentil')) return 'dal';
  if (key.includes('paneer')) return 'paneer';
  if (key.includes('chicken')) return 'chicken';
  if (key.includes('rice') || key.includes('biryani') || key.includes('pulao')) return 'rice';
  return key;
}

export function resolvePrimaryIngredient(recipe: Recipe): string {
  if (recipe.primaryIngredient?.trim()) {
    return recipe.primaryIngredient.trim().toLowerCase();
  }

  const ingredients = normalizeRecipeIngredients(recipe.ingredients);
  return (
    primaryFromTitle(recipe.title) ??
    primaryFromIngredients(ingredients) ??
    recipe.kitchenStyleId.toLowerCase()
  );
}

export function getRecipeCuisineIds(recipe: Recipe): string[] {
  return [recipe.kitchenStyleId];
}
