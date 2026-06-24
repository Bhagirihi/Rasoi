import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';

import { useAppContext } from '@/context/AppContext';
import { useTonightRecipes } from '@/context/TonightRecipesContext';
import { useRecipes } from '@/context/RecipesContext';
import { getScheduledMealContext } from '@/utils/mealTime';
import {
  type FastFilter,
  type ToggleableFastFilter,
  filterRecipes,
  sortRecipesForTonight,
} from '@/utils/recipes';
import { dietChoiceToFilter } from '@/utils/storage';

export function useRecipeDiscovery() {
  const {
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    pantryIngredients,
    pantryFilterActive,
    setPantryFilterActive,
  } = useAppContext();
  const { recipes, loading: recipesLoading, error: recipesError, refreshRecipes, hasMore: recipesHasMore, loadingMore: recipesLoadingMore, loadMoreRecipes, totalCount: recipesTotalCount } = useRecipes();
  const { rankedRecipes: baseRankedRecipes, topPick: stableTopPick, alsoFor: stableAlsoFor, lateNightPick: stableLateNightPick, rankingReady } = useTonightRecipes();
  const [activeFilters, setActiveFilters] = useState<ToggleableFastFilter[]>([]);
  const meal = getScheduledMealContext();

  const hasDiscoveryFilters = activeFilters.length > 0 || pantryFilterActive;

  const filteredRecipes = useMemo(() => {
    if (!hasDiscoveryFilters) {
      return baseRankedRecipes;
    }

    return filterRecipes(recipes, {
      dietPreference: dietChoiceToFilter(dietChoice),
      regionalCuisine,
      favoriteCuisines,
      pantryIngredients,
      fastFilters: activeFilters,
      requirePantryMatch: pantryFilterActive,
      pantryMatchMode: pantryFilterActive ? 'any' : 'full',
    });
  }, [
    hasDiscoveryFilters,
    baseRankedRecipes,
    recipes,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    pantryIngredients,
    activeFilters,
    pantryFilterActive,
  ]);

  useEffect(() => {
    if (!pantryFilterActive || recipesLoading || recipes.length === 0) return;
    if (filteredRecipes.length > 0) return;
    setPantryFilterActive(false);
  }, [filteredRecipes.length, pantryFilterActive, recipes.length, recipesLoading, setPantryFilterActive]);

  const rankedRecipes = useMemo(() => {
    if (!hasDiscoveryFilters) {
      return baseRankedRecipes;
    }

    return sortRecipesForTonight(filteredRecipes, {
      regionalCuisine,
      pantryIngredients,
      mealSlot: meal.slot,
    });
  }, [
    hasDiscoveryFilters,
    baseRankedRecipes,
    filteredRecipes,
    regionalCuisine,
    pantryIngredients,
    meal.slot,
  ]);

  const topPick = hasDiscoveryFilters ? rankedRecipes[0] : stableTopPick;
  const tonightCards = hasDiscoveryFilters ? rankedRecipes.slice(1, 4) : stableAlsoFor;
  const lateNightPick = hasDiscoveryFilters ? undefined : stableLateNightPick;
  const moreRecipes = rankedRecipes.slice(4);
  const hasQuickFilters = activeFilters.length > 0 || pantryFilterActive;

  const handleFilterToggle = (filter: FastFilter) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (filter === 'all') {
      setActiveFilters([]);
      return;
    }
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((item) => item !== filter)
        : [...current, filter],
    );
  };

  return {
    meal,
    recipes,
    recipesLoading,
    recipesLoadingMore,
    recipesHasMore,
    recipesTotalCount,
    loadMoreRecipes,
    recipesError,
    rankingReady,
    refreshRecipes,
    activeFilters,
    filteredRecipes,
    rankedRecipes,
    topPick,
    tonightCards,
    lateNightPick,
    moreRecipes,
    hasQuickFilters,
    pantryFilterActive,
    setPantryFilterActive,
    pantryIngredients,
    dietChoice,
    regionalCuisine,
    handleFilterToggle,
  };
}
