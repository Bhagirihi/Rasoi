import 'dotenv/config';

import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { ALL_CATALOG_RECIPES, countByKitchenStyle } from './recipe-catalog';
import { imageForRecipe } from './recipe-catalog/recipe-images';
import type { RecipeCatalogEntry } from './recipe-catalog/types';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

async function upsertRasoiRecipe(entry: RecipeCatalogEntry, now: Date): Promise<void> {
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

async function pruneOrphanRasoiRecipes(validIds: string[]): Promise<number> {
  const result = await pool.query(
    `
      DELETE FROM rasoi."Recipe"
      WHERE NOT (id = ANY($1::text[]))
    `,
    [validIds],
  );
  return result.rowCount ?? 0;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const now = new Date();
  const validIds = ALL_CATALOG_RECIPES.map((recipe) => recipe.id);
  const baseCount = 150;
  const batch3Count = 50;
  const batch4Count = 1500;
  const batch5Count = 1500;

  console.log(
    `Catalog: ${ALL_CATALOG_RECIPES.length} recipes (${baseCount} base + ${ALL_CATALOG_RECIPES.length - baseCount - batch3Count - batch4Count - batch5Count} expanded + ${batch3Count} batch3 + ${batch4Count} batch4 + ${batch5Count} batch5)`,
  );
  console.log('Per cuisine (includes multi-cuisine):', countByKitchenStyle());

  if (dryRun) {
    console.log('Dry run — no database writes.');
    return;
  }

  let upserted = 0;
  for (const entry of ALL_CATALOG_RECIPES) {
    await upsertRasoiRecipe(entry, now);
    upserted += 1;
    if (upserted % 50 === 0) {
      console.log(`Upserted ${upserted}/${ALL_CATALOG_RECIPES.length}…`);
    }
  }

  const removed = await pruneOrphanRasoiRecipes(validIds);
  if (removed > 0) {
    console.log(`Removed ${removed} orphan recipes from rasoi."Recipe"`);
  }

  const counts = await pool.query<{ total: string }>(
    `SELECT COUNT(*)::text AS total FROM rasoi."Recipe"`,
  );
  console.log(`rasoi."Recipe" count: ${counts.rows[0]?.total ?? '?'}`);
  console.log('Run npm run db:sync-public to mirror into public.recipes');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
