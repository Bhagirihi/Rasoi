import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { Moon, Timer } from "lucide-react-native";
import { useMemo, useState, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AffiliateCheckoutModal from "@/components/AffiliateCheckoutModal";
import CookTonightSheet from "@/components/CookTonightSheet";
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
import { useRecipeListAdIndices } from "@/hooks/useRecipeListAdIndices";
import { colors, layout, radius, scrollIndicator, spacing } from "@/constants/theme";
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

const HOME_SECTION_GAP = spacing.xl + spacing.xs;

export default function HomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors } = useTheme();
  const { showDialog } = useAppDialog();
  const { openBrandSearch } = usePartners();
  const { userName, showPartners } = useAppContext();
  const {
    meal,
    recipes,
    recipesLoading,
    recipesError,
    rankingReady,
    rankedRecipes,
    topPick,
    tonightCards,
    pantryFilterActive,
    setPantryFilterActive,
    pantryIngredients,
    dietChoice,
    regionalCuisine,
  } = useRecipeDiscovery();
  const { sponsor: homeSponsor, loading: homeSponsorLoading } =
    usePlacementSponsor("home");
  const tonightAdIndices = useRecipeListAdIndices(tonightCards, {
    minRecipesBeforeFirstAd: 1,
    minGap: 2,
    maxAds: 1,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>("blinkit");
  const [cookTonightVisible, setCookTonightVisible] = useState(false);
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(null);
  const [heroIntroFinished, setHeroIntroFinished] = useState(false);

  const { greeting, subtitle } = getLocalizedGreeting();
  const isLateNight = meal.slot === "lateNight";
  const discoveryReady = !recipesLoading && rankingReady;
  const heroDataReady = discoveryReady;
  const showHeroIntro = !heroIntroFinished;
  const showPickCard = heroIntroFinished && !!topPick;
  const showTonightSkeleton = !discoveryReady && tonightCards.length === 0;
  const moreRecipeCount = Math.max(rankedRecipes.length - 4, 0);

  const topPickMissing = useMemo(() => {
    if (!topPick) return [];
    return partitionIngredients(topPick, pantryIngredients).missing;
  }, [topPick, pantryIngredients]);

  const topPickPantryMatch = useMemo(() => {
    if (!topPick) return 0;
    return getPantryMatchPercent(topPick, pantryIngredients);
  }, [topPick, pantryIngredients]);

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
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
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
          subtitle={subtitle}
        />

        <View style={styles.sections}>
          <TrialCountdownBanner />

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
              onFinished={() => setHeroIntroFinished(true)}
            />
          ) : null}

          {showPickCard && topPick ? (
            <HomeRecipeRow
              section="pick"
              fullWidth
              recipe={topPick}
              pickLabel={meal.topPickEyebrow}
              pantryMatchPercent={topPickPantryMatch}
              cookCtaLabel={meal.cookCta}
              missing={topPickMissing}
              onPress={() => router.push(`/recipe/${topPick.id}`)}
              onCookTonight={() => openCookTonight(topPick)}
              onShopMissing={(partner) =>
                openShopModal(topPick, topPickMissing, partner)
              }
            />
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

          {showTonightSkeleton ? (
            <View>
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
                {tonightCards.map((recipe, index) => {
                  const missing = partitionIngredients(recipe, pantryIngredients).missing;
                  return (
                    <View key={recipe.id}>
                      {tonightAdIndices.has(index) ? (
                        <SponsorOrAd
                          sponsor={homeSponsor}
                          loading={homeSponsorLoading}
                          placement="home"
                          compact
                          style={styles.adInset}
                        />
                      ) : null}
                      <HomeRecipeRow
                        section="also"
                        recipe={recipe}
                        pantryMatchPercent={getPantryMatchPercent(
                          recipe,
                          pantryIngredients,
                        )}
                        cookCtaLabel={meal.cookCta}
                        missing={missing}
                        onPress={() => router.push(`/recipe/${recipe.id}`)}
                        onCookTonight={() => openCookTonight(recipe)}
                        onShopMissing={(partner) =>
                          openShopModal(recipe, missing, partner)
                        }
                      />
                    </View>
                  );
                })}
              </View>
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
  tonightBlock: {
    gap: spacing.sm,
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
    fontSize: 16,
    fontWeight: "700",
  },
  messageBody: {
    marginTop: spacing.sm,
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
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
