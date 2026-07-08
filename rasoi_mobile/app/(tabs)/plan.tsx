import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Bookmark,
  CheckCircle2,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cookie,
  Moon,
  MoonStar,
  RefreshCw,
  ShoppingBag,
  Sun,
  Sunrise,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AffiliateCheckoutModal from "@/components/AffiliateCheckoutModal";
import { AppTabHeader } from "@/components/AppTabHeader";
import OfflineBanner from "@/components/OfflineBanner";
import { ScrollViewWithFloatingIndicator } from "@/components/ScrollableScreen";
import {
  EmptyState,
  InsightBanner,
  PrimaryButton,
} from "@/components/ui/Primitives";
import { useDismissOnBlur } from "@/hooks/useDismissOnBlur";
import { appFonts } from "@/constants/fonts";
import {
  layout,
  radius,
  scrollIndicator,
  shadows,
  spacing,
  colors,
} from "@/constants/theme";
import { testIds } from "@/constants/testIds";
import { useAppContext } from "@/context/AppContext";
import { useRecipes } from "@/context/RecipesContext";
import { useTheme } from "@/context/ThemeContext";
import type { Recipe } from "@/data/mockRecipes";
import { scoreRecipeForMealSlot, type MealSlot } from "@/utils/mealTime";
import { resolveCanonicalLabel } from "@/utils/pantryCanonical";
import { ingredientKey } from "@/utils/recipeIngredients";
import {
  filterRecipes,
  getPantryMatchPercent,
  partitionIngredients,
} from "@/utils/recipes";
import { PAYWALL_HREF } from "@/utils/routes";
import { dietChoiceToFilter } from "@/utils/storage";

type PlanMealSlot = MealSlot;

const PLAN_SLOTS: Array<{
  slot: PlanMealSlot;
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

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_INGREDIENT_CHIPS = 12;

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function dayKey(date: Date): number {
  return Math.floor(date.getTime() / DAY_MS);
}

function formatDateHeading(date: Date): string {
  const today = startOfToday();
  const diffDays = Math.round((date.getTime() - today.getTime()) / DAY_MS);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long" });
}

function formatDateCaption(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function pickForSlot(
  pool: Recipe[],
  slot: MealSlot,
  seed: number,
): Recipe | null {
  if (pool.length === 0) return null;
  const ranked = [...pool].sort(
    (a, b) => scoreRecipeForMealSlot(b, slot) - scoreRecipeForMealSlot(a, slot),
  );
  const topCount = Math.min(5, ranked.length);
  return ranked[seed % topCount] ?? ranked[0];
}

function chipLabel(name: string): string {
  return resolveCanonicalLabel(name) ?? name.trim();
}

type PlanMealCardProps = {
  label: string;
  Icon: typeof Sunrise;
  accent: string;
  accentDark: string;
  recipe: Recipe;
  saved: boolean;
  pantryMatch: number;
  isDark: boolean;
  onOpen: () => void;
  onSave: () => void;
};

function PlanMealCard({
  label,
  Icon,
  accent,
  accentDark,
  recipe,
  saved,
  pantryMatch,
  isDark,
  onOpen,
  onSave,
}: PlanMealCardProps) {
  const { colors: themeColors } = useTheme();
  const slotBg = isDark ? accentDark : accent;

  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${recipe.title}. ${pantryMatch}% pantry match. ${recipe.prepTime} minutes.`}
      style={({ pressed }) => [
        styles.mealCard,
        shadows.card,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View style={[styles.mealSlotRail, { backgroundColor: slotBg }]}>
        <View style={[styles.mealSlotIconWrap, { backgroundColor: themeColors.white }]}>
          <Icon size={16} color={colors.primary} strokeWidth={2.2} />
        </View>
      </View>

      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.mealImage} />
      ) : (
        <View
          style={[
            styles.mealImage,
            styles.mealImageFallback,
            { backgroundColor: themeColors.cream },
          ]}
        >
          <ChefHat size={20} color={themeColors.muted} />
        </View>
      )}

      <View style={styles.mealBody}>
        <Text style={[styles.mealSlot, { color: themeColors.muted }]}>
          {label}
        </Text>
        <Text
          style={[styles.mealTitle, { color: themeColors.charcoal }]}
          numberOfLines={2}
        >
          {recipe.title}
        </Text>
        <View style={styles.mealMetaRow}>
          <Clock size={12} color={themeColors.muted} />
          <Text style={[styles.mealMeta, { color: themeColors.muted }]}>
            {recipe.prepTime} min · {recipe.region}
          </Text>
        </View>
        <View style={styles.mealPillRow}>
          <View style={[styles.matchPill, { backgroundColor: slotBg }]}>
            <Text style={styles.matchPillText}>{pantryMatch}% pantry match</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          onSave();
        }}
        hitSlop={12}
        style={styles.bookmarkBtn}
        accessibilityRole="button"
        accessibilityLabel={saved ? "Remove from saved" : "Save recipe"}
      >
        <Bookmark
          size={18}
          color={saved ? colors.primary : themeColors.muted}
          fill={saved ? colors.primary : "transparent"}
        />
      </Pressable>
    </Pressable>
  );
}

export default function PlanScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors, isDark } = useTheme();
  const {
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    pantryIngredients,
    allergyExclusions,
    showPartners,
    isRecipeSaved,
    toggleSavedRecipe,
  } = useAppContext();
  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
    refreshRecipes,
  } = useRecipes();

  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfToday());
  const [shuffleSalt, setShuffleSalt] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useDismissOnBlur(useCallback(() => setModalVisible(false), []));

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

  const menu = useMemo(() => {
    if (eligibleRecipes.length === 0) {
      return [] as Array<{
        slot: PlanMealSlot;
        label: string;
        Icon: typeof Sunrise;
        accent: string;
        accentDark: string;
        recipe: Recipe;
      }>;
    }
    const seed = dayKey(selectedDate) + shuffleSalt * 13;
    const used = new Set<string>();
    const result: Array<{
      slot: PlanMealSlot;
      label: string;
      Icon: typeof Sunrise;
      accent: string;
      accentDark: string;
      recipe: Recipe;
    }> = [];

    PLAN_SLOTS.forEach((entry, index) => {
      const available = eligibleRecipes.filter(
        (recipe) => !used.has(recipe.id),
      );
      const pool = available.length > 0 ? available : eligibleRecipes;
      const recipe = pickForSlot(pool, entry.slot, seed + index * 7);
      if (recipe) {
        used.add(recipe.id);
        result.push({ ...entry, recipe });
      }
    });

    return result;
  }, [eligibleRecipes, selectedDate, shuffleSalt]);

  const { needToBuy, haveAtHome } = useMemo(() => {
    const missingMap = new Map<string, string>();
    const haveMap = new Map<string, string>();

    menu.forEach(({ recipe }) => {
      const { available, missing } = partitionIngredients(
        recipe,
        pantryIngredients,
      );
      missing.forEach((name) => {
        const label = chipLabel(name);
        const key = ingredientKey(label);
        if (key && !missingMap.has(key)) missingMap.set(key, label);
      });
      available.forEach((name) => {
        const label = chipLabel(name);
        const key = ingredientKey(label);
        if (key && !haveMap.has(key)) haveMap.set(key, label);
      });
    });

    for (const key of missingMap.keys()) haveMap.delete(key);

    return {
      needToBuy: Array.from(missingMap.values()),
      haveAtHome: Array.from(haveMap.values()),
    };
  }, [menu, pantryIngredients]);

  const pantryCoverage = useMemo(() => {
    const total = needToBuy.length + haveAtHome.length;
    if (total === 0) return 100;
    return Math.round((haveAtHome.length / total) * 100);
  }, [needToBuy.length, haveAtHome.length]);

  const goToDate = (deltaDays: number) => {
    void Haptics.selectionAsync();
    setSelectedDate(
      (current) => new Date(current.getTime() + deltaDays * DAY_MS),
    );
  };

  const jumpToToday = () => {
    void Haptics.selectionAsync();
    setSelectedDate(startOfToday());
  };

  const shuffleMenu = () => {
    void Haptics.selectionAsync();
    setShuffleSalt((value) => value + 1);
  };

  const handleOrderMissing = () => {
    if (needToBuy.length === 0) return;
    void Haptics.selectionAsync();
    if (!showPartners) {
      router.push(PAYWALL_HREF);
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setModalVisible(true);
  };

  const unsavedMenuRecipes = useMemo(
    () => menu.filter(({ recipe }) => !isRecipeSaved(recipe.id)),
    [menu, isRecipeSaved],
  );

  const handleSaveAll = () => {
    if (unsavedMenuRecipes.length === 0) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    unsavedMenuRecipes.forEach(({ recipe }) => toggleSavedRecipe(recipe.id));
  };

  const handleSaveRecipe = (recipeId: string) => {
    void Haptics.selectionAsync();
    toggleSavedRecipe(recipeId);
  };

  const scrollBottomPadding = tabBarHeight + spacing.xxxl;
  const isToday = dayKey(selectedDate) === dayKey(startOfToday());
  const dateGradient = isDark
    ? (["rgba(255,107,53,0.28)", "rgba(255,153,51,0.12)"] as const)
    : (["#FFE8DC", "#FFF8F4"] as const);

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
        <View style={styles.screenSections}>
          <AppTabHeader
            eyebrow="Daily menus"
            title="Your day, sorted"
          />

          <LinearGradient
            colors={dateGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.dateHero,
              shadows.card,
              { borderColor: themeColors.border },
            ]}
          >
            <View style={styles.dateHeroTop}>
              <Pressable
                onPress={() => goToDate(-1)}
                style={[
                  styles.dateNavBtn,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.border,
                  },
                ]}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Previous day"
              >
                <ChevronLeft
                  size={18}
                  color={themeColors.charcoal}
                  strokeWidth={2.2}
                />
              </Pressable>

              <View style={styles.dateCopy}>
                <Text
                  style={[styles.dateLine, { color: themeColors.charcoal }]}
                  numberOfLines={1}
                >
                  {formatDateHeading(selectedDate)} · {formatDateCaption(selectedDate)}
                </Text>
                {!isToday ? (
                  <Pressable
                    onPress={jumpToToday}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Jump to today"
                  >
                    <Text style={styles.todayLink}>Back to today</Text>
                  </Pressable>
                ) : null}
              </View>

              <Pressable
                onPress={() => goToDate(1)}
                style={[
                  styles.dateNavBtn,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.border,
                  },
                ]}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Next day"
              >
                <ChevronRight
                  size={18}
                  color={themeColors.charcoal}
                  strokeWidth={2.2}
                />
              </Pressable>
            </View>
          </LinearGradient>
        </View>

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
        ) : recipesLoading && menu.length === 0 ? (
          <InsightBanner
            title="Building your menu…"
            subtitle="Matching recipes to your preferences."
          />
        ) : menu.length === 0 ? (
          <EmptyState
            icon={ChefHat}
            title="No recipes match yet"
            subtitle="Update your diet or cuisines in Settings, or add staples in the Pantry tab to see a daily menu."
          />
        ) : (
          <>
            {needToBuy.length > 0 ? (
              <InsightBanner
                title={`${needToBuy.length} ingredients missing for this menu`}
                subtitle="Order everything in one tap on Blinkit, Zepto, or Instamart."
              />
            ) : null}

            <View style={styles.section}>
              <View style={styles.sectionActions}>
                <Pressable
                  onPress={shuffleMenu}
                  hitSlop={14}
                  style={[
                    styles.iconAction,
                    {
                      backgroundColor: themeColors.white,
                      borderColor: themeColors.border,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Shuffle all meals for this day"
                >
                  <RefreshCw size={16} color={colors.primary} />
                </Pressable>
                {unsavedMenuRecipes.length > 0 ? (
                  <Pressable
                    onPress={handleSaveAll}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Save all meals to your saved recipes"
                  >
                    <Text style={styles.saveAllLink}>Save all</Text>
                  </Pressable>
                ) : (
                  <Text
                    style={[styles.savedHint, { color: themeColors.muted }]}
                  >
                    Saved
                  </Text>
                )}
              </View>

              <View style={styles.menuList}>
                {menu.map(
                  ({
                    slot,
                    label,
                    Icon,
                    accent,
                    accentDark,
                    recipe,
                  }) => (
                    <PlanMealCard
                      key={slot}
                      label={label}
                      Icon={Icon}
                      accent={accent}
                      accentDark={accentDark}
                      recipe={recipe}
                      saved={isRecipeSaved(recipe.id)}
                      pantryMatch={getPantryMatchPercent(
                        recipe,
                        pantryIngredients,
                      )}
                      isDark={isDark}
                      onOpen={() => {
                        void Haptics.selectionAsync();
                        router.push(`/recipe/${recipe.id}`);
                      }}
                      onSave={() => handleSaveRecipe(recipe.id)}
                    />
                  ),
                )}
              </View>
            </View>

            <View
              style={[
                styles.panel,
                shadows.card,
                {
                  backgroundColor: themeColors.white,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View style={styles.panelHeader}>
                <View style={styles.panelHeaderCopy}>
                  <Text
                    style={[styles.panelTitle, { color: themeColors.charcoal }]}
                  >
                    Grocery list
                  </Text>
                  <Text
                    style={[styles.panelSubtitle, { color: themeColors.muted }]}
                  >
                    {needToBuy.length === 0
                      ? "You have everything for this menu"
                      : `${needToBuy.length} to buy · ${haveAtHome.length} at home`}
                  </Text>
                </View>
                {needToBuy.length === 0 ? (
                  <CheckCircle2 size={22} color={colors.green} />
                ) : null}
              </View>

              <View style={styles.coverageRow}>
                <View
                  accessible
                  accessibilityRole="progressbar"
                  accessibilityLabel="Ingredients already at home"
                  accessibilityValue={{ min: 0, max: 100, now: pantryCoverage }}
                  style={[
                    styles.coverageTrack,
                    { backgroundColor: themeColors.cream },
                  ]}
                >
                  <View
                    style={[
                      styles.coverageFill,
                      { width: `${pantryCoverage}%` },
                    ]}
                  />
                </View>
                <Text
                  style={[styles.coverageLabel, { color: themeColors.muted }]}
                >
                  {pantryCoverage}% ingredients at home
                </Text>
              </View>

              {haveAtHome.length > 0 ? (
                <View style={styles.ingredientGroup}>
                  <Text
                    style={[
                      styles.ingredientGroupLabel,
                      { color: themeColors.muted },
                    ]}
                  >
                    At home
                  </Text>
                  <View style={styles.chipWrap}>
                    {haveAtHome.slice(0, MAX_INGREDIENT_CHIPS).map((item) => (
                      <View
                        key={`have-${item}`}
                        style={[
                          styles.chip,
                          styles.chipMuted,
                          { borderColor: themeColors.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            { color: themeColors.muted },
                          ]}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {haveAtHome.length > MAX_INGREDIENT_CHIPS ? (
                    <Text
                      style={[styles.moreText, { color: themeColors.muted }]}
                    >
                      +{haveAtHome.length - MAX_INGREDIENT_CHIPS} more
                    </Text>
                  ) : null}
                </View>
              ) : null}

              {needToBuy.length > 0 ? (
                <View style={styles.ingredientGroup}>
                  <Text
                    style={[
                      styles.ingredientGroupLabel,
                      { color: colors.primary },
                    ]}
                  >
                    Need to buy
                  </Text>
                  <View style={styles.chipWrap}>
                    {needToBuy.slice(0, MAX_INGREDIENT_CHIPS).map((item) => (
                      <View
                        key={`need-${item}`}
                        style={[styles.chip, styles.chipAccent]}
                      >
                        <Text style={styles.chipAccentText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                  {needToBuy.length > MAX_INGREDIENT_CHIPS ? (
                    <Text
                      style={[styles.moreText, { color: themeColors.muted }]}
                    >
                      +{needToBuy.length - MAX_INGREDIENT_CHIPS} more
                    </Text>
                  ) : null}
                </View>
              ) : null}

              {needToBuy.length > 0 ? (
                <PrimaryButton
                  label="Order missing items"
                  icon={ShoppingBag}
                  onPress={handleOrderMissing}
                  style={styles.orderBtn}
                />
              ) : (
                <Text
                  style={[styles.readyCopy, { color: themeColors.charcoal }]}
                >
                  Everything you need is already in your pantry.
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollViewWithFloatingIndicator>

      <AffiliateCheckoutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        recipeTitle={isToday ? "Today's menu" : "Your menu"}
        missingIngredients={needToBuy}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  screenSections: {
    gap: spacing.lg,
  },
  errorBlock: {
    gap: spacing.md,
  },
  dateHero: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dateHeroTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCopy: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingHorizontal: spacing.xs,
  },
  dateLine: {
    fontFamily: appFonts.bodyBold,
    fontSize: 17,
    lineHeight: 22,
    textAlign: "center",
  },
  todayLink: {
    fontFamily: appFonts.bodyBold,
    fontSize: 12,
    color: colors.primary,
  },
  section: {
    gap: spacing.md,
  },
  sectionActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  iconAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  saveAllLink: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    color: colors.primary,
  },
  savedHint: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 13,
  },
  menuList: {
    gap: spacing.sm,
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    minHeight: 104,
  },
  mealSlotRail: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  mealSlotIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  mealImage: {
    width: 76,
    alignSelf: "center",
    height: 76,
    borderRadius: radius.md,
    marginVertical: spacing.sm,
  },
  mealImageFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  mealBody: {
    flex: 1,
    gap: 3,
    paddingVertical: spacing.md,
    paddingRight: spacing.xs,
    justifyContent: "center",
  },
  mealSlot: {
    fontFamily: appFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  mealTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 15,
    lineHeight: 20,
  },
  mealMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  mealMeta: {
    fontFamily: appFonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  mealPillRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  matchPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
  },
  matchPillText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 11,
    color: colors.primary,
  },
  bookmarkBtn: {
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  panel: {
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  panelHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  panelTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 17,
    lineHeight: 22,
  },
  panelSubtitle: {
    fontFamily: appFonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  coverageRow: {
    gap: spacing.xs,
  },
  coverageTrack: {
    height: 6,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  coverageFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.green,
    minWidth: 6,
  },
  coverageLabel: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
  ingredientGroup: {
    gap: spacing.sm,
  },
  ingredientGroupLabel: {
    fontFamily: appFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  chipMuted: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  chipAccent: {
    backgroundColor: "rgba(255,107,53,0.08)",
  },
  chipText: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 13,
  },
  chipAccentText: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 13,
    color: colors.primary,
  },
  moreText: {
    fontFamily: appFonts.body,
    fontSize: 12,
  },
  readyCopy: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  orderBtn: {
    marginTop: spacing.xs,
  },
});
