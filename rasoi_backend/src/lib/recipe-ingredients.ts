import type { RecipeIngredient } from '@/lib/types';
import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';

/** Normalizes catalog/legacy shapes (string[] or partial objects) into API ingredients. */
export function normalizeRecipeIngredients(raw: unknown): RecipeIngredient[] {
  if (!Array.isArray(raw)) return [];

  const normalized: RecipeIngredient[] = [];

  for (const item of raw) {
    if (typeof item === 'string') {
      const name = canonicalizeIngredientName(item.trim());
      if (name) normalized.push({ name, isStaple: false });
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

      normalized.push(ingredient);
    }
  }

  return normalized;
}
