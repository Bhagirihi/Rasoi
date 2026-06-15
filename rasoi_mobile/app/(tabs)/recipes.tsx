import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Search, Timer } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import CookTonightSheet from '@/components/CookTonightSheet';
import { AppTabHeader } from '@/components/AppTabHeader';
import QuickFiltersSection, { getQuickFilterLabels } from '@/components/QuickFiltersSection';
import RecipeCard from '@/components/RecipeCard';
import { FlatListWithFloatingIndicator } from '@/components/ScrollableScreen';
import SponsorOrAd from '@/components/SponsorOrAd';
import { EmptyState } from '@/components/ui/Primitives';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import { usePlacementSponsor } from '@/hooks/usePlacementSponsor';
import { useRecipeDiscovery } from '@/hooks/useRecipeDiscovery';
import { colors, layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { Recipe } from '@/data/mockRecipes';
import { logRecipeSearch } from '@/services/recipeSearch';
import type { AffiliatePartner } from '@/utils/affiliate';
import {
  getPantryMatchPercent,
  getRecipePickReason,
  partitionIngredients,
  recipeMatchesSearch,
} from '@/utils/recipes';
import { hasValidProfilePhone, PHONE_REQUIRED_FOR_PARTNERS_MESSAGE } from '@/utils/phoneGate';

export default function RecipesTabScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { keyboardHeight, keyboardVisible } = useKeyboardInset();
  const { colors: themeColors } = useTheme();
  const { showDialog } = useAppDialog();
  const { showPartners, userPhone } = useAppContext();
  const {
    meal,
    recipes,
    recipesLoading,
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
  } = useRecipeDiscovery();
  const { sponsor: homeSponsor, loading: homeSponsorLoading } = usePlacementSponsor('home');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>('blinkit');
  const [cookTonightVisible, setCookTonightVisible] = useState(false);
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const lastLoggedSearch = useRef('');

  const searchedMoreRecipes = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return moreRecipes;
    return moreRecipes.filter((recipe) => recipeMatchesSearch(recipe, query));
  }, [moreRecipes, searchQuery]);

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
        sourceScreen: 'recipes',
        resultCount: searchedMoreRecipes.length,
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery, searchedMoreRecipes.length]);

  const sheetRecipe = cookTonightTarget;
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

  const clearDiscovery = () => {
    setSearchQuery('');
    if (activeFilters.length > 0) {
      handleFilterToggle('all');
    }
    if (pantryFilterActive) {
      setPantryFilterActive(false);
    }
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

  const listBottomPadding = keyboardVisible
    ? keyboardHeight + tabBarHeight + spacing.xxxl
    : tabBarHeight + spacing.xxxl + spacing.lg;

  const renderItem = ({ item, index }: { item: Recipe; index: number }) => (
    <View>
      {index === 1 && (
        <View style={styles.sponsorSlot}>
          <SponsorOrAd sponsor={homeSponsor} loading={homeSponsorLoading} placement="home" />
        </View>
      )}
      <RecipeCard
        recipe={item}
        testID={index === 0 ? testIds.recipeCardFirst : undefined}
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
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.cream }]}
      edges={['top']}
      testID={testIds.screenRecipesTab}
    >
      <FlatListWithFloatingIndicator
        data={searchedMoreRecipes}
        keyExtractor={(item) => item.id}
        {...scrollIndicator}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: listBottomPadding },
          searchedMoreRecipes.length === 0 && styles.listContentEmpty,
        ]}
        ItemSeparatorComponent={() => <View style={styles.itemGap} />}
        ListHeaderComponent={
          <View style={styles.screenSections}>
            <AppTabHeader title="Recipes" subtitle="Search and filter dishes for your kitchen" />

            <QuickFiltersSection
              variant="recipes"
              activeFilters={activeFilters}
              pantryFilterActive={pantryFilterActive}
              pantryIngredientCount={pantryIngredients.length}
              hasQuickFilters={hasQuickFilters || searchQuery.trim().length > 0}
              activeFilterLabels={activeFilterLabels}
              onFilterToggle={handleFilterToggle}
              onClearPantryFilter={() => setPantryFilterActive(false)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchTestId={testIds.recipesSearchInput}
              resultCount={searchedMoreRecipes.length}
              totalCount={moreRecipes.length}
              onClearAll={clearDiscovery}
            />

            {!recipesLoading && !recipesError && recipes.length > 0 && rankedRecipes.length === 0 && (
              <View
                style={[
                  styles.noMatchCard,
                  { backgroundColor: themeColors.white, borderColor: themeColors.border },
                ]}
              >
                <Text style={[styles.noMatchTitle, { color: themeColors.charcoal }]}>No recipes match</Text>
                <Text style={[styles.noMatchSub, { color: themeColors.muted }]}>
                  Try changing quick filters, turning off pantry mode, or updating diet and region in Settings.
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
          </View>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          recipesLoading && recipes.length === 0 ? (
            <EmptyState
              icon={Timer}
              title="Loading recipes"
              subtitle="Fetching dishes from Rasoi…"
            />
          ) : recipesError ? (
            <View style={styles.errorBox}>
              <EmptyState icon={Timer} title="Could not load recipes" subtitle={recipesError} />
              <Pressable onPress={() => void refreshRecipes()} style={styles.retryBtn}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            </View>
          ) : searchQuery.trim() && moreRecipes.length > 0 ? (
            <EmptyState
              icon={Search}
              title="No matches"
              subtitle={`Nothing matched "${searchQuery.trim()}". Try another dish or ingredient.`}
            />
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
  sponsorSlot: {
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
