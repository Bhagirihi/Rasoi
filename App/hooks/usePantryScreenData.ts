import { useEffect, useMemo, useState, useDeferredValue } from 'react';
import { InteractionManager } from 'react-native';

import { getPantrySetupStapleLabels } from '@/constants/pantryEssentials';
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
  takeUnclaimedPantryItems,
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
    pendingPantrySetup,
  } = useAppContext();
  const deferredPantryIngredients = useDeferredValue(pantryIngredients);
  const { kitchenStyles } = useReferenceData();
  const { recipes } = useRecipes();
  const { topPick, alsoFor, lateNightPick, readyToCookCount } = useTonightRecipes();

  const setupStaples = useMemo(
    () => (pendingPantrySetup ? getPantrySetupStapleLabels(dietChoice) : []),
    [pendingPantrySetup, dietChoice],
  );

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
    const task = InteractionManager.runAfterInteractions(() => {
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

  // Screen order: staples → plan days → home. Claim each ingredient once.
  const { visibleSetupStaples, visiblePlanDaySections, visibleHomeSection } = useMemo(() => {
    const claimedKeys = new Set<string>();
    const visibleSetupStaples = takeUnclaimedPantryItems(setupStaples, claimedKeys);

    const visiblePlanDaySections: PantryPlanDaySection[] = [];
    for (const entry of planDaySections) {
      const items = takeUnclaimedPantryItems(entry.section.items, claimedKeys);
      if (items.length === 0) continue;
      visiblePlanDaySections.push({
        ...entry,
        section: { ...entry.section, items },
      });
    }

    const homeItems = homeSection
      ? takeUnclaimedPantryItems(homeSection.items, claimedKeys)
      : [];
    const visibleHomeSection =
      homeSection && homeItems.length > 0
        ? { ...homeSection, items: homeItems }
        : null;

    return { visibleSetupStaples, visiblePlanDaySections, visibleHomeSection };
  }, [setupStaples, planDaySections, homeSection]);

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
      ...visibleSetupStaples,
      ...visiblePlanDaySections.flatMap((entry) => entry.section.items),
      ...(visibleHomeSection?.items ?? []),
    ];
    return countStockedPantryItems([], personalItems, deferredPantryIngredients);
  }, [visibleSetupStaples, visiblePlanDaySections, visibleHomeSection, deferredPantryIngredients]);

  const restockItems = useMemo(
    () => getMissingPantryLabels(contextRecipes, deferredPantryIngredients),
    [contextRecipes, deferredPantryIngredients],
  );

  return {
    homeSection: visibleHomeSection,
    planDaySections: visiblePlanDaySections,
    setupStaples: visibleSetupStaples,
    stockStats,
    restockItems,
    matchCount: readyToCookCount,
    contextRecipes,
    preferenceSummary,
  };
}
