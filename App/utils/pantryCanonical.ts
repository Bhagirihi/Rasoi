import { getAllPantryCatalogItems } from '@/constants/pantryCuisineCatalog';
import {
  canonicalizeIngredientName,
  expandIngredientAliasKeys,
} from '@/constants/ingredientCanonical';
import { PANTRY_ESSENTIAL_SECTIONS, type PantryEssentialItem } from '@/constants/pantryEssentials';

function ingredientKey(name: string | undefined | null): string {
  return (name ?? '').trim().toLowerCase();
}

const ALL_CANONICAL_ITEMS: PantryEssentialItem[] = [
  ...PANTRY_ESSENTIAL_SECTIONS.flatMap((section) => section.items),
  ...getAllPantryCatalogItems(),
];

const KEY_TO_CANONICAL_ID = new Map<string, string>();

for (const item of ALL_CANONICAL_ITEMS) {
  const keys = [item.id, item.label, ...item.aliases].map(ingredientKey);
  for (const key of keys) {
    // Essentials are registered first — keep the first id so cuisine variants
    // (e.g. south-green-chilli) do not create duplicate chips for Hari Mirch.
    if (key && !KEY_TO_CANONICAL_ID.has(key)) {
      KEY_TO_CANONICAL_ID.set(key, item.id);
    }
  }
}

function pantryItemForId(id: string): PantryEssentialItem | undefined {
  return ALL_CANONICAL_ITEMS.find((item) => item.id === id);
}

export function resolveCanonicalId(name: string): string | null {
  const key = ingredientKey(name);
  if (!key) return null;

  const pantryId = KEY_TO_CANONICAL_ID.get(key);
  if (pantryId) return pantryId;

  const canonicalName = canonicalizeIngredientName(name);
  const canonicalKey = ingredientKey(canonicalName);
  if (canonicalKey !== key) {
    return KEY_TO_CANONICAL_ID.get(canonicalKey) ?? null;
  }

  return null;
}

export function resolveCanonicalLabel(name: string): string | null {
  const id = resolveCanonicalId(name);
  if (id) {
    return pantryItemForId(id)?.label ?? null;
  }

  const canonicalName = canonicalizeIngredientName(name);
  if (canonicalName !== name.trim()) {
    return canonicalName;
  }

  return null;
}

export function isEssentialIngredient(name: string): boolean {
  return resolveCanonicalId(name) !== null || resolveCanonicalLabel(name) !== null;
}

export function expandCanonicalKeys(name: string): Set<string> {
  const id = resolveCanonicalId(name);
  if (id) {
    const item = pantryItemForId(id);
    if (item) {
      const keys = new Set<string>();
      for (const alias of [item.id, item.label, ...item.aliases]) {
        const key = ingredientKey(alias);
        if (key) keys.add(key);
      }
      for (const aliasKey of expandIngredientAliasKeys(item.label)) {
        keys.add(aliasKey);
      }
      return keys;
    }
  }

  const canonicalName = canonicalizeIngredientName(name);
  const aliasKeys = expandIngredientAliasKeys(canonicalName);
  if (aliasKeys.size > 1 || canonicalName !== name.trim()) {
    return aliasKeys;
  }

  return new Set([ingredientKey(name)]);
}

/** Stable key for collapsing duplicate chips (Green chilli / Hari Mirch / Green Chilies). */
export function pantryDedupeKey(name: string): string {
  const canonical = canonicalizeIngredientName(name);
  const aliasKeys = [...expandIngredientAliasKeys(canonical)].filter(Boolean).sort();
  if (aliasKeys.length > 0) {
    return `canon:${aliasKeys.join('|')}`;
  }

  const id = resolveCanonicalId(name);
  if (id) return `id:${id}`;

  return `raw:${ingredientKey(name)}`;
}

export function buildPantryKeySet(pantryIngredients: string[]): Set<string> {
  const pantryKeys = new Set<string>();
  for (const item of pantryIngredients) {
    for (const alias of expandCanonicalKeys(item)) {
      pantryKeys.add(alias);
    }
  }
  return pantryKeys;
}

export function pantryHasIngredientInSet(pantryKeys: Set<string>, ingredientName: string): boolean {
  for (const key of expandCanonicalKeys(ingredientName)) {
    if (pantryKeys.has(key)) return true;
  }
  return false;
}

export function pantryHasIngredient(pantryIngredients: string[], ingredientName: string): boolean {
  return pantryHasIngredientInSet(buildPantryKeySet(pantryIngredients), ingredientName);
}

export function removePantryIngredient(pantryIngredients: string[], ingredientName: string): string[] {
  const removeKeys = expandCanonicalKeys(ingredientName);
  return pantryIngredients.filter((item) => !removeKeys.has(ingredientKey(item)));
}

export function addPantryIngredient(pantryIngredients: string[], ingredientName: string): string[] {
  const canonicalLabel = resolveCanonicalLabel(ingredientName) ?? canonicalizeIngredientName(ingredientName);
  if (!canonicalLabel || pantryHasIngredient(pantryIngredients, canonicalLabel)) {
    return pantryIngredients;
  }
  const removeKeys = expandCanonicalKeys(canonicalLabel);
  const next = pantryIngredients.filter((item) => !removeKeys.has(ingredientKey(item)));
  return [...next, canonicalLabel];
}

export function getEssentialPantryLabels(): string[] {
  return ALL_CANONICAL_ITEMS.map((item) => item.label);
}

/** Collapse alias/spelling duplicates while keeping first preferred label. */
export function dedupePantryLabels(labels: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const label of labels) {
    const trimmed = label.trim();
    if (!trimmed) continue;
    const key = pantryDedupeKey(trimmed);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(resolveCanonicalLabel(trimmed) ?? trimmed);
  }

  return result;
}
