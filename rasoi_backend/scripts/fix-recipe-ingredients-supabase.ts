/**
 * Fix recipe ingredients in Supabase: title-aligned hero, khichdi dal, dedupe, step refresh.
 *
 * Dry run:  npx tsx scripts/fix-recipe-ingredients-supabase.ts --dry-run
 * Apply:    npx tsx scripts/fix-recipe-ingredients-supabase.ts
 * Sample:   npx tsx scripts/fix-recipe-ingredients-supabase.ts --dry-run --limit=20
 */
import 'dotenv/config';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { heroIngredientMismatch, inferHeroIngredientFromTitle } from '../src/lib/infer-hero-ingredient';
import { buildRecipeDescription, buildRecipeDescriptionHi } from '../src/lib/recipe-description';
import { localizeDescriptionToHindi, buildDetailedStepsHi } from '../src/lib/recipe-content-hi';
import { normalizeRecipeIngredients } from '../src/lib/recipe-ingredients';
import { resolveRecipeSteps, stepsLookVague, stepsMismatchTitle, type RecipeStepInput } from '../src/lib/recipe-steps';
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

function khichdiNeedsDal(title: string, ingredients: RecipeIngredient[]): boolean {
  const lower = title.toLowerCase();
  if (!/khichdi|khichri/.test(lower) || /dal/.test(lower)) return false;
  return !ingredients.some((item) => /moong dal|dal|lentil/i.test(item.name));
}

function ingredientListsEqual(a: RecipeIngredient[], b: RecipeIngredient[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].name !== b[i].name || a[i].isStaple !== b[i].isStaple) return false;
  }
  return true;
}

function fixIngredients(title: string, raw: unknown): { ingredients: RecipeIngredient[]; changed: boolean } {
  const normalized = normalizeRecipeIngredients(raw);
  if (normalized.length === 0) return { ingredients: normalized, changed: false };

  const heroIndex = normalized.findIndex((item) => !item.isStaple);
  const index = heroIndex >= 0 ? heroIndex : 0;
  const currentHero = normalized[index]?.name ?? '';
  let changed = heroIngredientMismatch(title, currentHero);

  const expectedHero = inferHeroIngredientFromTitle(title, currentHero);
  if (heroIngredientMismatch(title, currentHero)) {
    normalized[index] = { ...normalized[index], name: expectedHero, isStaple: false };
  }

  if (khichdiNeedsDal(title, normalized)) {
    normalized.splice(index + 1, 0, { name: 'Moong Dal', isStaple: false });
    changed = true;
  }

  const deduped = normalizeRecipeIngredients(normalized);
  if (deduped.length !== normalized.length) changed = true;

  return { ingredients: deduped, changed };
}

function needsStepRefresh(title: string, steps: string[], ingredients: RecipeIngredient[]): boolean {
  if (steps.length === 0 || stepsLookVague(steps)) return true;
  if (stepsMismatchTitle(title, steps)) return true;
  if (/dhebra|knead into a soft dough|lemon-sized balls/i.test(steps.join(' ')) && /khichdi|khichri/i.test(title)) {
    return true;
  }
  if (/khichdi|khichri/i.test(title) && !/khichdi|creamy|mushy|rice-lentil/i.test(steps.join(' '))) {
    return true;
  }
  if (ingredients.some((item) => /bajra|ragi|jowar/i.test(item.name)) && /the main grain/i.test(steps.join(' '))) {
    return true;
  }
  return false;
}

function buildContent(recipe: DbRecipe, ingredients: RecipeIngredient[]) {
  const storedSteps = parseJson<string[]>(recipe.steps, []);
  const input: RecipeStepInput = {
    title: recipe.title,
    kitchenStyleId: recipe.kitchenStyleId,
    dietType: recipe.dietType,
    ingredients,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
    description: recipe.description,
    steps: needsStepRefresh(recipe.title, storedSteps, ingredients) ? undefined : storedSteps,
  };

  const steps = resolveRecipeSteps(input);
  const description = buildRecipeDescription({ ...input, steps });
  const descriptionHi = buildRecipeDescriptionHi({ ...input, steps });
  const stepsHi = buildDetailedStepsHi({ ...input, steps, description });

  return { steps, description, descriptionHi, stepsHi };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number.parseInt(limitArg.split('=')[1] ?? '', 10) : undefined;

  const { rows } = await pool.query<DbRecipe>(`
    SELECT id, title, description, steps, "prepTime", "kitchenStyleId", "dietType", difficulty, ingredients
    FROM rasoi."Recipe"
    ORDER BY id
    ${limit ? `LIMIT ${limit}` : ''}
  `);

  let ingredientUpdates = 0;
  let stepUpdates = 0;
  let unchanged = 0;

  console.log(`Loaded ${rows.length} recipes. Mode: ${dryRun ? 'DRY RUN' : 'APPLY'}`);

  const client = await pool.connect();
  try {
    if (!dryRun) await client.query('BEGIN');

    for (const recipe of rows) {
      const before = parseJson<RecipeIngredient[]>(recipe.ingredients, []);
      const { ingredients: fixed, changed: ingredientsMeaningfullyChanged } = fixIngredients(recipe.title, before);
      const ingredientsJson = JSON.stringify(fixed);
      const ingredientsChanged = ingredientsMeaningfullyChanged;

      const storedSteps = parseJson<string[]>(recipe.steps, []);
      const stepsNeedRefresh = ingredientsChanged || needsStepRefresh(recipe.title, storedSteps, fixed);
      const content = stepsNeedRefresh ? buildContent(recipe, fixed) : null;

      if (!ingredientsChanged && !stepsNeedRefresh) {
        unchanged += 1;
        continue;
      }

      if (ingredientsChanged) ingredientUpdates += 1;
      if (stepsNeedRefresh) stepUpdates += 1;

      if (dryRun && ingredientUpdates + stepUpdates <= 8) {
        console.log('\n---', recipe.id, recipe.title, '---');
        if (ingredientsChanged && !ingredientListsEqual(before, fixed)) {
          console.log('Before:', before.map((i) => i.name).join(', '));
          console.log('After:', fixed.map((i) => i.name).join(', '));
        }
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
            ingredientsJson,
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

  console.log(
    `Done. Ingredient fixes: ${ingredientUpdates}, step refreshes: ${stepUpdates}, unchanged: ${unchanged}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
