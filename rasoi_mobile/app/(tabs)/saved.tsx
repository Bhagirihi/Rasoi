import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChefHat } from 'lucide-react-native';

import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import CookTonightSheet from '@/components/CookTonightSheet';
import { AppTabHeader } from '@/components/AppTabHeader';
import RecipeCard from '@/components/RecipeCard';
import { FlatListWithFloatingIndicator } from '@/components/ScrollableScreen';
import SponsorOrAd from '@/components/SponsorOrAd';
import { EmptyState, InsightBanner } from '@/components/ui/Primitives';
import { usePlacementSponsor } from '@/hooks/usePlacementSponsor';
import { colors, layout, scrollIndicator, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useTheme } from '@/context/ThemeContext';
import { useAppContext } from '@/context/AppContext';
import { Recipe } from '@/data/mockRecipes';
import type { AffiliatePartner } from '@/utils/affiliate';
import { getMealContext } from '@/utils/mealTime';
import {
  getPantryMatchPercent,
  getRecipePickReason,
  partitionIngredients,
} from '@/utils/recipes';
import { pantryHasIngredient } from '@/utils/recipeIngredients';

export default function SavedScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const meal = getMealContext();
  const { colors: themeColors } = useTheme();
  const { getSavedRecipes, pantryIngredients, dietChoice, regionalCuisine, showPartners } =
    useAppContext();
  const savedRecipes = getSavedRecipes();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const [modalPartner, setModalPartner] = useState<AffiliatePartner>('blinkit');
  const [cookTonightVisible, setCookTonightVisible] = useState(false);
  const [cookTonightTarget, setCookTonightTarget] = useState<Recipe | null>(null);
  const { sponsor: savedSponsor, loading: savedSponsorLoading } = usePlacementSponsor('saved');

  const totalMissing = useMemo(() => {
    return savedRecipes.reduce((sum, recipe) => {
      const missing = recipe.ingredients.filter((ing) => {
        const name = ing.name?.trim();
        return name && !pantryHasIngredient(pantryIngredients, name);
      }).length;
      return sum + missing;
    }, 0);
  }, [savedRecipes, pantryIngredients]);

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

  const openShopModal = (
    recipe: Recipe,
    missing: string[],
    partner: AffiliatePartner = 'blinkit',
  ) => {
    setModalPartner(partner);
    setModalRecipe(recipe);
    setModalMissing(missing);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.cream }]}
      edges={['top']}
      testID={testIds.screenSaved}
    >
      <FlatListWithFloatingIndicator
        data={savedRecipes}
        keyExtractor={(item) => item.id}
        {...scrollIndicator}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + spacing.xxxl + spacing.lg },
          savedRecipes.length === 0 && styles.contentEmpty,
        ]}
        ItemSeparatorComponent={() => <View style={styles.itemGap} />}
        ListHeaderComponent={
          <View style={styles.screenSections}>
            <AppTabHeader
              eyebrow="Saved menus"
              title="Recipes you love"
              subtitle="Re-cook favourites and order missing ingredients in one tap."
            />

            {savedRecipes.length > 0 && totalMissing > 0 && (
              <InsightBanner
                title={`${totalMissing} ingredients missing across saved recipes`}
                subtitle="Tap Shop on any card to checkout on Blinkit, Zepto, or Instamart."
              />
            )}

            {savedRecipes.length > 0 && (
              <SponsorOrAd
                sponsor={savedSponsor}
                loading={savedSponsorLoading}
                placement="saved"
                compact
              />
            )}

            {savedRecipes.length > 0 && <View style={styles.listDivider} />}
          </View>
        }
        renderItem={({ item }) => (
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
        )}
        ListEmptyComponent={
          <EmptyState
            icon={ChefHat}
            title="No saved recipes yet"
            subtitle="Tap Save on any recipe from Home to bookmark dishes you want to cook again."
          />
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
  listDivider: {
    height: spacing.sm,
  },
  itemGap: {
    height: spacing.md,
  },
  contentEmpty: {
    flexGrow: 1,
  },
});
