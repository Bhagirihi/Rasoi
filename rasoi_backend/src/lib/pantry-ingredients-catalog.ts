import { PANTRY_SECTIONS } from '@/lib/pantry-sections';
import { queryPg } from '@/lib/db/pg';

export type PantryIngredientCatalogRow = {
  name: string;
  section: string;
  isStaple: boolean;
  recipeCount: number;
};

type IngredientRow = {
  name: string;
  section: string;
  is_staple: boolean;
  recipe_count: string;
};

const SECTION_ORDER = ['Staples', 'Pulses', 'Veggies', 'Dairy', 'Protein', 'Other'] as const;

function sectionSortIndex(section: string): number {
  const index = SECTION_ORDER.indexOf(section as (typeof SECTION_ORDER)[number]);
  return index === -1 ? SECTION_ORDER.length : index;
}

/** All unique ingredient names from recipes (`public.ingredients`) with usage counts. */
export async function listRecipeIngredientCatalog(): Promise<PantryIngredientCatalogRow[]> {
  try {
    const rows = await queryPg<IngredientRow>(
      `SELECT
         i.name,
         i.section::text AS section,
         i.is_staple,
         COUNT(ri.recipe_id)::text AS recipe_count
       FROM public.ingredients i
       LEFT JOIN public.recipe_ingredients ri ON ri.ingredient_id = i.id
       GROUP BY i.id, i.name, i.section, i.is_staple
       ORDER BY i.section, i.name`,
    );

    return rows.map((row) => ({
      name: row.name,
      section: row.section,
      isStaple: row.is_staple,
      recipeCount: Number.parseInt(row.recipe_count, 10) || 0,
    }));
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
