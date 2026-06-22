import 'dotenv/config';

import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { imageForRecipe } from './recipe-catalog/recipe-images';
import { ALL_CATALOG_RECIPES } from './recipe-catalog';

const dryRun = process.argv.includes('--dry-run');

async function main() {
  const pool = new Pool({ connectionString: getDirectDatabaseUrl() });
  const keywordByTitle = new Map(
    ALL_CATALOG_RECIPES.map((entry) => [entry.title.trim().toLowerCase(), entry.imageKeyword]),
  );

  const { rows } = await pool.query<{ id: string; title: string; imageUrl: string }>(
    `SELECT id, title, "imageUrl" FROM rasoi."Recipe" ORDER BY id`,
  );

  let updated = 0;
  for (const row of rows) {
    const imageKeyword = keywordByTitle.get(row.title.trim().toLowerCase());
    const nextUrl = imageForRecipe(row.title, imageKeyword);
    if (nextUrl === row.imageUrl) continue;

    updated += 1;
    console.log(`${row.title}`);
    console.log(`  was: ${row.imageUrl}`);
    console.log(`  now: ${nextUrl}`);

    if (!dryRun) {
      await pool.query(`UPDATE rasoi."Recipe" SET "imageUrl" = $1, "updatedAt" = NOW() WHERE id = $2`, [
        nextUrl,
        row.id,
      ]);
    }
  }

  console.log(
    dryRun
      ? `Dry run complete — ${updated}/${rows.length} recipes would update imageUrl.`
      : `Updated imageUrl for ${updated}/${rows.length} recipes.`,
  );

  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
