import { canonicalizeIngredientName } from '@/lib/ingredient-canonical';
import { PANTRY_SECTIONS } from '@/lib/pantry-sections';
import { resolveIngredientSection } from '@/lib/pantry-ingredient-section';
import { queryPg } from '@/lib/db/pg';
import { normalizeRecipeIngredients } from '@/lib/recipe-ingredients';

export type PantryIngredientCatalogRow = {
  name: string;
  section: string;
  isStaple: boolean;
  recipeCount: number;
};

type RecipeIngredientRow = {
  id: string;
  ingredients: string;
};

const SECTION_ORDER = ['Staples', 'Pulses', 'Veggies', 'Dairy', 'Protein', 'Other'] as const;

function sectionSortIndex(section: string): number {
  const index = SECTION_ORDER.indexOf(section as (typeof SECTION_ORDER)[number]);
  return index === -1 ? SECTION_ORDER.length : index;
}

function parseIngredientsJson(ingredientsJson: string): ReturnType<typeof normalizeRecipeIngredients> {
  try {
    return normalizeRecipeIngredients(JSON.parse(ingredientsJson));
  } catch {
    return [];
  }
}

function buildCatalogFromRecipes(rows: RecipeIngredientRow[]): PantryIngredientCatalogRow[] {
  const counts = new Map<
    string,
    { name: string; section: string; isStaple: boolean; recipeCount: number }
  >();

  for (const recipe of rows) {
    const ingredients = parseIngredientsJson(recipe.ingredients);
    const seenInRecipe = new Set<string>();

    for (const ingredient of ingredients) {
      const name = canonicalizeIngredientName(ingredient.name);
      const key = name.toLowerCase();
      if (!key || seenInRecipe.has(key)) continue;
      seenInRecipe.add(key);

      const section = resolveIngredientSection(name, ingredient.isStaple);
      const existing = counts.get(key);
      if (existing) {
        existing.recipeCount += 1;
        existing.isStaple = existing.isStaple || ingredient.isStaple;
      } else {
        counts.set(key, {
          name,
          section,
          isStaple: ingredient.isStaple,
          recipeCount: 1,
        });
      }
    }
  }

  return [...counts.values()].sort(
    (a, b) =>
      sectionSortIndex(a.section) - sectionSortIndex(b.section) ||
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
}

/** Unique ingredient names from published `rasoi.Recipe` rows with usage counts. */
export async function listRecipeIngredientCatalog(): Promise<PantryIngredientCatalogRow[]> {
  try {
    const rows = await queryPg<RecipeIngredientRow>(
      `SELECT id, ingredients
       FROM rasoi."Recipe"
       WHERE published = true`,
    );

    if (rows.length === 0) {
      return fallbackPantryCatalog();
    }

    return buildCatalogFromRecipes(rows);
  } catch {
    return fallbackPantryCatalog();
  }
}

function fallbackPantryCatalog(): PantryIngredientCatalogRow[] {
  const rows: PantryIngredientCatalogRow[] = [];
  for (const section of PANTRY_SECTIONS) {
    for (const name of section.items) {
      rows.push({
        name,
        section: section.title,
        isStaple: section.title === 'Staples' || section.title === 'Pulses',
        recipeCount: 0,
      });
    }
  }
  return rows.sort(
    (a, b) =>
      sectionSortIndex(a.section) - sectionSortIndex(b.section) ||
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
}

export function groupIngredientsBySection(
  rows: PantryIngredientCatalogRow[],
): { section: string; items: PantryIngredientCatalogRow[] }[] {
  const map = new Map<string, PantryIngredientCatalogRow[]>();
  for (const row of rows) {
    const bucket = map.get(row.section) ?? [];
    bucket.push(row);
    map.set(row.section, bucket);
  }

  return [...map.entries()]
    .sort(([a], [b]) => sectionSortIndex(a) - sectionSortIndex(b))
    .map(([section, items]) => ({
      section,
      items: items.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      ),
    }));
}
