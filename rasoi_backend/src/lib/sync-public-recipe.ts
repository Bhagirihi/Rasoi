import { Pool } from 'pg';

import type { Recipe } from '@/lib/db/types';
import type { RecipeIngredient } from '@/lib/types';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';
import { PANTRY_SECTIONS } from '@/lib/pantry-sections';
import { getPooledDatabaseUrl } from '@/lib/database-url';

let pool: Pool | null = null;

type PantrySectionName = 'Staples' | 'Veggies' | 'Dairy' | 'Protein' | 'Other';

const STAPLE_NAMES = new Set<string>(
  PANTRY_SECTIONS.find((section) => section.title === 'Staples')?.items ?? [],
);
const VEGGIE_NAMES = new Set<string>(
  PANTRY_SECTIONS.find((section) => section.title === 'Veggies')?.items ?? [],
);
const DAIRY_NAMES = new Set<string>(
  PANTRY_SECTIONS.find((section) => section.title === 'Dairy')?.items ?? [],
);
const PROTEIN_NAMES = new Set<string>([
  'Chicken',
  'Fish',
  'Mutton',
  'Prawn',
  'Eggs',
  'Anda',
  'Paneer',
  'Beef',
  'Pork',
  'Duck',
  'Lamb',
  'Keema',
  'Bhetki',
  'Gosht',
  'Maas',
  'Machhli',
  'Chingri',
  'Ilish',
]);

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: getPooledDatabaseUrl() });
  }
  return pool;
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseTags(tagsJson: string): string[] {
  const parsed = parseJson<unknown>(tagsJson, []);
  return Array.isArray(parsed) ? parsed.filter((tag) => typeof tag === 'string') : [];
}

function parseIngredients(ingredientsJson: string): RecipeIngredient[] {
  const parsed = parseJson<unknown>(ingredientsJson, []);
  return normalizeRecipeIngredients(parsed);
}

function parseSteps(stepsJson: string | null): string[] {
  if (!stepsJson) return [];
  const parsed = parseJson<unknown>(stepsJson, []);
  return Array.isArray(parsed) ? parsed.filter((step) => typeof step === 'string') : [];
}

function resolveIngredientSection(name: string, isStaple: boolean): PantrySectionName {
  if (isStaple || STAPLE_NAMES.has(name)) return 'Staples';
  if (DAIRY_NAMES.has(name)) return 'Dairy';
  if (VEGGIE_NAMES.has(name)) return 'Veggies';
  if (PROTEIN_NAMES.has(name)) return 'Protein';
  return 'Other';
}

async function ensurePublicIngredient(
  client: Pool,
  ingredient: RecipeIngredient,
): Promise<string> {
  const section = resolveIngredientSection(ingredient.name, ingredient.isStaple);
  const result = await client.query<{ id: string }>(
    `
      INSERT INTO public.ingredients (name, section, is_staple)
      VALUES ($1, $2::public.pantry_section, $3)
      ON CONFLICT (name) DO UPDATE SET
        is_staple = public.ingredients.is_staple OR EXCLUDED.is_staple
      RETURNING id
    `,
    [ingredient.name, section, ingredient.isStaple],
  );

  return result.rows[0].id;
}

function dedupeIngredients(ingredients: RecipeIngredient[]): RecipeIngredient[] {
  const seen = new Map<string, RecipeIngredient>();
  for (const ingredient of ingredients) {
    const key = ingredient.name.trim().toLowerCase();
    if (!key) continue;
    const existing = seen.get(key);
    if (existing) {
      existing.isStaple = existing.isStaple || ingredient.isStaple;
      if (!existing.recommendedBrand && ingredient.recommendedBrand) {
        existing.recommendedBrand = ingredient.recommendedBrand;
      }
      continue;
    }
    seen.set(key, { ...ingredient, name: ingredient.name.trim() });
  }
  return [...seen.values()];
}

async function syncPublicRecipeIngredients(
  client: Pool,
  recipeId: string,
  ingredients: RecipeIngredient[],
): Promise<void> {
  await client.query('DELETE FROM public.recipe_ingredients WHERE recipe_id = $1', [recipeId]);

  const uniqueIngredients = dedupeIngredients(ingredients);
  const usedIngredientIds = new Set<string>();
  let sortOrder = 0;

  for (const ingredient of uniqueIngredients) {
    const ingredientId = await ensurePublicIngredient(client, ingredient);
    if (usedIngredientIds.has(ingredientId)) continue;
    usedIngredientIds.add(ingredientId);
    sortOrder += 1;

    await client.query(
      `
        INSERT INTO public.recipe_ingredients (
          recipe_id,
          ingredient_id,
          sort_order,
          brand_name,
          brand_logo_url
        )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET
          sort_order = EXCLUDED.sort_order,
          brand_name = EXCLUDED.brand_name,
          brand_logo_url = EXCLUDED.brand_logo_url
      `,
      [
        recipeId,
        ingredientId,
        sortOrder,
        ingredient.recommendedBrand?.name ?? null,
        ingredient.recommendedBrand?.logo ?? null,
      ],
    );
  }
}

async function syncPublicRecipeSteps(
  client: Pool,
  recipeId: string,
  steps: string[],
): Promise<void> {
  await client.query('DELETE FROM public.recipe_steps WHERE recipe_id = $1', [recipeId]);

  for (let index = 0; index < steps.length; index += 1) {
    await client.query(
      `
        INSERT INTO public.recipe_steps (recipe_id, step_number, instruction)
        VALUES ($1, $2, $3)
      `,
      [recipeId, index + 1, steps[index]],
    );
  }
}

/**
 * Keeps legacy `public.recipes` (+ ingredients/steps) aligned with Prisma `rasoi.Recipe`.
 * `public.recipes_with_ingredient_count` is a view over recipes + recipe_ingredients.
 */
export async function syncPublicRecipe(recipe: Recipe): Promise<void> {
  const client = getPool();
  const tags = parseTags(recipe.tags);
  const ingredients = parseIngredients(recipe.ingredients);
  const steps = parseSteps(recipe.steps);

  await client.query(
    `
      INSERT INTO public.recipes (
        id,
        title,
        description,
        prep_time,
        calories,
        region,
        diet_type,
        difficulty,
        image_url,
        tags,
        published,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::public.diet_type, $8::public.recipe_difficulty, $9, $10::text[], $11, now())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        prep_time = EXCLUDED.prep_time,
        calories = EXCLUDED.calories,
        region = EXCLUDED.region,
        diet_type = EXCLUDED.diet_type,
        difficulty = EXCLUDED.difficulty,
        image_url = EXCLUDED.image_url,
        tags = EXCLUDED.tags,
        published = EXCLUDED.published,
        updated_at = now()
    `,
    [
      recipe.id,
      recipe.title,
      recipe.description,
      recipe.prepTime,
      recipe.calories,
      recipe.region,
      recipe.dietType,
      recipe.difficulty,
      recipe.imageUrl,
      tags,
      recipe.published,
    ],
  );

  await syncPublicRecipeIngredients(client, recipe.id, ingredients);
  await syncPublicRecipeSteps(client, recipe.id, steps);
}

export async function deletePublicRecipe(id: string): Promise<void> {
  const client = getPool();
  await client.query('DELETE FROM public.recipes WHERE id = $1', [id]);
}

/** Remove legacy public recipes that no longer exist in rasoi.Recipe. */
export async function pruneOrphanPublicRecipes(validIds: string[]): Promise<number> {
  const client = getPool();
  const result = await client.query(
    `
      DELETE FROM public.recipes
      WHERE NOT (id = ANY($1::text[]))
    `,
    [validIds],
  );
  return result.rowCount ?? 0;
}
