/**
 * Pantry staple ingredient data-integrity audit (Supabase + JSON catalogs).
 *
 * Rules:
 *   1. all_staple_bloat     — every ingredient is isStaple: true
 *   2. hero_as_staple       — title hero noun marked staple (P1)
 *   3. tracked_liquid       — Pani/Water/Ice in ingredient array (P2)
 *   4. assumed_at_home_overlap — missing UI blocked only by salt/oil/ghee (P4)
 *
 *   npx tsx scripts/audit-pantry-staple-ingredients.ts
 *   npx tsx scripts/audit-pantry-staple-ingredients.ts --catalog-only
 *   npx tsx scripts/audit-pantry-staple-ingredients.ts --supabase-only
 */
import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import {
  auditPantryStapleRecipe,
  countByRule,
  countBySeverity,
  severityFromRules,
  type PantryStapleAuditResult,
  type PantryStapleRule,
  type PantryStapleSeverity,
} from '../src/lib/pantry-staple-audit';
import { ALL_CATALOG_RECIPES } from './recipe-catalog';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

type DbRecipe = {
  id: string;
  title: string;
  kitchenStyleId: string;
  dietType: string;
  published: boolean;
  ingredients: string;
};

function parseJson<T>(raw: string | null, fallback: T): T {
  try {
    return JSON.parse(raw ?? '') as T;
  } catch {
    return fallback;
  }
}

function parseArgs(): { supabase: boolean; catalog: boolean } {
  const args = new Set(process.argv.slice(2));
  if (args.has('--catalog-only')) return { supabase: false, catalog: true };
  if (args.has('--supabase-only')) return { supabase: true, catalog: false };
  return { supabase: true, catalog: true };
}

function mergeResults(
  supabaseRows: PantryStapleAuditResult[],
  catalogRows: PantryStapleAuditResult[],
): PantryStapleAuditResult[] {
  const byId = new Map<string, PantryStapleAuditResult>();

  for (const row of catalogRows) {
    byId.set(row.id, { ...row, source: 'catalog' });
  }

  for (const row of supabaseRows) {
    const existing = byId.get(row.id);
    if (existing) {
      const rules = [...new Set([...existing.rules, ...row.rules])] as PantryStapleRule[];
      byId.set(row.id, {
        ...row,
        source: 'both',
        violations: mergeViolations(existing.violations, row.violations),
        rules,
        severity: severityFromRules(rules),
      });
    } else {
      byId.set(row.id, { ...row, source: 'supabase' });
    }
  }

  return [...byId.values()].sort((a, b) => {
    const sev = a.severity.localeCompare(b.severity);
    if (sev !== 0) return sev;
    return a.title.localeCompare(b.title);
  });
}

function mergeViolations(
  a: PantryStapleAuditResult['violations'],
  b: PantryStapleAuditResult['violations'],
): PantryStapleAuditResult['violations'] {
  const seen = new Set<string>();
  const merged = [...a, ...b].filter((v) => {
    const key = `${v.rule}:${v.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return merged;
}

function toMarkdown(payload: {
  generatedAt: string;
  totalSupabase: number;
  totalCatalog: number;
  merged: PantryStapleAuditResult[];
  issueCounts: Record<PantryStapleRule, number>;
  severityCounts: Record<PantryStapleSeverity, number>;
}): string {
  const { merged, issueCounts, severityCounts } = payload;
  const bySeverity = (s: PantryStapleSeverity) => merged.filter((r) => r.severity === s);

  const lines: string[] = [
    '# Pantry staple ingredient audit',
    '',
    `Generated: ${payload.generatedAt}`,
    '',
    '## Summary',
    '',
    '| Metric | Count |',
    '|--------|------:|',
    `| Supabase published recipes scanned | ${payload.totalSupabase} |`,
    `| JSON catalog recipes scanned | ${payload.totalCatalog} |`,
    `| Flagged recipes (merged) | ${merged.length} |`,
    '',
    '### By severity',
    '',
    '| Severity | Meaning | Count |',
    '|----------|---------|------:|',
    '| **P1** | Hero ingredient marked staple | ' + severityCounts.P1 + ' |',
    '| **P2** | Tracked liquid (Pani/Water/Ice) | ' + severityCounts.P2 + ' |',
    '| **P3** | 100% staple bloat | ' + severityCounts.P3 + ' |',
    '| **P4** | Assumed-at-home drives missing UI | ' + severityCounts.P4 + ' |',
    '',
    '### By rule',
    '',
    '| Rule | Count |',
    '|------|------:|',
    `| Rule 1 — all_staple_bloat | ${issueCounts.all_staple_bloat} |`,
    `| Rule 2 — hero_as_staple | ${issueCounts.hero_as_staple} |`,
    `| Rule 3 — tracked_liquid | ${issueCounts.tracked_liquid} |`,
    `| Rule 4 — assumed_at_home_overlap | ${issueCounts.assumed_at_home_overlap} |`,
    '',
    '## Rule definitions',
    '',
    '1. **all_staple_bloat** — Every ingredient has `isStaple: true` (except salt/water-only edge cases).',
    '2. **hero_as_staple** — A title-defining ingredient (Aloo, Paneer, Chicken, …) is marked staple.',
    '3. **tracked_liquid** — Pani, Water, or Ice appears in the structured ingredient array.',
    '4. **assumed_at_home_overlap** — User stocked on hero/distinctive items but missing UI shows only Namak/Tel/Ghee/Haldi.',
    '',
    '## P1 — Hero marked staple (sample)',
    '',
    '| ID | Title | Heroes [S] | Source |',
    '|---|---|---|---|',
  ];

  for (const row of bySeverity('P1').slice(0, 40)) {
    lines.push(
      `| ${row.id} | ${esc(row.title)} | ${esc(row.heroesMarkedStaple.join(', '))} | ${row.source} |`,
    );
  }
  if (bySeverity('P1').length > 40) {
    lines.push(`| … | +${bySeverity('P1').length - 40} more P1 rows in JSON | | |`);
  }

  lines.push(
    '',
    '## P2 — Tracked liquids (full list)',
    '',
    '| ID | Title | Liquids | Source |',
    '|---|---|---|---|',
  );

  for (const row of bySeverity('P2')) {
    if (!row.rules.includes('tracked_liquid')) continue;
    lines.push(
      `| ${row.id} | ${esc(row.title)} | ${esc(row.trackedLiquids.join(', '))} | ${row.source} |`,
    );
  }

  lines.push(
    '',
    '## Full flagged recipes',
    '',
    '| Sev | ID | Title | Rules | Source | Suggested fix |',
    '|:---:|---|---|---|---|---|',
  );

  for (const row of merged) {
    lines.push(
      `| ${row.severity} | ${row.id} | ${esc(row.title)} | ${row.rules.join(', ')} | ${row.source} | ${esc(row.suggestedFix)} |`,
    );
  }

  return `${lines.join('\n')}\n`;
}

function esc(value: string): string {
  return value.replace(/\|/g, '\\|');
}

async function loadSupabaseRecipes(): Promise<{ total: number; flagged: PantryStapleAuditResult[] }> {
  const { rows } = await pool.query<DbRecipe>(
    `SELECT id, title, "kitchenStyleId", "dietType", published, ingredients
     FROM rasoi."Recipe"
     WHERE published = true
     ORDER BY title`,
  );

  const flagged: PantryStapleAuditResult[] = [];
  for (const recipe of rows) {
    const result = auditPantryStapleRecipe({
      id: recipe.id,
      title: recipe.title,
      kitchenStyleId: recipe.kitchenStyleId,
      dietType: recipe.dietType,
      ingredients: parseJson(recipe.ingredients, []),
      source: 'supabase',
    });
    if (result) flagged.push(result);
  }

  return { total: rows.length, flagged };
}

function loadCatalogRecipes(): { total: number; flagged: PantryStapleAuditResult[] } {
  const flagged: PantryStapleAuditResult[] = [];

  for (const recipe of ALL_CATALOG_RECIPES) {
    const result = auditPantryStapleRecipe({
      id: recipe.id,
      title: recipe.title,
      kitchenStyleId: recipe.kitchenStyleId,
      dietType: recipe.dietType,
      ingredients: recipe.ingredients,
      source: 'catalog',
    });
    if (result) flagged.push(result);
  }

  return { total: ALL_CATALOG_RECIPES.length, flagged };
}

async function main() {
  const { supabase, catalog } = parseArgs();

  let totalSupabase = 0;
  let totalCatalog = 0;
  let supabaseFlagged: PantryStapleAuditResult[] = [];
  let catalogFlagged: PantryStapleAuditResult[] = [];

  if (supabase) {
    const loaded = await loadSupabaseRecipes();
    totalSupabase = loaded.total;
    supabaseFlagged = loaded.flagged;
  }

  if (catalog) {
    const loaded = loadCatalogRecipes();
    totalCatalog = loaded.total;
    catalogFlagged = loaded.flagged;
  }

  const merged =
    supabase && catalog
      ? mergeResults(supabaseFlagged, catalogFlagged)
      : supabase
        ? supabaseFlagged
        : catalogFlagged;

  const issueCounts = countByRule(merged);
  const severityCounts = countBySeverity(merged);

  const root = join(__dirname, '..', '..');
  const jsonPath = join(root, 'docs', 'PANTRY_STAPLE_INGREDIENT_AUDIT.json');
  const mdPath = join(root, 'docs', 'PANTRY_STAPLE_INGREDIENT_AUDIT.md');
  const csvPath = join(root, 'docs', 'PANTRY_ASSUMED_HOME_PRIORITY.csv');

  const generatedAt = new Date().toISOString();
  const payload = {
    generatedAt,
    rulesVersion: '2.0',
    sources: {
      supabase: supabase
        ? {
            scanned: totalSupabase,
            flagged: supabaseFlagged.length,
            issueCounts: countByRule(supabaseFlagged),
            severityCounts: countBySeverity(supabaseFlagged),
          }
        : null,
      catalog: catalog
        ? {
            scanned: totalCatalog,
            flagged: catalogFlagged.length,
            issueCounts: countByRule(catalogFlagged),
            severityCounts: countBySeverity(catalogFlagged),
          }
        : null,
      merged: {
        flagged: merged.length,
        issueCounts,
        severityCounts,
      },
    },
    issueCounts,
    severityCounts,
    recipes: merged,
  };

  writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  writeFileSync(
    mdPath,
    toMarkdown({
      generatedAt,
      totalSupabase,
      totalCatalog,
      merged,
      issueCounts,
      severityCounts,
    }),
  );

  const csvLines = [
    'Severity,ID,Title,Kitchen,Source,Rules,HeroesMarkedStaple,TrackedLiquids,MissingWhenStockedOnHero,SuggestedFix',
  ];
  for (const row of merged) {
    csvLines.push(
      [
        row.severity,
        row.id,
        `"${row.title.replace(/"/g, '""')}"`,
        row.kitchenStyleId,
        row.source,
        row.rules.join('|'),
        `"${row.heroesMarkedStaple.join('; ')}"`,
        `"${row.trackedLiquids.join('; ')}"`,
        `"${row.missingWhenStockedOnHero.join('; ')}"`,
        `"${row.suggestedFix.replace(/"/g, '""')}"`,
      ].join(','),
    );
  }
  writeFileSync(csvPath, `${csvLines.join('\n')}\n`);

  console.log(`Supabase scanned: ${totalSupabase} (${supabaseFlagged.length} flagged)`);
  console.log(`Catalog scanned:  ${totalCatalog} (${catalogFlagged.length} flagged)`);
  console.log(`Merged flagged:   ${merged.length}`);
  console.log('Issue counts:', issueCounts);
  console.log('Severity:', severityCounts);
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
  console.log(`Wrote ${csvPath}`);

  if (supabase) await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await pool.end();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
