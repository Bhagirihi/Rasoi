import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';

/** Comma-separated `main_ingredients` text from Supabase → clean names for pantry UX. */
export function parseMainIngredients(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  const names: string[] = [];
  const seen = new Set<string>();

  for (const part of raw.split(',')) {
    const name = canonicalizeIngredientName(part.trim());
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }

  return names;
}

/** Normalize admin/API input into the DB column format (comma-separated) or null. */
export function formatMainIngredientsColumn(
  value: string | string[] | null | undefined,
): string | null {
  if (value == null) return null;
  const raw = Array.isArray(value) ? value.join(', ') : value;
  const names = parseMainIngredients(raw);
  return names.length > 0 ? names.join(', ') : null;
}
