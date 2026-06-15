import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChefHat } from 'lucide-react-native';

import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
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
import { ingredientKey } from '@/utils/recipeIngredients';

export default function SavedScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors } = useTheme();
  const { getSavedRecipes, pantryIngredients } = useAppContext();
  const savedRecipes = getSavedRecipes();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const { sponsor: homeSponsor, loading: homeSponsorLoading } = usePlacementSponsor('home');

  const totalMissing = useMemo(() => {
    return savedRecipes.reduce((sum, recipe) => {
      const pantrySet = new Set(pantryIngredients.map((i) => ingredientKey(i)));
      const missing = recipe.ingredients.filter((ing) => {
        const key = ingredientKey(ing.name);
        return key && !pantrySet.has(key);
      }).length;
      return sum + missing;
    }, 0);
  }, [savedRecipes, pantryIngredients]);

  const openShopModal = (recipe: Recipe, missing: string[]) => {
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
              <View style={styles.sponsorSlot}>
                <SponsorOrAd
                  sponsor={homeSponsor}
                  loading={homeSponsorLoading}
                  placement="saved"
                  compact
                />
              </View>
            )}

            {savedRecipes.length > 0 && <View style={styles.listDivider} />}
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard recipe={item} compact onShopMissing={openShopModal} />
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
  sponsorSlot: {},
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
