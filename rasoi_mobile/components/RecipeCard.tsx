import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import MissingShopInline, { missingShopActionStyles } from '@/components/MissingShopInline';
import RecipeImage from '@/components/RecipeImage';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { Recipe } from '@/data/mockRecipes';
import type { AffiliatePartner } from '@/utils/affiliate';
import { getPantryMatchPercent, partitionIngredients } from '@/utils/recipes';

export type RecipeCardVariant = 'tonight' | 'list';

interface RecipeCardProps {
  recipe: Recipe;
  testID?: string;
  variant?: RecipeCardVariant;
  /** @deprecated Use variant="tonight" */
  compact?: boolean;
  cookCtaLabel?: string;
  pickReason?: string;
  pantryMatchPercent?: number;
  onShopMissing?: (recipe: Recipe, missing: string[], partner?: AffiliatePartner) => void;
  onCookTonight?: (recipe: Recipe) => void;
}

export default function RecipeCard({
  recipe,
  testID,
  variant,
  compact = false,
  pickReason,
  pantryMatchPercent,
  onShopMissing,
  onCookTonight,
  cookCtaLabel = 'Cook tonight',
}: RecipeCardProps) {
  const resolvedVariant: RecipeCardVariant = variant ?? (compact ? 'tonight' : 'list');
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const { pantryIngredients, isRecipeSaved, toggleSavedRecipe } = useAppContext();
  const matchPercent = pantryMatchPercent ?? getPantryMatchPercent(recipe, pantryIngredients);
  const { missing } = partitionIngredients(recipe, pantryIngredients);
  const saved = isRecipeSaved(recipe.id);
  const isTonight = resolvedVariant === 'tonight';

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/recipe/${recipe.id}`);
  };

  const handleSavePress = () => {
    void Haptics.selectionAsync();
    toggleSavedRecipe(recipe.id);
  };

  const handleShopPress = (partner?: AffiliatePartner) => {
    void Haptics.selectionAsync();
    onShopMissing?.(recipe, missing, partner);
  };

  const handleCookPress = () => {
    void Haptics.selectionAsync();
    onCookTonight?.(recipe);
  };

  const shopFooter =
    missing.length > 0 ? (
      <MissingShopInline
        missing={missing}
        variant="footer"
        cookSlot={
          onCookTonight ? (
            <Pressable
              onPress={(event) => {
                event.stopPropagation?.();
                handleCookPress();
              }}
              style={missingShopActionStyles.cookPill}
            >
              <Text style={missingShopActionStyles.cookPillText}>{cookCtaLabel} →</Text>
            </Pressable>
          ) : undefined
        }
        onShopPress={() => handleShopPress()}
        onPartnerPress={(partner) => handleShopPress(partner)}
      />
    ) : null;

  const cookPill = onCookTonight ? (
    <Pressable
      onPress={(event) => {
        event.stopPropagation?.();
        handleCookPress();
      }}
      style={missingShopActionStyles.cookPill}
    >
      <Text style={missingShopActionStyles.cookPillText}>{cookCtaLabel} →</Text>
    </Pressable>
  ) : null;

  if (isTonight) {
    return (
      <View
        style={[
          styles.tonightCard,
          { backgroundColor: themeColors.white, borderColor: themeColors.border },
        ]}
      >
        <Pressable onPress={handlePress} testID={testID} style={styles.tonightMain}>
          <RecipeImage uri={recipe.imageUrl} style={styles.tonightImage} />
          <View style={styles.tonightBody}>
            <View style={styles.tonightTitleRow}>
              <Text style={[styles.tonightTitle, { color: themeColors.charcoal }]} numberOfLines={2}>
                {recipe.title}
              </Text>
              <Pressable onPress={handleSavePress} hitSlop={10} style={styles.bookmarkBtn}>
                <Bookmark
                  size={18}
                  color={saved ? colors.primary : themeColors.muted}
                  fill={saved ? colors.primary : 'transparent'}
                />
              </Pressable>
            </View>

            {pickReason ? (
              <Text style={[styles.tonightReason, { color: themeColors.muted }]} numberOfLines={2}>
                {pickReason}
              </Text>
            ) : null}

            <Text style={[styles.tonightMeta, { color: themeColors.muted }]}>
              {recipe.prepTime} min · {matchPercent}% pantry · {recipe.dietType}
            </Text>

            {missing.length === 0 && cookPill ? (
              <View style={styles.standaloneCook}>{cookPill}</View>
            ) : null}
          </View>
        </Pressable>
        {shopFooter}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.listCard,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <Pressable onPress={handlePress} testID={testID}>
        <RecipeImage uri={recipe.imageUrl} style={styles.listImage} />

        <View style={styles.listBody}>
          <View style={styles.listTitleRow}>
            <Text style={[styles.listTitle, { color: themeColors.charcoal }]} numberOfLines={2}>
              {recipe.title}
            </Text>
            <Pressable onPress={handleSavePress} hitSlop={10} style={styles.bookmarkBtn}>
              <Bookmark
                size={18}
                color={saved ? colors.primary : themeColors.muted}
                fill={saved ? colors.primary : 'transparent'}
              />
            </Pressable>
          </View>

          {pickReason ? (
            <Text style={[styles.listReason, { color: themeColors.muted }]} numberOfLines={2}>
              {pickReason}
            </Text>
          ) : null}

          <Text style={[styles.listMeta, { color: themeColors.muted }]}>
            {recipe.prepTime} min · {matchPercent}% pantry · {recipe.region}
          </Text>

          {missing.length === 0 && cookPill ? (
            <View style={styles.standaloneCook}>{cookPill}</View>
          ) : null}
        </View>
      </Pressable>

      {shopFooter}
    </View>
  );
}

const styles = StyleSheet.create({
  tonightCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    overflow: 'hidden',
    ...shadows.card,
  },
  tonightMain: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  tonightImage: {
    width: 92,
    alignSelf: 'stretch',
    minHeight: 108,
    borderTopLeftRadius: radius.lg - 1,
    borderBottomLeftRadius: radius.lg - 1,
  },
  tonightBody: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.sm,
    justifyContent: 'center',
  },
  tonightTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  tonightTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    color: colors.charcoal,
  },
  tonightReason: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: colors.primary,
  },
  tonightMeta: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  standaloneCook: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  bookmarkBtn: {
    padding: 2,
  },
  listCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  listImage: {
    width: '100%',
    height: 140,
  },
  listBody: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  listTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  listTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: colors.charcoal,
  },
  listReason: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  listMeta: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
});
