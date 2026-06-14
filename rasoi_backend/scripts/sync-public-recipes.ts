import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { getDirectDatabaseUrl } from '../src/lib/database-url';
import { PrismaClient } from '../src/generated/prisma/client';
import { pruneOrphanPublicRecipes, syncPublicRecipe } from '../src/lib/sync-public-recipe';

const pool = new Pool({ connectionString: getDirectDatabaseUrl() });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const recipes = await prisma.recipe.findMany({ orderBy: { id: 'asc' } });
  const validIds = recipes.map((recipe) => recipe.id);

  const removed = await pruneOrphanPublicRecipes(validIds);
  if (removed > 0) {
    console.log(`Removed ${removed} orphan recipes from public.recipes`);
  }

  for (let index = 0; index < recipes.length; index += 1) {
    const recipe = recipes[index];
    await syncPublicRecipe(recipe);
    if ((index + 1) % 50 === 0 || index === recipes.length - 1) {
      console.log(`Synced ${index + 1}/${recipes.length}…`);
    }
  }

  const counts = await pool.query<{
    recipes: string;
    ingredients: string;
    steps: string;
    view_rows: string;
    zero_ingredient_rows: string;
  }>(`
    SELECT
      (SELECT COUNT(*)::text FROM public.recipes) AS recipes,
      (SELECT COUNT(*)::text FROM public.recipe_ingredients) AS ingredients,
      (SELECT COUNT(*)::text FROM public.recipe_steps) AS steps,
      (SELECT COUNT(*)::text FROM public.recipes_with_ingredient_count) AS view_rows,
      (
        SELECT COUNT(*)::text
        FROM public.recipes_with_ingredient_count
        WHERE ingredient_count = 0
      ) AS zero_ingredient_rows
  `);

  const summary = counts.rows[0];
  console.log(`Done — ${recipes.length} recipes synced to public.recipes`);
  console.log(
    `public.recipes=${summary.recipes}, recipe_ingredients=${summary.ingredients}, recipe_steps=${summary.steps}`,
  );
  console.log(
    `recipes_with_ingredient_count=${summary.view_rows} (zero ingredient_count=${summary.zero_ingredient_rows})`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
