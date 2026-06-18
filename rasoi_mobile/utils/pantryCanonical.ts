import { PANTRY_ESSENTIAL_SECTIONS, type PantryEssentialItem } from '@/constants/pantryEssentials';

function ingredientKey(name: string | undefined | null): string {
  return (name ?? '').trim().toLowerCase();
}

const ALL_CANONICAL_ITEMS: PantryEssentialItem[] = PANTRY_ESSENTIAL_SECTIONS.flatMap(
  (section) => section.items,
);

const KEY_TO_CANONICAL_ID = new Map<string, string>();

for (const item of ALL_CANONICAL_ITEMS) {
  const keys = [item.id, item.label, ...item.aliases].map(ingredientKey);
  for (const key of keys) {
    if (key) KEY_TO_CANONICAL_ID.set(key, item.id);
  }
}

export function resolveCanonicalId(name: string): string | null {
  const key = ingredientKey(name);
  if (!key) return null;
  return KEY_TO_CANONICAL_ID.get(key) ?? null;
}

export function resolveCanonicalLabel(name: string): string | null {
  const id = resolveCanonicalId(name);
  if (!id) return null;
  return ALL_CANONICAL_ITEMS.find((item) => item.id === id)?.label ?? null;
}

export function isEssentialIngredient(name: string): boolean {
  return resolveCanonicalId(name) !== null;
}

export function expandCanonicalKeys(name: string): Set<string> {
  const id = resolveCanonicalId(name);
  if (!id) {
    return new Set([ingredientKey(name)]);
  }

  const item = ALL_CANONICAL_ITEMS.find((entry) => entry.id === id);
  if (!item) {
    return new Set([ingredientKey(name)]);
  }

  const keys = new Set<string>();
  for (const alias of [item.id, item.label, ...item.aliases]) {
    const key = ingredientKey(alias);
    if (key) keys.add(key);
  }
  return keys;
}

export function pantryHasIngredient(pantryIngredients: string[], ingredientName: string): boolean {
  const needed = expandCanonicalKeys(ingredientName);
  const pantryKeys = new Set<string>();
  for (const item of pantryIngredients) {
    for (const alias of expandCanonicalKeys(item)) {
      pantryKeys.add(alias);
    }
  }
  return [...needed].some((key) => pantryKeys.has(key));
}

export function removePantryIngredient(pantryIngredients: string[], ingredientName: string): string[] {
  const removeKeys = expandCanonicalKeys(ingredientName);
  return pantryIngredients.filter((item) => !removeKeys.has(ingredientKey(item)));
}

export function addPantryIngredient(pantryIngredients: string[], ingredientName: string): string[] {
  const canonicalLabel = resolveCanonicalLabel(ingredientName) ?? ingredientName.trim();
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
