import { apiFetch } from '@/utils/api';
import { parseJson } from '@/utils/parseJson';
import { normalizeRecipeIngredients } from '@/utils/recipeIngredients';
import type { Recipe } from '@/data/mockRecipes';
import type { CuisineId } from '@/constants/theme';
import type { PaginatedItems } from '@/types/pagination';

type ApiRecipeRow = {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId: string;
  kitchenStyleIds: CuisineId[];
  dietType: Recipe['dietType'];
  difficulty: Recipe['difficulty'];
  description: string;
  imageUrl: string;
  tags: Recipe['tags'];
  ingredients: unknown;
};

function mapApiRecipe(row: ApiRecipeRow): Recipe {
  const kitchenStyleIds =
    row.kitchenStyleIds?.length > 0 ? row.kitchenStyleIds : [row.kitchenStyleId as CuisineId];

  return {
    id: row.id,
    title: row.title,
    prepTime: row.prepTime,
    calories: row.calories,
    region: row.region,
    kitchenStyleId: row.kitchenStyleId as CuisineId,
    kitchenStyleIds,
    dietType: row.dietType,
    difficulty: row.difficulty,
    description: row.description,
    imageUrl: row.imageUrl,
    tags: Array.isArray(row.tags) ? row.tags : [],
    ingredients: normalizeRecipeIngredients(
      parseJson<unknown[]>(typeof row.ingredients === 'string' ? row.ingredients : null, []),
    ),
    steps: [],
  };
}

export async function searchRecipes(options: {
  query: string;
  dietChoice?: string;
  region?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedItems<Recipe>> {
  const params = new URLSearchParams();
  params.set('q', options.query);
  if (options.dietChoice) params.set('dietChoice', options.dietChoice);
  if (options.region) params.set('region', options.region);
  if (options.limit != null) params.set('limit', String(options.limit));
  if (options.offset != null) params.set('offset', String(options.offset));

  const response = await apiFetch<PaginatedItems<ApiRecipeRow>>(
    `/api/recipes/search?${params.toString()}`,
  );

  return {
    items: response.items.map(mapApiRecipe),
    pagination: response.pagination,
  };
}

export async function logRecipeSearch(input: {
  query: string;
  sourceScreen: string;
  resultCount: number;
}): Promise<void> {
  try {
    await apiFetch('/api/recipe-searches', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch {
    // non-fatal analytics
  }
}
