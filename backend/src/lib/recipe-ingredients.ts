import type { RecipeIngredient } from '@/lib/types';
import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';

/** Common pantry staples — used when DB stores flat comma-separated ingredient names. */
const STAPLE_KEYS = new Set(
  [
    'salt',
    'namak',
    'salt and black pepper',
    'black pepper',
    'water',
    'hot water',
    'cold water',
    'chilled water',
    'ice',
    'ice cubes',
    'oil',
    'vegetable oil',
    'cooking oil',
    'mustard oil',
    'sesame oil',
    'tel',
    'ghee',
    'butter',
  ].map((s) => s.toLowerCase()),
);

function isStapleName(name: string): boolean {
  const key = name.trim().toLowerCase();
  if (STAPLE_KEYS.has(key)) return true;
  if (key.startsWith('salt ')) return true;
  return false;
}

function ingredientDedupeKey(name: string): string {
  return canonicalizeIngredientName(name).trim().toLowerCase();
}

function pushUnique(
  normalized: RecipeIngredient[],
  seen: Map<string, number>,
  name: string,
  isStaple: boolean,
): void {
  const canonical = canonicalizeIngredientName(name.trim());
  if (!canonical) return;
  const key = ingredientDedupeKey(canonical);
  const existingIndex = seen.get(key);
  if (existingIndex !== undefined) {
    if (!isStaple) {
      normalized[existingIndex].isStaple = false;
    }
    return;
  }
  seen.set(key, normalized.length);
  normalized.push({ name: canonical, isStaple });
}

/**
 * Catalog/legacy shapes:
 * - JSON array of `{ name, isStaple }` objects
 * - JSON string array
 * - comma-separated names: `"Cauliflower, Carrot, Onion"`
 * - already-parsed arrays
 */
export function normalizeRecipeIngredients(raw: unknown): RecipeIngredient[] {
  const normalized: RecipeIngredient[] = [];
  const seen = new Map<string, number>();

  let value: unknown = raw;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        value = JSON.parse(trimmed) as unknown;
      } catch {
        value = trimmed;
      }
    }
    if (typeof value === 'string') {
      for (const part of value.split(',')) {
        const name = part.trim();
        if (!name) continue;
        pushUnique(normalized, seen, name, isStapleName(name));
      }
      return normalized;
    }
  }

  if (!Array.isArray(value)) return [];

  for (const item of value) {
    if (typeof item === 'string') {
      pushUnique(normalized, seen, item, isStapleName(item));
      continue;
    }

    if (typeof item === 'object' && item !== null && 'name' in item) {
      const record = item as {
        name?: unknown;
        isStaple?: unknown;
        recommendedBrand?: { name?: unknown; logo?: unknown };
      };
      const name = canonicalizeIngredientName(String(record.name ?? '').trim());
      if (!name) continue;

      const key = ingredientDedupeKey(name);
      const existingIndex = seen.get(key);
      if (existingIndex !== undefined) {
        if (!Boolean(record.isStaple)) {
          normalized[existingIndex].isStaple = false;
        }
        continue;
      }

      const ingredient: RecipeIngredient = {
        name,
        isStaple: Boolean(record.isStaple) || isStapleName(name),
      };

      const brandName = record.recommendedBrand?.name;
      const brandLogo = record.recommendedBrand?.logo;
      if (typeof brandName === 'string' && typeof brandLogo === 'string' && brandName.trim()) {
        ingredient.recommendedBrand = {
          name: brandName.trim(),
          logo: brandLogo.trim(),
        };
      }

      seen.set(key, normalized.length);
      normalized.push(ingredient);
    }
  }

  return normalized;
}
