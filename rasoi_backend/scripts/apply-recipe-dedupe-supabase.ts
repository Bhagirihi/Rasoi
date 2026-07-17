/**
 * Remap user references and delete exact duplicate recipes on Supabase.
 *
 * Dry run:  npx tsx scripts/apply-recipe-dedupe-supabase.ts --dry-run
 * Apply:    npx tsx scripts/apply-recipe-dedupe-supabase.ts
 */
import 'dotenv/config';
import { writeFileSync } from 'fs';
import path from 'path';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { ALL_CATALOG_RECIPES, RAW_CATALOG_RECIPES } from './recipe-catalog';
import { buildRecipeDedupePlan } from './recipe-dedupe';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

async function withRemapTable<T>(
  remap: Map<string, string>,
  fn: (client: import('pg').PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TEMP TABLE dedupe_remap (
        from_id text PRIMARY KEY,
        to_id text NOT NULL
      ) ON COMMIT DROP
    `);
    const entries = [...remap.entries()];
    const chunkSize = 500;
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      const values = chunk.map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`).join(', ');
      const params = chunk.flatMap(([fromId, toId]) => [fromId, toId]);
      await client.query(`INSERT INTO dedupe_remap (from_id, to_id) VALUES ${values}`, params);
    }
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

function remapJsonIds(raw: string, remap: Map<string, string>): { next: string; changed: boolean } {
  let ids: string[] = [];
  try {
    const parsed = JSON.parse(raw || '[]');
    ids = Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    ids = [];
  }
  const nextIds = [...new Set(ids.map((id) => remap.get(id) ?? id))];
  const next = JSON.stringify(nextIds);
  return { next, changed: next !== JSON.stringify(ids) };
}

async function remapUserJsonColumn(
  table: string,
  column: string,
  remap: Map<string, string>,
  dryRun: boolean,
): Promise<number> {
  const { rows } = await pool.query<{ id: string; value: string }>(
    `SELECT id, "${column}" AS value FROM rasoi."${table}" WHERE "${column}" IS NOT NULL AND "${column}" != '[]'`,
  );
  let updated = 0;
  const pending: { id: string; next: string }[] = [];
  for (const row of rows) {
    const { next, changed } = remapJsonIds(row.value, remap);
    if (!changed) continue;
    updated += 1;
    if (!dryRun) pending.push({ id: row.id, next });
  }
  if (!dryRun && pending.length > 0) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const row of pending) {
        await client.query(`UPDATE rasoi."${table}" SET "${column}" = $1 WHERE id = $2`, [row.next, row.id]);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  return updated;
}

async function deleteDuplicateRecipes(removeIds: string[], dryRun: boolean): Promise<number> {
  if (removeIds.length === 0) return 0;
  if (dryRun) {
    const { rows } = await pool.query<{ n: number }>(
      `SELECT count(*)::int AS n FROM rasoi."Recipe" WHERE id = ANY($1::text[])`,
      [removeIds],
    );
    return rows[0]?.n ?? 0;
  }
  const result = await pool.query(`DELETE FROM rasoi."Recipe" WHERE id = ANY($1::text[])`, [removeIds]);
  return result.rowCount ?? 0;
}

async function countDuplicateTitleGroups(): Promise<number> {
  const { rows } = await pool.query<{ n: number }>(`
    SELECT count(*)::int AS n FROM (
      SELECT lower(trim(title)) FROM rasoi."Recipe" GROUP BY 1 HAVING count(*) > 1
    ) t
  `);
  return rows[0]?.n ?? 0;
}

async function runRemapSteps(remap: Map<string, string>, dryRun: boolean) {
  return withRemapTable(remap, async (client) => {
    const remapRecipeId = async (table: string, uniqueWithUser?: boolean): Promise<number> => {
      let updated = 0;
      if (uniqueWithUser) {
        if (dryRun) {
          const { rows } = await client.query<{ n: number }>(`
            SELECT count(*)::int AS n
            FROM rasoi."${table}" src
            INNER JOIN dedupe_remap r ON src."recipeId" = r.from_id
            WHERE EXISTS (
              SELECT 1 FROM rasoi."${table}" dst
              WHERE dst."recipeId" = r.to_id AND dst."userId" = src."userId"
            )
          `);
          updated += rows[0]?.n ?? 0;
        } else {
          const merged = await client.query(`
            DELETE FROM rasoi."${table}" src
            USING dedupe_remap r, rasoi."${table}" dst
            WHERE src."recipeId" = r.from_id
              AND dst."recipeId" = r.to_id
              AND src."userId" = dst."userId"
          `);
          updated += merged.rowCount ?? 0;
        }
      }

      if (dryRun) {
        const { rows } = await client.query<{ n: number }>(`
          SELECT count(*)::int AS n
          FROM rasoi."${table}" src
          INNER JOIN dedupe_remap r ON src."recipeId" = r.from_id
        `);
        updated += rows[0]?.n ?? 0;
      } else {
        const result = await client.query(`
          UPDATE rasoi."${table}" src
          SET "recipeId" = r.to_id
          FROM dedupe_remap r
          WHERE src."recipeId" = r.from_id
        `);
        updated += result.rowCount ?? 0;
      }
      return updated;
    };

    return {
      recipeCooked: await remapRecipeId('UserRecipeCooked', true),
      recipeViews: await remapRecipeId('UserRecipeView', true),
      recommendationHistory: await remapRecipeId('UserRecommendationHistory'),
      mealNotificationLogs: await remapRecipeId('MealNotificationLog'),
      affiliateEvents: await remapRecipeId('AffiliateEvent'),
      sponsors: await remapRecipeId('Sponsor'),
    };
  });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const plan = buildRecipeDedupePlan(RAW_CATALOG_RECIPES);
  const removeIds = [...plan.removeIds];

  console.log(`Catalog raw: ${RAW_CATALOG_RECIPES.length}`);
  console.log(`Catalog deduped: ${ALL_CATALOG_RECIPES.length}`);
  console.log(`Duplicate groups: ${plan.duplicateGroups.length}`);
  console.log(`Recipes to remove: ${removeIds.length}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY'}`);

  const planPath = path.join(__dirname, 'recipe-dedupe-plan.json');
  writeFileSync(
    planPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        removeCount: removeIds.length,
        keepCount: plan.keepIds.size,
        duplicateGroups: plan.duplicateGroups,
        remap: Object.fromEntries(plan.remap),
      },
      null,
      2,
    ),
  );
  console.log(`Plan written: ${planPath}`);

  const beforeDupes = await countDuplicateTitleGroups();
  const beforeTotal = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM rasoi."Recipe"`);
  console.log(`DB before: ${beforeTotal.rows[0]?.n ?? 0} recipes, ${beforeDupes} duplicate title groups`);

  const jsonStats = {
    usersSavedRecipes: await remapUserJsonColumn('User', 'savedRecipeIds', plan.remap, dryRun),
    recommendationCache: await remapUserJsonColumn(
      'UserRecommendationCache',
      'recipeIds',
      plan.remap,
      dryRun,
    ),
  };
  const idStats = await runRemapSteps(plan.remap, dryRun);
  const recipesDeleted = await deleteDuplicateRecipes(removeIds, dryRun);

  const stats = { ...jsonStats, ...idStats, recipesDeleted };
  console.log('Reference updates:', stats);

  const afterDupes = dryRun ? beforeDupes : await countDuplicateTitleGroups();
  const afterTotal = await pool.query<{ n: number }>(`SELECT count(*)::int AS n FROM rasoi."Recipe"`);
  console.log(`DB after: ${afterTotal.rows[0]?.n ?? 0} recipes, ${afterDupes} duplicate title groups`);

  if (dryRun) {
    console.log('Dry run complete — no writes made.');
  } else {
    console.log('Supabase dedupe applied.');
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
