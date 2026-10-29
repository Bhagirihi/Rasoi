import type { RecipeCatalogEntry } from './recipe-catalog/types';

export function normalizeRecipeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const TITLE_PREFIXES = [
  'home-style',
  'dhaba',
  'quick',
  'festive',
  'royal',
  'smoky',
  'mumbai',
  'delhi',
  'punjabi-style',
  'south indian',
  'gujarati',
  'bengali',
  'chennai',
  'hyderabadi',
  'lucknowi',
  'amritsari',
  'kolkata',
  'bangalore',
  'jaipur',
  'udaipur',
  'monsoon',
  'winter',
  'summer',
  'temple',
  'street-style',
  'hotel-style',
  'grand',
  'mini',
  'family',
  'chef',
  'classic',
  'premium',
  'lite',
  'spicy',
  'mild',
  'crispy',
  'soft',
  'buttery',
  'tawa',
  'pressure-cooker',
  'one-pot',
  'weeknight',
  'sunday',
  'party',
  'comfort',
  'healthy',
  'traditional',
  'modern',
  "grandma's",
  'rasoi',
  'authentic',
  'special',
  'homestyle',
  'restaurant',
  'simple',
  'easy',
];

export function stripMarketingPrefix(title: string): string {
  let t = normalizeRecipeTitle(title);
  for (const prefix of [...TITLE_PREFIXES].sort((a, b) => b.length - a.length)) {
    if (t.startsWith(`${prefix} `)) {
      t = t.slice(prefix.length + 1).trim();
      break;
    }
  }
  return t;
}

export function isMarketingRecipe(recipe: RecipeCatalogEntry): boolean {
  return recipe.id.startsWith('ad-mkt-');
}

function ingredientFingerprint(recipe: RecipeCatalogEntry): string {
  const names = (recipe.ingredients ?? [])
    .map((i) => String(i.name ?? '').trim().toLowerCase())
    .filter(Boolean);
  return names.sort().join('|');
}

function titleTokenSet(title: string): Set<string> {
  return new Set(normalizeRecipeTitle(title).split(' ').filter(Boolean));
}

function titleJaccard(a: string, b: string): number {
  const sa = titleTokenSet(a);
  const sb = titleTokenSet(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter += 1;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Lower tuple sorts first = preferred canonical recipe. */
export function canonicalRank(recipe: RecipeCatalogEntry): [number, number, number, string] {
  const isMarketing = isMarketingRecipe(recipe) ? 1 : 0;
  const styleMatch = recipe.id.startsWith(`${recipe.kitchenStyleId}-`) ? 0 : 1;
  const numMatch = recipe.id.match(/-(\d+)$/);
  const num = numMatch ? Number.parseInt(numMatch[1], 10) : 99_999;
  return [isMarketing, styleMatch, num, recipe.id];
}

export function pickCanonicalRecipe(recipes: RecipeCatalogEntry[]): RecipeCatalogEntry {
  return [...recipes].sort((a, b) => {
    const ra = canonicalRank(a);
    const rb = canonicalRank(b);
    for (let i = 0; i < 3; i += 1) {
      if (ra[i] !== rb[i]) return ra[i] - rb[i];
    }
    return ra[3].localeCompare(rb[3]);
  })[0];
}

export type RecipeDedupePlan = {
  dedupedRecipes: RecipeCatalogEntry[];
  remap: Map<string, string>;
  removeIds: Set<string>;
  keepIds: Set<string>;
  duplicateGroups: Array<{
    title: string;
    canonicalId: string;
    removedIds: string[];
    reason?: string;
  }>;
};

function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}

function resolveRemapTarget(id: string, remap: Map<string, string>): string {
  let current = id;
  const seen = new Set<string>();
  while (remap.has(current) && !seen.has(current)) {
    seen.add(current);
    current = remap.get(current)!;
  }
  return current;
}

function addRemovals(
  plan: RecipeDedupePlan,
  recipes: RecipeCatalogEntry[],
  canonical: RecipeCatalogEntry,
  reason: string,
  label: string,
) {
  const removedIds: string[] = [];
  for (const recipe of recipes) {
    if (recipe.id === canonical.id) continue;
    if (plan.removeIds.has(recipe.id)) continue;
    const target = resolveRemapTarget(canonical.id, plan.remap);
    plan.remap.set(recipe.id, target);
    plan.removeIds.add(recipe.id);
    plan.keepIds.delete(recipe.id);
    removedIds.push(recipe.id);
  }
  if (removedIds.length > 0) {
    plan.duplicateGroups.push({
      title: label,
      canonicalId: resolveRemapTarget(canonical.id, plan.remap),
      removedIds,
      reason,
    });
  }
  plan.keepIds.add(resolveRemapTarget(canonical.id, plan.remap));
}

export function buildRecipeDedupePlan(recipes: RecipeCatalogEntry[]): RecipeDedupePlan {
  const byTitle = groupBy(recipes, (r) => normalizeRecipeTitle(r.title));

  const plan: RecipeDedupePlan = {
    dedupedRecipes: [],
    remap: new Map(),
    removeIds: new Set(),
    keepIds: new Set(recipes.map((r) => r.id)),
    duplicateGroups: [],
  };

  for (const [title, list] of byTitle) {
    if (list.length === 1) continue;
    const canonical = pickCanonicalRecipe(list);
    addRemovals(plan, list, canonical, 'exact-title', title);
  }

  plan.dedupedRecipes = recipes.filter((recipe) => !plan.removeIds.has(recipe.id));
  return plan;
}

/** Extended cleanup: core-title, same-ingredients+style, near-title (non-marketing only). */
export function buildExtendedCleanupPlan(recipes: RecipeCatalogEntry[]): RecipeDedupePlan {
  const plan: RecipeDedupePlan = {
    dedupedRecipes: [],
    remap: new Map(),
    removeIds: new Set(),
    keepIds: new Set(recipes.map((r) => r.id)),
    duplicateGroups: [],
  };

  const active = () => recipes.filter((r) => !plan.removeIds.has(r.id));
  const nonMarketing = (list: RecipeCatalogEntry[]) => list.filter((r) => !isMarketingRecipe(r));

  // Phase A: same core title + same kitchen style (batch2/extra overlap)
  const byCoreStyle = groupBy(
    nonMarketing(active()),
    (r) => `${r.kitchenStyleId}::${stripMarketingPrefix(r.title)}`,
  );
  for (const [key, list] of byCoreStyle) {
    if (list.length < 2) continue;
    const canonical = pickCanonicalRecipe(list);
    addRemovals(plan, list, canonical, 'core-title-style', key);
  }

  // Phase B: same ingredients + same kitchen style + same core title
  const byIngStyle = groupBy(nonMarketing(active()), (r) => {
    const fp = ingredientFingerprint(r);
    if (!fp) return '';
    return `${r.kitchenStyleId}::${fp}::${stripMarketingPrefix(r.title)}`;
  });
  for (const [key, list] of byIngStyle) {
    if (!key || list.length < 2) continue;
    const canonical = pickCanonicalRecipe(list);
    addRemovals(plan, list, canonical, 'same-ingredients-style', key);
  }

  // Phase C: near-title pairs (≥88%) within same kitchen style
  const remaining = nonMarketing(active());
  for (let i = 0; i < remaining.length; i += 1) {
    const a = remaining[i];
    if (plan.removeIds.has(a.id)) continue;
    const aNorm = normalizeRecipeTitle(a.title);
    for (let j = i + 1; j < remaining.length; j += 1) {
      const b = remaining[j];
      if (plan.removeIds.has(b.id)) continue;
      if (a.kitchenStyleId !== b.kitchenStyleId) continue;
      const bNorm = normalizeRecipeTitle(b.title);
      if (aNorm === bNorm) continue;
      if (titleJaccard(a.title, b.title) < 0.88) continue;
      const pair = [a, b];
      const canonical = pickCanonicalRecipe(pair);
      const duplicate = pair.find((r) => r.id !== canonical.id)!;
      addRemovals(plan, [duplicate], canonical, 'near-title', `${a.title} ~ ${b.title}`);
    }
  }

  plan.dedupedRecipes = recipes.filter((recipe) => !plan.removeIds.has(recipe.id));
  return plan;
}
