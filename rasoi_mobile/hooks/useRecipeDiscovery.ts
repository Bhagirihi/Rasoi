import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';

import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
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
    allergyExclusions: effectiveAllergyExclusions,
  } = useAppContext();
  const { showDialog } = useAppDialog();
  const { recipes, loading: recipesLoading, error: recipesError, refreshRecipes, hasMore: recipesHasMore, loadingMore: recipesLoadingMore, loadMoreRecipes, totalCount: recipesTotalCount } = useRecipes();
  const { rankedRecipes: baseRankedRecipes, topPick: stableTopPick, alsoFor: stableAlsoFor, lateNightPick: stableLateNightPick, seasonalRail, rankingReady, picksRefreshing, refreshHomePicks } = useTonightRecipes();
  const [activeFilters, setActiveFilters] = useState<ToggleableFastFilter[]>([]);
  const meal = getScheduledMealContext();

  const hasDiscoveryFilters = activeFilters.length > 0 || pantryFilterActive;

  const filteredRecipes = useMemo(() => {
    if (!hasDiscoveryFilters) {
      return baseRankedRecipes;
    }

    return filterRecipes(recipes, {
      dietPreference: dietChoiceToFilter(dietChoice),
      dietChoice,
      regionalCuisine,
      favoriteCuisines,
      pantryIngredients,
      fastFilters: activeFilters,
      requirePantryMatch: pantryFilterActive,
      pantryMatchMode: pantryFilterActive ? 'any' : 'full',
      allergyExclusions: effectiveAllergyExclusions,
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
    effectiveAllergyExclusions,
  ]);

  useEffect(() => {
    if (!pantryFilterActive || recipesLoading || recipes.length === 0) return;
    if (filteredRecipes.length > 0) return;
    setPantryFilterActive(false);
    showDialog({
      title: 'No pantry matches',
      message: 'Nothing in your pantry matches right now. Showing all recipes instead.',
    });
  }, [filteredRecipes.length, pantryFilterActive, recipes.length, recipesLoading, setPantryFilterActive, showDialog]);

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
  const moreRecipes = rankedRecipes;
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
    picksRefreshing,
    refreshRecipes,
    refreshHomePicks,
    activeFilters,
    filteredRecipes,
    rankedRecipes,
    topPick,
    tonightCards,
    lateNightPick,
    seasonalRail,
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
