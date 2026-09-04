import 'dotenv/config';

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parseMainIngredients } from '@/lib/recipe-main-ingredients';
import { queryPg } from '@/lib/db/pg';

type RecipeRow = {
  id: string;
  title: string;
  main_ingredients: string | null;
};

type IngredientIndexEntry = {
  name: string;
  recipeCount: number;
  recipeIds: string[];
};

async function main() {
  const rows = await queryPg<RecipeRow>(
    `SELECT id, title, main_ingredients
     FROM rasoi."Recipe"
     WHERE published = true
     ORDER BY title ASC`,
  );

  const recipes = rows.map((row) => {
    const mainIngredients = parseMainIngredients(row.main_ingredients);
    return {
      id: row.id,
      title: row.title,
      mainIngredients,
      mainIngredientsRaw: row.main_ingredients?.trim() || null,
    };
  });

  const ingredientIndex = new Map<string, IngredientIndexEntry>();

  for (const recipe of recipes) {
    for (const name of recipe.mainIngredients) {
      const key = name.toLowerCase();
      const existing = ingredientIndex.get(key);
      if (existing) {
        existing.recipeCount += 1;
        existing.recipeIds.push(recipe.id);
        continue;
      }
      ingredientIndex.set(key, {
        name,
        recipeCount: 1,
        recipeIds: [recipe.id],
      });
    }
  }

  const uniqueMainIngredients = [...ingredientIndex.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
  );

  const payload = {
    exportedAt: new Date().toISOString(),
    source: 'rasoi."Recipe".main_ingredients',
    publishedRecipeCount: recipes.length,
    uniqueMainIngredientCount: uniqueMainIngredients.length,
    uniqueMainIngredients: uniqueMainIngredients.map(({ name, recipeCount, recipeIds }) => ({
      name,
      recipeCount,
      recipeIds,
    })),
    recipes,
  };

  const outPath = resolve(
    process.cwd(),
    '../reports/recipe-data-gaps/main_ingredients_supabase.json',
  );
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${recipes.length} recipes`);
  console.log(`Unique main ingredients: ${uniqueMainIngredients.length}`);
  console.log(outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
