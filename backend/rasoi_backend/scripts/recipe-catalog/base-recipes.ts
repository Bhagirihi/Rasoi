import { KITCHEN_STYLE_RECIPES } from '../../prisma/kitchen-style-recipes';

import type { RecipeCatalogEntry } from './types';

function titleToImageKeyword(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Original 150 seed recipes (01-10 per cuisine) with dish-matched image keywords. */
export const BASE_RECIPES: RecipeCatalogEntry[] = KITCHEN_STYLE_RECIPES.map((recipe) => ({
  id: recipe.id,
  kitchenStyleId: recipe.kitchenStyleId,
  kitchenStyleIds: [recipe.kitchenStyleId],
  title: recipe.title,
  prepTime: recipe.prepTime,
  calories: recipe.calories,
  region: recipe.region,
  dietType: recipe.dietType,
  difficulty: recipe.difficulty,
  description: recipe.description,
  imageKeyword: titleToImageKeyword(recipe.title),
  tags: recipe.tags,
  ingredients: recipe.ingredients,
  steps: recipe.steps,
}));
