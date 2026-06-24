import type { Recipe } from '@/data/mockRecipes';
import type { PantrySection } from '@/services/reference';
import type { DietChoice } from '@/constants/theme';
import type { MealContext } from '@/utils/mealTime';
import {
  isEssentialIngredient,
  pantryHasIngredient,
  resolveCanonicalLabel,
} from '@/utils/pantryCanonical';
import {
  getPersonalizedPantrySections,
  type PantryPreferenceSummary,
} from '@/utils/pantryPersonalization';
import type { KitchenStyle } from '@/utils/kitchenStyles';
import { ingredientKey } from '@/utils/recipeIngredients';

export type PantryPersonalSection = {
  title: string;
  subtitle: string;
  items: string[];
  recipeCount: number;
};

export type { PantryPreferenceSummary };

export function getPantryEssentialSections(input: {
  dietChoice: DietChoice;
  favoriteCuisines: string[];
  kitchenStyles: KitchenStyle[];
}): { sections: PantrySection[]; preferenceSummary: PantryPreferenceSummary } {
  return getPersonalizedPantrySections(input);
}

function uniqueRecipes(recipes: Array<Recipe | null | undefined>): Recipe[] {
  const seen = new Set<string>();
  const result: Recipe[] = [];
  for (const recipe of recipes) {
    if (!recipe || seen.has(recipe.id)) continue;
    seen.add(recipe.id);
    result.push(recipe);
  }
  return result;
}

function titleCaseIngredient(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function chipLabelForIngredient(name: string): string {
  return resolveCanonicalLabel(name) ?? titleCaseIngredient(name);
}

/** Ingredients from user picks + saved that are not already covered by essentials. */
export function buildPersonalPantrySection(
  contextRecipes: Recipe[],
  meal: MealContext,
  savedCount: number,
): PantryPersonalSection | null {
  if (contextRecipes.length === 0) {
    return null;
  }

  const seenChipKeys = new Set<string>();
  const items: string[] = [];

  for (const recipe of contextRecipes) {
    for (const ingredient of recipe.ingredients) {
      const rawName = ingredient.name?.trim();
      if (!rawName) continue;
      if (isEssentialIngredient(rawName)) continue;

      const label = chipLabelForIngredient(rawName);
      const chipKey = ingredientKey(label);
      if (!chipKey || seenChipKeys.has(chipKey)) continue;

      seenChipKeys.add(chipKey);
      items.push(label);
    }
  }

  if (items.length === 0) {
    return null;
  }

  items.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  const previewTitles = contextRecipes.slice(0, 2).map((recipe) => recipe.title);
  const preview =
    previewTitles.length > 0
      ? `${previewTitles.join(', ')}${contextRecipes.length > 2 ? ` +${contextRecipes.length - 2}` : ''}`
      : '';
  const savedSuffix = savedCount > 0 ? `${savedCount} saved` : '';
  const subtitle = [preview, savedSuffix].filter(Boolean).join(' · ');

  const pickLabel = meal.topPickEyebrow.replace(/ pick$/i, '');
  const title = `For your ${pickLabel.toLowerCase()} picks`;

  return {
    title,
    subtitle,
    items,
    recipeCount: contextRecipes.length,
  };
}

export function collectPantryContextRecipes(input: {
  topPick?: Recipe | null;
  alsoFor: Recipe[];
  saved: Recipe[];
}): Recipe[] {
  return uniqueRecipes([input.topPick, ...input.alsoFor, ...input.saved]);
}

export function getMissingPantryLabels(recipes: Recipe[], pantryIngredients: string[]): string[] {
  const seen = new Set<string>();
  const missing: string[] = [];

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const rawName = ingredient.name?.trim();
      if (!rawName || pantryHasIngredient(pantryIngredients, rawName)) continue;

      const label = chipLabelForIngredient(rawName);
      const key = ingredientKey(label);
      if (!key || seen.has(key)) continue;

      seen.add(key);
      missing.push(label);
    }
  }

  return missing.slice(0, 6);
}

export function countStockedPantryItems(
  sections: PantrySection[],
  personalItems: string[],
  pantryIngredients: string[],
): { stocked: number; total: number; percent: number } {
  const labels = [...sections.flatMap((section) => section.items), ...personalItems];
  const uniqueKeys = new Set<string>();
  let stocked = 0;

  for (const label of labels) {
    const key = ingredientKey(label);
    if (!key || uniqueKeys.has(key)) continue;
    uniqueKeys.add(key);
    if (pantryHasIngredient(pantryIngredients, label)) {
      stocked += 1;
    }
  }

  const total = uniqueKeys.size;
  const percent = total > 0 ? Math.round((stocked / total) * 100) : 0;
  return { stocked, total, percent };
}
