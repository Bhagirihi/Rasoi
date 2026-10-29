/**
 * Scan ALL_CATALOG_RECIPES for exact and near-duplicate recipes.
 * Run: cd rasoi_backend && npx tsx scripts/analyze-recipe-duplicates.ts
 */
import 'dotenv/config';
import { writeFileSync } from 'fs';
import path from 'path';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { ALL_CATALOG_RECIPES } from './recipe-catalog';
import type { RecipeCatalogEntry } from './recipe-catalog/types';

type RecipeRef = {
  id: string;
  title: string;
  kitchenStyleId: string;
  region: string;
  dietType: string;
  prepTime: number;
};

const PREFIXES = [
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

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarketingPrefix(title: string): string {
  let t = normalizeTitle(title);
  for (const prefix of PREFIXES.sort((a, b) => b.length - a.length)) {
    if (t.startsWith(`${prefix} `)) {
      t = t.slice(prefix.length + 1).trim();
      break;
    }
  }
  return t;
}

function tokenSet(title: string): Set<string> {
  return new Set(normalizeTitle(title).split(' ').filter(Boolean));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function ingredientNames(recipe: RecipeCatalogEntry): string[] {
  return (recipe.ingredients ?? [])
    .map((i) => {
      if (typeof i === 'string') return i.trim().toLowerCase();
      if (i && typeof i === 'object' && 'name' in i) return String(i.name ?? '').trim().toLowerCase();
      return '';
    })
    .filter(Boolean);
}

function ingredientFingerprint(recipe: RecipeCatalogEntry): string {
  return ingredientNames(recipe).sort().join('|');
}

function ingredientTokenSet(recipe: RecipeCatalogEntry): Set<string> {
  return new Set(ingredientNames(recipe));
}

function normalizeDescription(description: string): string {
  return normalizeTitle(description).slice(0, 200);
}

function toRef(recipe: RecipeCatalogEntry): RecipeRef {
  return {
    id: recipe.id,
    title: recipe.title,
    kitchenStyleId: recipe.kitchenStyleId,
    region: recipe.region,
    dietType: recipe.dietType,
    prepTime: recipe.prepTime,
  };
}

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

async function fetchSupabaseStats(): Promise<{
  totalRecipes: number;
  exactTitleDuplicateGroups: number;
  catalogOnlyIds: string[];
  dbOnlyIds: string[];
} | null> {
  try {
    const pool = new Pool({ connectionString: getDirectDatabaseUrl() });
    const total = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM rasoi."Recipe"`);
    const dupes = await pool.query<{ n: number }>(`
      SELECT count(*)::int AS n FROM (
        SELECT lower(trim(title)) FROM rasoi."Recipe" GROUP BY 1 HAVING count(*) > 1
      ) t
    `);
    const { rows: dbRows } = await pool.query<{ id: string }>(`SELECT id FROM rasoi."Recipe"`);
    await pool.end();

    const catalogIds = new Set(ALL_CATALOG_RECIPES.map((r) => r.id));
    const dbIds = new Set(dbRows.map((r) => r.id));
    const catalogOnlyIds = [...catalogIds].filter((id) => !dbIds.has(id));
    const dbOnlyIds = [...dbIds].filter((id) => !catalogIds.has(id));

    return {
      totalRecipes: total.rows[0]?.n ?? 0,
      exactTitleDuplicateGroups: dupes.rows[0]?.n ?? 0,
      catalogOnlyIds,
      dbOnlyIds,
    };
  } catch {
    return null;
  }
}

function findNearIngredientPairs(
  recipes: RecipeCatalogEntry[],
  minScore: number,
): Array<{ score: number; a: RecipeRef; b: RecipeRef }> {
  const pairs: Array<{ score: number; a: RecipeRef; b: RecipeRef }> = [];
  const byCount = groupBy(recipes, (r) => String(ingredientNames(r).length));
  for (const bucket of byCount.values()) {
    if (bucket.length < 2) continue;
    for (let i = 0; i < bucket.length; i += 1) {
      const a = bucket[i];
      const aSet = ingredientTokenSet(a);
      const aFp = ingredientFingerprint(a);
      for (let j = i + 1; j < bucket.length; j += 1) {
        const b = bucket[j];
        if (ingredientFingerprint(b) === aFp) continue;
        const score = jaccard(aSet, ingredientTokenSet(b));
        if (score >= minScore) {
          pairs.push({ score, a: toRef(a), b: toRef(b) });
        }
      }
    }
  }
  pairs.sort((x, y) => y.score - x.score);
  return pairs;
}

async function main() {
  const recipes = ALL_CATALOG_RECIPES;
  const total = recipes.length;

  // Duplicate IDs
  const byId = groupBy(recipes, (r) => r.id);
  const duplicateIds = [...byId.entries()].filter(([, list]) => list.length > 1);

  // Exact title duplicates (case-insensitive)
  const byExactTitle = groupBy(recipes, (r) => normalizeTitle(r.title));
  const exactTitleDupes = [...byExactTitle.entries()].filter(([, list]) => list.length > 1);

  // Core title (strip marketing prefix)
  const byCoreTitle = groupBy(recipes, (r) => stripMarketingPrefix(r.title));
  const coreTitleFamilies = [...byCoreTitle.entries()]
    .filter(([, list]) => list.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  // Identical ingredient fingerprints
  const byIngredients = groupBy(recipes, ingredientFingerprint);
  const sameIngredients = [...byIngredients.entries()]
    .filter(([fp, list]) => fp.length > 0 && list.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  // Near-duplicate titles (Jaccard on word tokens)
  const nearTitlePairsHigh: Array<{ score: number; a: RecipeRef; b: RecipeRef }> = [];
  const nearTitlePairsModerate: Array<{ score: number; a: RecipeRef; b: RecipeRef }> = [];

  const sample = recipes;
  for (let i = 0; i < sample.length; i += 1) {
    const a = sample[i];
    const aNorm = normalizeTitle(a.title);
    const aTokens = tokenSet(a.title);
    for (let j = i + 1; j < sample.length; j += 1) {
      const b = sample[j];
      const bNorm = normalizeTitle(b.title);
      if (aNorm === bNorm) continue;
      const score = jaccard(aTokens, tokenSet(b.title));
      if (score >= 0.88) {
        nearTitlePairsHigh.push({ score, a: toRef(a), b: toRef(b) });
      } else if (score >= 0.75) {
        nearTitlePairsModerate.push({ score, a: toRef(a), b: toRef(b) });
      }
    }
  }
  nearTitlePairsHigh.sort((x, y) => y.score - x.score);
  nearTitlePairsModerate.sort((x, y) => y.score - x.score);

  // Same ingredients within same kitchen style (strong almost-duplicate signal)
  const byStyleAndIngredients = groupBy(
    recipes.filter((r) => ingredientFingerprint(r).length > 0),
    (r) => `${r.kitchenStyleId}::${ingredientFingerprint(r)}`,
  );
  const sameIngredientsSameStyle = [...byStyleAndIngredients.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([, list]) => ({
      kitchenStyleId: list[0].kitchenStyleId,
      ingredientCount: ingredientNames(list[0]).length,
      recipeCount: list.length,
      recipes: list.map(toRef),
    }))
    .sort((a, b) => b.recipeCount - a.recipeCount);

  // Identical descriptions (copy-paste signal)
  const byDescription = groupBy(
    recipes.filter((r) => normalizeDescription(r.description).length >= 40),
    (r) => normalizeDescription(r.description),
  );
  const sameDescriptions = [...byDescription.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([, list]) => ({
      descriptionPreview: list[0].description.slice(0, 120),
      recipeCount: list.length,
      recipes: list.map(toRef),
    }))
    .sort((a, b) => b.recipeCount - a.recipeCount);

  const nearIngredientPairs = findNearIngredientPairs(recipes, 0.9);

  // Marketing batch detection (marketing-ad-missing-batch.ts uses ad-mkt-* ids)
  const marketingVariants = recipes.filter((r) => r.id.startsWith('ad-mkt-'));
  const marketingByCore = groupBy(marketingVariants, (r) => stripMarketingPrefix(r.title));

  const isMarketingRecipe = (r: RecipeCatalogEntry) => r.id.startsWith('ad-mkt-');

  const exactTitleDupesNonMarketing = exactTitleDupes
    .map(([title, list]) => ({ title, list: list.filter((r) => !isMarketingRecipe(r)) }))
    .filter((g) => g.list.length > 1);

  // Cross-batch unintentional: same core title, excluding marketing variants
  const unintentionalCoreDupes = coreTitleFamilies.filter(([, list]) => {
    const nonMarketing = list.filter((r) => !isMarketingRecipe(r));
    return nonMarketing.length > 1;
  });

  const supabase = await fetchSupabaseStats();

  const report = {
    generatedAt: new Date().toISOString(),
    totalRecipes: total,
    summary: {
      duplicateIds: duplicateIds.length,
      exactTitleDuplicateGroups: exactTitleDupes.length,
      exactTitleDuplicateRecipes: exactTitleDupes.reduce((n, [, l]) => n + l.length, 0),
      exactTitleDuplicateGroupsNonMarketing: exactTitleDupesNonMarketing.length,
      exactTitleDuplicateRecipesNonMarketing: exactTitleDupesNonMarketing.reduce(
        (n, g) => n + g.list.length,
        0,
      ),
      coreTitleFamilies: coreTitleFamilies.length,
      coreTitleFamilyRecipes: coreTitleFamilies.reduce((n, [, l]) => n + l.length, 0),
      unintentionalCoreTitleFamilies: unintentionalCoreDupes.length,
      sameIngredientGroups: sameIngredients.length,
      sameIngredientsSameStyleGroups: sameIngredientsSameStyle.length,
      sameDescriptionGroups: sameDescriptions.length,
      nearTitlePairsHigh: nearTitlePairsHigh.length,
      nearTitlePairsModerate: nearTitlePairsModerate.length,
      nearIngredientPairs: nearIngredientPairs.length,
      nearTitlePairs: nearTitlePairsHigh.length,
      marketingVariantRecipes: marketingVariants.length,
      marketingCoreDishes: marketingByCore.size,
    },
    supabase,
    duplicateIds: duplicateIds.map(([id, list]) => ({
      id,
      recipes: list.map(toRef),
    })),
    exactTitleDuplicates: exactTitleDupes.map(([title, list]) => ({
      title,
      count: list.length,
      recipes: list.map(toRef),
    })),
    exactTitleDuplicatesNonMarketing: exactTitleDupesNonMarketing.map((g) => ({
      title: g.title,
      count: g.list.length,
      recipes: g.list.map(toRef),
    })),
    unintentionalCoreTitleDuplicates: unintentionalCoreDupes.map(([core, list]) => ({
      coreTitle: core,
      count: list.length,
      recipes: list.map(toRef),
    })),
    largestCoreTitleFamilies: coreTitleFamilies.slice(0, 30).map(([core, list]) => ({
      coreTitle: core,
      count: list.length,
      sampleTitles: list.slice(0, 5).map((r) => r.title),
      ids: list.map((r) => r.id),
    })),
    sameIngredientSets: sameIngredients.map(([fp, list]) => ({
      ingredientCount: fp.split('|').length,
      recipeCount: list.length,
      recipes: list.map(toRef),
    })),
    sameIngredientsSameStyle: sameIngredientsSameStyle.slice(0, 60),
    sameDescriptions: sameDescriptions.slice(0, 40),
    nearTitlePairsHigh: nearTitlePairsHigh.slice(0, 100),
    nearTitlePairsModerate: nearTitlePairsModerate.slice(0, 80),
    nearIngredientPairs: nearIngredientPairs.slice(0, 80),
    nearTitlePairs: nearTitlePairsHigh.slice(0, 100),
    marketingBatch: {
      variantCount: marketingVariants.length,
      baseDishes: [...marketingByCore.entries()]
        .map(([core, list]) => ({ coreTitle: core, variants: list.length }))
        .sort((a, b) => b.variants - a.variants),
    },
  };

  const jsonPath = path.join(__dirname, 'recipe-duplicate-analysis.json');
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const md = buildMarkdown(report);
  const mdPath = path.join(__dirname, '../../docs/RECIPE_DUPLICATES_REPORT.md');
  writeFileSync(mdPath, md);

  console.log(`Analyzed ${total} catalog recipes`);
  console.log(`JSON: ${jsonPath}`);
  console.log(`Markdown: ${mdPath}`);
  console.log(JSON.stringify(report.summary, null, 2));
}

function buildMarkdown(report: object): string {
  const r = report as {
    generatedAt: string;
    totalRecipes: number;
    summary: Record<string, number>;
    supabase: {
      totalRecipes: number;
      exactTitleDuplicateGroups: number;
      catalogOnlyIds: string[];
      dbOnlyIds: string[];
    } | null;
    duplicateIds: Array<{ id: string; recipes: RecipeRef[] }>;
    exactTitleDuplicates: Array<{ title: string; count: number; recipes: RecipeRef[] }>;
    exactTitleDuplicatesNonMarketing?: Array<{ title: string; count: number; recipes: RecipeRef[] }>;
    unintentionalCoreTitleDuplicates: Array<{ coreTitle: string; count: number; recipes: RecipeRef[] }>;
    largestCoreTitleFamilies: Array<{ coreTitle: string; count: number; sampleTitles: string[]; ids: string[] }>;
    sameIngredientSets: Array<{ ingredientCount: number; recipeCount: number; recipes: RecipeRef[] }>;
    sameIngredientsSameStyle: Array<{
      kitchenStyleId: string;
      ingredientCount: number;
      recipeCount: number;
      recipes: RecipeRef[];
    }>;
    sameDescriptions: Array<{ descriptionPreview: string; recipeCount: number; recipes: RecipeRef[] }>;
    nearTitlePairsHigh: Array<{ score: number; a: RecipeRef; b: RecipeRef }>;
    nearTitlePairsModerate: Array<{ score: number; a: RecipeRef; b: RecipeRef }>;
    nearIngredientPairs: Array<{ score: number; a: RecipeRef; b: RecipeRef }>;
    marketingBatch: { variantCount: number; baseDishes: Array<{ coreTitle: string; variants: number }> };
  };

  const lines: string[] = [];
  lines.push('# Rasoi Recipe Duplicate & Near-Duplicate Report');
  lines.push('');
  lines.push(`Generated: ${r.generatedAt}`);
  lines.push('');
  lines.push('Source: `rasoi_backend/scripts/recipe-catalog` → `ALL_CATALOG_RECIPES` (authoring catalog before admin edits).');
  lines.push('');
  lines.push('## Executive summary');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|------:|`);
  lines.push(`| Total catalog recipes | ${r.totalRecipes} |`);
  for (const [k, v] of Object.entries(r.summary)) {
    lines.push(`| ${k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())} | ${v} |`);
  }
  lines.push('');
  lines.push('### How to read this report');
  lines.push('');
  lines.push('- **Exact title duplicate** — same dish name, different IDs. Usually unintentional; pick one canonical row.');
  lines.push('- **Core title family** — same dish after stripping marketing prefixes like "Quick", "Dhaba", "Rasoi". Many are **intentional SEO variants** from `marketing-ad-missing-batch.ts`.');
  lines.push('- **Unintentional core duplicate** — same core title across non-marketing recipes (higher cleanup priority).');
  lines.push('- **Same ingredient set** — identical ingredient lists; may still differ in steps/description.');
  lines.push('- **Near title pair** — high (≥88%) or moderate (75–87%) word overlap between titles.');
  lines.push('- **Near ingredient pair** — ≥90% ingredient overlap but not identical lists.');
  lines.push('');
  if (r.supabase) {
    lines.push('### Production Supabase (live DB)');
    lines.push('');
    lines.push(`| Check | Result |`);
    lines.push(`|-------|--------|`);
    lines.push(`| DB recipe count | ${r.supabase.totalRecipes} |`);
    lines.push(`| Catalog recipe count | ${r.totalRecipes} |`);
    lines.push(`| Exact title duplicate groups in DB | ${r.supabase.exactTitleDuplicateGroups} |`);
    lines.push(`| IDs in catalog but not DB | ${r.supabase.catalogOnlyIds.length} |`);
    lines.push(`| IDs in DB but not catalog | ${r.supabase.dbOnlyIds.length} |`);
    lines.push('');
    if (r.supabase.catalogOnlyIds.length > 0 || r.supabase.dbOnlyIds.length > 0) {
      lines.push('**Catalog ↔ DB drift detected** — reconcile before next seed.');
      if (r.supabase.dbOnlyIds.length > 0) {
        lines.push(`DB-only sample: ${r.supabase.dbOnlyIds.slice(0, 10).map((id) => `\`${id}\``).join(', ')}`);
      }
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  lines.push('## 1. Duplicate IDs (critical)');
  lines.push('');
  if (r.duplicateIds.length === 0) {
    lines.push('None found — every catalog `id` is unique.');
  } else {
    for (const group of r.duplicateIds) {
      lines.push(`### ID \`${group.id}\``);
      for (const recipe of group.recipes) {
        lines.push(`- ${recipe.title} · ${recipe.kitchenStyleId} · ${recipe.region}`);
      }
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  lines.push('## 2. Exact title duplicates (non-marketing — cleanup priority)');
  lines.push('');
  const nonMkt = (r as { exactTitleDuplicatesNonMarketing?: Array<{ title: string; count: number; recipes: RecipeRef[] }> })
    .exactTitleDuplicatesNonMarketing ?? [];
  if (nonMkt.length === 0) {
    lines.push('None — all non-marketing titles are unique (case-insensitive).');
  } else {
    lines.push(
      `Found **${r.summary.exactTitleDuplicateGroupsNonMarketing ?? nonMkt.length}** duplicate title groups affecting **${r.summary.exactTitleDuplicateRecipesNonMarketing ?? 0}** recipes (excluding \`ad-mkt-*\` SEO variants).`,
    );
    lines.push('');
    for (const group of nonMkt.slice(0, 100)) {
      lines.push(`### "${group.title}" (${group.count} recipes)`);
      lines.push('');
      lines.push('| ID | Kitchen style | Region | Diet | Prep |');
      lines.push('|----|---------------|--------|------|-----:|');
      for (const recipe of group.recipes) {
        lines.push(`| \`${recipe.id}\` | ${recipe.kitchenStyleId} | ${recipe.region} | ${recipe.dietType} | ${recipe.prepTime}m |`);
      }
      lines.push('');
    }
    if (nonMkt.length > 100) {
      lines.push(`_…and ${nonMkt.length - 100} more groups. See JSON export._`);
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  lines.push('## 2b. All exact title duplicates (including marketing)');
  lines.push('');
  if (r.exactTitleDuplicates.length === 0) {
    lines.push('None — all titles are unique (case-insensitive).');
  } else {
    lines.push(`Found **${r.exactTitleDuplicates.length}** duplicate title groups.`);
    lines.push('');
    for (const group of r.exactTitleDuplicates.slice(0, 100)) {
      lines.push(`### "${group.title}" (${group.count} recipes)`);
      lines.push('');
      lines.push('| ID | Kitchen style | Region | Diet | Prep |');
      lines.push('|----|---------------|--------|------|-----:|');
      for (const recipe of group.recipes) {
        lines.push(`| \`${recipe.id}\` | ${recipe.kitchenStyleId} | ${recipe.region} | ${recipe.dietType} | ${recipe.prepTime}m |`);
      }
      lines.push('');
    }
    if (r.exactTitleDuplicates.length > 100) {
      lines.push(`_…and ${r.exactTitleDuplicates.length - 100} more groups. See JSON export._`);
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  lines.push('## 3. Unintentional core-title duplicates (non-marketing)');
  lines.push('');
  lines.push('Same dish name after removing variant prefixes, excluding `ad-missing` marketing IDs.');
  lines.push('');
  if (r.unintentionalCoreTitleDuplicates.length === 0) {
    lines.push('None — non-marketing catalog is clean at core-title level.');
  } else {
    lines.push(
      `Found **${r.summary.unintentionalCoreTitleFamilies}** families where multiple non-marketing recipes share the same core dish name (showing all in JSON; top 120 below).`,
    );
    lines.push('');
    for (const group of r.unintentionalCoreTitleDuplicates.slice(0, 120)) {
      lines.push(`### Core: "${group.coreTitle}" (${group.count})`);
      for (const recipe of group.recipes) {
        lines.push(`- **${recipe.title}** — \`${recipe.id}\` (${recipe.kitchenStyleId}, ${recipe.region})`);
      }
      lines.push('');
    }
    if (r.unintentionalCoreTitleDuplicates.length > 120) {
      lines.push(`_…and ${r.unintentionalCoreTitleDuplicates.length - 120} more families in JSON export._`);
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  lines.push('## 4. Largest intentional variant families');
  lines.push('');
  lines.push('Usually from `marketing-ad-missing-batch.ts` (50 prefixes × base dishes).');
  lines.push('');
  for (const family of r.largestCoreTitleFamilies) {
    lines.push(`### "${family.coreTitle}" — ${family.count} variants`);
    lines.push(`Samples: ${family.sampleTitles.map((t) => `"${t}"`).join(', ')}`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('## 5. Identical ingredient sets (any kitchen style)');
  lines.push('');
  if (r.sameIngredientSets.length === 0) {
    lines.push('No duplicate ingredient fingerprints found.');
  } else {
    lines.push(`**${r.summary.sameIngredientGroups}** groups total. Top ${Math.min(50, r.sameIngredientSets.length)}:`);
    lines.push('');
    for (const group of r.sameIngredientSets.slice(0, 50)) {
      lines.push(`### ${group.recipeCount} recipes share ${group.ingredientCount} ingredients`);
      for (const recipe of group.recipes.slice(0, 8)) {
        lines.push(`- ${recipe.title} (\`${recipe.id}\`)`);
      }
      if (group.recipes.length > 8) lines.push(`- _…+${group.recipes.length - 8} more_`);
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  lines.push('## 5b. Same ingredients + same kitchen style (high-confidence almost-duplicates)');
  lines.push('');
  if (!r.sameIngredientsSameStyle?.length) {
    lines.push('None found.');
  } else {
    lines.push(
      `**${r.summary.sameIngredientsSameStyleGroups}** groups — same ingredient list under the same \`kitchenStyleId\` but different titles/IDs.`,
    );
    lines.push('');
    for (const group of r.sameIngredientsSameStyle) {
      lines.push(`### ${group.kitchenStyleId} — ${group.recipeCount} recipes (${group.ingredientCount} ingredients)`);
      for (const recipe of group.recipes) {
        lines.push(`- ${recipe.title} (\`${recipe.id}\`)`);
      }
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  lines.push('## 5c. Identical descriptions');
  lines.push('');
  if (!r.sameDescriptions?.length) {
    lines.push('None found (descriptions are unique after normalization).');
  } else {
    lines.push(`**${r.summary.sameDescriptionGroups}** groups share the same description text:`);
    lines.push('');
    for (const group of r.sameDescriptions) {
      lines.push(`### ${group.recipeCount} recipes`);
      lines.push(`> ${group.descriptionPreview}…`);
      for (const recipe of group.recipes.slice(0, 10)) {
        lines.push(`- ${recipe.title} (\`${recipe.id}\`)`);
      }
      if (group.recipes.length > 10) lines.push(`- _…+${group.recipes.length - 10} more_`);
      lines.push('');
    }
  }
  lines.push('---');
  lines.push('');
  lines.push('## 6. Near-duplicate title pairs — high confidence (≥88% word overlap)');
  lines.push('');
  if (!r.nearTitlePairsHigh?.length) {
    lines.push('None above threshold.');
  } else {
    lines.push(`**${r.summary.nearTitlePairsHigh}** pairs. Showing top ${Math.min(100, r.nearTitlePairsHigh.length)}:`);
    lines.push('');
    lines.push('| Similarity | Recipe A | Recipe B |');
    lines.push('|-----------:|----------|----------|');
    for (const pair of r.nearTitlePairsHigh) {
      lines.push(`| ${(pair.score * 100).toFixed(0)}% | ${pair.a.title} (\`${pair.a.id}\`) | ${pair.b.title} (\`${pair.b.id}\`) |`);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('## 6b. Near-duplicate title pairs — moderate (75–87% word overlap)');
  lines.push('');
  if (!r.nearTitlePairsModerate?.length) {
    lines.push('None in this band.');
  } else {
    lines.push(`**${r.summary.nearTitlePairsModerate}** pairs. Showing top ${Math.min(80, r.nearTitlePairsModerate.length)}:`);
    lines.push('');
    lines.push('| Similarity | Recipe A | Recipe B |');
    lines.push('|-----------:|----------|----------|');
    for (const pair of r.nearTitlePairsModerate) {
      lines.push(`| ${(pair.score * 100).toFixed(0)}% | ${pair.a.title} (\`${pair.a.id}\`) | ${pair.b.title} (\`${pair.b.id}\`) |`);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('## 6c. Near-duplicate ingredient pairs (≥90% overlap, not identical)');
  lines.push('');
  if (!r.nearIngredientPairs?.length) {
    lines.push('None above threshold.');
  } else {
    lines.push(`**${r.summary.nearIngredientPairs}** pairs. Showing top ${Math.min(80, r.nearIngredientPairs.length)}:`);
    lines.push('');
    lines.push('| Overlap | Recipe A | Recipe B |');
    lines.push('|--------:|----------|----------|');
    for (const pair of r.nearIngredientPairs) {
      lines.push(`| ${(pair.score * 100).toFixed(0)}% | ${pair.a.title} (\`${pair.a.id}\`) | ${pair.b.title} (\`${pair.b.id}\`) |`);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('## 7. Marketing ad-missing batch');
  lines.push('');
  lines.push(`Total marketing variants: **${r.marketingBatch.variantCount}** across **${r.marketingBatch.baseDishes.length}** base dishes.`);
  lines.push('');
  lines.push('| Base dish (core title) | Variants |');
  lines.push('|------------------------|--------:|');
  for (const row of r.marketingBatch.baseDishes) {
    lines.push(`| ${row.coreTitle} | ${row.variants} |`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Recommended cleanup priority');
  lines.push('');
  lines.push('1. ~~**Exact title duplicates**~~ — **Cleared** (catalog + Supabase deduped 2026-07-03).');
  lines.push('2. **Same ingredients + same kitchen style** — strongest remaining almost-duplicate signal; merge or differentiate titles.');
  lines.push('3. **Unintentional core-title families** — review regional batch overlap (`*-extra`, `*-batch2`).');
  lines.push('4. **Near-title / near-ingredient pairs** — alias in search or rename for clarity.');
  lines.push('5. **Marketing variants** — keep for SEO; dedupe in app browse/search by core title.');
  lines.push('6. **Identical descriptions** — rewrite or merge if recipes are truly redundant.');
  lines.push('');
  lines.push('## Regenerate');
  lines.push('');
  lines.push('```bash');
  lines.push('cd rasoi_backend && npx tsx scripts/analyze-recipe-duplicates.ts');
  lines.push('```');
  lines.push('');
  lines.push('Full machine-readable output: `rasoi_backend/scripts/recipe-duplicate-analysis.json`');
  lines.push('');

  return lines.join('\n');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
