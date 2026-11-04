import { useEffect, useMemo, useState } from 'react';
import { runAfterInteractions } from '@/utils/runAfterInteractions';

import { useAppContext } from '@/context/AppContext';
import { useReferenceData } from '@/context/ReferenceContext';
import { useTonightRecipes } from '@/context/TonightRecipesContext';
import { useRecipes } from '@/context/RecipesContext';
import type { Recipe } from '@/data/mockRecipes';
import {
  buildPantryRecipeSection,
  collectPantryHomeRecipes,
  countStockedPantryItems,
  getMissingPantryLabels,
  getPantryEssentialSections,
} from '@/utils/pantryCatalog';
import {
  collectPlanMenuRecipes,
  collectPlanMenuRecipesByDay,
  type PlanDayOffset,
} from '@/utils/planMenu';
import { filterRecipes } from '@/utils/recipes';
import { dietChoiceToFilter } from '@/utils/storage';

export type PantryPlanDaySection = {
  offset: PlanDayOffset;
  heading: string;
  section: NonNullable<ReturnType<typeof buildPantryRecipeSection>>;
};

const DEFAULT_SHUFFLE = { 0: 0, 1: 0, 2: 0 } as const;

export function usePantryScreenData() {
  const {
    pantryIngredients,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    effectiveAllergyExclusions,
  } = useAppContext();
  const { kitchenStyles } = useReferenceData();
  const { recipes } = useRecipes();
  const { topPick, alsoFor, lateNightPick, readyToCookCount } = useTonightRecipes();

  const homeRecipes = useMemo(
    () =>
      collectPantryHomeRecipes({
        topPick,
        alsoFor,
        lateNightPick,
      }),
    [topPick, alsoFor, lateNightPick],
  );

  const homeRecipeIds = useMemo(
    () => homeRecipes.map((recipe) => recipe.id),
    [homeRecipes],
  );

  const eligiblePlanRecipes = useMemo(() => {
    if (recipes.length === 0) return [];
    return filterRecipes(recipes, {
      dietPreference: dietChoiceToFilter(dietChoice),
      dietChoice,
      regionalCuisine,
      favoriteCuisines,
      pantryIngredients: [],
      fastFilters: [],
      allergyExclusions: effectiveAllergyExclusions,
    });
  }, [recipes, dietChoice, regionalCuisine, favoriteCuisines, effectiveAllergyExclusions]);

  const [planRecipes, setPlanRecipes] = useState<Recipe[]>([]);
  const [planDaySections, setPlanDaySections] = useState<PantryPlanDaySection[]>([]);

  useEffect(() => {
    if (eligiblePlanRecipes.length === 0) {
      setPlanRecipes([]);
      setPlanDaySections([]);
      return;
    }

    let cancelled = false;
    const task = runAfterInteractions(() => {
      const collected = collectPlanMenuRecipes(
        eligiblePlanRecipes,
        DEFAULT_SHUFFLE,
        homeRecipeIds,
      );
      const sections = collectPlanMenuRecipesByDay(
        eligiblePlanRecipes,
        DEFAULT_SHUFFLE,
        homeRecipeIds,
      )
        .map((day) => {
          const section = buildPantryRecipeSection(
            day.recipes,
            day.heading,
            `${day.recipes.length} meal${day.recipes.length === 1 ? '' : 's'} · ${day.caption}`,
          );
          return section ? { offset: day.offset, heading: day.heading, section } : null;
        })
        .filter((entry): entry is PantryPlanDaySection => entry !== null);

      if (!cancelled) {
        setPlanRecipes(collected);
        setPlanDaySections(sections);
      }
    });

    return () => {
      cancelled = true;
      task.cancel();
    };
  }, [eligiblePlanRecipes, homeRecipeIds]);

  const { preferenceSummary } = useMemo(
    () =>
      getPantryEssentialSections({
        dietChoice,
        favoriteCuisines,
        kitchenStyles,
      }),
    [dietChoice, favoriteCuisines, kitchenStyles],
  );

  const homeSection = useMemo(
    () =>
      buildPantryRecipeSection(
        homeRecipes,
        'From home picks',
        topPick ? `Tonight's ${topPick.title}` : 'Open Home to see picks',
      ),
    [homeRecipes, topPick],
  );

  const contextRecipes = useMemo(() => {
    const seen = new Set<string>();
    return [...homeRecipes, ...planRecipes].filter((recipe) => {
      if (seen.has(recipe.id)) return false;
      seen.add(recipe.id);
      return true;
    });
  }, [homeRecipes, planRecipes]);

  const stockStats = useMemo(() => {
    const personalItems = [
      ...(homeSection?.items ?? []),
      ...planDaySections.flatMap((entry) => entry.section.items),
    ];
    return countStockedPantryItems([], personalItems, pantryIngredients);
  }, [homeSection, planDaySections, pantryIngredients]);

  const restockItems = useMemo(
    () => getMissingPantryLabels(contextRecipes, pantryIngredients),
    [contextRecipes, pantryIngredients],
  );

  return {
    homeSection,
    planDaySections,
    stockStats,
    restockItems,
    matchCount: readyToCookCount,
    contextRecipes,
    preferenceSummary,
  };
}


