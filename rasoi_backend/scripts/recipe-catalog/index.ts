import { ALL_CUISINES_BATCH3_RECIPES } from './all-cuisines-batch3';
import { ALL_CUISINES_BATCH4_RECIPES } from './all-cuisines-batch4';
import { ALL_CUISINES_BATCH5_RECIPES } from './all-cuisines-batch5';
import { ASSAMESE_BATCH2_RECIPES } from './assamese-batch2';
import { ASSAMESE_EXTRA_RECIPES } from './assamese-extra';
import { BASE_RECIPES } from './base-recipes';
import { BENGALI_BATCH2_RECIPES } from './bengali-batch2';
import { BENGALI_EXTRA_RECIPES } from './bengali-extra';
import { CHETTINAD_BATCH2_RECIPES } from './chettinad-batch2';
import { CHETTINAD_EXTRA_RECIPES } from './chettinad-extra';
import { CHINESE_BATCH2_RECIPES } from './chinese-batch2';
import { CHINESE_EXTRA_RECIPES } from './chinese-extra';
import { GOAN_BATCH2_RECIPES } from './goan-batch2';
import { GOAN_EXTRA_RECIPES } from './goan-extra';
import { GUJARATI_BATCH2_RECIPES } from './gujarati-batch2';
import { GUJARATI_EXTRA_RECIPES } from './gujarati-extra';
import { HYDERABADI_BATCH2_RECIPES } from './hyderabadi-batch2';
import { HYDERABADI_EXTRA_RECIPES } from './hyderabadi-extra';
import { KASHMIRI_BATCH2_RECIPES } from './kashmiri-batch2';
import { KASHMIRI_EXTRA_RECIPES } from './kashmiri-extra';
import { KERALA_BATCH2_RECIPES } from './kerala-batch2';
import { KERALA_EXTRA_RECIPES } from './kerala-extra';
import { MAHARASHTRIAN_BATCH2_RECIPES } from './maharashtrian-batch2';
import { MAHARASHTRIAN_EXTRA_RECIPES } from './maharashtrian-extra';
import { MARKETING_AD_MISSING_RECIPES } from './marketing-ad-missing-batch';
import { NORTH_BATCH2_RECIPES } from './north-batch2';
import { NORTH_EXTRA_RECIPES } from './north-extra';
import { PUNJABI_BATCH2_RECIPES } from './punjabi-batch2';
import { PUNJABI_EXTRA_RECIPES } from './punjabi-extra';
import { RAJASTHANI_BATCH2_RECIPES } from './rajasthani-batch2';
import { RAJASTHANI_EXTRA_RECIPES } from './rajasthani-extra';
import { SOUTH_BATCH2_RECIPES } from './south-batch2';
import { SOUTH_EXTRA_RECIPES } from './south-extra';
import { STREET_BATCH2_RECIPES } from './street-batch2';
import { STREET_EXTRA_RECIPES } from './street-extra';
import type { RecipeCatalogEntry } from './types';
import { resolveRecipeSteps } from './step-builder';

const VALID_KITCHEN_STYLES = new Set([
  'gujarati',
  'street',
  'south',
  'north',
  'punjabi',
  'rajasthani',
  'bengali',
  'maharashtrian',
  'hyderabadi',
  'goan',
  'kerala',
  'chinese',
  'assamese',
  'kashmiri',
  'chettinad',
]);

const KITCHEN_STYLE_ALIASES: Record<string, string> = {
  'indo-chinese': 'chinese',
  malabar: 'kerala',
  'south-indian': 'south',
  portuguese: 'goan',
  'street-food': 'street',
  'middle-eastern': 'north',
  mughlai: 'north',
  awadhi: 'north',
};

const VALID_TAGS = new Set(['under20', 'leftover', 'kids', 'quick', 'festive']);

const EXTRA_RECIPES: RecipeCatalogEntry[] = [
  ...GUJARATI_EXTRA_RECIPES,
  ...GUJARATI_BATCH2_RECIPES,
  ...STREET_EXTRA_RECIPES,
  ...STREET_BATCH2_RECIPES,
  ...SOUTH_EXTRA_RECIPES,
  ...SOUTH_BATCH2_RECIPES,
  ...NORTH_EXTRA_RECIPES,
  ...NORTH_BATCH2_RECIPES,
  ...PUNJABI_EXTRA_RECIPES,
  ...PUNJABI_BATCH2_RECIPES,
  ...RAJASTHANI_EXTRA_RECIPES,
  ...RAJASTHANI_BATCH2_RECIPES,
  ...BENGALI_EXTRA_RECIPES,
  ...BENGALI_BATCH2_RECIPES,
  ...MAHARASHTRIAN_EXTRA_RECIPES,
  ...MAHARASHTRIAN_BATCH2_RECIPES,
  ...HYDERABADI_EXTRA_RECIPES,
  ...HYDERABADI_BATCH2_RECIPES,
  ...GOAN_EXTRA_RECIPES,
  ...GOAN_BATCH2_RECIPES,
  ...KERALA_EXTRA_RECIPES,
  ...KERALA_BATCH2_RECIPES,
  ...CHINESE_EXTRA_RECIPES,
  ...CHINESE_BATCH2_RECIPES,
  ...ASSAMESE_EXTRA_RECIPES,
  ...ASSAMESE_BATCH2_RECIPES,
  ...KASHMIRI_EXTRA_RECIPES,
  ...KASHMIRI_BATCH2_RECIPES,
  ...CHETTINAD_EXTRA_RECIPES,
  ...CHETTINAD_BATCH2_RECIPES,
  ...ALL_CUISINES_BATCH3_RECIPES,
  ...ALL_CUISINES_BATCH4_RECIPES,
  ...ALL_CUISINES_BATCH5_RECIPES,
  ...MARKETING_AD_MISSING_RECIPES,
];

function resolveKitchenStyleId(styleId: string | undefined): string | undefined {
  if (!styleId) return undefined;
  const normalized = KITCHEN_STYLE_ALIASES[styleId] ?? styleId;
  return VALID_KITCHEN_STYLES.has(normalized) ? normalized : undefined;
}

function normalizeKitchenStyleIds(entry: RecipeCatalogEntry): string[] {
  const rawIds = entry.kitchenStyleIds?.length
    ? entry.kitchenStyleIds
    : [entry.kitchenStyleId];
  const resolved = [...new Set(rawIds.map(resolveKitchenStyleId).filter(Boolean) as string[])];
  const primary = resolveKitchenStyleId(entry.kitchenStyleId);
  if (primary && !resolved.includes(primary)) {
    resolved.unshift(primary);
  }
  return resolved.length > 0 ? resolved : primary ? [primary] : [entry.kitchenStyleId];
}

function normalizeTags(entry: RecipeCatalogEntry): string[] {
  const tags = new Set<string>();
  for (const tag of entry.tags) {
    if (VALID_TAGS.has(tag)) tags.add(tag);
  }
  if (entry.prepTime <= 20) tags.add('under20');
  if (tags.size === 0) tags.add('quick');
  return [...tags];
}

function sanitizeEntry(entry: RecipeCatalogEntry): RecipeCatalogEntry {
  return {
    ...entry,
    kitchenStyleIds: normalizeKitchenStyleIds(entry),
    tags: normalizeTags(entry),
    steps: resolveRecipeSteps(entry),
  };
}

export const ALL_CATALOG_RECIPES: RecipeCatalogEntry[] = [...BASE_RECIPES, ...EXTRA_RECIPES].map(
  sanitizeEntry,
);

export function countByKitchenStyle(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const recipe of ALL_CATALOG_RECIPES) {
    for (const styleId of recipe.kitchenStyleIds ?? [recipe.kitchenStyleId]) {
      counts[styleId] = (counts[styleId] ?? 0) + 1;
    }
  }
  return counts;
}

export function findDuplicateTitles(): string[] {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const recipe of ALL_CATALOG_RECIPES) {
    const key = recipe.title.trim().toLowerCase();
    const existing = seen.get(key);
    if (existing) {
      duplicates.push(`${recipe.title} (${recipe.id} vs ${existing})`);
    } else {
      seen.set(key, recipe.id);
    }
  }
  return duplicates;
}
