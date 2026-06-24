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
import { buildHomePicksProfileKey, resolveHomeMealPicks } from '@/utils/homeMealPicks';
import { getScheduledMealWindow } from '@/utils/mealTime';
import { countFullyStockedRecipes, filterRecipes, sortRecipesForTonight } from '@/utils/recipes';
import { dietChoiceToFilter } from '@/utils/storage';

type TonightRecipesContextValue = {
  rankedRecipes: Recipe[];
  topPick: Recipe | undefined;
  alsoFor: Recipe[];
  lateNightPick: Recipe | undefined;
  readyToCookCount: number;
  readyToCookReady: boolean;
  /** False while the recipe list is still loading from the network. */
  rankingReady: boolean;
};

const TonightRecipesContext = createContext<TonightRecipesContextValue | undefined>(undefined);

/** Max recipes scanned for pantry match counts — avoids O(n) work on huge catalogs. */
const READY_TO_COOK_SCAN_LIMIT = 300;
const HOME_PICK_COUNT = 4;

export function TonightRecipesProvider({ children }: { children: ReactNode }) {
  const { dietChoice, regionalCuisine, favoriteCuisines, pantryIngredients, userId } =
    useAppContext();
  const { recipes, loading: recipesLoading } = useRecipes();
  const mealWindow = getScheduledMealWindow();
  const deferredPantryIngredients = useDeferredValue(pantryIngredients);
  const deferredRecipes = useDeferredValue(recipes);

  const profileKey = useMemo(
    () =>
      buildHomePicksProfileKey({
        dietChoice,
        regionalCuisine,
        favoriteCuisines,
        userId,
      }),
    [dietChoice, regionalCuisine, favoriteCuisines, userId],
  );

  const pickPool = useMemo(() => {
    if (recipesLoading || deferredRecipes.length === 0) {
      return [];
    }

    return filterRecipes(deferredRecipes, {
      dietPreference: dietChoiceToFilter(dietChoice),
      regionalCuisine,
      favoriteCuisines,
      pantryIngredients: [],
      fastFilters: [],
    });
  }, [deferredRecipes, recipesLoading, dietChoice, regionalCuisine, favoriteCuisines]);

  const rankedRecipes = useMemo(() => {
    if (pickPool.length === 0) {
      return [];
    }

    return sortRecipesForTonight(
      filterRecipes(pickPool, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        favoriteCuisines,
        pantryIngredients: deferredPantryIngredients,
        fastFilters: [],
      }),
      {
        regionalCuisine,
        pantryIngredients: deferredPantryIngredients,
        mealSlot: mealWindow.slot,
      },
    );
  }, [
    pickPool,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    deferredPantryIngredients,
    mealWindow.slot,
  ]);

  const [homePicks, setHomePicks] = useState<Recipe[]>([]);
  const [lateNightPick, setLateNightPick] = useState<Recipe | undefined>();
  const [homePicksReady, setHomePicksReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setHomePicksReady(false);

    if (recipesLoading || pickPool.length === 0) {
      setHomePicks([]);
      setLateNightPick(undefined);
      return () => {
        cancelled = true;
      };
    }

    const loadPicks = async () => {
      if (mealWindow.isOvernightDual && mealWindow.tomorrowBreakfastWindowKey) {
        const latePicks = await resolveHomeMealPicks({
          recipes: pickPool,
          windowKey: mealWindow.windowKey,
          profileKey,
          mealSlot: 'lateNight',
          count: 1,
        });
        const late = latePicks[0];
        const tomorrowPicks = await resolveHomeMealPicks({
          recipes: pickPool,
          windowKey: mealWindow.tomorrowBreakfastWindowKey,
          profileKey,
          mealSlot: 'breakfast',
          count: HOME_PICK_COUNT,
          excludeRecipeIds: late ? [late.id] : undefined,
        });
        const tomorrowFinal = late
          ? tomorrowPicks.filter((recipe) => recipe.id !== late.id)
          : tomorrowPicks;
        if (cancelled) return;
        setLateNightPick(late);
        setHomePicks(tomorrowFinal);
        setHomePicksReady(Boolean(late) && tomorrowFinal.length > 0);
        return;
      }

      const picks = await resolveHomeMealPicks({
        recipes: pickPool,
        windowKey: mealWindow.windowKey,
        profileKey,
        mealSlot: mealWindow.slot,
        count: HOME_PICK_COUNT,
      });
      if (cancelled) return;
      setLateNightPick(undefined);
      setHomePicks(picks);
      setHomePicksReady(picks.length > 0);
    };

    void loadPicks();

    return () => {
      cancelled = true;
    };
  }, [
    pickPool.length,
    mealWindow.windowKey,
    mealWindow.tomorrowBreakfastWindowKey,
    mealWindow.slot,
    mealWindow.isOvernightDual,
    profileKey,
    recipesLoading,
  ]);

  const topPick = homePicks[0];
  const alsoFor = homePicks.slice(1, HOME_PICK_COUNT);
  const rankingReady = !recipesLoading && homePicksReady;

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
      const scanPool = recipes.slice(0, READY_TO_COOK_SCAN_LIMIT);
      const count = countFullyStockedRecipes(scanPool, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        pantryIngredients,
      });
      setReadyToCookCount(count);
      setReadyToCookReady(true);
    });

    return () => task.cancel();
  }, [recipes.length, dietChoice, regionalCuisine, pantryIngredients]);

  const value = useMemo<TonightRecipesContextValue>(
    () => ({
      rankedRecipes,
      topPick,
      alsoFor,
      lateNightPick,
      readyToCookCount,
      readyToCookReady,
      rankingReady,
    }),
    [rankedRecipes, topPick, alsoFor, lateNightPick, readyToCookCount, readyToCookReady, rankingReady],
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
