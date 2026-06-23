import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Timer } from 'lucide-react-native';
import { useMemo, useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import CookTonightSheet from '@/components/CookTonightSheet';
import MissingShopInline, { missingShopActionStyles } from '@/components/MissingShopInline';
import { AppTabHeader } from '@/components/AppTabHeader';
import RecipeCard from '@/components/RecipeCard';
import RecipeImage from '@/components/RecipeImage';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import SponsorOrAd from '@/components/SponsorOrAd';
import TrialCountdownBanner from '@/components/TrialCountdownBanner';
import TonightCardsSkeleton from '@/components/TonightCardsSkeleton';
import HomeHeroLoadingBox from '@/components/HomeHeroLoadingBox';
import { EmptyState } from '@/components/ui/Primitives';
import { useRecipeDiscovery } from '@/hooks/useRecipeDiscovery';
import { useDismissOnBlur } from '@/hooks/useDismissOnBlur';
import { usePlacementSponsor } from '@/hooks/usePlacementSponsor';
import { useRecipeListAdIndices } from '@/hooks/useRecipeListAdIndices';
import { colors, layout, radius, scrollIndicator, shadows, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { Recipe } from '@/data/mockRecipes';
import type { AffiliatePartner } from '@/utils/affiliate';
import { getLocalizedGreeting } from '@/utils/greeting';
import {
  getPantryMatchPercent,
  getRecipePickReason,
  partitionIngredients,
} from '@/utils/recipes';
import { hasValidProfilePhone, PHONE_REQUIRED_FOR_PARTNERS_MESSAGE } from '@/utils/phoneGate';

export default function HomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors, semantic, isDark } = useTheme();
  const { showDialog } = useAppDialog();
  const { userName, showPartners, userPhone } = useAppContext();
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
  const { sponsor: homeSponsor, loading: homeSponsorLoading } = usePlacementSponsor('home');
  const tonightAdIndices = useRecipeListAdIndices(tonightCards, {
    minRecipesBeforeFirstAd: 1,
    minGap: 2,
    maxAds: 1,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>('blinkit');
  const [cookTonightVisible, setCookTonightVisible] = useState(false);
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(null);
  const [heroIntroFinished, setHeroIntroFinished] = useState(false);

  const { greeting, subtitle } = getLocalizedGreeting();
  const isLateNight = meal.slot === 'lateNight';
  const discoveryReady = !recipesLoading && rankingReady;
  const heroDataReady = discoveryReady && !!topPick;
  const showHeroIntro = !heroIntroFinished;
  const showHeroCard = heroIntroFinished && !!topPick;
  const showTonightSkeleton = !discoveryReady && tonightCards.length === 0;

  const topPickMissing = useMemo(() => {
    if (!topPick) return [];
    return partitionIngredients(topPick, pantryIngredients).missing;
  }, [topPick, pantryIngredients]);

  const topPickReason = useMemo(() => {
    if (!topPick) return '';
    return getRecipePickReason(topPick, {
      regionalCuisine,
      pantryIngredients,
      dietChoice,
      mealSlot: meal.slot,
    });
  }, [topPick, regionalCuisine, pantryIngredients, dietChoice, meal.slot]);

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
    if (!sheetRecipe) return '';
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
    partner: AffiliatePartner = 'blinkit',
  ) => {
    if (missing.length === 0 || !showPartners) return;
    if (!hasValidProfilePhone(userPhone)) {
      showDialog({
        title: 'Mobile number needed',
        message: PHONE_REQUIRED_FOR_PARTNERS_MESSAGE,
        buttons: [
          { text: 'Not now', style: 'cancel' },
          {
            text: 'Add in Settings',
            onPress: () => router.push('/(tabs)/settings/edit-profile'),
          },
        ],
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
      style={[styles.safe, { backgroundColor: themeColors.cream }]}
      edges={['top']}
      testID={testIds.screenHome}
    >
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + spacing.xxxl + spacing.lg },
        ]}
      >
        <View style={styles.screenSections}>
          <AppTabHeader
            title={
              userName
                ? `${greeting.replace('!', '')}, ${userName.split(' ')[0]}!`
                : greeting
            }
            subtitle={subtitle}
          />

          <TrialCountdownBanner />

          <SponsorOrAd
            sponsor={homeSponsor}
            loading={homeSponsorLoading}
            placement="home"
            compact
          />

          {!recipesLoading && recipesError && (
            <EmptyState
              icon={Timer}
              title="Could not load recipes"
              subtitle={recipesError}
            />
          )}

          {showHeroIntro && (
            <HomeHeroLoadingBox
              dataReady={heroDataReady}
              hasError={!!recipesError && !recipesLoading}
              isLateNight={isLateNight}
              onFinished={() => setHeroIntroFinished(true)}
            />
          )}

          {showHeroCard && (
            <Pressable
              style={[styles.heroCard, isLateNight && styles.heroCardLateNight]}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/recipe/${topPick.id}`);
              }}
            >
              <LinearGradient
                colors={
                  isLateNight
                    ? (['#2A1810', '#1A1A2E', '#14110F'] as const)
                    : ([colors.charcoal, colors.charcoal] as const)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <View style={styles.heroMain}>
                  <View style={styles.heroCopy}>
                    <View style={styles.heroTopRow}>
                      <View
                        style={[
                          styles.heroEyebrowPill,
                          isLateNight && styles.heroEyebrowPillLateNight,
                        ]}
                      >
                        {isLateNight && <Moon size={12} color={colors.saffron} fill={colors.saffron} />}
                        <Text
                          style={[
                            styles.heroEyebrow,
                            isLateNight && styles.heroEyebrowLateNight,
                          ]}
                        >
                          {meal.topPickEyebrow}
                        </Text>
                      </View>
                      <Text style={styles.heroMatchText}>{topPickPantryMatch}% pantry</Text>
                    </View>
                    <Text
                      style={[styles.heroTitle, isLateNight && styles.heroTitleLateNight]}
                      numberOfLines={2}
                    >
                      {topPick.title}
                    </Text>
                    <Text style={styles.heroReason} numberOfLines={2}>
                      {topPickReason}
                    </Text>
                    <Text style={styles.heroMeta}>
                      {topPick.prepTime} min · {topPick.dietType} · {topPick.region}
                    </Text>
                    {topPickMissing.length === 0 && (
                      <Pressable
                        onPress={(event) => {
                          event.stopPropagation?.();
                          void Haptics.selectionAsync();
                          if (topPick) openCookTonight(topPick);
                        }}
                        style={[
                          missingShopActionStyles.cookPill,
                          styles.cookTonightBtnStandalone,
                          isLateNight && styles.cookTonightBtnLateNight,
                        ]}
                      >
                        <Text style={missingShopActionStyles.cookPillText}>{meal.cookCta} →</Text>
                      </Pressable>
                    )}
                  </View>
                  <RecipeImage
                    uri={topPick.imageUrl}
                    tone="onDark"
                    style={[styles.heroImage, isLateNight && styles.heroImageLateNight]}
                  />
                </View>

                {topPickMissing.length > 0 && (
                  <MissingShopInline
                    missing={topPickMissing}
                    variant="hero"
                    cookSlot={
                      <Pressable
                        onPress={(event) => {
                          event.stopPropagation?.();
                          void Haptics.selectionAsync();
                          if (topPick) openCookTonight(topPick);
                        }}
                        style={[
                          missingShopActionStyles.cookPill,
                          isLateNight && styles.cookTonightBtnLateNight,
                        ]}
                      >
                        <Text style={missingShopActionStyles.cookPillText}>{meal.cookCta} →</Text>
                      </Pressable>
                    }
                    onShopPress={() => openShopModal(topPick, topPickMissing)}
                    onPartnerPress={(partner) =>
                      openShopModal(topPick, topPickMissing, partner)
                    }
                  />
                )}
              </LinearGradient>
            </Pressable>
          )}

          {showTonightSkeleton && (
            <TonightCardsSkeleton
              label={meal.alsoLabel}
              isLateNight={isLateNight}
              count={3}
            />
          )}

          {tonightCards.length > 0 && (
            <View style={styles.tonightCards}>
              <View style={styles.tonightSectionHeader}>
                {isLateNight && <Moon size={14} color={themeColors.muted} />}
                <Text style={[styles.tonightSectionLabel, { color: themeColors.muted }]}>
                  {meal.alsoLabel}
                </Text>
              </View>
              {tonightCards.map((recipe, index) => (
                <View key={recipe.id}>
                  {tonightAdIndices.has(index) && (
                    <SponsorOrAd
                      sponsor={homeSponsor}
                      loading={homeSponsorLoading}
                      placement="home"
                      compact
                      style={styles.tonightSponsorInset}
                    />
                  )}
                  <RecipeCard
                    recipe={recipe}
                    variant="tonight"
                    cookCtaLabel={meal.cookCta}
                    pickReason={getRecipePickReason(recipe, {
                      regionalCuisine,
                      pantryIngredients,
                      dietChoice,
                      mealSlot: meal.slot,
                    })}
                    pantryMatchPercent={getPantryMatchPercent(recipe, pantryIngredients)}
                    onShopMissing={openShopModal}
                    onCookTonight={openCookTonight}
                  />
                </View>
              ))}
            </View>
          )}

          {discoveryReady && !recipesError && recipes.length > 0 && rankedRecipes.length === 0 && (
            <View
              style={[
                styles.noMatchCard,
                { backgroundColor: themeColors.white, borderColor: themeColors.border },
              ]}
            >
              <Text style={[styles.noMatchTitle, { color: themeColors.charcoal }]}>No recipes match</Text>
              <Text style={[styles.noMatchSub, { color: themeColors.muted }]}>
                No matches for your diet, region, or pantry settings. Update preferences in Settings
                or browse dishes on the Recipe tab.
              </Text>
              {pantryFilterActive && (
                <Pressable
                  onPress={() => setPantryFilterActive(false)}
                  style={styles.noMatchBtn}
                >
                  <Text style={styles.noMatchBtnText}>Show all recipes</Text>
                </Pressable>
              )}
            </View>
          )}

          {discoveryReady && (
            <Pressable
              onPress={() => router.push('/(tabs)/recipes')}
              style={[
                styles.browseCard,
                { backgroundColor: themeColors.white, borderColor: themeColors.border },
              ]}
            >
              <Text style={[styles.browseTitle, { color: themeColors.charcoal }]}>More ideas</Text>
              <Text style={[styles.browseSub, { color: themeColors.muted }]}>
                Browse {Math.max(rankedRecipes.length - 4, 0)} more dishes on the Recipe tab →
              </Text>
            </Pressable>
          )}
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
    paddingTop: spacing.lg,
  },
  screenSections: {
    gap: spacing.xxl,
  },
  heroCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    ...shadows.card,
  },
  heroCardLateNight: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.45)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  heroGradient: {
    padding: spacing.lg,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  heroCopy: {
    flex: 1,
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroImageLateNight: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    borderColor: 'rgba(255,153,51,0.35)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  heroMatchText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.green,
  },
  heroEyebrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroEyebrowPillLateNight: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,107,53,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,153,51,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  heroEyebrowLateNight: {
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.saffron,
  },
  heroTitle: {
    marginTop: spacing.sm,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    color: colors.white,
  },
  heroTitleLateNight: {
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  heroReason: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: 'rgba(255,153,51,0.95)',
  },
  heroMeta: {
    marginTop: 4,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  cookTonightBtnStandalone: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  cookTonightBtnLateNight: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  tonightCards: {
    gap: spacing.md,
  },
  tonightSponsorInset: {
    marginBottom: spacing.md,
  },
  tonightSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tonightSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
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
    fontWeight: '700',
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
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  noMatchBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  browseCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    ...shadows.card,
  },
  browseTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  browseSub: {
    marginTop: spacing.xs,
    fontSize: 14,
    lineHeight: 20,
  },
});
