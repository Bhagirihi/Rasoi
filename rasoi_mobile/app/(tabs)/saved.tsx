import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChefHat } from "lucide-react-native";

import AffiliateCheckoutModal from "@/components/AffiliateCheckoutModal";
import CookTonightSheet from "@/components/CookTonightSheet";
import { AppTabHeader } from "@/components/AppTabHeader";
import RecipeCard from "@/components/RecipeCard";
import { FlatListWithFloatingIndicator } from "@/components/ScrollableScreen";
import SponsorOrAd from "@/components/SponsorOrAd";
import { EmptyState, InsightBanner } from "@/components/ui/Primitives";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { useOfflineRecipes } from "@/hooks/useOfflineRecipes";
import { useFlatListAdViewability } from "@/hooks/useFlatListAdViewability";
import { usePlacementSponsor } from "@/hooks/usePlacementSponsor";
import { useRecipeListAdIndices } from "@/hooks/useRecipeListAdIndices";
import { useDismissOnBlur } from "@/hooks/useDismissOnBlur";
import { colors, layout, radius, scrollIndicator, spacing } from "@/constants/theme";
import { testIds } from "@/constants/testIds";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
import { useNetworkConnectivity } from "@/context/NetworkConnectivityContext";
import { Recipe } from "@/data/mockRecipes";
import type { AffiliatePartner } from "@/utils/affiliate";
import { getMealContext } from "@/utils/mealTime";
import {
  getPantryMatchPercent,
  getRecipePickReason,
  partitionIngredients,
} from "@/utils/recipes";

export default function SavedScreen() {
  const router = useRouter();
  const { offline: offlineParam } = useLocalSearchParams<{ offline?: string }>();
  const tabBarHeight = useBottomTabBarHeight();
  const meal = getMealContext();
  const { colors: themeColors, screenBackground } = useTheme();
  const {
    pantryIngredients,
    dietChoice,
    regionalCuisine,
    showPartners,
    offlineRecipeIds,
    planLimits,
  } = useAppContext();
  const { isOffline } = useNetworkConnectivity();
  const { savedRecipes } = useSavedRecipes();
  const { offlineRecipes } = useOfflineRecipes();
  const [offlineFilterOnly, setOfflineFilterOnly] = useState(false);

  const planAllowsOffline = planLimits.offlineRecipeLimit > 0;
  const cappedOfflineRecipes = useMemo(() => {
    if (!planAllowsOffline) return [];
    return offlineRecipes.slice(0, planLimits.offlineRecipeLimit);
  }, [offlineRecipes, planAllowsOffline, planLimits.offlineRecipeLimit]);

  const visibleRecipes = offlineFilterOnly ? cappedOfflineRecipes : savedRecipes;
  const hasAnySaved = savedRecipes.length > 0;
  const hasAnyOffline = planAllowsOffline && offlineRecipeIds.length > 0;
  const showFilters = hasAnySaved || hasAnyOffline;

  // Deep link / offline redirect → Offline ready (plan-gated).
  useEffect(() => {
    if (!planAllowsOffline) {
      setOfflineFilterOnly(false);
      return;
    }
    if (offlineParam === "1" || (isOffline && offlineRecipeIds.length > 0)) {
      setOfflineFilterOnly(true);
    }
  }, [offlineParam, isOffline, planAllowsOffline, offlineRecipeIds.length]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>("blinkit");
  const [cookTonightVisible, setCookTonightVisible] = useState(false);
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(
    null,
  );
  const { sponsor: savedSponsor, loading: savedSponsorLoading } =
    usePlacementSponsor("saved");
  const savedAdIndices = useRecipeListAdIndices(visibleRecipes, {
    stableSeed: "saved-tab",
  });
  const { viewableIndices, viewabilityConfig, onViewableItemsChanged } =
    useFlatListAdViewability();

  const totalMissing = useMemo(() => {
    return savedRecipes.reduce((sum, recipe) => {
      return (
        sum + partitionIngredients(recipe, pantryIngredients).missing.length
      );
    }, 0);
  }, [savedRecipes, pantryIngredients]);

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

  const openCookTonight = (recipe: Recipe) => {
    setCookTonightTarget(recipe);
    setCookTonightVisible(true);
  };

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

  const openShopModal = (
    recipe: Recipe,
    missing: string[],
    partner: AffiliatePartner = "blinkit",
  ) => {
    setModalPartner(partner);
    setModalRecipe(recipe);
    setModalMissing(missing);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: screenBackground }]}
      edges={["top"]}
      testID={testIds.screenSaved}
    >
      <FlatListWithFloatingIndicator
        data={visibleRecipes}
        keyExtractor={(item) => item.id}
        {...scrollIndicator}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + spacing.xxxl + spacing.lg },
          visibleRecipes.length === 0 && styles.contentEmpty,
        ]}
        ItemSeparatorComponent={() => <View style={styles.itemGap} />}
        ListHeaderComponent={
          <View style={styles.screenSections}>
            <AppTabHeader
              eyebrow={offlineFilterOnly ? "Offline library" : "Saved menus"}
              title={offlineFilterOnly ? "Cook without internet" : "Recipes you love"}
              subtitle={
                offlineFilterOnly
                  ? "Downloaded recipes with steps and ingredients stored on this device."
                  : "Re-cook favourites and order missing ingredients in one tap."
              }
            />

            {showFilters && (
              <View style={styles.filterRow}>
                <Pressable
                  onPress={() => setOfflineFilterOnly(false)}
                  style={[styles.filterChip, !offlineFilterOnly && styles.filterChipActive]}
                  testID={testIds.savedOfflineFilter}
                >
                  <Text style={[styles.filterChipText, !offlineFilterOnly && styles.filterChipTextActive]}>
                    All saved{hasAnySaved ? ` (${savedRecipes.length})` : ""}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setOfflineFilterOnly(true)}
                  style={[styles.filterChip, offlineFilterOnly && styles.filterChipActive]}
                  disabled={!planAllowsOffline}
                >
                  <Text style={[styles.filterChipText, offlineFilterOnly && styles.filterChipTextActive]}>
                    Offline ready
                    {hasAnyOffline ? ` (${cappedOfflineRecipes.length})` : planAllowsOffline ? "" : " (Plus)"}
                  </Text>
                </Pressable>
              </View>
            )}

            {!offlineFilterOnly && hasAnySaved && totalMissing > 0 && (
              <InsightBanner
                title={`${totalMissing} ingredients missing across saved recipes`}
                subtitle="Tap Shop on any card to checkout on Blinkit, Zepto, or Instamart."
              />
            )}

            {visibleRecipes.length > 0 && <View style={styles.listDivider} />}
          </View>
        }
        renderItem={({ item, index }) => (
          <View>
            {savedAdIndices.has(index) && (
              <SponsorOrAd
                sponsor={savedSponsor}
                loading={savedSponsorLoading}
                placement="saved"
                compact
                lazyLoad
                isViewable={viewableIndices.has(index)}
                style={styles.listSponsorInset}
              />
            )}
            <RecipeCard
              recipe={item}
              variant="list"
              pickReason={getRecipePickReason(item, {
                regionalCuisine,
                pantryIngredients,
                dietChoice,
                mealSlot: meal.slot,
              })}
              pantryMatchPercent={getPantryMatchPercent(
                item,
                pantryIngredients,
              )}
              onShopMissing={showPartners ? openShopModal : undefined}
              onCookTonight={openCookTonight}
              cookCtaLabel={meal.cookCta}
            />
          </View>
        )}
        ListEmptyComponent={
          offlineFilterOnly ? (
            <EmptyState
              icon={ChefHat}
              title={planAllowsOffline ? "No offline recipes yet" : "Offline cooking is on Plus"}
              subtitle={
                planAllowsOffline
                  ? "Tap Download on any recipe from Home or recipe detail. Offline downloads are separate from Save."
                  : "Upgrade to Rasoi Plus (or start a trial) to download recipes and cook without internet."
              }
            />
          ) : (
            <EmptyState
              icon={ChefHat}
              title="No saved recipes yet"
              subtitle="Tap Save on any recipe from Home to bookmark dishes you want to cook again."
            />
          )
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
  flex: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  screenSections: {
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
  },
  filterChipTextActive: {
    color: colors.primary,
  },
  listDivider: {
    height: spacing.sm,
  },
  listSponsorInset: {
    marginBottom: spacing.lg,
  },
  itemGap: {
    height: spacing.md,
  },
  contentEmpty: {
    flexGrow: 1,
  },
});
