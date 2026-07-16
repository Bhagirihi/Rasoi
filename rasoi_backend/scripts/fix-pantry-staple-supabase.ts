/**
 * Fix pantry staple ingredient flags in Supabase (P2 → P1 → Rule 1) + refresh Hindi copy.
 *
 * Dry run:       npx tsx scripts/fix-pantry-staple-supabase.ts --dry-run
 * Apply:         npx tsx scripts/fix-pantry-staple-supabase.ts
 * Hindi only:    npx tsx scripts/fix-pantry-staple-supabase.ts --hindi-only
 * Force all HI:  npx tsx scripts/fix-pantry-staple-supabase.ts --refresh-hindi
 * Phase filter:  npx tsx scripts/fix-pantry-staple-supabase.ts --phase=p2
 * Sample:        npx tsx scripts/fix-pantry-staple-supabase.ts --dry-run --limit=20
 */
import 'dotenv/config';
import { Pool } from 'pg';

import type { Recipe } from '@/lib/db/types';
import { getDirectDatabaseUrl } from '@/lib/database-url';
import {
  auditPantryStapleRecipe,
  countByRule,
  countBySeverity,
  fixPantryStapleIngredients,
  type PantryStapleFixPhase,
} from '@/lib/pantry-staple-audit';
import { buildDetailedStepsHi, hindiContentNeedsRefresh } from '@/lib/recipe-content-hi';
import { buildRecipeDescription, buildRecipeDescriptionHi } from '@/lib/recipe-description';
import { resolveRecipeSteps, type RecipeStepInput } from '@/lib/recipe-steps';
import { syncPublicRecipe } from '@/lib/sync-public-recipe';
import type { RecipeIngredient } from '@/lib/types';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

type DbRecipe = {
  id: string;
  title: string;
  descriptionHi: string | null;
  steps: string | null;
  stepsHi: string | null;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId: string;
  dietType: string;
  difficulty: string;
  imageUrl: string;
  ingredients: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function parseJson<T>(raw: string | null, fallback: T): T {
  try {
    return JSON.parse(raw ?? '') as T;
  } catch {
    return fallback;
  }
}

function parseArgs(): {
  dryRun: boolean;
  hindiOnly: boolean;
  forceHindi: boolean;
  phases: PantryStapleFixPhase[];
  limit?: number;
} {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const hindiOnly = args.includes('--hindi-only');
  const forceHindi = args.includes('--refresh-hindi');
  const phaseArg = args.find((a) => a.startsWith('--phase='));
  const limitArg = args.find((a) => a.startsWith('--limit='));

  let phases: PantryStapleFixPhase[] = ['p2', 'p1', 'rule1'];
  if (phaseArg) {
    const value = phaseArg.split('=')[1] ?? 'all';
    if (value === 'p2') phases = ['p2'];
    else if (value === 'p1') phases = ['p1'];
    else if (value === 'rule1') phases = ['rule1'];
  }

  const limit = limitArg ? Number.parseInt(limitArg.split('=')[1] ?? '', 10) : undefined;
  return { dryRun, hindiOnly, forceHindi, phases, limit };
}

function buildHindiContent(
  recipe: DbRecipe,
  ingredients: RecipeIngredient[],
  steps: string[],
): { descriptionHi: string; stepsHi: string[] } {
  const input: RecipeStepInput = {
    title: recipe.title,
    kitchenStyleId: recipe.kitchenStyleId,
    dietType: recipe.dietType,
    ingredients,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    steps,
  };
  const description = buildRecipeDescription({ ...input, steps });

  return {
    descriptionHi: buildRecipeDescriptionHi({ ...input, steps }),
    stepsHi: buildDetailedStepsHi({ ...input, steps, description }),
  };
}

async function loadRecipes(limit?: number): Promise<DbRecipe[]> {
  const { rows } = await pool.query<DbRecipe>(`
    SELECT
      id, title, "descriptionHi", steps, "stepsHi",
      "prepTime", calories, region, "kitchenStyleId",
      "dietType", difficulty, "imageUrl", ingredients, published,
      "createdAt", "updatedAt"
    FROM rasoi."Recipe"
    WHERE published = true
    ORDER BY id
    ${limit ? `LIMIT ${limit}` : ''}
  `);
  return rows;
}

async function fetchRecipeForSync(id: string): Promise<Recipe | null> {
  const { rows } = await pool.query<Recipe>(
    `SELECT * FROM rasoi."Recipe" WHERE id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

async function main() {
  const { dryRun, hindiOnly, forceHindi, phases, limit } = parseArgs();
  const rows = await loadRecipes(limit);

  console.log(`Loaded ${rows.length} published recipes`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY'}`);
  if (hindiOnly) console.log('Scope: Hindi content only');
  else console.log(`Phases: ${phases.join(' → ')}`);
  if (forceHindi) console.log('Force refresh all Hindi copy');

  let ingredientUpdates = 0;
  let hindiUpdates = 0;
  let synced = 0;
  let unchanged = 0;
  const changedIds: string[] = [];

  const client = await pool.connect();
  try {
    if (!dryRun) await client.query('BEGIN');

    for (const recipe of rows) {
      const beforeIngredients = parseJson<RecipeIngredient[]>(recipe.ingredients, []);
      const beforeAudit = auditPantryStapleRecipe({
        id: recipe.id,
        title: recipe.title,
        kitchenStyleId: recipe.kitchenStyleId,
        dietType: recipe.dietType,
        ingredients: beforeIngredients,
      });

      const fixResult = hindiOnly
        ? { ingredients: beforeIngredients, changes: [] as string[], changed: false }
        : fixPantryStapleIngredients(recipe.title, beforeIngredients, phases);
      const { ingredients: fixed, changes, changed: ingredientsChanged } = fixResult;

      const storedSteps = parseJson<string[]>(recipe.steps, []);
      const steps =
        storedSteps.length > 0
          ? storedSteps
          : resolveRecipeSteps({
              title: recipe.title,
              kitchenStyleId: recipe.kitchenStyleId,
              dietType: recipe.dietType,
              ingredients: fixed,
              prepTime: recipe.prepTime,
              difficulty: recipe.difficulty,
            });

      const storedStepsHi = parseJson<string[]>(recipe.stepsHi, []);
      const hindiStale =
        forceHindi ||
        ingredientsChanged ||
        hindiContentNeedsRefresh(recipe.title, recipe.descriptionHi, storedStepsHi);

      const hindiContent = hindiOnly || hindiStale ? buildHindiContent(recipe, fixed, steps) : null;
      const hindiChanged =
        hindiContent !== null &&
        (recipe.descriptionHi?.trim() !== hindiContent.descriptionHi.trim() ||
          JSON.stringify(storedStepsHi) !== JSON.stringify(hindiContent.stepsHi));

      if (!ingredientsChanged && !hindiChanged) {
        unchanged += 1;
        continue;
      }

      if (ingredientsChanged) ingredientUpdates += 1;
      if (hindiChanged) hindiUpdates += 1;
      changedIds.push(recipe.id);

      if (dryRun && changedIds.length <= 12) {
        console.log(`\n--- ${recipe.id} ${recipe.title} ---`);
        if (beforeAudit) console.log('Before rules:', beforeAudit.rules.join(', '));
        if (changes.length) console.log('Fixes:', changes.join('; '));
        if (hindiContent) {
          console.log('descriptionHi:', hindiContent.descriptionHi.slice(0, 120));
          console.log('stepsHi[0]:', hindiContent.stepsHi[0]?.slice(0, 120));
        }
      }

      if (!dryRun) {
        await client.query(
          `
            UPDATE rasoi."Recipe"
            SET ingredients = $2,
                "descriptionHi" = COALESCE($3, "descriptionHi"),
                "stepsHi" = COALESCE($4, "stepsHi"),
                "updatedAt" = NOW()
            WHERE id = $1
          `,
          [
            recipe.id,
            JSON.stringify(fixed),
            hindiContent?.descriptionHi ?? null,
            hindiContent ? JSON.stringify(hindiContent.stepsHi) : null,
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

  if (!dryRun) {
    for (const id of changedIds) {
      try {
        const syncRow = await fetchRecipeForSync(id);
        if (syncRow) {
          await syncPublicRecipe(syncRow);
          synced += 1;
        }
      } catch (error) {
        if (synced === 0) {
          console.warn(
            'Public recipe sync skipped (legacy public.recipes not present):',
            error instanceof Error ? error.message : error,
          );
        }
        break;
      }
    }
  }

  console.log('\nDone.');
  console.log(`Ingredient updates: ${ingredientUpdates}`);
  console.log(`Hindi refreshes:    ${hindiUpdates}`);
  console.log(`Public sync calls:  ${synced}`);
  console.log(`Unchanged:          ${unchanged}`);

  if (!dryRun && changedIds.length > 0) {
    const afterRows = await loadRecipes(limit);
    const afterFlagged = afterRows
      .map((recipe) =>
        auditPantryStapleRecipe({
          id: recipe.id,
          title: recipe.title,
          kitchenStyleId: recipe.kitchenStyleId,
          dietType: recipe.dietType,
          ingredients: parseJson(recipe.ingredients, []),
        }),
      )
      .filter(Boolean);

    console.log('\nPost-fix audit (sample set):');
    console.log('Flagged:', afterFlagged.length, '/', afterRows.length);
    console.log('Rules:', countByRule(afterFlagged));
    console.log('Severity:', countBySeverity(afterFlagged));
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
