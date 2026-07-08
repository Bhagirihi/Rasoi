/**
 * Chef-style audit + fix for all Supabase recipes.
 *
 * Audit only:  npx tsx scripts/fix-recipe-chef-quality-supabase.ts --audit-only
 * Dry run:     npx tsx scripts/fix-recipe-chef-quality-supabase.ts --dry-run
 * Apply:       npx tsx scripts/fix-recipe-chef-quality-supabase.ts
 */
import 'dotenv/config';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { localizeDescriptionToHindi, buildDetailedStepsHi } from '../src/lib/recipe-content-hi';
import { buildRecipeDescription, buildRecipeDescriptionHi } from '../src/lib/recipe-description';
import { fixRecipeIngredientsFromTitle } from '../src/lib/fix-recipe-ingredients';
import {
  auditRecipeChefQuality,
  buildRecipeStepInput,
  recipeNeedsChefFix,
  type ChefAuditIssueCode,
  type ChefAuditResult,
} from '../src/lib/recipe-chef-audit';
import { resolveRecipeSteps, buildDetailedSteps, stepsLookVague, stepsMismatchTitle } from '../src/lib/recipe-steps';
import type { RecipeIngredient } from '../src/lib/types';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

type DbRecipe = {
  id: string;
  title: string;
  description: string;
  steps: string | null;
  prepTime: number;
  kitchenStyleId: string;
  dietType: string;
  difficulty: string;
  ingredients: string;
};

function parseJson<T>(raw: string | null, fallback: T): T {
  try {
    return JSON.parse(raw ?? '') as T;
  } catch {
    return fallback;
  }
}

function needsStepRegeneration(
  title: string,
  steps: string[],
  ingredients: RecipeIngredient[],
  auditBeforeFix: ChefAuditResult,
): boolean {
  const stepIssues = new Set<ChefAuditIssueCode>([
    'empty_steps',
    'vague_steps',
    'steps_title_mismatch',
    'steps_dish_kind_mismatch',
  ]);
  if (auditBeforeFix.issues.some((issue) => stepIssues.has(issue.code))) return true;
  if (recipeNeedsChefFix(auditBeforeFix)) {
    return true;
  }
  if (steps.length === 0 || stepsLookVague(steps) || stepsMismatchTitle(title, steps)) return true;
  if (/dhebra|knead into a soft dough|lemon-sized balls/i.test(steps.join(' ')) && /khichdi|khichri/i.test(title)) {
    return true;
  }
  if (/onion turns golden|onion-tomato masala/i.test(steps.join(' ')) && /thepla|paratha|rotla|raita|salad|raab|porridge/i.test(title.toLowerCase())) {
    return true;
  }
  if (ingredients.some((item) => /bajra|ragi|jowar|poha|sabudana/i.test(item.name)) && /the main grain|hero components for/i.test(steps.join(' '))) {
    return true;
  }
  return false;
}

function buildContent(recipe: DbRecipe, ingredients: RecipeIngredient[], forceNewSteps: boolean) {
  const storedSteps = parseJson<string[]>(recipe.steps, []);
  const input = buildRecipeStepInput({
    title: recipe.title,
    kitchenStyleId: recipe.kitchenStyleId,
    dietType: recipe.dietType,
    ingredients,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    description: recipe.description,
    steps: forceNewSteps ? undefined : storedSteps,
  });

  const steps = forceNewSteps ? buildDetailedSteps(input) : resolveRecipeSteps(input);
  const description = buildRecipeDescription({ ...input, steps });
  const descriptionHi = buildRecipeDescriptionHi({ ...input, steps });
  const stepsHi = buildDetailedStepsHi({ ...input, steps, description });

  return { steps, description, descriptionHi, stepsHi };
}

function summarizeByCode(results: ChefAuditResult[]): Record<ChefAuditIssueCode, number> {
  const counts = {} as Record<ChefAuditIssueCode, number>;
  for (const result of results) {
    for (const issue of result.issues) {
      counts[issue.code] = (counts[issue.code] ?? 0) + 1;
    }
  }
  return counts;
}

function writeAuditReport(label: string, results: ChefAuditResult[], totalRecipes: number) {
  const flagged = results.filter((r) => r.issues.length > 0);
  const byCode = summarizeByCode(flagged);
  const jsonPath = resolve(__dirname, 'recipe-chef-audit.json');
  const mdPath = resolve(__dirname, '../../docs/RECIPE_CHEF_AUDIT_REPORT.md');

  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        label,
        totalRecipes,
        flaggedRecipes: flagged.length,
        issueCounts: byCode,
        recipes: flagged,
      },
      null,
      2,
    ),
  );

  const lines: string[] = [
    `# Recipe chef audit (${label})`,
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `- Total recipes scanned: **${totalRecipes}**`,
    `- Recipes with issues: **${flagged.length}**`,
    '',
    '## Issue counts',
    '',
  ];

  for (const [code, count] of Object.entries(byCode).sort((a, b) => b[1] - a[1])) {
    lines.push(`- \`${code}\`: ${count}`);
  }

  lines.push('', '## Flagged recipes (dish by dish)', '');

  for (const recipe of flagged.slice(0, 500)) {
    lines.push(`### ${recipe.title} (\`${recipe.id}\`)`);
    lines.push(`- Kitchen style: ${recipe.kitchenStyleId}`);
    lines.push(`- Hero: ${recipe.hero || '—'}`);
    lines.push(`- Ingredients: ${recipe.ingredientNames.join(', ') || '—'}`);
    lines.push(`- Steps: ${recipe.stepCount}`);
    for (const issue of recipe.issues) {
      lines.push(`- **${issue.code}**: ${issue.message}`);
    }
    lines.push('');
  }

  if (flagged.length > 500) {
    lines.push(`_…and ${flagged.length - 500} more (see recipe-chef-audit.json)._`, '');
  }

  mkdirSync(resolve(__dirname, '../../docs'), { recursive: true });
  writeFileSync(mdPath, lines.join('\n'));

  console.log(`Report written: ${mdPath}`);
  console.log(`JSON written: ${jsonPath}`);
  console.log(`Flagged: ${flagged.length}/${totalRecipes}`);
}

async function loadRecipes(limit?: number): Promise<DbRecipe[]> {
  const { rows } = await pool.query<DbRecipe>(`
    SELECT id, title, description, steps, "prepTime", "kitchenStyleId", "dietType", difficulty, ingredients
    FROM rasoi."Recipe"
    ORDER BY id
    ${limit ? `LIMIT ${limit}` : ''}
  `);
  return rows;
}

function auditAll(rows: DbRecipe[]): ChefAuditResult[] {
  return rows.map((recipe) =>
    auditRecipeChefQuality({
      id: recipe.id,
      title: recipe.title,
      kitchenStyleId: recipe.kitchenStyleId,
      ingredients: parseJson(recipe.ingredients, []),
      steps: parseJson<string[]>(recipe.steps, []),
    }),
  );
}

async function ensureColumns(): Promise<void> {
  await pool.query(`
    ALTER TABLE rasoi."Recipe"
    ADD COLUMN IF NOT EXISTS "descriptionHi" text,
    ADD COLUMN IF NOT EXISTS "stepsHi" text
  `);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const auditOnly = process.argv.includes('--audit-only');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number.parseInt(limitArg.split('=')[1] ?? '', 10) : undefined;

  const rows = await loadRecipes(limit);
  console.log(`Loaded ${rows.length} recipes.`);

  const beforeAudit = auditAll(rows);
  writeAuditReport('before fix', beforeAudit, rows.length);

  if (auditOnly) return;

  if (!dryRun) await ensureColumns();

  let ingredientUpdates = 0;
  let stepUpdates = 0;
  let unchanged = 0;

  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY'}`);

  const client = await pool.connect();
  try {
    if (!dryRun) await client.query('BEGIN');

    for (let i = 0; i < rows.length; i += 1) {
      const recipe = rows[i];
      const auditBefore = beforeAudit[i];
      const beforeIngredients = parseJson<RecipeIngredient[]>(recipe.ingredients, []);
      const { ingredients: fixed, changed: ingredientsChanged, changes } = fixRecipeIngredientsFromTitle(
        recipe.title,
        beforeIngredients,
      );

      const storedSteps = parseJson<string[]>(recipe.steps, []);
      const stepsNeedRefresh =
        ingredientsChanged || needsStepRegeneration(recipe.title, storedSteps, fixed, auditBefore);
      const content = stepsNeedRefresh ? buildContent(recipe, fixed, true) : null;

      if (!ingredientsChanged && !stepsNeedRefresh) {
        unchanged += 1;
        continue;
      }

      if (ingredientsChanged) ingredientUpdates += 1;
      if (stepsNeedRefresh) stepUpdates += 1;

      if (dryRun && ingredientUpdates + stepUpdates <= 10) {
        console.log(`\n--- ${recipe.id} ${recipe.title} ---`);
        if (changes.length) console.log('Ingredient changes:', changes.join('; '));
        if (content) console.log('Step 1:', content.steps[0]?.slice(0, 120));
      }

      if (!dryRun) {
        await client.query(
          `
            UPDATE rasoi."Recipe"
            SET ingredients = $2,
                description = COALESCE($3, description),
                steps = COALESCE($4, steps),
                "descriptionHi" = COALESCE($5, "descriptionHi"),
                "stepsHi" = COALESCE($6, "stepsHi"),
                "updatedAt" = NOW()
            WHERE id = $1
          `,
          [
            recipe.id,
            JSON.stringify(fixed),
            content?.description ?? null,
            content ? JSON.stringify(content.steps) : null,
            content?.descriptionHi ?? null,
            content ? JSON.stringify(content.stepsHi) : null,
          ],
        );
      }
    }

    if (!dryRun) await client.query('COMMIT');
  } catch (error) {
    if (!dryRun) await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  console.log(`Done. Ingredient fixes: ${ingredientUpdates}, step refreshes: ${stepUpdates}, unchanged: ${unchanged}`);

  if (!dryRun) {
    const afterRows = await loadRecipes(limit);
    const afterAudit = auditAll(afterRows);
    writeAuditReport('after fix', afterAudit, afterRows.length);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
