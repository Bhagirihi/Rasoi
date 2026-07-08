/**
 * Fix recipe ingredients from title: hero alignment, missing title ingredients, khichdi dal, dedupe.
 */
import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';
import { heroIngredientMismatch, inferHeroIngredientFromTitle } from '@/lib/infer-hero-ingredient';
import { missingTitleIngredientNames } from '@/lib/recipe-chef-audit';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import type { RecipeIngredient } from '@/lib/types';

function khichdiNeedsDal(title: string, ingredients: RecipeIngredient[]): boolean {
  const lower = title.toLowerCase();
  if (!/khichdi|khichri/.test(lower) || /dal/.test(lower)) return false;
  return !ingredients.some((item) => /moong dal|dal|lentil/i.test(item.name));
}

function spuriousFallbackIngredient(title: string, name: string): boolean {
  const lower = title.toLowerCase();
  const ingredient = name.toLowerCase();
  if (ingredient === 'aloo' && /bajra|ragi|jowar|millet|quinoa|poha|sabudana|khichdi|rotla|thepla|paneer|chicken|fish|mutton|dal|chole|rajma/i.test(lower) && !/aloo|potato|bateta/.test(lower)) {
    return true;
  }
  if (ingredient === 'millet' && /bajra|ragi|jowar/i.test(lower)) return true;
  if (ingredient === 'tuver dal' && /bajra|ragi|jowar|millet|raab|rotla|thepla|paneer|chicken|poha/i.test(lower) && !/dal|tuver|toor|arhar/.test(lower)) {
    return true;
  }
  return false;
}

export function fixRecipeIngredientsFromTitle(
  title: string,
  raw: unknown,
): { ingredients: RecipeIngredient[]; changed: boolean; changes: string[] } {
  const normalized = normalizeRecipeIngredients(raw);
  const changes: string[] = [];
  if (normalized.length === 0) return { ingredients: normalized, changed: false, changes };

  const heroIndex = normalized.findIndex((item) => !item.isStaple);
  const index = heroIndex >= 0 ? heroIndex : 0;
  const currentHero = normalized[index]?.name ?? '';

  if (heroIngredientMismatch(title, currentHero)) {
    const expectedHero = inferHeroIngredientFromTitle(title, currentHero);
    normalized[index] = { ...normalized[index], name: expectedHero, isStaple: false };
    changes.push(`hero: ${currentHero} → ${expectedHero}`);
  }

  for (const missing of missingTitleIngredientNames(title, normalized)) {
    if (normalized.some((item) => canonicalizeIngredientName(item.name).toLowerCase() === missing.toLowerCase())) {
      continue;
    }
    normalized.splice(index + 1, 0, { name: missing, isStaple: false });
    changes.push(`added: ${missing}`);
  }

  if (khichdiNeedsDal(title, normalized)) {
    normalized.splice(index + 1, 0, { name: 'Moong Dal', isStaple: false });
    changes.push('added: Moong Dal');
  }

  const beforeLen = normalized.length;
  const deduped = normalizeRecipeIngredients(normalized);
  if (deduped.length < beforeLen) changes.push('deduped duplicate ingredients');

  const cleaned = deduped.filter((item) => {
    if (!spuriousFallbackIngredient(title, item.name)) return true;
    const properHero = inferHeroIngredientFromTitle(title, item.name).toLowerCase();
    const hasProperHero = deduped.some((entry) => {
      const name = entry.name.toLowerCase();
      return name.includes(properHero.split(' ')[0]!) || properHero.includes(name.split(' ')[0]!);
    });
    if (hasProperHero || heroIngredientMismatch(title, item.name)) {
      changes.push(`removed spurious: ${item.name}`);
      return false;
    }
    return true;
  });

  return { ingredients: cleaned, changed: changes.length > 0, changes };
}
