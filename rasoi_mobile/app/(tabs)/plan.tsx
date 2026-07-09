import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  ChefHat,
  Cookie,
  Moon,
  MoonStar,
  RefreshCw,
  Sun,
  Sunrise,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppTabHeader } from "@/components/AppTabHeader";
import OfflineBanner from "@/components/OfflineBanner";
import PlanDayPicker from "@/components/plan/PlanDayPicker";
import PlanDayToolbar from "@/components/plan/PlanDayToolbar";
import PlanPantryNudge from "@/components/plan/PlanPantryNudge";
import PlanRecipesLink from "@/components/plan/PlanRecipesLink";
import PlanSectionLabel from "@/components/plan/PlanSectionLabel";
import RecipeCard from "@/components/RecipeCard";
import RecipeListSkeleton from "@/components/RecipeListSkeleton";
import { ScrollViewWithFloatingIndicator } from "@/components/ScrollableScreen";
import {
  EmptyState,
  InsightBanner,
  PrimaryButton,
} from "@/components/ui/Primitives";
import { layout, scrollIndicator, spacing, colors } from "@/constants/theme";
import { testIds } from "@/constants/testIds";
import { useAppContext } from "@/context/AppContext";
import { useRecipes } from "@/context/RecipesContext";
import { useTheme } from "@/context/ThemeContext";
import type { Recipe } from "@/data/mockRecipes";
import type { MealSlot } from "@/utils/mealTime";
import {
  buildMenuForDate,
  buildPlanDayOptions,
  type PlanDayOffset,
} from "@/utils/planMenu";
import { ingredientKey } from "@/utils/recipeIngredients";
import {
  filterRecipes,
  getPantryMatchPercent,
  partitionIngredients,
} from "@/utils/recipes";
import { dietChoiceToFilter } from "@/utils/storage";

const PLAN_SLOTS: Array<{
  slot: MealSlot;
  label: string;
  Icon: typeof Sunrise;
  accent: string;
  accentDark: string;
}> = [
  {
    slot: "breakfast",
    label: "Breakfast",
    Icon: Sunrise,
    accent: "#FFF4E6",
    accentDark: "rgba(255, 153, 51, 0.18)",
  },
  {
    slot: "lunch",
    label: "Lunch",
    Icon: Sun,
    accent: "#FFF0EA",
    accentDark: "rgba(255, 107, 53, 0.18)",
  },
  {
    slot: "snack",
    label: "Snack",
    Icon: Cookie,
    accent: "#FFF9E6",
    accentDark: "rgba(244, 196, 48, 0.18)",
  },
  {
    slot: "dinner",
    label: "Dinner",
    Icon: Moon,
    accent: "#F3EDE8",
    accentDark: "rgba(26, 26, 46, 0.35)",
  },
  {
    slot: "lateNight",
    label: "Late night",
    Icon: MoonStar,
    accent: "#EFECFB",
    accentDark: "rgba(90, 79, 140, 0.22)",
  },
];

const SKELETON_COUNT = 5;

type PlanMenuEntry = (typeof PLAN_SLOTS)[number] & { recipe: Recipe };

function buildStyledMenu(
  eligibleRecipes: Recipe[],
  date: Date,
  shuffleSalt: number,
): PlanMenuEntry[] {
  const menu = buildMenuForDate(eligibleRecipes, date, shuffleSalt);
  return menu.map((entry) => {
    const slotMeta = PLAN_SLOTS.find((slot) => slot.slot === entry.slot)!;
    return { ...slotMeta, recipe: entry.recipe };
  });
}

export default function PlanScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors } = useTheme();
  const {
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    pantryIngredients,
    allergyExclusions,
    isRecipeSaved,
    toggleSavedRecipe,
  } = useAppContext();
  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
    refreshRecipes,
  } = useRecipes();

  const [selectedDayOffset, setSelectedDayOffset] = useState<PlanDayOffset>(0);
  const [shuffleSaltByOffset, setShuffleSaltByOffset] = useState<
    Record<PlanDayOffset, number>
  >({ 0: 0, 1: 0, 2: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const planDays = useMemo(() => buildPlanDayOptions(), []);
  const selectedDay =
    planDays.find((day) => day.offset === selectedDayOffset) ?? planDays[0];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshRecipes();
    } finally {
      setRefreshing(false);
    }
  }, [refreshRecipes]);

  const eligibleRecipes = useMemo(() => {
    if (recipes.length === 0) return [];
    return filterRecipes(recipes, {
      dietPreference: dietChoiceToFilter(dietChoice),
      dietChoice,
      regionalCuisine,
      favoriteCuisines,
      pantryIngredients: [],
      fastFilters: [],
      allergyExclusions,
    });
  }, [
    recipes,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    allergyExclusions,
  ]);

  const menu = useMemo(
    () =>
      buildStyledMenu(
        eligibleRecipes,
        selectedDay.date,
        shuffleSaltByOffset[selectedDayOffset],
      ),
    [eligibleRecipes, selectedDay.date, selectedDayOffset, shuffleSaltByOffset],
  );

  const dayStats = useMemo(() => {
    if (menu.length === 0) {
      return { avgPantryMatch: 0, readyCount: 0, missing: [] as string[] };
    }

    const matches = menu.map(({ recipe }) =>
      getPantryMatchPercent(recipe, pantryIngredients),
    );
    const missingMap = new Map<string, string>();

    menu.forEach(({ recipe }) => {
      partitionIngredients(recipe, pantryIngredients).missing.forEach(
        (name) => {
          const key = ingredientKey(name);
          if (key && !missingMap.has(key)) missingMap.set(key, name);
        },
      );
    });

    return {
      avgPantryMatch: Math.round(
        matches.reduce((sum, value) => sum + value, 0) / matches.length,
      ),
      readyCount: matches.filter((value) => value === 100).length,
      missing: Array.from(missingMap.values()),
    };
  }, [menu, pantryIngredients]);

  const unsavedMenuRecipes = useMemo(
    () => menu.filter(({ recipe }) => !isRecipeSaved(recipe.id)),
    [menu, isRecipeSaved],
  );

  const shuffleMenu = () => {
    void Haptics.selectionAsync();
    setShuffleSaltByOffset((current) => ({
      ...current,
      [selectedDayOffset]: current[selectedDayOffset] + 1,
    }));
  };

  const handleSaveAll = () => {
    if (unsavedMenuRecipes.length === 0) return;
    unsavedMenuRecipes.forEach(({ recipe }) => toggleSavedRecipe(recipe.id));
  };

  const openPantry = useCallback(() => {
    void Haptics.selectionAsync();
    router.push("/(tabs)/pantry");
  }, [router]);

  const showSkeleton = recipesLoading && menu.length === 0;
  const mealsSectionTitle =
    selectedDayOffset === 0
      ? "Today's meals"
      : selectedDayOffset === 1
        ? "Tomorrow's meals"
        : `${selectedDay.heading}'s meals`;

  const scrollBottomPadding = tabBarHeight + spacing.xxxl;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.cream }]}
      edges={["top"]}
      testID={testIds.screenPlan}
    >
      <OfflineBanner />
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.content,
          { paddingBottom: scrollBottomPadding },
        ]}
      >
        <AppTabHeader
          compact
          eyebrow="Meal plan"
          // title={selectedDay.heading}
          // subtitle={selectedDay.caption}
        />

        <PlanDayPicker
          days={planDays}
          selectedOffset={selectedDayOffset}
          onSelect={setSelectedDayOffset}
        />

        {!recipesLoading && recipesError && menu.length === 0 ? (
          <View style={styles.errorBlock}>
            <EmptyState
              icon={ChefHat}
              title="Could not load your menu"
              subtitle={recipesError}
            />
            <PrimaryButton
              label="Try again"
              icon={RefreshCw}
              onPress={() => void onRefresh()}
            />
          </View>
        ) : showSkeleton ? (
          <View style={styles.mealsBlock}>
            <PlanSectionLabel title={mealsSectionTitle} hint="Loading…" />
            <RecipeListSkeleton count={SKELETON_COUNT} />
          </View>
        ) : menu.length === 0 ? (
          <EmptyState
            icon={ChefHat}
            title="No recipes match yet"
            subtitle="Update your diet or cuisines in Settings to see a daily menu."
          />
        ) : (
          <>
            <PlanDayToolbar
              readyCount={dayStats.readyCount}
              totalMeals={menu.length}
              avgPantryMatch={dayStats.avgPantryMatch}
              unsavedCount={unsavedMenuRecipes.length}
              onShuffle={shuffleMenu}
              onSaveAll={handleSaveAll}
            />

            <PlanPantryNudge
              missingCount={dayStats.missing.length}
              missingPreview={dayStats.missing}
              onPress={openPantry}
            />

            <View style={styles.mealsBlock}>
              <PlanSectionLabel
                title={mealsSectionTitle}
                hint="Tap a card to open recipe"
              />
              <View style={styles.mealsList}>
                {menu.map(({ slot, label, recipe }) => (
                  <RecipeCard
                    key={slot}
                    recipe={recipe}
                    variant="list"
                    pickReason={label}
                    pantryMatchPercent={getPantryMatchPercent(
                      recipe,
                      pantryIngredients,
                    )}
                    onPantryPress={openPantry}
                  />
                ))}
              </View>
            </View>

            <View style={styles.exploreBlock}>
              <PlanSectionLabel title="Explore more" hint="Full catalog" />
              <PlanRecipesLink
                recipeCount={eligibleRecipes.length}
                onPress={() => router.push("/(tabs)/recipes")}
              />
            </View>
          </>
        )}
      </ScrollViewWithFloatingIndicator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  errorBlock: {
    gap: spacing.md,
  },
  mealsBlock: {
    gap: spacing.sm,
  },
  mealsList: {
    gap: spacing.lg,
  },
  exploreBlock: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
