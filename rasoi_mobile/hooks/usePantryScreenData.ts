import { useMemo } from 'react';

import { useAppContext } from '@/context/AppContext';
import { useTonightRecipes } from '@/context/TonightRecipesContext';
import { useRecipes } from '@/context/RecipesContext';
import { getMealContext } from '@/utils/mealTime';
import {
  buildPersonalPantrySection,
  collectPantryContextRecipes,
  countStockedPantryItems,
  getMissingPantryLabels,
  getPantryEssentialSections,
} from '@/utils/pantryCatalog';

export function usePantryScreenData() {
  const meal = getMealContext();
  const { pantryIngredients, savedRecipeIds } = useAppContext();
  const { recipes } = useRecipes();
  const { topPick, alsoFor, readyToCookCount } = useTonightRecipes();

  const savedRecipes = useMemo(
    () => recipes.filter((recipe) => savedRecipeIds.includes(recipe.id)),
    [recipes, savedRecipeIds],
  );

  const contextRecipes = useMemo(
    () =>
      collectPantryContextRecipes({
        topPick,
        alsoFor,
        saved: savedRecipes,
      }),
    [topPick, alsoFor, savedRecipes],
  );

  const essentialSections = useMemo(() => getPantryEssentialSections(), []);

  const personalSection = useMemo(
    () => buildPersonalPantrySection(contextRecipes, meal, savedRecipes.length),
    [contextRecipes, meal, savedRecipes.length],
  );

  const stockStats = useMemo(
    () =>
      countStockedPantryItems(
        essentialSections,
        personalSection?.items ?? [],
        pantryIngredients,
      ),
    [essentialSections, personalSection, pantryIngredients],
  );

  const restockItems = useMemo(
    () => getMissingPantryLabels(contextRecipes, pantryIngredients),
    [contextRecipes, pantryIngredients],
  );

  return {
    meal,
    essentialSections,
    personalSection,
    stockStats,
    restockItems,
    matchCount: readyToCookCount,
    contextRecipes,
  };
}
