import type { DietType, Recipe } from '@/data/mockRecipes';
import { apiFetch } from '@/utils/api';
import { normalizeRecipeIngredients } from '@/utils/recipeIngredients';

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

export type RecipeFetchFilters = {
  region?: string;
  dietChoice?: string;
  dietType?: DietType;
  tag?: string;
};

function mapRecipe(recipe: ApiRecipe): Recipe {
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

export async function fetchPublishedRecipes(filters?: RecipeFetchFilters): Promise<Recipe[]> {
  const recipes = await apiFetch<ApiRecipe[]>(`/api/recipes${buildRecipesQuery(filters)}`);
  return recipes.map(mapRecipe);
}

export async function fetchRecipeById(id: string): Promise<Recipe> {
  const recipe = await apiFetch<ApiRecipe>(`/api/recipes/${id}`);
  return mapRecipe(recipe);
}
