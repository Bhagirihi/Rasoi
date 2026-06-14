import { Check } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import BrandSponsor from '@/components/BrandSponsor';
import MissingItemsPanel from '@/components/MissingItemsPanel';
import { colors, radius, spacing } from '@/constants/theme';
import { Recipe, RecipeIngredient } from '@/data/mockRecipes';

interface IngredientListProps {
  recipe: Recipe;
  available: string[];
  missing: string[];
  onShopMissing?: () => void;
}

function IngredientRow({
  ingredient,
}: {
  ingredient: RecipeIngredient;
}) {
  return (
    <View style={styles.rowAvailable}>
      <View style={styles.checkboxDone}>
        <Check size={14} color={colors.white} strokeWidth={3} />
      </View>
      <Text style={styles.rowTextAvailable}>{ingredient.name}</Text>
      {ingredient.isStaple && (
        <View style={styles.stapleBadge}>
          <Text style={styles.stapleText}>Staple</Text>
        </View>
      )}
    </View>
  );
}

export default function IngredientList({
  recipe,
  available,
  missing,
  onShopMissing,
}: IngredientListProps) {
  const availableSet = new Set(available.map((item) => item.toLowerCase()));

  const availableIngredients = recipe.ingredients.filter((ingredient) =>
    availableSet.has(ingredient.name.toLowerCase()),
  );

  const sponsoredIngredient = recipe.ingredients.find(
    (ingredient) => ingredient.recommendedBrand !== undefined,
  );

  return (
    <View>
      {availableIngredients.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Check size={18} color={colors.green} />
            <Text style={styles.sectionTitle}>Already in your kitchen</Text>
            <View style={styles.countBadgeGreen}>
              <Text style={styles.countTextGreen}>{availableIngredients.length}</Text>
            </View>
          </View>

          {availableIngredients.map((ingredient) => (
            <IngredientRow key={ingredient.name} ingredient={ingredient} />
          ))}
        </View>
      )}

      <MissingItemsPanel
        missing={missing}
        totalCount={recipe.ingredients.length}
        onShopAll={missing.length > 0 ? onShopMissing : undefined}
      />

      {sponsoredIngredient?.recommendedBrand && (
        <BrandSponsor
          brandName={sponsoredIngredient.recommendedBrand.name}
          logoUrl={sponsoredIngredient.recommendedBrand.logo}
          productLabel={`${sponsoredIngredient.recommendedBrand.name} recommended for this dish`}
          searchQuery={sponsoredIngredient.name}
        />
      )}

      {availableIngredients.length === 0 && missing.length > 0 && (
        <Text style={styles.emptyHint}>
          Update your pantry to track what you already have at home.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginLeft: spacing.sm,
    fontSize: 15,
    fontWeight: '800',
    color: colors.charcoal,
  },
  countBadgeGreen: {
    marginLeft: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,168,107,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  countTextGreen: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.green,
  },
  emptyHint: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  rowAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm + 2,
    backgroundColor: 'rgba(0,168,107,0.06)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  checkboxDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowTextAvailable: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
  stapleBadge: {
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  stapleText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
