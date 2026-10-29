import type { Recipe } from '@/data/mockRecipes';

const SPICY_KEYWORDS = /\b(mirch|chilli|chili|masala|spicy|teekha|laal)\b/i;

export function isKidsFriendlyRecipe(recipe: Recipe): boolean {
  const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
  if (tags.includes('kids')) return true;

  const nonStapleCount = recipe.ingredients.filter((item) => !item.isStaple).length;
  const ingredientText = recipe.ingredients.map((item) => item.name).join(' ');
  const stepsText = (recipe.steps ?? []).join(' ');

  return (
    recipe.difficulty === 'Easy' &&
    recipe.prepTime <= 25 &&
    nonStapleCount <= 8 &&
    !SPICY_KEYWORDS.test(ingredientText) &&
    !SPICY_KEYWORDS.test(stepsText) &&
    !SPICY_KEYWORDS.test(recipe.title)
  );
}

export function isBudgetFriendlyRecipe(recipe: Recipe): boolean {
  const nonStapleCount = recipe.ingredients.filter((item) => !item.isStaple).length;
  return recipe.prepTime <= 20 && nonStapleCount <= 8;
}

export function isSmallPortionRecipe(recipe: Recipe): boolean {
  const nonStapleCount = recipe.ingredients.filter((item) => !item.isStaple).length;
  return nonStapleCount <= 10 && recipe.prepTime <= 30 && recipe.calories <= 450;
}
