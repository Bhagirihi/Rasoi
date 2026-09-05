import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { Timer } from "lucide-react-native";
import { useMemo, useState, useCallback, useEffect } from "react";
import {
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

import AffiliateCheckoutModal from "@/components/AffiliateCheckoutModal";
import CookTonightSheet from "@/components/CookTonightSheet";
import OfflineBanner from "@/components/OfflineBanner";
import HomeRecentCooks from "@/components/home/HomeRecentCooks";
import GuestRegisterBanner from "@/components/home/GuestRegisterBanner";
import HomeSeasonalRail from "@/components/home/HomeSeasonalRail";
import { AppTabHeader } from "@/components/AppTabHeader";
import HomeScreenLinks from "@/components/home/HomeScreenLinks";
import HomePickCard, {
  HomePickShuffleButton,
} from "@/components/home/HomePickCard";
import HomeRecipeRowSkeleton from "@/components/home/HomeRecipeRowSkeleton";
import { ScrollViewWithFloatingIndicator } from "@/components/ScrollableScreen";
import SponsorOrAd from "@/components/SponsorOrAd";
import TrialCountdownBanner from "@/components/TrialCountdownBanner";
import HomeAnnouncementBridge from "@/components/home/HomeAnnouncementBridge";
import HomeQaMonetizationBar from "@/components/home/HomeQaMonetizationBar";
import HomeHeroLoadingBox from "@/components/HomeHeroLoadingBox";
import { EmptyState } from "@/components/ui/Primitives";
import { useRecipeDiscovery } from "@/hooks/useRecipeDiscovery";
import { useDismissOnBlur } from "@/hooks/useDismissOnBlur";
import { usePlacementSponsor } from "@/hooks/usePlacementSponsor";
import {
  colors,
  layout,
  radius,
  scrollIndicator,
  spacing,
} from "@/constants/theme";
import { appFonts } from "@/constants/fonts";
import { testIds } from "@/constants/testIds";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
import { useNetworkConnectivity } from "@/context/NetworkConnectivityContext";
import { useAppDialog } from "@/context/AppDialogContext";
import { usePartners } from "@/context/PartnersContext";
import { Recipe } from "@/data/mockRecipes";
import type { AffiliatePartner } from "@/utils/affiliate";
import { getLocalizedGreeting } from "@/utils/greeting";
import {
  getPantryMatchPercent,
  getRecipePickReason,
  partitionIngredients,
} from "@/utils/recipes";
import { PAYWALL_HREF } from "@/utils/routes";
import { useShuffleGate } from "@/hooks/useShuffleGate";
import { dismissRecommendation } from "@/services/recommendations";
import {
  trackRecipeSuggestionTap,
  type RecipeSuggestionSource,
} from "@/utils/productAnalytics";

const HOME_HERO_SEEN_KEY = "@rasoi/home_hero_intro_seen";

const HOME_SECTION_GAP = spacing.lg;
const PICK_SECTION_GAP = spacing.md;

export default function HomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors, screenBackground } = useTheme();
  const { showDialog } = useAppDialog();
  const { openBrandSearch } = usePartners();
  const { userName, showPartners, userCity, isGuest, offlineRecipeIds, planLimits } =
    useAppContext();
  const { isOffline } = useNetworkConnectivity();
  const { tryShuffle: tryHomeShuffle } = useShuffleGate("home");
  const {
    meal,
    recipes,
    recipesLoading,
    recipesError,
    rankingReady,
    rankedRecipes,
    refreshHomePicks,
    topPick,
    lateNightPick,
    seasonalRail,
    pantryFilterActive,
    setPantryFilterActive,
    pantryIngredients,
    dietChoice,
    regionalCuisine,
  } = useRecipeDiscovery();
  const { sponsor: homeSponsor, loading: homeSponsorLoading } =
    usePlacementSponsor("home");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>("blinkit");
  const [cookTonightVisible, setCookTonightVisible] = useState(false);
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(
    null,
  );
  const [heroIntroFinished, setHeroIntroFinished] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(HOME_HERO_SEEN_KEY).then((value) => {
      if (value === "1") setHeroIntroFinished(true);
    });
  }, []);

  const handleHeroIntroFinished = useCallback(() => {
    void AsyncStorage.setItem(HOME_HERO_SEEN_KEY, "1");
    setHeroIntroFinished(true);
  }, []);

  const handleNotInterested = useCallback(
    (recipe: Recipe) => {
      void dismissRecommendation(recipe.id).catch(() => undefined);
      void tryHomeShuffle(() => refreshHomePicks(true));
    },
    [refreshHomePicks, tryHomeShuffle],
  );

  const openRecipeSuggestion = useCallback(
    (recipe: Recipe, source: RecipeSuggestionSource) => {
      trackRecipeSuggestionTap({
        recipeId: recipe.id,
        recipeName: recipe.title,
        source,
        mealSlot: meal.slot,
      });
      router.push(`/recipe/${recipe.id}`);
    },
    [meal.slot, router],
  );

  const { greeting, subtitle } = getLocalizedGreeting();
  const isLateNight = meal.isOvernightDual === true;
  const showingOfflineDownloads =
    (isOffline || Boolean(recipesError)) &&
    planLimits.offlineRecipeLimit > 0 &&
    offlineRecipeIds.length > 0;
  // rankingReady already allows offline download picks before catalog settle.
  const discoveryReady = rankingReady;
  const heroDataReady = discoveryReady;
  const showHeroIntro = !heroIntroFinished;
  const showLateNightPick =
    heroIntroFinished && meal.isOvernightDual && !!lateNightPick;
  const fallbackTopPick =
    heroIntroFinished && discoveryReady && !topPick && rankedRecipes.length > 0
      ? rankedRecipes[0]
      : undefined;
  const displayTopPick = topPick ?? fallbackTopPick;
  const showPickCard = heroIntroFinished && !!displayTopPick;
  const showTonightSkeleton =
    heroIntroFinished && !discoveryReady && !showLateNightPick;
  const showRecipesCluster =
    showLateNightPick || showPickCard || showTonightSkeleton;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await tryHomeShuffle(() => refreshHomePicks(true));
    } finally {
      setRefreshing(false);
    }
  }, [refreshHomePicks, tryHomeShuffle]);

  const topPickPantryMatch = useMemo(() => {
    if (!displayTopPick) return 0;
    return getPantryMatchPercent(displayTopPick, pantryIngredients);
  }, [displayTopPick, pantryIngredients]);

  const lateNightPantryMatch = useMemo(() => {
    if (!lateNightPick) return 0;
    return getPantryMatchPercent(lateNightPick, pantryIngredients);
  }, [lateNightPick, pantryIngredients]);

  const topPickPickReason = useMemo(() => {
    if (!displayTopPick) return "";
    return getRecipePickReason(displayTopPick, {
      regionalCuisine,
      pantryIngredients,
      dietChoice,
      mealSlot: meal.slot,
    });
  }, [
    displayTopPick,
    regionalCuisine,
    pantryIngredients,
    dietChoice,
    meal.slot,
  ]);

  const lateNightPickReason = useMemo(() => {
    if (!lateNightPick) return "";
    return getRecipePickReason(lateNightPick, {
      regionalCuisine,
      pantryIngredients,
      dietChoice,
      mealSlot: "lateNight",
    });
  }, [lateNightPick, regionalCuisine, pantryIngredients, dietChoice]);

  const moreRecipeCount = Math.max(rankedRecipes.length - 1, 0);

  const sheetRecipe = cookTonightTarget ?? displayTopPick ?? null;
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
    if (!showPartners) {
      router.push(PAYWALL_HREF);
      return;
    }
    if (missing.length === 0) {
      void openBrandSearch(recipe.title, partner, {
        context: "home_recipe_card",
      });
      return;
    }
    setModalPartner(partner);
    setModalRecipe(recipe);
    setModalMissing(missing);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: screenBackground }]}
      edges={["top"]}
      testID={testIds.screenHome}
    >
      <OfflineBanner />
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + spacing.xxxl },
        ]}
      >
        <AppTabHeader
          compact
          title={
            userName
              ? `${greeting.replace("!", "")}, ${userName.split(" ")[0]}!`
              : greeting
          }
          subtitle={
            userCity ? `${subtitle} · Picks near ${userCity}` : subtitle
          }
        />

        <View style={styles.sections}>
          <HomeQaMonetizationBar />
          <TrialCountdownBanner />
          <HomeAnnouncementBridge />
          {isGuest ? <GuestRegisterBanner /> : null}

          {!recipesLoading && recipesError && !showingOfflineDownloads ? (
            <EmptyState
              icon={Timer}
              title="Could not load recipes"
              subtitle={recipesError}
            />
          ) : null}

          {showHeroIntro ? (
            <HomeHeroLoadingBox
              dataReady={heroDataReady}
              hasError={!!recipesError && !recipesLoading}
              isLateNight={isLateNight}
              onFinished={handleHeroIntroFinished}
            />
          ) : null}

          {showRecipesCluster ? (
            <View style={styles.pickSection}>
              <View style={styles.recipesCluster}>
                {showLateNightPick && lateNightPick ? (
                  <HomePickCard
                    key={lateNightPick.id}
                    eyebrow={meal.lateNightPickEyebrow ?? "Late night pick"}
                    pickReason={lateNightPickReason}
                    recipe={lateNightPick}
                    pantryMatchPercent={lateNightPantryMatch}
                    cookCtaLabel="Cook now"
                    onPress={() =>
                      openRecipeSuggestion(lateNightPick, "home_late_night")
                    }
                    onCookTonight={() => openCookTonight(lateNightPick)}
                    onShopMissing={(missing, partner) =>
                      openShopModal(lateNightPick, missing, partner)
                    }
                    onNotInterested={() => handleNotInterested(lateNightPick)}
                  />
                ) : null}

                {showPickCard && displayTopPick ? (
                  <HomePickCard
                    key={displayTopPick.id}
                    eyebrow={
                      meal.isOvernightDual
                        ? (meal.tomorrowTopPickEyebrow ?? meal.topPickEyebrow)
                        : meal.topPickEyebrow
                    }
                    pickReason={topPickPickReason}
                    headerTrailing={
                      <HomePickShuffleButton
                        onDark
                        onPress={() =>
                          void tryHomeShuffle(() => refreshHomePicks(true))
                        }
                      />
                    }
                    recipe={displayTopPick}
                    pantryMatchPercent={topPickPantryMatch}
                    cookCtaLabel={
                      meal.isOvernightDual ? "Plan breakfast" : meal.cookCta
                    }
                    onPress={() =>
                      openRecipeSuggestion(displayTopPick, "home_top_pick")
                    }
                    onCookTonight={() => openCookTonight(displayTopPick)}
                    onShopMissing={(missing, partner) =>
                      openShopModal(displayTopPick, missing, partner)
                    }
                    onNotInterested={() => handleNotInterested(displayTopPick)}
                  />
                ) : null}

                {showTonightSkeleton ? <HomeRecipeRowSkeleton /> : null}
              </View>
            </View>
          ) : null}

          {heroIntroFinished ? (
            <SponsorOrAd
              sponsor={homeSponsor}
              loading={homeSponsorLoading}
              placement="home"
              compact
            />
          ) : null}

          {heroIntroFinished && seasonalRail ? (
            <HomeSeasonalRail
              title={seasonalRail.title}
              subtitle={seasonalRail.subtitle}
              picks={seasonalRail.picks}
            />
          ) : null}

          {heroIntroFinished ? <HomeRecentCooks /> : null}

          {heroIntroFinished &&
          discoveryReady &&
          !recipesError &&
          recipes.length === 0 &&
          !displayTopPick ? (
            <EmptyState
              icon={Timer}
              title="No recipes yet"
              subtitle="Check your connection and pull to refresh, or browse the Recipe tab."
            />
          ) : null}

          {heroIntroFinished &&
          discoveryReady &&
          !recipesError &&
          recipes.length > 0 &&
          rankedRecipes.length === 0 ? (
            <View
              style={[
                styles.messageCard,
                {
                  backgroundColor: themeColors.white,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <Text
                style={[styles.messageTitle, { color: themeColors.charcoal }]}
              >
                No recipes match your filters
              </Text>
              <Text style={[styles.messageBody, { color: themeColors.muted }]}>
                Try updating diet or region in Settings, or turn off pantry
                mode.
              </Text>
              {pantryFilterActive ? (
                <Pressable
                  onPress={() => setPantryFilterActive(false)}
                  style={styles.messageBtn}
                >
                  <Text style={styles.messageBtnText}>Show all recipes</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {discoveryReady && heroIntroFinished ? (
            <HomeScreenLinks
              recipeCount={moreRecipeCount}
              onPlanPress={() => router.push("/(tabs)/plan")}
              onRecipesPress={() => router.push("/(tabs)/recipes")}
            />
          ) : null}
        </View>
      </ScrollViewWithFloatingIndicator>

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
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xs,
  },
  sections: {
    gap: HOME_SECTION_GAP,
    marginTop: spacing.sm,
  },
  pickSection: {
    gap: PICK_SECTION_GAP,
  },
  recipesCluster: {
    gap: PICK_SECTION_GAP,
  },
  adInset: {
    marginBottom: spacing.md,
  },
  messageCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  messageTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 16,
  },
  messageBody: {
    marginTop: spacing.sm,
    fontFamily: appFonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  messageBtn: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  messageBtnText: {
    fontFamily: appFonts.bodyBold,
    color: colors.white,
    fontSize: 14,
  },
});
