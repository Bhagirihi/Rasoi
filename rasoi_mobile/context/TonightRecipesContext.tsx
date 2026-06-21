import React, {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { InteractionManager } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { useRecipes } from '@/context/RecipesContext';
import type { Recipe } from '@/data/mockRecipes';
import { getMealContext } from '@/utils/mealTime';
import { countFullyStockedRecipes, filterRecipes, sortRecipesForTonight } from '@/utils/recipes';
import { dietChoiceToFilter } from '@/utils/storage';

type TonightRecipesContextValue = {
  rankedRecipes: Recipe[];
  topPick: Recipe | undefined;
  alsoFor: Recipe[];
  readyToCookCount: number;
  readyToCookReady: boolean;
  /** False while tonight picks are still being ranked after the recipe list loads. */
  rankingReady: boolean;
};

const TonightRecipesContext = createContext<TonightRecipesContextValue | undefined>(undefined);

export function TonightRecipesProvider({ children }: { children: ReactNode }) {
  const { dietChoice, regionalCuisine, favoriteCuisines, pantryIngredients } = useAppContext();
  const { recipes, loading: recipesLoading } = useRecipes();
  const meal = getMealContext();
  const deferredPantryIngredients = useDeferredValue(pantryIngredients);
  const [rankedRecipes, setRankedRecipes] = useState<Recipe[]>([]);
  const [rankingReady, setRankingReady] = useState(false);

  useEffect(() => {
    if (recipesLoading) {
      setRankingReady(false);
      return;
    }

    if (recipes.length === 0) {
      setRankedRecipes([]);
      setRankingReady(true);
      return;
    }

    setRankingReady(false);

    const task = InteractionManager.runAfterInteractions(() => {
      const filtered = filterRecipes(recipes, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        favoriteCuisines,
        pantryIngredients: deferredPantryIngredients,
        fastFilters: [],
      });

      setRankedRecipes(
        sortRecipesForTonight(filtered, {
          regionalCuisine,
          pantryIngredients: deferredPantryIngredients,
          mealSlot: meal.slot,
        }),
      );
      setRankingReady(true);
    });

    return () => task.cancel();
  }, [
    recipes,
    recipesLoading,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    deferredPantryIngredients,
    meal.slot,
  ]);

  const topPick = rankedRecipes[0];
  const alsoFor = rankedRecipes.slice(1, 4);

  const [readyToCookCount, setReadyToCookCount] = useState(0);
  const [readyToCookReady, setReadyToCookReady] = useState(false);

  useEffect(() => {
    setReadyToCookReady(false);

    if (recipes.length === 0 || pantryIngredients.length === 0) {
      setReadyToCookCount(0);
      setReadyToCookReady(true);
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      const count = countFullyStockedRecipes(recipes, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        pantryIngredients,
      });
      setReadyToCookCount(count);
      setReadyToCookReady(true);
    });

    return () => task.cancel();
  }, [recipes, dietChoice, regionalCuisine, pantryIngredients]);

  const value = useMemo<TonightRecipesContextValue>(
    () => ({
      rankedRecipes,
      topPick,
      alsoFor,
      readyToCookCount,
      readyToCookReady,
      rankingReady,
    }),
    [rankedRecipes, topPick, alsoFor, readyToCookCount, readyToCookReady, rankingReady],
  );

  return <TonightRecipesContext.Provider value={value}>{children}</TonightRecipesContext.Provider>;
}

export function useTonightRecipes(): TonightRecipesContextValue {
  const context = useContext(TonightRecipesContext);
  if (!context) {
    throw new Error('useTonightRecipes must be used within TonightRecipesProvider');
  }
  return context;
}
