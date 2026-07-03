/**
 * Restore household-01..50 from catalog source (accurate descriptions + steps).
 */
import 'dotenv/config';
import { Pool } from 'pg';

import { HOUSEHOLD_STAPLES_RECIPES } from './recipe-catalog/household-staples-batch';
import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { buildRecipeDescriptionHi } from '../src/lib/recipe-description';
import { buildDetailedStepsHi } from '../src/lib/recipe-content-hi';
import type { RecipeStepInput } from '../src/lib/recipe-steps';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const recipe of HOUSEHOLD_STAPLES_RECIPES) {
      const input: RecipeStepInput = {
        title: recipe.title,
        kitchenStyleId: recipe.kitchenStyleId,
        dietType: recipe.dietType,
        ingredients: recipe.ingredients,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        description: recipe.description,
        steps: recipe.steps,
      };
      const descriptionHi = buildRecipeDescriptionHi({ ...input, steps: recipe.steps });
      const stepsHi = buildDetailedStepsHi({ ...input, steps: recipe.steps, description: recipe.description });

      await client.query(
        `
          UPDATE rasoi."Recipe"
          SET description = $2,
              steps = $3,
              "descriptionHi" = $4,
              "stepsHi" = $5,
              "updatedAt" = NOW()
          WHERE id = $1
        `,
        [
          recipe.id,
          recipe.description,
          JSON.stringify(recipe.steps),
          descriptionHi,
          JSON.stringify(stepsHi),
        ],
      );
      console.log('Restored', recipe.id, recipe.title);
    }
    await client.query('COMMIT');
    console.log(`Done. Restored ${HOUSEHOLD_STAPLES_RECIPES.length} household recipes.`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
