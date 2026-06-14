import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Baby, Recycle, SlidersHorizontal, Sparkles, Timer } from 'lucide-react-native';
import { useMemo, useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdMobBanner from '@/components/AdMobBanner';
import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import CookTonightSheet from '@/components/CookTonightSheet';
import MissingShopInline from '@/components/MissingShopInline';
import { AppTabHeader } from '@/components/AppTabHeader';
import RecipeCard from '@/components/RecipeCard';
import { FlatListWithFloatingIndicator } from '@/components/ScrollableScreen';
import SponsorRail from '@/components/SponsorRail';
import TrialCountdownBanner from '@/components/TrialCountdownBanner';
import { EmptyState } from '@/components/ui/Primitives';
import { usePlacementSponsor } from '@/hooks/usePlacementSponsor';
import { colors, layout, radius, scrollIndicator, shadows, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { useRecipes } from '@/context/RecipesContext';
import { Recipe } from '@/data/mockRecipes';
import type { AffiliatePartner } from '@/utils/affiliate';
import { getLocalizedGreeting } from '@/utils/greeting';
import { getMealContext } from '@/utils/mealTime';
import { FastFilter, filterRecipes, getPantryMatchPercent, getRecipePickReason, partitionIngredients, sortRecipesForTonight } from '@/utils/recipes';
import { hasValidProfilePhone, PHONE_REQUIRED_FOR_PARTNERS_MESSAGE } from '@/utils/phoneGate';
import { dietChoiceToFilter } from '@/utils/storage';

const QUICK_FILTERS: Array<{
  value: FastFilter;
  label: string;
  icon: typeof Timer;
}> = [
  { value: 'all', label: 'All picks', icon: Sparkles },
  { value: 'under20', label: 'Under 20 mins', icon: Timer },
  { value: 'leftover', label: 'Leftover', icon: Recycle },
  { value: 'kids', label: 'Kids', icon: Baby },
];

export default function HomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { showDialog } = useAppDialog();
  const {
    userName,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    pantryIngredients,
    pantryFilterActive,
    setPantryFilterActive,
    showPartners,
    userPhone,
  } = useAppContext();
  const { recipes, loading: recipesLoading, error: recipesError, refreshRecipes } = useRecipes();
  const [activeFilter, setActiveFilter] = useState<FastFilter>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>('blinkit');
  const { sponsor: homeSponsor } = usePlacementSponsor('home');
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [cookTonightVisible, setCookTonightVisible] = useState(false);
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(null);

  const { greeting, subtitle } = getLocalizedGreeting();
  const meal = getMealContext();

  const filteredRecipes = useMemo(
    () =>
      filterRecipes(recipes, {
        dietPreference: dietChoiceToFilter(dietChoice),
        regionalCuisine,
        favoriteCuisines,
        pantryIngredients,
        fastFilter: activeFilter,
        requirePantryMatch: pantryFilterActive,
        pantryMatchMode: pantryFilterActive ? 'any' : 'full',
      }),
    [recipes, dietChoice, regionalCuisine, favoriteCuisines, pantryIngredients, activeFilter, pantryFilterActive],
  );

  useEffect(() => {
    if (!pantryFilterActive || recipesLoading || recipes.length === 0) return;
    if (filteredRecipes.length > 0) return;
    setPantryFilterActive(false);
  }, [filteredRecipes.length, pantryFilterActive, recipes.length, recipesLoading, setPantryFilterActive]);

  const rankedRecipes = useMemo(
    () =>
      sortRecipesForTonight(filteredRecipes, {
        regionalCuisine,
        pantryIngredients,
        mealSlot: meal.slot,
      }),
    [filteredRecipes, regionalCuisine, pantryIngredients, meal.slot],
  );

  const topPick = rankedRecipes[0];
  const tonightCards = rankedRecipes.slice(1, 4);
  const moreRecipes = rankedRecipes.slice(4);
  const listData = showAllRecipes ? moreRecipes : [];

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

  const handleFilterToggle = (filter: FastFilter) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter((current) => (current === filter ? 'all' : filter));
  };

  const renderItem = ({ item, index }: { item: Recipe; index: number }) => (
    <View>
      {index === 1 && homeSponsor && <SponsorRail {...homeSponsor} />}
      <RecipeCard
        recipe={item}
        variant="list"
        pickReason={getRecipePickReason(item, {
          regionalCuisine,
          pantryIngredients,
          dietChoice,
          mealSlot: meal.slot,
        })}
        pantryMatchPercent={getPantryMatchPercent(item, pantryIngredients)}
        onShopMissing={openShopModal}
        onCookTonight={openCookTonight}
        cookCtaLabel={meal.cookCta}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatListWithFloatingIndicator
        data={listData}
        keyExtractor={(item) => item.id}
        floatingBottomOffset={tabBarHeight}
        floatingLabel="More recipes"
        showFloatingIndicator={showAllRecipes && listData.length > 0}
        {...scrollIndicator}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + spacing.xxxl + (showAllRecipes ? 0 : spacing.lg) },
        ]}
        ListHeaderComponent={
          <View>
            <AppTabHeader
              title={
                userName
                  ? `${greeting.replace('!', '')}, ${userName.split(' ')[0]}!`
                  : greeting
              }
              subtitle={subtitle}
            />

            <TrialCountdownBanner />

            {topPick ? null : !recipesLoading && !recipesError && recipes.length > 0 ? (
              <View style={styles.noMatchCard}>
                <Text style={styles.noMatchTitle}>No recipes match your filters</Text>
                <Text style={styles.noMatchSub}>
                  Try turning off pantry mode, switching diet, or setting region to All India in Settings.
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
            ) : null}

            {topPick && (
              <Pressable
                style={styles.heroCard}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push(`/recipe/${topPick.id}`);
                }}
              >
                <View style={styles.heroMain}>
                  <View style={styles.heroCopy}>
                    <View style={styles.heroTopRow}>
                      <Text style={styles.heroEyebrow}>{meal.topPickEyebrow}</Text>
                      <Text style={styles.heroMatchText}>{topPickPantryMatch}% pantry</Text>
                    </View>
                    <Text style={styles.heroTitle} numberOfLines={2}>
                      {topPick.title}
                    </Text>
                    <Text style={styles.heroReason} numberOfLines={2}>
                      {topPickReason}
                    </Text>
                    <Text style={styles.heroMeta}>
                      {topPick.prepTime} min · {topPick.dietType} · {topPick.region}
                    </Text>
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation?.();
                        void Haptics.selectionAsync();
                        if (topPick) openCookTonight(topPick);
                      }}
                      style={styles.cookTonightBtn}
                    >
                      <Text style={styles.cookTonightBtnText}>{meal.cookCta} →</Text>
                    </Pressable>
                  </View>
                  <Image
                    source={{ uri: topPick.imageUrl }}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                </View>

                {topPickMissing.length > 0 && (
                  <View style={styles.heroShopFooter}>
                    <MissingShopInline
                      missing={topPickMissing}
                      variant="hero"
                      onShopPress={() => openShopModal(topPick, topPickMissing)}
                      onPartnerPress={(partner) => openShopModal(topPick, topPickMissing, partner)}
                    />
                  </View>
                )}
              </Pressable>
            )}

            {tonightCards.length > 0 && (
              <View style={styles.tonightCards}>
                <Text style={styles.tonightSectionLabel}>{meal.alsoLabel}</Text>
                {tonightCards.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
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
                ))}
              </View>
            )}

            <AdMobBanner placement="home" />

            <View style={styles.quickFiltersSection}>
              <View style={styles.quickFiltersHeader}>
                <SlidersHorizontal size={16} color={colors.primary} />
                <Text style={styles.quickFiltersTitle}>Quick filters</Text>
              </View>

              {pantryFilterActive && (
                <Pressable
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setPantryFilterActive(false);
                  }}
                  style={styles.pantryBanner}
                >
                  <Text style={styles.pantryBannerTitle}>
                    Pantry mode · {pantryIngredients.length} items
                  </Text>
                  <Text style={styles.pantryBannerSub}>Tap to show all recipes</Text>
                </Pressable>
              )}

              <View style={styles.filterChipRow}>
                {QUICK_FILTERS.map(({ value, label, icon: Icon }) => {
                  const isActive = activeFilter === value;
                  return (
                    <Pressable
                      key={value}
                      onPress={() => handleFilterToggle(value)}
                      style={[styles.filterChip, isActive && styles.filterChipActive]}
                    >
                      <Icon size={14} color={isActive ? colors.white : colors.primary} />
                      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {!showAllRecipes && moreRecipes.length > 0 && (
              <Pressable
                onPress={() => {
                  void Haptics.selectionAsync();
                  setShowAllRecipes(true);
                }}
                style={styles.showAllBtn}
              >
                <Text style={styles.showAllBtnText}>
                  View all {rankedRecipes.length} recipes
                </Text>
              </Pressable>
            )}

            {showAllRecipes && (
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>More ideas</Text>
                <Text style={styles.listCount}>{moreRecipes.length} dishes</Text>
              </View>
            )}
          </View>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          recipesLoading ? (
            <EmptyState
              icon={Timer}
              title="Loading recipes"
              subtitle="Fetching tonight's dishes from Rasoi…"
            />
          ) : recipesError ? (
            <View style={styles.errorBox}>
              <EmptyState
                icon={Timer}
                title="Could not load recipes"
                subtitle={recipesError}
              />
              <Pressable onPress={() => void refreshRecipes()} style={styles.retryBtn}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <EmptyState
              icon={Timer}
              title="No recipes match"
              subtitle="Try changing diet, region, or pantry filters on Home."
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
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  listContent: { paddingHorizontal: layout.screenPadding },
  heroCard: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.charcoal,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    overflow: 'hidden',
    ...shadows.card,
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
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
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
  heroEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    color: colors.white,
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
  cookTonightBtn: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  cookTonightBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  heroShopFooter: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tonightCards: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  tonightSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  quickFiltersSection: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card,
  },
  quickFiltersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickFiltersTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  showAllBtn: {
    marginTop: spacing.lg,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
  },
  showAllBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.charcoal,
  },
  noMatchCard: {
    marginTop: spacing.lg,
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
  heroCta: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  heroCtaGreen: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.green,
  },
  heroCtaMuted: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
  },
  pantryBanner: {
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,168,107,0.1)',
    padding: 14,
  },
  pantryBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.green,
  },
  pantryBannerSub: {
    marginTop: 2,
    fontSize: 12,
    color: colors.muted,
  },
  sectionTitle: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
  },
  dietRow: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dietChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 12,
    paddingVertical: 10,
  },
  dietChipActive: {
    backgroundColor: colors.charcoal,
  },
  dietDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dietChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
  },
  dietChipTextActive: {
    color: colors.white,
  },
  chipScroll: { gap: 8, paddingRight: 8 },
  chip: {
    borderRadius: 999,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.charcoal,
  },
  chipTextActive: { color: colors.white },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
  filterTextActive: {
    color: colors.white,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.charcoal,
  },
  listCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  errorBox: {
    gap: spacing.md,
  },
  retryBtn: {
    alignSelf: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
});
