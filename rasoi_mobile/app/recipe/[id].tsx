import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Flame } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import RecipeDetailSkeleton from "@/components/RecipeDetailSkeleton";
import AffiliateCheckoutModal from "@/components/AffiliateCheckoutModal";
import ViewportLazyAdSlot from "@/components/ViewportLazyAdSlot";
import SponsorOrAd from "@/components/SponsorOrAd";
import FoodDeliveryModal from "@/components/FoodDeliveryModal";
import FoodDeliveryStrip from "@/components/FoodDeliveryStrip";
import MissingItemsPanel from "@/components/MissingItemsPanel";
import RecipeDetailHeader from "@/components/recipe/RecipeDetailHeader";
import RecipeDetailHero from "@/components/recipe/RecipeDetailHero";
import RecipeDetailSection from "@/components/recipe/RecipeDetailSection";
import RecipeDetailStickyBar from "@/components/recipe/RecipeDetailStickyBar";
import RecipeDetailToolChip from "@/components/recipe/RecipeDetailToolChip";
import RecipeIngredientsGuide from "@/components/recipe/RecipeIngredientsGuide";
import RecipeMethodTimeline from "@/components/recipe/RecipeMethodTimeline";
import PartnerUpsellCard from "@/components/PartnerUpsellCard";
import RecipeSafetyDisclaimer from "@/components/RecipeSafetyDisclaimer";
import TrialPartnerBanner from "@/components/TrialPartnerBanner";
import { PlanBadge } from "@/components/ui/Primitives";
import { SCREENSHOT_MODE } from "@/constants/screenshotMode";
import { appFonts } from "@/constants/fonts";
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
import { useSaveRecipeGate } from '@/hooks/useSaveRecipeGate';
import { useOfflineRecipeGate } from '@/hooks/useOfflineRecipeGate';
import { useRecipes } from "@/context/RecipesContext";
import { useShoppingSession } from "@/context/ShoppingSessionContext";
import { fetchRecipeSponsor, type SponsorCardData } from "@/services/sponsors";
import type { Recipe } from "@/data/mockRecipes";
import { useRasoiRealtimeTables } from "@/utils/realtime";
import {
  getPantryMatchPercent,
  partitionIngredients,
  countMatchableIngredients,
} from "@/utils/recipes";
import { shareRecipeOnWhatsApp } from "@/utils/shareRecipe";
import { logRecipeView, logRecipeCooked } from "@/services/recommendations";
import { PAYWALL_HREF } from "@/utils/routes";
import { getOfflineRecipe } from "@/utils/offlineRecipeStorage";
import type { AffiliatePartner } from "@/utils/affiliate";

function normalizeRecipeId(id: string | string[] | undefined): string {
  if (Array.isArray(id)) return id[0] ?? "";
  return id ?? "";
}

const STEPS_PLACEHOLDER_EN = ["Steps coming soon — we are updating this recipe."];
const STEPS_PLACEHOLDER_HI = ["विधि जल्द ही उपलब्ध होगी।"];

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams<{
    id: string | string[];
    cook?: string;
  }>();
  const recipeId = normalizeRecipeId(params.id);
  const startInCookMode = params.cook === "1";
  const router = useRouter();
  const {
    pantryIngredients,
    isRecipeSaved,
    isRecipeOffline,
    showPartners,
    partnersInTrialMode,
  } = useAppContext();
  const { trySaveRecipe } = useSaveRecipeGate();
  const { tryToggleOfflineRecipe } = useOfflineRecipeGate();
  const { getRecipeById, loadRecipeById } = useRecipes();
  const { getSessionProgress, getNextShoppingItem } = useShoppingSession();
  const loadRecipeByIdRef = useRef(loadRecipeById);
  loadRecipeByIdRef.current = loadRecipeById;
  const [modalVisible, setModalVisible] = useState(false);
  const [checkoutFocusedItem, setCheckoutFocusedItem] = useState<string | null>(
    null,
  );
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>("blinkit");
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [stickyBarHeight, setStickyBarHeight] = useState(160);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(true);
  const [recipeSponsor, setRecipeSponsor] = useState<SponsorCardData | null>(
    null,
  );
  const [recipeSponsorLoading, setRecipeSponsorLoading] = useState(true);
  const [adScrollGeneration, setAdScrollGeneration] = useState(0);
  const [cookMode, setCookMode] = useState(startInCookMode);
  const [stepsLang, setStepsLang] = useState<"en" | "hi">("en");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    () => new Set(),
  );
  const { colors: themeColors, isDark, screenBackground } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setCookMode(startInCookMode);
    setCompletedSteps(new Set());
    setStepsLang("en");
  }, [recipeId, startInCookMode]);

  useEffect(() => {
    if (!recipeId) {
      setRecipe(null);
      setRecipeSponsor(null);
      setRecipeLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      const cached = getRecipeById(recipeId);
      const offline = cached ? null : await getOfflineRecipe(recipeId);
      if (cancelled) return;

      const initial = cached ?? offline;
      if (initial) {
        setRecipe(initial);
        setRecipeLoading(false);
      } else {
        setRecipe(null);
        setRecipeLoading(true);
      }

      const loaded = await loadRecipeByIdRef.current(recipeId);
      if (cancelled) return;
      setRecipe(loaded);
      setRecipeLoading(false);
      if (loaded) {
        void logRecipeView(loaded.id);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const refreshRecipeSponsor = useCallback(async () => {
    if (!recipeId) {
      setRecipeSponsor(null);
      setRecipeSponsorLoading(false);
      return;
    }

    setRecipeSponsorLoading(true);
    try {
      const sponsor = await fetchRecipeSponsor(recipeId);
      setRecipeSponsor(sponsor);
    } catch {
      setRecipeSponsor(null);
    } finally {
      setRecipeSponsorLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    void refreshRecipeSponsor();
  }, [refreshRecipeSponsor]);

  useRasoiRealtimeTables(
    ["Sponsor"],
    () => {
      void refreshRecipeSponsor();
    },
    `recipe-sponsor-${recipeId ?? "none"}`,
  );

  const { available, missing } = useMemo(() => {
    if (!recipe) return { available: [], missing: [] };
    return partitionIngredients(recipe, pantryIngredients);
  }, [recipe, pantryIngredients]);

  const displaySteps = useMemo(() => {
    if (!recipe) return [];
    if (stepsLang === "hi") {
      if (recipe.stepsHi?.length) return recipe.stepsHi;
      return STEPS_PLACEHOLDER_HI;
    }
    if (recipe.steps?.length) return recipe.steps;
    return STEPS_PLACEHOLDER_EN;
  }, [recipe, stepsLang]);

  const displayDescription = useMemo(() => {
    if (!recipe) return "";
    if (stepsLang === "hi" && recipe.descriptionHi?.trim()) {
      return recipe.descriptionHi;
    }
    return recipe.description;
  }, [recipe, stepsLang]);

  const cookedLoggedRef = useRef(false);

  useEffect(() => {
    cookedLoggedRef.current = false;
  }, [recipeId]);

  useEffect(() => {
    if (!recipe || !cookMode || displaySteps.length === 0) return;
    if (completedSteps.size < displaySteps.length) return;
    if (cookedLoggedRef.current) return;
    cookedLoggedRef.current = true;
    void logRecipeCooked(recipe.id);
  }, [recipe, cookMode, completedSteps, displaySteps.length]);

  useEffect(() => {
    if (!recipeId || !SCREENSHOT_MODE || !showPartners) return;
    const timer = setTimeout(() => {
      setDeliveryModalVisible(true);
    }, 700);
    return () => clearTimeout(timer);
  }, [recipeId, showPartners]);

  if (recipeLoading) {
    return <RecipeDetailSkeleton />;
  }

  if (!recipe) {
    return (
      <View style={[styles.notFound, { backgroundColor: screenBackground }]}>
        <Text style={[styles.notFoundTitle, { color: themeColors.charcoal }]}>
          Recipe not found
        </Text>
        <Pressable onPress={() => router.back()} style={styles.notFoundBtn}>
          <Text style={styles.notFoundBtnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const pantryMatchPercent = getPantryMatchPercent(recipe, pantryIngredients);
  const saved = isRecipeSaved(recipe.id);
  const offlineDownloaded = isRecipeOffline(recipe.id);
  const shoppingProgress = getSessionProgress(recipe.id);
  const nextShopItem = getNextShoppingItem(recipe.id);

  const handleSavePress = () => {
    void Haptics.selectionAsync();
    trySaveRecipe(recipe.id);
  };

  const handleOfflinePress = () => {
    void Haptics.selectionAsync();
    void (async () => {
      let fullRecipe = recipe;
      if (!recipe.steps?.length) {
        const loaded = await loadRecipeById(recipe.id);
        if (loaded) fullRecipe = loaded;
      }
      tryToggleOfflineRecipe(fullRecipe);
    })();
  };

  const openCheckout = (
    partner: AffiliatePartner = "blinkit",
    focusItem?: string,
  ) => {
    if (!showPartners || missing.length === 0) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCheckoutFocusedItem(focusItem ?? null);
    setModalPartner(partner);
    setModalVisible(true);
  };

  const closeCheckout = () => {
    setModalVisible(false);
    setCheckoutFocusedItem(null);
  };

  const openDelivery = () => {
    if (!showPartners) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDeliveryModalVisible(true);
  };

  const handleShare = () => {
    void Haptics.selectionAsync();
    void shareRecipeOnWhatsApp(recipe);
  };

  const toggleStepDone = (index: number) => {
    void Haptics.selectionAsync();
    setCompletedSteps((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleCookMode = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCookMode((on) => !on);
  };

  const methodChips = (
    <>
      <RecipeDetailToolChip
        label={cookMode ? "Cook mode on" : "Cook mode"}
        active={cookMode}
        onPress={toggleCookMode}
      />
      <RecipeDetailToolChip
        label={stepsLang === "hi" ? "हिंदी" : "English"}
        active={stepsLang === "hi"}
        onPress={() => setStepsLang((lang) => (lang === "en" ? "hi" : "en"))}
      />
    </>
  );

  if (cookMode) {
    return (
      <View
        style={[styles.root, { backgroundColor: screenBackground }]}
        testID={testIds.screenRecipe}
      >
        <View
          style={[
            styles.cookHeader,
            {
              paddingTop: insets.top + spacing.sm,
              borderBottomColor: themeColors.border,
              backgroundColor: themeColors.white,
            },
          ]}
        >
          <Text
            style={[styles.cookTitle, { color: themeColors.charcoal }]}
            numberOfLines={2}
          >
            {recipe.title}
          </Text>
          <Text style={[styles.cookProgress, { color: themeColors.muted }]}>
            {completedSteps.size} of {displaySteps.length} steps done
          </Text>
          <View style={styles.cookLangRow}>
            <RecipeDetailToolChip
              label={stepsLang === "hi" ? "हिंदी" : "English"}
              active={stepsLang === "hi"}
              onPress={() => setStepsLang((lang) => (lang === "en" ? "hi" : "en"))}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          {...scrollIndicator}
          contentContainerStyle={[
            styles.cookScrollContent,
            { paddingBottom: insets.bottom + 88 },
          ]}
        >
          <RecipeMethodTimeline
            title={recipe.title}
            steps={displaySteps}
            prepTime={recipe.prepTime}
            cookMode
            completedSteps={completedSteps}
            onToggleStep={toggleStepDone}
          />
        </ScrollView>

        <View
          style={[
            styles.cookExitBar,
            {
              paddingBottom: Math.max(insets.bottom, spacing.md),
              backgroundColor: themeColors.white,
              borderTopColor: themeColors.border,
            },
          ]}
        >
          <Pressable
            onPress={toggleCookMode}
            style={styles.cookExitBtn}
            accessibilityRole="button"
            accessibilityLabel="Exit cook mode"
          >
            <Text style={styles.cookExitBtnText}>Exit cook mode</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.root, { backgroundColor: screenBackground }]}
      testID={testIds.screenRecipe}
    >
      <ScrollView
        style={styles.scroll}
        {...scrollIndicator}
        scrollEventThrottle={100}
        onScroll={() => setAdScrollGeneration((value) => value + 1)}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: stickyBarHeight + spacing.xl },
        ]}
      >
        <RecipeDetailHero
          recipe={recipe}
          saved={saved}
          offlineDownloaded={offlineDownloaded}
          onBack={() => router.back()}
          onShare={handleShare}
          onSave={handleSavePress}
          onOfflineToggle={handleOfflinePress}
          saveTestId={testIds.recipeSaveButton}
          offlineTestId={testIds.recipeOfflineButton}
        />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: themeColors.cream,
              borderColor: themeColors.border,
            },
          ]}
        >
          <RecipeDetailHeader
            recipe={recipe}
            pantryMatchPercent={pantryMatchPercent}
          />

          {displayDescription ? (
            <Text style={[styles.description, { color: themeColors.muted }]}>
              {displayDescription}
            </Text>
          ) : null}

          <View
            style={[
              styles.calorieCard,
              {
                backgroundColor: themeColors.white,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View
              style={[
                styles.calorieIcon,
                {
                  backgroundColor: isDark
                    ? "rgba(255,107,53,0.18)"
                    : "rgba(255,107,53,0.1)",
                },
              ]}
            >
              <Flame size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.calorieLabel, { color: themeColors.muted }]}>
                Per serving
              </Text>
              <Text
                style={[styles.calorieValue, { color: themeColors.charcoal }]}
              >
                {recipe.calories} kcal
              </Text>
            </View>
          </View>

          {partnersInTrialMode && showPartners ? <TrialPartnerBanner /> : null}

          {showPartners ? (
            <FoodDeliveryStrip
              recipeTitle={recipe.title}
              prepTime={recipe.prepTime}
              onOrderPress={openDelivery}
            />
          ) : (
            <PartnerUpsellCard
              title="Skip cooking tonight?"
              subtitle="Zomato & Swiggy delivery — unlock with Rasoi Plus trial or subscription"
              compact
            />
          )}

          <View style={styles.freeWrap}>
            <PlanBadge />
          </View>

          <RecipeSafetyDisclaimer />

          <RecipeDetailSection
            title="Ingredients"
            subtitle={
              missing.length > 0
                ? `${missing.length} missing from your pantry`
                : "Everything looks stocked"
            }
          >
            <RecipeIngredientsGuide
              ingredients={recipe.ingredients}
              available={available}
              missing={missing}
            />
            {missing.length > 0 ? (
              <ViewportLazyAdSlot scrollGeneration={adScrollGeneration}>
                <SponsorOrAd
                  sponsor={recipeSponsor}
                  loading={recipeSponsorLoading}
                  placement="recipe"
                  compact
                />
              </ViewportLazyAdSlot>
            ) : null}
            <View style={styles.ingredientShopWrap}>
              <MissingItemsPanel
                missing={missing}
                totalCount={countMatchableIngredients(recipe)}
                shoppingProgress={shoppingProgress}
                onShopAll={
                  missing.length > 0 && showPartners
                    ? () => openCheckout()
                    : undefined
                }
                onPartnerPress={
                  missing.length > 0 && showPartners
                    ? (partner) => openCheckout(partner)
                    : undefined
                }
              />
            </View>
          </RecipeDetailSection>

          <RecipeDetailSection
            title={stepsLang === "hi" ? "बनाने की विधि" : "Method"}
            subtitle={
              cookMode
                ? `${completedSteps.size} of ${displaySteps.length} steps done`
                : `${recipe.prepTime} min · ${displaySteps.length} steps`
            }
            toolbar={methodChips}
          >
            <RecipeMethodTimeline
              title={recipe.title}
              steps={displaySteps}
              prepTime={recipe.prepTime}
              cookMode={cookMode}
              completedSteps={completedSteps}
              onToggleStep={cookMode ? toggleStepDone : undefined}
            />
          </RecipeDetailSection>
        </View>
      </ScrollView>

      {!(deliveryModalVisible || modalVisible) && (
        <RecipeDetailStickyBar
          showPartners={showPartners}
          missingCount={missing.length}
          nextShopItem={nextShopItem}
          shoppingProgress={shoppingProgress}
          onDeliveryPress={openDelivery}
          onShopAll={() => openCheckout()}
          onShopNext={(partner, item) => openCheckout(partner, item)}
          onPaywallPress={() => router.push(PAYWALL_HREF)}
          onLayout={(height) => {
            if (Math.abs(height - stickyBarHeight) > 2) {
              setStickyBarHeight(height);
            }
          }}
        />
      )}

      {showPartners && (
        <>
          <FoodDeliveryModal
            visible={deliveryModalVisible}
            onClose={() => setDeliveryModalVisible(false)}
            recipeTitle={recipe.title}
            prepTime={recipe.prepTime}
          />

          <AffiliateCheckoutModal
            visible={modalVisible}
            onClose={closeCheckout}
            recipeTitle={recipe.title}
            recipeId={recipe.id}
            recipe={recipe}
            missingIngredients={missing}
            initialPartner={modalPartner}
            initialFocusedItem={checkoutFocusedItem}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  sheet: {
    marginTop: -spacing.xl,
    borderTopLeftRadius: radius.lg + 4,
    borderTopRightRadius: radius.lg + 4,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  description: {
    fontFamily: appFonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  calorieCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  calorieIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  calorieLabel: {
    fontFamily: appFonts.body,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  calorieValue: {
    fontFamily: appFonts.bodyBold,
    fontSize: 18,
    marginTop: 2,
  },
  freeWrap: {
    alignSelf: "flex-start",
  },
  ingredientShopWrap: {
    marginTop: spacing.sm,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  notFoundTitle: {
    fontFamily: appFonts.display,
    fontSize: 22,
  },
  notFoundBtn: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  notFoundBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 15,
    color: colors.white,
  },
  cookHeader: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
  },
  cookTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 20,
    lineHeight: 26,
  },
  cookProgress: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  cookLangRow: {
    flexDirection: "row",
    marginTop: spacing.xs,
  },
  cookScrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  cookExitBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  cookExitBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
  },
  cookExitBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 16,
    color: colors.white,
  },
});
