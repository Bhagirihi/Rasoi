import type { DietType, Recipe } from '@/data/mockRecipes';
import type { CuisineId } from '@/constants/theme';
import { apiFetch } from '@/utils/api';
import { parseJson } from '@/utils/parseJson';
import { dietChoiceToDietType } from '@/utils/recipeFilters';
import { getRasoiDb, isDirectSupabaseReadsEnabled } from '@/utils/rasoiDb';
import { resolveStepsForRecipe } from '@/utils/generateRecipeSteps';
import { normalizeRecipeIngredients } from '@/utils/recipeIngredients';

type DbRecipeRow = {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId: string;
  kitchenStyleIds: string;
  dietType: DietType;
  difficulty: Recipe['difficulty'];
  description: string;
  imageUrl: string;
  tags: string;
  ingredients: string;
  published: boolean;
};

export type RecipeFetchFilters = {
  region?: string;
  dietChoice?: string;
  dietType?: DietType;
  tag?: string;
};

function mapRecipeRow(recipe: DbRecipeRow, options?: { includeSteps?: boolean }): Recipe {
  const kitchenStyleIds = parseJson<CuisineId[]>(recipe.kitchenStyleIds, []);
  const resolvedKitchenStyleIds =
    kitchenStyleIds.length > 0 ? kitchenStyleIds : [recipe.kitchenStyleId as CuisineId];

  const normalizedIngredients = normalizeRecipeIngredients(parseJson<unknown>(recipe.ingredients, []));

  return {
    id: recipe.id,
    title: recipe.title,
    prepTime: recipe.prepTime,
    calories: recipe.calories,
    region: recipe.region,
    kitchenStyleId: recipe.kitchenStyleId as CuisineId,
    kitchenStyleIds: resolvedKitchenStyleIds,
    dietType: recipe.dietType,
    difficulty: recipe.difficulty,
    description: recipe.description,
    imageUrl: recipe.imageUrl,
    tags: parseJson<Recipe['tags']>(recipe.tags, []),
    ingredients: normalizedIngredients,
    steps: options?.includeSteps
      ? resolveStepsForRecipe({
        title: recipe.title,
        kitchenStyleId: recipe.kitchenStyleId,
        dietType: recipe.dietType,
        ingredients: recipe.ingredients,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        description: recipe.description,
      })
      : [],
  };
}

function applyFetchFilters(recipes: Recipe[], filters?: RecipeFetchFilters): Recipe[] {
  const dietType =
    filters?.dietType ??
    (filters?.dietChoice ? dietChoiceToDietType(filters.dietChoice) : undefined);

  if (!dietType) {
    return recipes;
  }

  return recipes.filter((recipe) => recipe.dietType === dietType);
}

async function fetchPublishedRecipesFromSupabase(filters?: RecipeFetchFilters): Promise<Recipe[]> {
  let query = getRasoiDb().from('Recipe').select('*').eq('published', true);

  const region = filters?.region?.trim();
  if (region && region !== 'All India') {
    query = query.eq('region', region);
  }

  const dietType =
    filters?.dietType ??
    (filters?.dietChoice ? dietChoiceToDietType(filters.dietChoice) : undefined);
  if (dietType) {
    query = query.eq('dietType', dietType);
  }

  const tag = filters?.tag?.trim();
  if (tag && tag !== 'all') {
    query = query.ilike('tags', `%"${tag}"%`);
  }

  const { data, error } = await query.order('createdAt', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return applyFetchFilters((data as DbRecipeRow[]).map((row) => mapRecipeRow(row)), filters);
}

async function fetchRecipeByIdFromSupabase(id: string): Promise<Recipe> {
  const { data, error } = await getRasoiDb()
    .from('Recipe')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Recipe not found');
  }

  return mapRecipeRow(data as DbRecipeRow, { includeSteps: true });
}

function buildRecipesQuery(filters?: RecipeFetchFilters): string {
  const params = new URLSearchParams();
  params.set('view', 'list');
  if (filters?.region && filters.region !== 'All India') {
    params.set('region', filters.region);
  }
  if (filters?.dietChoice) {
    params.set('dietChoice', filters.dietChoice);
  }
  if (filters?.dietType) {
    params.set('dietType', filters.dietType);
  }
  if (filters?.tag && filters.tag !== 'all') {
    params.set('tag', filters.tag);
  }

  const query = params.toString();
  return `?${query}`;
}

type ApiRecipe = {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId?: string;
  kitchenStyleIds?: string[];
  dietType: Recipe['dietType'];
  difficulty: Recipe['difficulty'];
  description: string;
  imageUrl: string;
  tags: Recipe['tags'];
  ingredients: Recipe['ingredients'];
  steps?: string[];
  published: boolean;
};

function mapApiRecipe(recipe: ApiRecipe): Recipe {
  const kitchenStyleIds =
    recipe.kitchenStyleIds?.length
      ? recipe.kitchenStyleIds
      : recipe.kitchenStyleId
        ? [recipe.kitchenStyleId]
        : undefined;

  return {
    id: recipe.id,
    title: recipe.title,
    prepTime: recipe.prepTime,
    calories: recipe.calories,
    region: recipe.region,
    kitchenStyleId: recipe.kitchenStyleId,
    kitchenStyleIds,
    dietType: recipe.dietType,
    difficulty: recipe.difficulty,
    description: recipe.description,
    imageUrl: recipe.imageUrl,
    tags: recipe.tags ?? [],
    ingredients: normalizeRecipeIngredients(recipe.ingredients),
    steps: recipe.steps,
  };
}

export async function fetchPublishedRecipes(filters?: RecipeFetchFilters): Promise<Recipe[]> {
  if (isDirectSupabaseReadsEnabled()) {
    try {
      return await fetchPublishedRecipesFromSupabase(filters);
    } catch (error) {
      console.warn('[recipes] Supabase read failed, falling back to API', error);
    }
  }

  const recipes = await apiFetch<ApiRecipe[]>(`/api/recipes${buildRecipesQuery(filters)}`);
  return applyFetchFilters(recipes.map(mapApiRecipe), filters);
}

export async function fetchRecipeById(id: string): Promise<Recipe> {
  if (isDirectSupabaseReadsEnabled()) {
    try {
      return await fetchRecipeByIdFromSupabase(id);
    } catch (error) {
      console.warn('[recipes] Supabase read failed, falling back to API', error);
    }
  }

  const recipe = await apiFetch<ApiRecipe>(`/api/recipes/${id}`);
  return mapApiRecipe(recipe);
}
