/**
 * Re-canonicalize rasoi.Recipe ingredient JSON and re-sync public.ingredients links.
 *
 * Run: cd rasoi_backend && npx tsx scripts/merge-ingredient-canonical.ts
 * Re-run recipe sync only (SQL already applied): add --skip-sql
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Pool } from 'pg';

import { db } from '@/lib/db';
import { getDirectDatabaseUrl } from '@/lib/database-url';
import type { Recipe } from '@/lib/db/types';
import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import { syncPublicRecipe } from '@/lib/sync-public-recipe';

const PROGRESS_EVERY = 25;
const MAX_RETRIES = 4;

async function fetchAllRecipes(pool: Pool): Promise<Recipe[]> {
  const result = await pool.query<Recipe>(`
    SELECT
      id,
      title,
      "prepTime",
      calories,
      region,
      "kitchenStyleId",
      "kitchenStyleIds",
      "dietType",
      difficulty,
      description,
      "imageUrl",
      tags,
      ingredients,
      steps,
      published,
      "createdAt",
      "updatedAt"
    FROM rasoi."Recipe"
    ORDER BY id ASC
  `);
  return result.rows;
}

async function withRetries<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const code = (error as NodeJS.ErrnoException).code;
      const retryable = code === 'ETIMEDOUT' || code === 'ECONNRESET' || code === 'ENOTFOUND';
      if (!retryable || attempt === MAX_RETRIES) break;
      const waitMs = attempt * 3000;
      console.warn(`[merge-ingredient-canonical] ${label} failed (${code}), retry ${attempt}/${MAX_RETRIES} in ${waitMs}ms…`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastError;
}

async function main() {
  const skipSql = process.argv.includes('--skip-sql');
  const pool = new Pool({
    connectionString: getDirectDatabaseUrl(),
    connectionTimeoutMillis: 30_000,
    idleTimeoutMillis: 60_000,
    max: 3,
  });

  try {
    if (!skipSql) {
      const sqlPath = resolve(
        __dirname,
        '../../rasoi_mobile/supabase/migrations/20250624130000_merge_ingredient_canonical.sql',
      );
      const sql = readFileSync(sqlPath, 'utf8');
      console.log('[merge-ingredient-canonical] applying SQL migration…');
      await withRetries('SQL migration', () => pool.query(sql));
      console.log('[merge-ingredient-canonical] SQL applied');
    } else {
      console.log('[merge-ingredient-canonical] skipping SQL (--skip-sql)');
    }

    const recipes = await fetchAllRecipes(pool);
    console.log(`[merge-ingredient-canonical] processing ${recipes.length} recipes…`);

    let updated = 0;
    let synced = 0;

    for (let index = 0; index < recipes.length; index += 1) {
      const recipe = recipes[index];
      const normalized = normalizeRecipeIngredients(JSON.parse(recipe.ingredients));
      const canonical = normalized.map((item) => ({
        ...item,
        name: canonicalizeIngredientName(item.name),
      }));

      const nextJson = JSON.stringify(canonical);
      const ingredientsChanged = nextJson !== recipe.ingredients;
      let recipeRow = recipe;

      if (ingredientsChanged) {
        recipeRow = await withRetries(`update ${recipe.id}`, () =>
          db.recipe.update({
            where: { id: recipe.id },
            data: { ingredients: nextJson },
          }),
        );
        updated += 1;

        await withRetries(`sync ${recipe.id}`, () => syncPublicRecipe(recipeRow));
        synced += 1;
      }

      if ((index + 1) % PROGRESS_EVERY === 0 || index === recipes.length - 1) {
        console.log(
          `[merge-ingredient-canonical] ${index + 1}/${recipes.length} checked · ${updated} updated · ${synced} synced`,
        );
      }
    }

    console.log(
      `[merge-ingredient-canonical] done — ${updated} ingredient JSON updates, ${synced} public syncs`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
