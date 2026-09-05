import type { DietType, Recipe } from '@/data/mockRecipes';
import type { CuisineId } from '@/constants/theme';
import { apiFetch } from '@/utils/api';
import { parseJson } from '@/utils/parseJson';
import { dietChoiceToDietType } from '@/utils/recipeFilters';
import { getRasoiDb, isDirectSupabaseCatalogEnabled } from '@/utils/rasoiDb';
import {
  loadCachedRecipePage,
  recipeCatalogFilterKey,
  saveCachedRecipePage,
} from '@/utils/recipeCatalogCache';
import {
  buildRecipeDescription,
  buildRecipeDescriptionHi,
} from '@/utils/recipeDescription';
import { normalizeRecipeIngredients } from '@/utils/recipeIngredients';
import { parseMainIngredients } from '@/utils/recipeMainIngredients';
import {
  RECIPE_PAGE_SIZE,
  PLAN_MENU_SIZE,
  type PaginatedItems,
  type PaginationMeta,
} from '@/types/pagination';

type DbRecipeRow = {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  region: string;
  kitchenStyleId: string;
  dietType: DietType;
  difficulty: Recipe['difficulty'];
  descriptionHi?: string | null;
  imageUrl: string;
  ingredients: string;
  main_ingredients?: string | null;
  steps?: string | null;
  stepsHi?: string | null;
  published: boolean;
};

/** List/bootstrap columns — omit steps + admin scores to shrink Supabase egress per page. */
const RECIPE_LIST_COLUMNS =
  'id, title, prepTime, calories, region, kitchenStyleId, dietType, difficulty, descriptionHi, imageUrl, ingredients, main_ingredients, published';

export type RecipeFetchFilters = {
  region?: string;
  dietChoice?: string;
  dietType?: DietType;
  tag?: string;
};

function mapRecipeRow(recipe: DbRecipeRow, options?: { includeSteps?: boolean }): Recipe {
  const kitchenStyleId = recipe.kitchenStyleId as CuisineId;
  const normalizedIngredients = normalizeRecipeIngredients(recipe.ingredients);
  const mainIngredients = parseMainIngredients(recipe.main_ingredients);
  const dbSteps = parseJson<string[]>(recipe.steps ?? null, []);
  const dbStepsHi = parseJson<string[]>(recipe.stepsHi ?? null, []);
  const storedDescHi = recipe.descriptionHi?.trim() ?? '';

  return {
    id: recipe.id,
    title: recipe.title,
    prepTime: recipe.prepTime,
    calories: recipe.calories,
    region: recipe.region,
    kitchenStyleId,
    kitchenStyleIds: [kitchenStyleId],
    dietType: recipe.dietType,
    difficulty: recipe.difficulty,
    description: buildRecipeDescription({
      title: recipe.title,
      ingredients: normalizedIngredients,
    }),
    descriptionHi:
      storedDescHi ||
      buildRecipeDescriptionHi({
        title: recipe.title,
        ingredients: normalizedIngredients,
      }),
    imageUrl: recipe.imageUrl,
    tags: [],
    ingredients: normalizedIngredients,
    mainIngredients: mainIngredients.length > 0 ? mainIngredients : undefined,
    steps: options?.includeSteps ? dbSteps : undefined,
    stepsHi: options?.includeSteps && dbStepsHi.length > 0 ? dbStepsHi : undefined,
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

function buildPublishedRecipeQuery(filters?: RecipeFetchFilters) {
  let query = getRasoiDb()
    .from('Recipe')
    .select(RECIPE_LIST_COLUMNS, { count: 'exact' })
    .eq('published', true);

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

  // tags column dropped — tag filters are applied client-side where needed.

  return query.order('createdAt', { ascending: false });
}

async function fetchPublishedRecipesPageFromSupabase(
  filters: RecipeFetchFilters | undefined,
  offset: number,
  limit: number,
): Promise<PaginatedItems<Recipe>> {
  const from = offset;
  const to = offset + limit - 1;
  const { data, error, count } = await buildPublishedRecipeQuery(filters).range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const items = applyFetchFilters((data as DbRecipeRow[]).map((row) => mapRecipeRow(row)), filters);
  const total = count ?? items.length;
  const hasMore = offset + items.length < total;

  return {
    items,
    pagination: {
      limit,
      offset,
      total,
      hasMore,
      nextOffset: hasMore ? offset + items.length : null,
    },
  };
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

function buildRecipesQuery(
  filters?: RecipeFetchFilters,
  pagination?: { limit: number; offset: number },
): string {
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
  if (pagination) {
    params.set('limit', String(pagination.limit));
    params.set('offset', String(pagination.offset));
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
  descriptionHi?: string;
  imageUrl: string;
  tags: Recipe['tags'];
  ingredients: Recipe['ingredients'];
  mainIngredients?: string[];
  steps?: string[];
  stepsHi?: string[];
  published: boolean;
};

type ApiPaginatedRecipes = {
  items: ApiRecipe[];
  pagination: PaginationMeta;
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
    descriptionHi: recipe.descriptionHi,
    imageUrl: recipe.imageUrl,
    tags: recipe.tags ?? [],
    ingredients: normalizeRecipeIngredients(recipe.ingredients),
    mainIngredients: recipe.mainIngredients,
    steps: recipe.steps,
    stepsHi: recipe.stepsHi,
  };
}

async function fetchPublishedRecipesPageFromApi(
  filters: RecipeFetchFilters | undefined,
  offset: number,
  limit: number,
): Promise<PaginatedItems<Recipe>> {
  const response = await apiFetch<ApiPaginatedRecipes>(
    `/api/recipes${buildRecipesQuery(filters, { limit, offset })}`,
  );

  return {
    items: applyFetchFilters(response.items.map(mapApiRecipe), filters),
    pagination: response.pagination,
  };
}

export async function fetchPublishedRecipesPage(
  filters: RecipeFetchFilters | undefined,
  offset = 0,
  limit = RECIPE_PAGE_SIZE,
  bypassCache = false,
  persistCache = true,
): Promise<PaginatedItems<Recipe>> {
  const filterKey = recipeCatalogFilterKey(filters ?? {});
  if (!bypassCache) {
    const cached = await loadCachedRecipePage(filterKey, offset);
    if (cached) {
      return { items: cached.items, pagination: cached.pagination };
    }
  }

  let page: PaginatedItems<Recipe>;

  if (isDirectSupabaseCatalogEnabled()) {
    try {
      page = await fetchPublishedRecipesPageFromSupabase(filters, offset, limit);
    } catch (error) {
      console.warn('[recipes] Supabase page read failed, falling back to API', error);
      page = await fetchPublishedRecipesPageFromApi(filters, offset, limit);
    }
  } else {
    page = await fetchPublishedRecipesPageFromApi(filters, offset, limit);
  }

  if (persistCache) {
    void saveCachedRecipePage(filterKey, offset, page.items, page.pagination);
  }
  return page;
}

export async function fetchPlanMenuRecipes(
  filters?: RecipeFetchFilters,
): Promise<Recipe[]> {
  const page = await fetchPublishedRecipesPage(filters, 0, PLAN_MENU_SIZE, true, false);
  return page.items.slice(0, PLAN_MENU_SIZE);
}

export async function fetchPublishedRecipes(filters?: RecipeFetchFilters): Promise<Recipe[]> {
  const all: Recipe[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const page = await fetchPublishedRecipesPage(filters, offset, RECIPE_PAGE_SIZE);
    all.push(...page.items);
    hasMore = page.pagination.hasMore;
    offset = page.pagination.nextOffset ?? offset + RECIPE_PAGE_SIZE;
  }

  return all;
}

export async function fetchRecipeById(id: string): Promise<Recipe> {
  if (isDirectSupabaseCatalogEnabled()) {
    try {
      return await fetchRecipeByIdFromSupabase(id);
    } catch (error) {
      console.warn('[recipes] Supabase read failed, falling back to API', error);
    }
  }

  const recipe = await apiFetch<ApiRecipe>(`/api/recipes/${id}`);
  return mapApiRecipe(recipe);
}
