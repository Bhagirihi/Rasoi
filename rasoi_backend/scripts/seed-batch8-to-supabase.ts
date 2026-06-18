import 'dotenv/config';

import { Pool } from 'pg';

import { resolveRecipeSteps } from '../src/lib/recipe-steps';
import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { ALL_CUISINES_BATCH8_RECIPES } from './recipe-catalog/all-cuisines-batch8';
import { imageForRecipe } from './recipe-catalog/recipe-images';
import type { RecipeCatalogEntry } from './recipe-catalog/types';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

function sanitize(entry: RecipeCatalogEntry): RecipeCatalogEntry {
  return { ...entry, steps: resolveRecipeSteps(entry) };
}

async function upsert(entry: RecipeCatalogEntry, now: Date): Promise<void> {
  const kitchenStyleIds = entry.kitchenStyleIds ?? [entry.kitchenStyleId];
  const imageUrl = imageForRecipe(entry.title, entry.imageKeyword);

  await pool.query(
    `
      INSERT INTO rasoi."Recipe" (
        id, title, "prepTime", calories, region, "kitchenStyleId", "kitchenStyleIds",
        "dietType", difficulty, description, "imageUrl", tags, ingredients, steps,
        published, "createdAt", "updatedAt"
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        "prepTime" = EXCLUDED."prepTime",
        calories = EXCLUDED.calories,
        region = EXCLUDED.region,
        "kitchenStyleId" = EXCLUDED."kitchenStyleId",
        "kitchenStyleIds" = EXCLUDED."kitchenStyleIds",
        "dietType" = EXCLUDED."dietType",
        difficulty = EXCLUDED.difficulty,
        description = EXCLUDED.description,
        "imageUrl" = EXCLUDED."imageUrl",
        tags = EXCLUDED.tags,
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
      JSON.stringify(kitchenStyleIds),
      entry.dietType,
      entry.difficulty,
      entry.description,
      imageUrl,
      JSON.stringify(entry.tags),
      JSON.stringify(entry.ingredients),
      JSON.stringify(entry.steps),
      true,
      now,
      now,
    ],
  );
}

async function main() {
  const recipes = ALL_CUISINES_BATCH8_RECIPES.map(sanitize);
  const now = new Date();
  const byCuisine: Record<string, number> = {};

  for (const r of recipes) {
    byCuisine[r.kitchenStyleId] = (byCuisine[r.kitchenStyleId] ?? 0) + 1;
  }

  console.log(`Upserting ${recipes.length} batch8 recipes (100 per cuisine)…`);
  console.log('Per cuisine:', byCuisine);

  let done = 0;
  for (const entry of recipes) {
    await upsert(entry, now);
    done += 1;
    if (done % 100 === 0) {
      console.log(`Upserted ${done}/${recipes.length}…`);
    }
  }

  const total = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM rasoi."Recipe"`,
  );
  console.log(`Done. rasoi."Recipe" total: ${total.rows[0]?.count ?? '?'}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
