import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChefHat } from 'lucide-react-native';

import AffiliateCheckoutModal from '@/components/AffiliateCheckoutModal';
import { AppTabHeader } from '@/components/AppTabHeader';
import RecipeCard from '@/components/RecipeCard';
import { FlatListWithFloatingIndicator } from '@/components/ScrollableScreen';
import SponsorRail from '@/components/SponsorRail';
import { EmptyState, InsightBanner } from '@/components/ui/Primitives';
import { usePlacementSponsor } from '@/hooks/usePlacementSponsor';
import { colors, layout, scrollIndicator, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Recipe } from '@/data/mockRecipes';

export default function SavedScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { getSavedRecipes, pantryIngredients } = useAppContext();
  const savedRecipes = getSavedRecipes();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecipe, setModalRecipe] = useState<Recipe | null>(null);
  const [modalMissing, setModalMissing] = useState<string[]>([]);
  const { sponsor: homeSponsor } = usePlacementSponsor('home');

  const totalMissing = useMemo(() => {
    return savedRecipes.reduce((sum, recipe) => {
      const pantrySet = new Set(pantryIngredients.map((i) => i.toLowerCase()));
      const missing = recipe.ingredients.filter(
        (ing) => !pantrySet.has(ing.name.toLowerCase()),
      ).length;
      return sum + missing;
    }, 0);
  }, [savedRecipes, pantryIngredients]);

  const openShopModal = (recipe: Recipe, missing: string[]) => {
    setModalRecipe(recipe);
    setModalMissing(missing);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatListWithFloatingIndicator
        data={savedRecipes}
        keyExtractor={(item) => item.id}
        floatingBottomOffset={tabBarHeight}
        floatingLabel="More saved"
        {...scrollIndicator}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + spacing.xxxl },
          savedRecipes.length === 0 && styles.contentEmpty,
        ]}
        ListHeaderComponent={
          <View>
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

            {savedRecipes.length > 0 && homeSponsor && <SponsorRail {...homeSponsor} compact />}
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
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
  },
  contentEmpty: {
    flexGrow: 1,
  },
});
