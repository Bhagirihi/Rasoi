import 'dotenv/config';

import { Pool } from 'pg';

import { resolveRecipeSteps } from '../src/lib/recipe-steps';
import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { ALL_CUISINES_BATCH7_RECIPES } from './recipe-catalog/all-cuisines-batch7';
import { imageForRecipe } from './recipe-catalog/recipe-images';
import type { RecipeCatalogEntry } from './recipe-catalog/types';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

function sanitize(entry: RecipeCatalogEntry): RecipeCatalogEntry {
  return {
    ...entry,
    steps: resolveRecipeSteps(entry),
  };
}

async function upsert(entry: RecipeCatalogEntry, now: Date): Promise<void> {
  const imageUrl = imageForRecipe(entry.title, entry.imageKeyword);

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
      JSON.stringify(entry.steps),
      true,
      now,
      now,
    ],
  );
}

async function main() {
  const recipes = ALL_CUISINES_BATCH7_RECIPES.map(sanitize);
  const now = new Date();

  console.log(`Upserting ${recipes.length} batch7 recipes to rasoi."Recipe"…`);

  let done = 0;
  for (const entry of recipes) {
    await upsert(entry, now);
    done += 1;
    if (done % 25 === 0) {
      console.log(`Upserted ${done}/${recipes.length}…`);
    }
  }

  const total = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM rasoi."Recipe"`,
  );
  console.log(`Done. rasoi."Recipe" total: ${total.rows[0]?.count ?? '?'}`);
  console.log('Sample ids:', recipes.slice(0, 3).map((r) => r.id).join(', '));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
