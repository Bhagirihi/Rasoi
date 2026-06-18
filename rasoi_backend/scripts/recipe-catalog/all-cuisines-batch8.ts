import { buildAllBatch8Recipes } from './batch8-shared';
import type { RecipeCatalogEntry } from './types';

export const ALL_CUISINES_BATCH8_RECIPES: RecipeCatalogEntry[] = buildAllBatch8Recipes();
export const BATCH8_RECIPE_COUNT = ALL_CUISINES_BATCH8_RECIPES.length;
