import 'dotenv/config';

import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { ALL_CATALOG_RECIPES, countByKitchenStyle } from './recipe-catalog';
import { imageForRecipe } from './recipe-catalog/recipe-images';
import type { RecipeCatalogEntry } from './recipe-catalog/types';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

async function ensureKitchenStyleIdsColumn(): Promise<void> {
  await pool.query(`
    ALTER TABLE rasoi."Recipe"
    ADD COLUMN IF NOT EXISTS "kitchenStyleIds" text NOT NULL DEFAULT '[]'
  `);
}

async function upsertRasoiRecipe(entry: RecipeCatalogEntry, now: Date): Promise<void> {
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

  console.log(
    `Catalog: ${ALL_CATALOG_RECIPES.length} recipes (${baseCount} base + ${ALL_CATALOG_RECIPES.length - baseCount} new)`,
  );
  console.log('Per cuisine (includes multi-cuisine):', countByKitchenStyle());

  if (dryRun) {
    console.log('Dry run — no database writes.');
    return;
  }

  await ensureKitchenStyleIdsColumn();

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
