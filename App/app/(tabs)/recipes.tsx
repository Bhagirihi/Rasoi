import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import { useRouter } from "expo-router";
import { Search, Timer } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AffiliateCheckoutModal from "@/components/AffiliateCheckoutModal";
import CookTonightSheet from "@/components/CookTonightSheet";
import { AppTabHeader } from "@/components/AppTabHeader";
import QuickFiltersSection, {
  getQuickFilterLabels,
} from "@/components/QuickFiltersSection";
import RecipeCard from "@/components/RecipeCard";
import { prefetchRecipeImages } from "@/components/RecipeImage";
import RecipeListSkeleton from "@/components/RecipeListSkeleton";
import { FlatListWithFloatingIndicator } from "@/components/ScrollableScreen";
import SponsorOrAd from "@/components/SponsorOrAd";
import { EmptyState } from "@/components/ui/Primitives";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { useDismissOnBlur } from "@/hooks/useDismissOnBlur";
import { useFlatListAdViewability } from "@/hooks/useFlatListAdViewability";
import { usePlacementSponsor } from "@/hooks/usePlacementSponsor";
import { useRecipeDiscovery } from "@/hooks/useRecipeDiscovery";
import { useRecipeListAdIndices } from "@/hooks/useRecipeListAdIndices";
import {
  colors,
  layout,
  radius,
  scrollIndicator,
  spacing,
} from "@/constants/theme";
import { testIds } from "@/constants/testIds";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
import { useAppDialog } from "@/context/AppDialogContext";
import { Recipe } from "@/data/mockRecipes";
import { useRecipeListSearch } from "@/hooks/useRecipeListSearch";
import { useTabWarmRender } from "@/hooks/useTabWarmRender";
import { logRecipeSearch } from "@/services/recipeSearch";
import type { AffiliatePartner } from "@/utils/affiliate";
import {
  getPantryMatchPercent,
  getRecipePickReason,
  partitionIngredients,
  sortRecipesByPantryMatch,
} from "@/utils/recipes";

export default function RecipesTabScreen() {
  const shouldRender = useTabWarmRender();
  const { screenBackground } = useTheme();
  if (!shouldRender) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: screenBackground }}
        edges={["top"]}
      />
    );
  }
  return <RecipesTabContent />;
}

function RecipesTabContent() {
  const router = useRouter();
  const tabBarHeight = useTabBarHeight();
  const { keyboardHeight, keyboardVisible } = useKeyboardInset();
  const { colors: themeColors, screenBackground } = useTheme();
  const { showDialog } = useAppDialog();
  const { showPartners } = useAppContext();
  const {
    meal,
    recipes,
    recipesLoading,
    recipesLoadingMore,
    recipesHasMore,
    loadMoreRecipes,
    recipesTotalCount,
    recipesError,
    refreshRecipes,
    activeFilters,
    rankedRecipes,
    moreRecipes,
    hasQuickFilters,
    pantryFilterActive,
    setPantryFilterActive,
    pantryIngredients,
    dietChoice,
    regionalCuisine,
    handleFilterToggle,
    rankingReady,
  } = useRecipeDiscovery();
  const { sponsor: recipesSponsor, loading: recipesSponsorLoading } =
    usePlacementSponsor("recipes");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>("blinkit");
  const [cookTonightVisible, setCookTonightVisible] = useState(false);
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [pantryMatchSortActive, setPantryMatchSortActive] = useState(true);
  const lastLoggedSearch = useRef("");

  const listRecipes = useMemo(
    () => (moreRecipes.length > 0 ? moreRecipes : rankedRecipes),
    [moreRecipes, rankedRecipes],
  );

  const suggestionCatalog = useMemo(() => {
    const catalog = recipes.length > 0 ? recipes : listRecipes;
    return catalog.slice(0, 400);
  }, [recipes, listRecipes]);

  const {
    items: searchedMoreRecipes,
    message: searchFallbackMessage,
    suggestions: searchSuggestions,
    searchLoading,
  } = useRecipeListSearch({
    query: searchQuery,
    listRecipes,
    suggestionCatalog,
    dietChoice,
    regionalCuisine,
  });

  const displayRecipes = useMemo(() => {
    if (!pantryMatchSortActive) return searchedMoreRecipes;
    return sortRecipesByPantryMatch(searchedMoreRecipes, pantryIngredients);
  }, [searchedMoreRecipes, pantryMatchSortActive, pantryIngredients]);

  // Precompute per-row derived data once per list change. The old renderItem
  // recomputed getRecipePickReason + getPantryMatchPercent for every row on
  // every render (including every scroll tick) — the main list jank source.
  const displayRows = useMemo(
    () =>
      displayRecipes.map((recipe) => ({
        recipe,
        pickReason: getRecipePickReason(recipe, {
          regionalCuisine,
          pantryIngredients,
          dietChoice,
          mealSlot: meal.slot,
        }),
        pantryMatchPercent: getPantryMatchPercent(recipe, pantryIngredients),
      })),
    [displayRecipes, regionalCuisine, pantryIngredients, dietChoice, meal.slot],
  );

  // Warm the image cache for the first screen of results.
  useEffect(() => {
    prefetchRecipeImages(displayRecipes.map((recipe) => recipe.imageUrl));
  }, [displayRecipes]);

  const recipeAdIndices = useRecipeListAdIndices(displayRecipes, {
    stableSeed: "recipes-tab",
  });
  const { viewableIndices, viewabilityConfig, onViewableItemsChanged } =
    useFlatListAdViewability();

  const activeFilterLabels = useMemo(
    () => getQuickFilterLabels(activeFilters),
    [activeFilters],
  );

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) return;

    const timer = setTimeout(() => {
      if (lastLoggedSearch.current === query.toLowerCase()) return;
      lastLoggedSearch.current = query.toLowerCase();
      void logRecipeSearch({
        query,
        sourceScreen: "recipes",
        resultCount: displayRecipes.length,
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery, displayRecipes.length]);

  const sheetRecipe = cookTonightTarget;
  const sheetMissing = useMemo(() => {
    if (!sheetRecipe) return [];
    return partitionIngredients(sheetRecipe, pantryIngredients).missing;
  }, [sheetRecipe, pantryIngredients]);
  const sheetPickReason = useMemo(() => {
    if (!sheetRecipe) return "";
    return getRecipePickReason(sheetRecipe, {
      regionalCuisine,
      pantryIngredients,
      dietChoice,
      mealSlot: meal.slot,
    });
  }, [sheetRecipe, regionalCuisine, pantryIngredients, dietChoice, meal.slot]);
  const sheetPantryMatch = useMemo(() => {
    if (!sheetRecipe) return 0;
    return getPantryMatchPercent(sheetRecipe, pantryIngredients);
  }, [sheetRecipe, pantryIngredients]);

  const openCookTonight = useCallback((recipe: Recipe) => {
    setCookTonightTarget(recipe);
    setCookTonightVisible(true);
  }, []);

  const closeCookTonight = () => {
    setCookTonightVisible(false);
    setCookTonightTarget(null);
  };

  useDismissOnBlur(
    useCallback(() => {
      setModalVisible(false);
      setCookTonightVisible(false);
      setCookTonightTarget(null);
    }, []),
  );

  const clearDiscovery = () => {
    setSearchQuery("");
    if (activeFilters.length > 0) {
      handleFilterToggle("all");
    }
    if (pantryFilterActive) {
      setPantryFilterActive(false);
    }
    setPantryMatchSortActive(true);
  };

  const openShopModal = useCallback(
    (
      recipe: Recipe,
      missing: string[],
      partner: AffiliatePartner = "blinkit",
    ) => {
      if (missing.length === 0 || !showPartners) return;
      setModalPartner(partner);
      setModalRecipe(recipe);
      setModalMissing(missing);
      setModalVisible(true);
    },
    [showPartners],
  );

  const listBottomPadding = keyboardVisible
    ? keyboardHeight + tabBarHeight + spacing.xxxl
    : tabBarHeight + spacing.xxxl + spacing.lg;

  const discoveryReady = !recipesLoading && rankingReady;
  const showListSkeleton =
    !discoveryReady && displayRecipes.length === 0 && !recipesError;

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: (typeof displayRows)[number];
      index: number;
    }) => (
      <View>
        {recipeAdIndices.has(index) && (
          <SponsorOrAd
            sponsor={recipesSponsor}
            loading={recipesSponsorLoading}
            placement="recipes"
            compact
            lazyLoad
            isViewable={viewableIndices.has(index)}
            style={styles.listSponsorInset}
          />
        )}
        <RecipeCard
          recipe={item.recipe}
          testID={index === 0 ? testIds.recipeCardFirst : undefined}
          variant="list"
          pickReason={item.pickReason}
          pantryMatchPercent={item.pantryMatchPercent}
          onShopMissing={openShopModal}
          onCookTonight={openCookTonight}
          cookCtaLabel={meal.cookCta}
        />
      </View>
    ),
    [
      recipeAdIndices,
      recipesSponsor,
      recipesSponsorLoading,
      viewableIndices,
      openShopModal,
      openCookTonight,
      meal.cookCta,
    ],
  );

  // Hoisted: an inline arrow here creates a new component identity per render,
  // remounting every separator on each render.
  const renderSeparator = useCallback(
    () => <View style={styles.itemGap} />,
    [],
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: screenBackground }]}
      edges={["top"]}
      testID={testIds.screenRecipesTab}
    >
      <FlatListWithFloatingIndicator
        data={displayRows}
        keyExtractor={(item) => item.recipe.id}
        renderItem={renderItem}
        // Perf tuning: defaults keep ~10 screens of heavy cards mounted.
        windowSize={9}
        maxToRenderPerBatch={6}
        initialNumToRender={6}
        removeClippedSubviews
        {...scrollIndicator}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
        onEndReached={() => {
          if (recipesHasMore && !recipesLoadingMore) {
            void loadMoreRecipes();
          }
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          recipesLoadingMore ? (
            <View style={styles.listFooter}>
              <ActivityIndicator color={themeColors.saffron} />
              <Text
                style={[styles.listFooterText, { color: themeColors.muted }]}
              >
                Loading more recipes…
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: listBottomPadding },
          displayRecipes.length === 0 && styles.listContentEmpty,
        ]}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={
          <View style={styles.screenSections}>
            <AppTabHeader
              title="Recipes"
              subtitle="Search and filter dishes for your kitchen"
            />

            <QuickFiltersSection
              variant="recipes"
              activeFilters={activeFilters}
              pantryFilterActive={pantryFilterActive}
              pantryIngredientCount={pantryIngredients.length}
              hasQuickFilters={
                hasQuickFilters ||
                searchQuery.trim().length > 0 ||
                !pantryMatchSortActive
              }
              activeFilterLabels={activeFilterLabels}
              onFilterToggle={handleFilterToggle}
              onClearPantryFilter={() => setPantryFilterActive(false)}
              pantryMatchSortActive={pantryMatchSortActive}
              onPantryMatchSortToggle={() =>
                setPantryMatchSortActive((current) => !current)
              }
              pantryMatchSortTestId={testIds.recipesPantryMatchSort}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSuggestionSelect={setSearchQuery}
              searchSuggestions={searchSuggestions}
              searchLoading={searchLoading}
              searchTestId={testIds.recipesSearchInput}
              resultCount={displayRecipes.length}
              totalCount={recipesTotalCount ?? listRecipes.length}
              onClearAll={clearDiscovery}
            />

            {searchFallbackMessage ? (
              <View
                style={[
                  styles.searchFallbackBanner,
                  {
                    backgroundColor: themeColors.white,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.searchFallbackText,
                    { color: themeColors.muted },
                  ]}
                >
                  {searchFallbackMessage}
                </Text>
              </View>
            ) : null}

            {discoveryReady &&
              !recipesError &&
              recipes.length > 0 &&
              rankedRecipes.length === 0 && (
                <View
                  style={[
                    styles.noMatchCard,
                    {
                      backgroundColor: themeColors.white,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.noMatchTitle,
                      { color: themeColors.charcoal },
                    ]}
                  >
                    No recipes match
                  </Text>
                  <Text
                    style={[styles.noMatchSub, { color: themeColors.muted }]}
                  >
                    Try changing quick filters, turning off pantry mode, or
                    updating diet and region in Settings.
                  </Text>
                  {pantryFilterActive && (
                    <Pressable
                      onPress={() => setPantryFilterActive(false)}
                      style={styles.noMatchBtn}
                    >
                      <Text style={styles.noMatchBtnText}>
                        Show all recipes
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}
          </View>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          showListSkeleton ? (
            <RecipeListSkeleton count={6} />
          ) : recipesError ? (
            <View style={styles.errorBox}>
              <EmptyState
                icon={Timer}
                title="Could not load recipes"
                subtitle={recipesError}
              />
              <Pressable
                onPress={() => void refreshRecipes()}
                style={styles.retryBtn}
              >
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            </View>
          ) : searchQuery.trim() && listRecipes.length > 0 ? (
            <EmptyState
              icon={Search}
              title="No matches"
              subtitle={`Nothing matched "${searchQuery.trim()}". Try another dish or ingredient.`}
            />
          ) : hasQuickFilters && searchedMoreRecipes.length === 0 ? (
            <View style={styles.errorBox}>
              <EmptyState
                icon={Search}
                title="No recipes match these filters"
                subtitle="Try clearing filters or turning off pantry mode."
              />
              <Pressable
                onPress={() => {
                  handleFilterToggle("all");
                  setPantryFilterActive(false);
                  setSearchQuery("");
                  setPantryMatchSortActive(true);
                }}
                style={styles.retryBtn}
              >
                <Text style={styles.retryBtnText}>Clear filters</Text>
              </Pressable>
            </View>
          ) : null
        }
      />

      <AffiliateCheckoutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        recipeTitle={modalRecipe?.title}
        missingIngredients={modalMissing}
        initialPartner={modalPartner}
      />

      <CookTonightSheet
        visible={cookTonightVisible}
        recipe={sheetRecipe}
        missing={sheetMissing}
        pickReason={sheetPickReason}
        pantryMatchPercent={sheetPantryMatch}
        showShop={showPartners}
        title={meal.sheetTitle}
        onClose={closeCookTonight}
        onStartCooking={() => {
          closeCookTonight();
          if (sheetRecipe) router.push(`/recipe/${sheetRecipe.id}?cook=1`);
        }}
        onShopMissing={() => {
          closeCookTonight();
          if (sheetRecipe) openShopModal(sheetRecipe, sheetMissing);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  listContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  screenSections: {
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  searchFallbackBanner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  searchFallbackText: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  listSponsorInset: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  itemGap: {
    height: spacing.md,
  },
  noMatchCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noMatchTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.charcoal,
  },
  noMatchSub: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  noMatchBtn: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  noMatchBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  errorBox: {
    gap: spacing.md,
  },
  retryBtn: {
    alignSelf: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.white,
  },
  listFooter: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  listFooterText: {
    fontSize: 13,
    fontWeight: "600",
  },
});


