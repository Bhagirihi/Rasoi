import 'dotenv/config';

import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { resolveRecipeSteps } from '../src/lib/recipe-steps';
import { ALL_CUISINES_BATCH6_RECIPES, BATCH6_RECIPE_COUNT } from './recipe-catalog/all-cuisines-batch6';
import { imageForRecipe } from './recipe-catalog/recipe-images';
import type { RecipeCatalogEntry } from './recipe-catalog/types';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

async function upsertRasoiRecipe(entry: RecipeCatalogEntry, now: Date): Promise<void> {
  const imageUrl = imageForRecipe(entry.title, entry.imageKeyword);
  const steps = resolveRecipeSteps({
    title: entry.title,
    kitchenStyleId: entry.kitchenStyleId,
    dietType: entry.dietType,
    ingredients: entry.ingredients,
    prepTime: entry.prepTime,
    difficulty: entry.difficulty,
    description: entry.description,
  });

  await pool.query(
    `
      INSERT INTO rasoi."Recipe" (
        id, title, "prepTime", calories, region, "kitchenStyleId",
        "dietType", difficulty, "imageUrl", ingredients, steps,
        published, "createdAt", "updatedAt"
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        "prepTime" = EXCLUDED."prepTime",
        calories = EXCLUDED.calories,
        region = EXCLUDED.region,
        "kitchenStyleId" = EXCLUDED."kitchenStyleId",
        "dietType" = EXCLUDED."dietType",
        difficulty = EXCLUDED.difficulty,
        "imageUrl" = EXCLUDED."imageUrl",
        ingredients = EXCLUDED.ingredients,
        steps = EXCLUDED.steps,
        published = EXCLUDED.published,
        "updatedAt" = EXCLUDED."updatedAt"
    `,
    [
      entry.id,
      entry.title,
      entry.prepTime,
      entry.calories,
      entry.region,
      entry.kitchenStyleId,
      entry.dietType,
      entry.difficulty,
      imageUrl,
      JSON.stringify(entry.ingredients),
      JSON.stringify(steps),
      true,
      now,
      now,
    ],
  );
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const now = new Date();

  console.log(`Batch 6: upserting ${BATCH6_RECIPE_COUNT} curated recipes (ids *-285+)`);

  if (dryRun) {
    for (const entry of ALL_CUISINES_BATCH6_RECIPES.slice(0, 3)) {
      const steps = resolveRecipeSteps({
        title: entry.title,
        kitchenStyleId: entry.kitchenStyleId,
        dietType: entry.dietType,
        ingredients: entry.ingredients,
        prepTime: entry.prepTime,
        difficulty: entry.difficulty,
        description: entry.description,
      });
      console.log(`\n${entry.id} — ${entry.title} (${steps.length} steps)`);
      steps.forEach((step, index) => console.log(`  ${index + 1}. ${step.slice(0, 90)}…`));
    }
    console.log('\nDry run — no database writes.');
    return;
  }

  let upserted = 0;
  for (const entry of ALL_CUISINES_BATCH6_RECIPES) {
    await upsertRasoiRecipe(entry, now);
    upserted += 1;
    if (upserted % 25 === 0) {
      console.log(`Upserted ${upserted}/${BATCH6_RECIPE_COUNT}…`);
    }
  }

  const counts = await pool.query<{ total: string }>(
    `SELECT COUNT(*)::text AS total FROM rasoi."Recipe"`,
  );
  console.log(`Done. Upserted ${upserted} batch-6 recipes.`);
  console.log(`rasoi."Recipe" total count: ${counts.rows[0]?.total ?? '?'}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
