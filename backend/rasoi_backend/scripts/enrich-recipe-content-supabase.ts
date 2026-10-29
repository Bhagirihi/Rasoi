/**
 * Regenerate accurate English + Hindi descriptions/steps for all recipes in Supabase.
 *
 * Dry run:  npx tsx scripts/enrich-recipe-content-supabase.ts --dry-run
 * Apply:    npx tsx scripts/enrich-recipe-content-supabase.ts
 * Sample:   npx tsx scripts/enrich-recipe-content-supabase.ts --dry-run --limit=20
 */
import 'dotenv/config';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { buildDetailedStepsHi } from '../src/lib/recipe-content-hi';
import { buildRecipeDescription, buildRecipeDescriptionHi } from '../src/lib/recipe-description';
import type { RecipeIngredient } from '../src/lib/types';
import { resolveRecipeSteps, stepsLookVague, stepsMismatchTitle, buildDetailedSteps, type RecipeStepInput } from '../src/lib/recipe-steps';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

type DbRecipe = {
  id: string;
  title: string;
  descriptionHi: string | null;
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

function needsRefresh(recipe: DbRecipe): boolean {
  const steps = parseJson<string[]>(recipe.steps, []);
  const descHi = recipe.descriptionHi?.trim() ?? '';
  if (steps.length === 0 || stepsLookVague(steps)) return true;
  if (descHi.length < 20) return true;
  if (/Rinse and drain Bread/i.test(steps.join(' '))) return true;
  if (/the main grain/i.test(steps.join(' ')) && /bread/i.test(recipe.title)) return true;
  if (stepsMismatchTitle(recipe.title, steps)) return true;
  return false;
}

function enrichRecipe(recipe: DbRecipe) {
  const ingredients = parseJson<RecipeIngredient[]>(recipe.ingredients, []);
  const storedSteps = parseJson<string[]>(recipe.steps, []);
  const input: RecipeStepInput = {
    title: recipe.title,
    kitchenStyleId: recipe.kitchenStyleId,
    dietType: recipe.dietType,
    ingredients,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    steps: storedSteps,
  };

  const steps = resolveRecipeSteps(input);
  // Always refresh Hindi + steps to match resolved content; force-regenerate mismatched steps.
  const forceSteps =
    storedSteps.length > 0 &&
    (stepsLookVague(storedSteps) || stepsMismatchTitle(recipe.title, storedSteps))
      ? buildDetailedSteps({ ...input, steps: undefined })
      : steps;
  const description = buildRecipeDescription({ ...input, steps: forceSteps });
  const descriptionHi = buildRecipeDescriptionHi({ ...input, steps: forceSteps });
  const stepsHi = buildDetailedStepsHi({ ...input, steps: forceSteps, description });

  return { description, steps: forceSteps, descriptionHi, stepsHi };
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
  const onlyBad = process.argv.includes('--only-bad');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number.parseInt(limitArg.split('=')[1] ?? '', 10) : undefined;

  if (!dryRun) await ensureColumns();

  const { rows } = await pool.query<DbRecipe>(`
    SELECT id, title, "descriptionHi", steps, "prepTime", "kitchenStyleId", "dietType", difficulty, ingredients
    FROM rasoi."Recipe"
    ORDER BY id
    ${limit ? `LIMIT ${limit}` : ''}
  `);

  let refreshed = 0;
  let skipped = 0;

  console.log(`Loaded ${rows.length} recipes. Mode: ${dryRun ? 'DRY RUN' : 'APPLY'}`);

  const client = await pool.connect();
  try {
    if (!dryRun) await client.query('BEGIN');

    for (const recipe of rows) {
      if (onlyBad && !needsRefresh(recipe)) {
        skipped += 1;
        continue;
      }

      const content = enrichRecipe(recipe);
      refreshed += 1;

      if (dryRun && refreshed <= 5) {
        console.log('\n---', recipe.id, recipe.title, '---');
        console.log('HI:', content.descriptionHi.slice(0, 120));
        console.log('Step 1:', content.steps[0]?.slice(0, 100));
      }

      if (!dryRun) {
        await client.query(
          `
            UPDATE rasoi."Recipe"
            SET steps = $2,
                "descriptionHi" = $3,
                "stepsHi" = $4,
                "updatedAt" = NOW()
            WHERE id = $1
          `,
          [
            recipe.id,
            JSON.stringify(content.steps),
            content.descriptionHi,
            JSON.stringify(content.stepsHi),
          ],
        );
      }

      if (refreshed % 200 === 0) console.log(`Processed ${refreshed} refreshes…`);
    }

    if (!dryRun) await client.query('COMMIT');
  } catch (error) {
    if (!dryRun) await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }

  console.log(`Done. Refreshed: ${refreshed}, skipped (already OK): ${skipped}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
