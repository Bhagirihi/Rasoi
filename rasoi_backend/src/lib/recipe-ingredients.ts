import type { RecipeIngredient } from '@/lib/types';
import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';

function ingredientDedupeKey(name: string): string {
  return canonicalizeIngredientName(name).trim().toLowerCase();
}

/** Normalizes catalog/legacy shapes (string[] or partial objects) into API ingredients. */
export function normalizeRecipeIngredients(raw: unknown): RecipeIngredient[] {
  if (!Array.isArray(raw)) return [];

  const normalized: RecipeIngredient[] = [];
  const seen = new Map<string, number>();

  for (const item of raw) {
    if (typeof item === 'string') {
      const name = canonicalizeIngredientName(item.trim());
      if (!name) continue;
      const key = ingredientDedupeKey(name);
      if (seen.has(key)) continue;
      seen.set(key, normalized.length);
      normalized.push({ name, isStaple: false });
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
        isStaple: Boolean(record.isStaple),
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
