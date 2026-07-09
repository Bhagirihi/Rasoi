import type { RecipeIngredient } from '@/data/mockRecipes';
import { canonicalizeIngredientName } from '@/constants/ingredientCanonical';

/** API/catalog may return string[] or partial objects — normalize before UI use. */
export function normalizeRecipeIngredients(raw: unknown): RecipeIngredient[] {
  if (!Array.isArray(raw)) return [];

  const normalized: RecipeIngredient[] = [];
  const seen = new Map<string, number>();

  for (const item of raw) {
    if (typeof item === 'string') {
      const name = canonicalizeIngredientName(item.trim());
      if (!name) continue;
      const key = name.trim().toLowerCase();
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

      const key = name.trim().toLowerCase();
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

export function ingredientKey(name: string | undefined | null): string {
  return (name ?? '').trim().toLowerCase();
}

export {
  addPantryIngredient,
  pantryHasIngredient,
  removePantryIngredient,
} from '@/utils/pantryCanonical';
