import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Clock,
  Gauge,
  MapPin,
  Share2,
  ShoppingCart,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RecipeVisualBadge from "@/components/RecipeVisualBadge";
import RecipeDetailSkeleton from "@/components/RecipeDetailSkeleton";

import AffiliateCheckoutModal from "@/components/AffiliateCheckoutModal";
import SponsorOrAd from "@/components/SponsorOrAd";
import FoodDeliveryModal from "@/components/FoodDeliveryModal";
import FoodDeliveryStrip from "@/components/FoodDeliveryStrip";
import IngredientList from "@/components/IngredientList";
import PartnerUpsellCard from "@/components/PartnerUpsellCard";
import RecipeSafetyDisclaimer from "@/components/RecipeSafetyDisclaimer";
import TrialPartnerBanner from "@/components/TrialPartnerBanner";
import { PlanBadge } from "@/components/ui/Primitives";
import { SCREENSHOT_MODE } from "@/constants/screenshotMode";
import {
  colors,
  layout,
  radius,
  scrollIndicator,
  shadows,
  spacing,
} from "@/constants/theme";
import { testIds } from "@/constants/testIds";
import { useTheme } from "@/context/ThemeContext";
import { useAppContext } from "@/context/AppContext";
import { useRecipes } from "@/context/RecipesContext";
import { fetchRecipeSponsor, type SponsorCardData } from "@/services/sponsors";
import type { Recipe } from "@/data/mockRecipes";
import { useRasoiRealtimeTables } from "@/utils/realtime";
import { getRegionalMatchPercent, partitionIngredients } from "@/utils/recipes";
import { getRecipeVisualIdentity } from "@/utils/recipeVisualIdentity";
import { getRecipeSteps } from "@/utils/recipeSteps";
import { getRecipeStepsHi } from "@/utils/recipeStepsHi";
import { shareRecipeOnWhatsApp } from "@/utils/shareRecipe";
import { PAYWALL_HREF } from "@/utils/routes";
import type { AffiliatePartner } from "@/utils/affiliate";

function normalizeRecipeId(id: string | string[] | undefined): string {
  if (Array.isArray(id)) return id[0] ?? "";
  return id ?? "";
}

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
    regionalCuisine,
    isRecipeSaved,
    toggleSavedRecipe,
    showPartners,
    partnersInTrialMode,
  } = useAppContext();
  const { getRecipeById, loadRecipeById } = useRecipes();
  const loadRecipeByIdRef = useRef(loadRecipeById);
  loadRecipeByIdRef.current = loadRecipeById;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>("blinkit");
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [stickyBarHeight, setStickyBarHeight] = useState(160);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(true);
  const [recipeSponsor, setRecipeSponsor] = useState<SponsorCardData | null>(
    null,
  );
  const [recipeSponsorLoading, setRecipeSponsorLoading] = useState(true);
  const [cookMode, setCookMode] = useState(startInCookMode);
  const [stepsLang, setStepsLang] = useState<"en" | "hi">("en");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    () => new Set(),
  );
  const { colors: themeColors } = useTheme();

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

    const cached = getRecipeById(recipeId);
    if (cached) {
      setRecipe(cached);
      setRecipeLoading(false);
    } else {
      setRecipe(null);
      setRecipeLoading(true);
    }

    void loadRecipeByIdRef
      .current(recipeId)
      .then((loaded) => {
        if (cancelled) return;
        setRecipe(loaded);
        setRecipeLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setRecipe(null);
        setRecipeLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Only re-load when the route id changes; recipe list updates are handled via the fetch below.
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
      return getRecipeStepsHi(recipe.id, recipe.title);
    }
    return recipe.steps ?? getRecipeSteps(recipe.id, recipe.title);
  }, [recipe, stepsLang]);

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
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Recipe not found</Text>
        <Pressable onPress={() => router.back()} style={styles.notFoundBtn}>
          <Text style={styles.notFoundBtnText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const matchPercent = getRegionalMatchPercent(recipe.region, regionalCuisine);
  const recipeVisual = getRecipeVisualIdentity(recipe);
  const saved = isRecipeSaved(recipe.id);

  const handleSavePress = () => {
    void Haptics.selectionAsync();
    toggleSavedRecipe(recipe.id);
  };

  const openCheckout = (partner: AffiliatePartner = "blinkit") => {
    if (!showPartners || missing.length === 0) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setModalPartner(partner);
    setModalVisible(true);
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

  return (
    <View
      style={[styles.root, { backgroundColor: themeColors.cream }]}
      testID={testIds.screenRecipe}
    >
      <ScrollView
        style={styles.scroll}
        {...scrollIndicator}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: stickyBarHeight + spacing.xl },
        ]}
      >
        <View style={styles.hero}>
          <RecipeVisualBadge recipe={recipe} variant="backdrop" style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={['transparent', 'rgba(26,26,46,0.88)']}
            style={StyleSheet.absoluteFillObject}
          />

          <SafeAreaView edges={["top"]} style={styles.heroTopBar}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <ArrowLeft size={22} color={colors.white} />
            </Pressable>
            <View style={styles.heroActions}>
              <Pressable onPress={handleShare} style={styles.iconBtn}>
                <Share2 size={20} color={colors.white} />
              </Pressable>
              <Pressable
                onPress={handleSavePress}
                style={[styles.saveBtn, saved && styles.saveBtnActive]}
                testID={testIds.recipeSaveButton}
              >
                <Bookmark size={16} color={colors.white} />
                <Text style={styles.saveBtnText}>
                  {saved ? "Saved" : "Save"}
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>

          <View style={styles.heroBottom}>
            <Text style={styles.heroEyebrow}>
              {recipeVisual.emoji} {recipeVisual.kitchenLabel} · {recipeVisual.mood}
            </Text>
            <Text style={styles.heroTitle}>{recipe.title}</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.heroPill}>
                <Clock size={14} color={colors.white} />
                <Text style={styles.heroPillText}>{recipe.prepTime} min</Text>
              </View>
              <View style={styles.heroPill}>
                <Gauge size={14} color={colors.white} />
                <Text style={styles.heroPillText}>{recipe.difficulty}</Text>
              </View>
              <View style={[styles.heroPill, styles.heroPillGreen]}>
                <MapPin size={14} color={colors.white} />
                <Text style={styles.heroPillText}>
                  {matchPercent}% regional match
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {partnersInTrialMode && showPartners && <TrialPartnerBanner />}

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

          <Text style={styles.description}>{recipe.description}</Text>

          <RecipeSafetyDisclaimer />

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>{recipe.calories}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Region</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {recipe.region}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Diet</Text>
              <Text style={[styles.statValue, { color: colors.green }]}>
                {recipe.dietType}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>How to cook</Text>
          <View style={styles.stepsToolbar}>
            <Pressable
              onPress={toggleCookMode}
              style={[styles.toolChip, cookMode && styles.toolChipActive]}
            >
              <Text
                style={[
                  styles.toolChipText,
                  cookMode && styles.toolChipTextActive,
                ]}
              >
                {cookMode ? "Cook mode on" : "Cook mode"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                setStepsLang((lang) => (lang === "en" ? "hi" : "en"));
              }}
              style={[
                styles.toolChip,
                stepsLang === "hi" && styles.toolChipActive,
              ]}
            >
              <Text
                style={[
                  styles.toolChipText,
                  stepsLang === "hi" && styles.toolChipTextActive,
                ]}
              >
                {stepsLang === "hi" ? "हिंदी" : "English"}
              </Text>
            </Pressable>
          </View>
          {displaySteps.map((step, index) => {
            const done = completedSteps.has(index);
            return (
              <Pressable
                key={`${stepsLang}-${index}`}
                onPress={cookMode ? () => toggleStepDone(index) : undefined}
                style={[
                  styles.stepRow,
                  cookMode && styles.stepRowCook,
                  done && styles.stepRowDone,
                ]}
              >
                <View
                  style={[styles.stepNumber, done && styles.stepNumberDone]}
                >
                  {done ? (
                    <Check size={14} color={colors.white} strokeWidth={3} />
                  ) : (
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  )}
                </View>
                <Text
                  style={[styles.stepText, cookMode && styles.stepTextCook]}
                >
                  {step}
                </Text>
              </Pressable>
            );
          })}

          <SponsorOrAd
            sponsor={recipeSponsor}
            loading={recipeSponsorLoading}
            placement="recipe"
            compact
          />

          <Text style={styles.sectionTitle}>Ingredients</Text>
          <IngredientList
            recipe={recipe}
            available={available}
            missing={missing}
            onShopMissing={
              missing.length > 0 && showPartners
                ? () => openCheckout()
                : undefined
            }
            onPartnerPress={
              missing.length > 0 && showPartners ? openCheckout : undefined
            }
          />
        </View>
      </ScrollView>

      {!(deliveryModalVisible || modalVisible) && (
        <SafeAreaView
          edges={["bottom"]}
          style={styles.stickyBar}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            if (height > 0 && Math.abs(height - stickyBarHeight) > 2) {
              setStickyBarHeight(height);
            }
          }}
        >
          {showPartners ? (
            <>
              <Pressable
                onPress={openDelivery}
                style={styles.stickyBtnDelivery}
              >
                <Text style={styles.stickyDeliveryEyebrow}>Recommended</Text>
                <Text style={styles.stickyTitle}>
                  Skip cooking — order ready-made
                </Text>
                <Text style={styles.stickySub}>
                  Zomato · Swiggy · ~30 min delivery
                </Text>
              </Pressable>
              {missing.length > 0 && (
                <Pressable
                  onPress={() => openCheckout()}
                  style={styles.stickyBtnGroceries}
                >
                  <ShoppingCart size={16} color={colors.primary} />
                  <Text style={styles.stickyGroceriesText}>
                    Or shop {missing.length} grocery item
                    {missing.length !== 1 ? "s" : ""}
                  </Text>
                </Pressable>
              )}
            </>
          ) : (
            <Pressable
              onPress={() => router.push(PAYWALL_HREF)}
              style={styles.stickyBtnDelivery}
            >
              <Text style={styles.stickyDeliveryEyebrow}>Rasoi Plus</Text>
              <Text style={styles.stickyTitle}>
                Unlock shop & delivery partners
              </Text>
              <Text style={styles.stickySub}>
                Start 3-day trial or subscribe in Settings
              </Text>
            </Pressable>
          )}
        </SafeAreaView>
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
            onClose={() => setModalVisible(false)}
            recipeTitle={recipe.title}
            recipeId={recipe.id}
            missingIngredients={missing}
            initialPartner={modalPartner}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
    paddingHorizontal: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.charcoal,
  },
  notFoundBtn: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  notFoundBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
  },
  hero: {
    height: 288,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroTopBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  saveBtnActive: {
    backgroundColor: colors.primary,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },
  heroBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.88)",
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.white,
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroPillGreen: {
    backgroundColor: "rgba(0,168,107,0.8)",
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
  },
  body: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
  },
  freeWrap: {
    alignSelf: "flex-start",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...shadows.card,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.muted,
  },
  statValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "800",
    color: colors.charcoal,
  },
  sectionTitle: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.sm,
    fontSize: 15,
    fontWeight: "800",
    color: colors.charcoal,
  },
  stepsToolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  toolChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toolChipActive: {
    borderColor: colors.primary,
    backgroundColor: "rgba(255,107,53,0.12)",
  },
  toolChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
  },
  toolChipTextActive: {
    color: colors.primary,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card,
  },
  stepRowCook: {
    paddingVertical: spacing.lg,
  },
  stepRowDone: {
    opacity: 0.72,
    backgroundColor: "rgba(0,168,107,0.06)",
    borderColor: "rgba(0,168,107,0.25)",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberDone: {
    backgroundColor: colors.green,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.white,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.charcoal,
  },
  stepTextCook: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "600",
  },
  stickyBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  stickyBtnDelivery: {
    borderRadius: radius.md,
    backgroundColor: colors.charcoal,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E23744",
    ...shadows.cta,
  },
  stickyDeliveryEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.saffron,
  },
  stickyTitle: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "800",
    color: colors.white,
    textAlign: "center",
  },
  stickySub: {
    marginTop: 2,
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },
  stickyBtnGroceries: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  stickyGroceriesText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
});
