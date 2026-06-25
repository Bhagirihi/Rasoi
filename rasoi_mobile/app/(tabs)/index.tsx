import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { Moon, RefreshCw, Timer } from "lucide-react-native";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

import AffiliateCheckoutModal from "@/components/AffiliateCheckoutModal";
import CookTonightSheet from "@/components/CookTonightSheet";
import OfflineBanner from "@/components/OfflineBanner";
import HomeRecentCooks from "@/components/home/HomeRecentCooks";
import HomePlanTomorrow from "@/components/home/HomePlanTomorrow";
import GuestRegisterBanner from "@/components/home/GuestRegisterBanner";
import HomeSeasonalRail from "@/components/home/HomeSeasonalRail";
import { AppTabHeader } from "@/components/AppTabHeader";
import HomeBrowseLink from "@/components/home/HomeBrowseLink";
import HomeRecipeRow from "@/components/home/HomeRecipeRow";
import HomeSectionHeader from "@/components/home/HomeSectionHeader";
import { ScrollViewWithFloatingIndicator } from "@/components/ScrollableScreen";
import SponsorOrAd from "@/components/SponsorOrAd";
import TrialCountdownBanner from "@/components/TrialCountdownBanner";
import TonightCardsSkeleton from "@/components/TonightCardsSkeleton";
import HomeHeroLoadingBox from "@/components/HomeHeroLoadingBox";
import { EmptyState } from "@/components/ui/Primitives";
import { useRecipeDiscovery } from "@/hooks/useRecipeDiscovery";
import { useDismissOnBlur } from "@/hooks/useDismissOnBlur";
import { usePlacementSponsor } from "@/hooks/usePlacementSponsor";
import { colors, layout, radius, scrollIndicator, spacing } from "@/constants/theme";
import { appFonts } from "@/constants/fonts";
import { testIds } from "@/constants/testIds";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
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
import { dismissRecommendation } from "@/services/recommendations";

const HOME_HERO_SEEN_KEY = "@rasoi/home_hero_intro_seen";

const HOME_SECTION_GAP = spacing.xl;
const RECIPES_CLUSTER_GAP = spacing.md;

export default function HomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors } = useTheme();
  const { showDialog } = useAppDialog();
  const { openBrandSearch } = usePartners();
  const { userName, showPartners, userCity, isGuest } = useAppContext();
  const {
    meal,
    recipes,
    recipesLoading,
    recipesError,
    rankingReady,
    rankedRecipes,
    refreshRecipes,
    refreshHomePicks,
    topPick,
    tonightCards,
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
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(null);
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
      void refreshHomePicks(true);
    },
    [refreshHomePicks],
  );

  const { greeting, subtitle } = getLocalizedGreeting();
  const isLateNight = meal.isOvernightDual === true;
  const hideFeaturedOvernightExtras =
    meal.isOvernightDual === true || meal.isTomorrowBreakfast === true;
  const discoveryReady = !recipesLoading && rankingReady;
  const heroDataReady = discoveryReady;
  const showHeroIntro = !heroIntroFinished;
  const showLateNightPick = heroIntroFinished && meal.isOvernightDual && !!lateNightPick;
  const showPickCard = heroIntroFinished && !!topPick;
  const showTonightSkeleton =
    heroIntroFinished && !discoveryReady && tonightCards.length === 0 && !showLateNightPick;
  const moreRecipeCount = Math.max(rankedRecipes.length - 4, 0);
  const showRecipesCluster =
    showLateNightPick ||
    showPickCard ||
    showTonightSkeleton ||
    tonightCards.length > 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshRecipes(), refreshHomePicks(true)]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshRecipes, refreshHomePicks]);

  const topPickPantryMatch = useMemo(() => {
    if (!topPick) return 0;
    return getPantryMatchPercent(topPick, pantryIngredients);
  }, [topPick, pantryIngredients]);

  const lateNightPantryMatch = useMemo(() => {
    if (!lateNightPick) return 0;
    return getPantryMatchPercent(lateNightPick, pantryIngredients);
  }, [lateNightPick, pantryIngredients]);

  const sheetRecipe = cookTonightTarget ?? topPick ?? null;
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
      void openBrandSearch(recipe.title, partner, { context: "home_recipe_card" });
      return;
    }
    setModalPartner(partner);
    setModalRecipe(recipe);
    setModalMissing(missing);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.cream }]}
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
          title={
            userName
              ? `${greeting.replace("!", "")}, ${userName.split(" ")[0]}!`
              : greeting
          }
          subtitle={
            userCity
              ? `${subtitle} · Picks near ${userCity}`
              : subtitle
          }
        />

        <View style={styles.sections}>
          <TrialCountdownBanner />
          {isGuest ? <GuestRegisterBanner /> : null}

          <SponsorOrAd
            sponsor={homeSponsor}
            loading={homeSponsorLoading}
            placement="home"
            compact
          />

          {!recipesLoading && recipesError ? (
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

          {heroIntroFinished && seasonalRail ? (
            <HomeSeasonalRail
              title={seasonalRail.title}
              subtitle={seasonalRail.subtitle}
              picks={seasonalRail.picks}
            />
          ) : null}

          {heroIntroFinished ? <HomeRecentCooks /> : null}

          {heroIntroFinished && meal.isOvernightDual ? (
            <HomePlanTomorrow
              lateNightPick={lateNightPick}
              tomorrowPick={topPick}
              onRecipePress={(recipe) => router.push(`/recipe/${recipe.id}`)}
            />
          ) : null}

          {showRecipesCluster ? (
            <View style={styles.recipesCluster}>
              {showLateNightPick && lateNightPick ? (
                <View style={styles.tonightBlock}>
                  <HomeSectionHeader
                    title={meal.lateNightPickEyebrow ?? '🌙 Late night pick'}
                    variant="featured"
                    icon={Moon}
                    iconColor={themeColors.muted}
                  />
                  <HomeRecipeRow
                    key={lateNightPick.id}
                    section="pick"
                    recipe={lateNightPick}
                    pantryMatchPercent={lateNightPantryMatch}
                    cookCtaLabel="Cook now"
                    onPress={() => router.push(`/recipe/${lateNightPick.id}`)}
                    onCookTonight={() => openCookTonight(lateNightPick)}
                    onShopMissing={(missing, partner) =>
                      openShopModal(lateNightPick, missing, partner)
                    }
                  />
                </View>
              ) : null}

              {showPickCard && topPick ? (
                <View style={styles.tonightBlock}>
                  <HomeSectionHeader
                    title={
                      meal.isOvernightDual
                        ? (meal.tomorrowTopPickEyebrow ?? meal.topPickEyebrow)
                        : meal.topPickEyebrow
                    }
                    subtitle={
                      hideFeaturedOvernightExtras
                        ? undefined
                        : 'Best match for you right now'
                    }
                    variant="featured"
                  />
                  <Pressable
                    onPress={() => void refreshHomePicks(true)}
                    style={styles.shuffleButton}
                    accessibilityRole="button"
                    accessibilityLabel="Show different recipe ideas"
                  >
                    <RefreshCw size={14} color={colors.primary} />
                    <Text style={styles.shuffleButtonText}>Different ideas</Text>
                  </Pressable>
                  <HomeRecipeRow
                    key={topPick.id}
                    section="pick"
                    recipe={topPick}
                    pantryMatchPercent={topPickPantryMatch}
                    cookCtaLabel={meal.isOvernightDual ? 'Plan breakfast' : meal.cookCta}
                    onPress={() => router.push(`/recipe/${topPick.id}`)}
                    onCookTonight={() => openCookTonight(topPick)}
                    onShopMissing={(missing, partner) =>
                      openShopModal(topPick, missing, partner)
                    }
                    onNotInterested={() => handleNotInterested(topPick)}
                  />
                </View>
              ) : null}

              {showTonightSkeleton ? (
                <View style={styles.tonightBlock}>
                  <HomeSectionHeader title={meal.alsoLabel} />
                  <TonightCardsSkeleton label="" isLateNight={isLateNight} count={3} />
                </View>
              ) : null}

              {tonightCards.length > 0 ? (
                <View style={styles.tonightBlock}>
                  <HomeSectionHeader
                    title={meal.alsoLabel}
                    subtitle="Tap a dish for ingredients and steps"
                    icon={isLateNight ? Moon : undefined}
                    iconColor={themeColors.muted}
                  />
                  <View style={styles.tonightList}>
                    {tonightCards.map((recipe) => {
                      return (
                        <View key={recipe.id}>
                          <HomeRecipeRow
                            section="also"
                            recipe={recipe}
                            pantryMatchPercent={getPantryMatchPercent(
                              recipe,
                              pantryIngredients,
                            )}
                            cookCtaLabel={meal.cookCta}
                            onPress={() => router.push(`/recipe/${recipe.id}`)}
                            onCookTonight={() => openCookTonight(recipe)}
                            onShopMissing={(missing, partner) =>
                              openShopModal(recipe, missing, partner)
                            }
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          {heroIntroFinished &&
          discoveryReady &&
          !recipesError &&
          recipes.length === 0 ? (
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
              <Text style={[styles.messageTitle, { color: themeColors.charcoal }]}>
                No recipes match your filters
              </Text>
              <Text style={[styles.messageBody, { color: themeColors.muted }]}>
                Try updating diet or region in Settings, or turn off pantry mode.
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
            <HomeBrowseLink
              count={moreRecipeCount}
              onPress={() => router.push("/(tabs)/recipes")}
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
    paddingTop: spacing.md,
  },
  sections: {
    gap: HOME_SECTION_GAP,
    marginTop: spacing.sm,
  },
  recipesCluster: {
    gap: RECIPES_CLUSTER_GAP,
  },
  tonightBlock: {
    gap: spacing.sm,
  },
  shuffleButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(232, 93, 44, 0.1)',
  },
  shuffleButtonText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    color: colors.primary,
  },
  tonightList: {
    gap: spacing.md,
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
