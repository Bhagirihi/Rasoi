import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { RecipeIngredient } from '@/data/mockRecipes';
import { ingredientKey } from '@/utils/recipeIngredients';

type RecipeIngredientsGuideProps = {
  ingredients: RecipeIngredient[];
  available: string[];
  missing: string[];
};

export default function RecipeIngredientsGuide({
  ingredients,
  available,
  missing,
}: RecipeIngredientsGuideProps) {
  const { colors: themeColors, isDark } = useTheme();
  const availableSet = new Set(available.map((item) => ingredientKey(item)));
  const missingSet = new Set(missing.map((item) => ingredientKey(item)));

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
        },
      ]}
    >
      {ingredients.map((ingredient, index) => {
        const key = ingredientKey(ingredient.name);
        const inPantry = availableSet.has(key);
        const isMissing = missingSet.has(key);

        return (
          <View
            key={`${ingredient.name}-${index}`}
            style={[
              styles.row,
              index < ingredients.length - 1 && styles.rowBorder,
              { borderBottomColor: themeColors.border },
            ]}
          >
            <View
              style={[
                styles.bullet,
                inPantry && styles.bulletInPantry,
                isMissing && styles.bulletMissing,
                !inPantry && !isMissing && {
                  backgroundColor: isDark ? themeColors.border : colors.border,
                },
              ]}
            />
            <Text style={[styles.text, { color: themeColors.charcoal }]}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              {ingredient.isStaple ? (
                <Text style={[styles.stapleHint, { color: themeColors.muted }]}>
                  {' '}
                  (staple)
                </Text>
              ) : null}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    backgroundColor: colors.border,
  },
  bulletInPantry: {
    backgroundColor: colors.green,
  },
  bulletMissing: {
    backgroundColor: colors.primary,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: colors.charcoal,
  },
  ingredientName: {
    fontWeight: '700',
  },
  stapleHint: {
    fontWeight: '500',
    fontSize: 13,
  },
});
