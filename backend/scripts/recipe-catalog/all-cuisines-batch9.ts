import { buildAllBatch9Recipes } from './batch9-shared';
import { BATCH9_CATEGORY_IDS, BATCH9_RECIPES_PER_CATEGORY } from './batch9-dish-pools';
import type { RecipeCatalogEntry } from './types';

export const ALL_CUISINES_BATCH9_RECIPES: RecipeCatalogEntry[] = buildAllBatch9Recipes();
export const BATCH9_RECIPE_COUNT = ALL_CUISINES_BATCH9_RECIPES.length;
export const BATCH9_CATEGORY_COUNT = BATCH9_CATEGORY_IDS.length;
export const BATCH9_RECIPES_PER_CATEGORY_EXPORT = BATCH9_RECIPES_PER_CATEGORY;
