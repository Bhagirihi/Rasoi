import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Bookmark } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import MissingShopInline, {
  missingShopActionStyles,
} from "@/components/MissingShopInline";
import RecipeVisualBadge, {
  RecipeTagChips,
} from "@/components/RecipeVisualBadge";
import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { colors, radius, shadows, spacing } from "@/constants/theme";
import { Recipe } from "@/data/mockRecipes";
import type { AffiliatePartner } from "@/utils/affiliate";
import { hasRecipeImage } from "@/utils/recipeImage";
import { getRecipeVisualIdentity } from "@/utils/recipeVisualIdentity";
import { getPantryMatchPercent, partitionIngredients } from "@/utils/recipes";

export type RecipeCardVariant = "tonight" | "list";

interface RecipeCardProps {
  recipe: Recipe;
  testID?: string;
  variant?: RecipeCardVariant;
  /** @deprecated Use variant="tonight" */
  compact?: boolean;
  cookCtaLabel?: string;
  pickReason?: string;
  pantryMatchPercent?: number;
  onShopMissing?: (
    recipe: Recipe,
    missing: string[],
    partner?: AffiliatePartner,
  ) => void;
  onCookTonight?: (recipe: Recipe) => void;
  /** Plan tab: missing ingredients open Pantry instead of shop modal. */
  onPantryPress?: () => void;
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
  onPantryPress,
  cookCtaLabel = "Cook tonight",
}: RecipeCardProps) {
  const resolvedVariant: RecipeCardVariant =
    variant ?? (compact ? "tonight" : "list");
  const router = useRouter();
  const { colors: themeColors, isDark } = useTheme();
  const { pantryIngredients, isRecipeSaved, toggleSavedRecipe } =
    useAppContext();
  const matchPercent =
    pantryMatchPercent ?? getPantryMatchPercent(recipe, pantryIngredients);
  const { missing } = partitionIngredients(recipe, pantryIngredients);
  const saved = isRecipeSaved(recipe.id);
  const isTonight = resolvedVariant === "tonight";
  const visual = getRecipeVisualIdentity(recipe);
  const recipeHasPhoto = hasRecipeImage(recipe);
  const matchColor =
    matchPercent >= 70
      ? colors.green
      : matchPercent >= 40
        ? colors.primary
        : themeColors.muted;

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
    !onPantryPress && missing.length > 0 ? (
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
              <Text style={missingShopActionStyles.cookPillText}>
                {cookCtaLabel} →
              </Text>
            </Pressable>
          ) : undefined
        }
        onShopPress={() => handleShopPress()}
        onPartnerPress={(partner) => handleShopPress(partner)}
      />
    ) : null;

  const pantryFooter =
    onPantryPress && missing.length > 0 ? (
      <Pressable
        onPress={(event) => {
          event.stopPropagation?.();
          void Haptics.selectionAsync();
          onPantryPress();
        }}
        style={[
          styles.pantryFooter,
          {
            backgroundColor: themeColors.white,
            borderTopColor: themeColors.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Update pantry for missing ingredients"
      >
        <Text style={styles.pantryFooterCta}>Update pantry →</Text>
        <Text
          style={[styles.pantryFooterItems, { color: themeColors.muted }]}
          numberOfLines={2}
        >
          {missing.slice(0, 3).join(", ")}
          {missing.length > 3 ? ` +${missing.length - 3}` : ""}
        </Text>
      </Pressable>
    ) : null;

  const cardFooter = pantryFooter ?? shopFooter;

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
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.border,
          },
        ]}
      >
        <Pressable
          onPress={handlePress}
          testID={testID}
          style={styles.tonightMain}
        >
          <RecipeVisualBadge recipe={recipe} variant="strip" />
          <View style={styles.tonightBody}>
            <View style={styles.tonightTitleRow}>
              <Text
                style={[styles.tonightTitle, { color: themeColors.charcoal }]}
                numberOfLines={2}
              >
                {recipe.title}
              </Text>
              <Pressable
                onPress={handleSavePress}
                hitSlop={10}
                style={styles.bookmarkBtn}
              >
                <Bookmark
                  size={18}
                  color={saved ? colors.primary : themeColors.muted}
                  fill={saved ? colors.primary : "transparent"}
                />
              </Pressable>
            </View>

            {pickReason ? (
              <Text
                style={[styles.tonightReason, { color: themeColors.muted }]}
                numberOfLines={2}
              >
                {pickReason}
              </Text>
            ) : null}

            <Text style={[styles.tonightMeta, { color: themeColors.muted }]}>
              {recipe.prepTime} min · {matchPercent}% pantry · {recipe.dietType}
            </Text>

            <RecipeTagChips recipe={recipe} />

            {missing.length === 0 && cookPill ? (
              <View style={styles.standaloneCook}>{cookPill}</View>
            ) : null}
          </View>
        </Pressable>
        {cardFooter}
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
        <RecipeVisualBadge
          recipe={recipe}
          variant="hero"
          style={styles.listHero}
        />

        <View style={styles.listBody}>
          <View style={styles.listTitleRow}>
            <Text
              style={[styles.listTitle, { color: themeColors.charcoal }]}
              numberOfLines={2}
            >
              {recipe.title}
            </Text>
            <Pressable
              onPress={handleSavePress}
              hitSlop={10}
              style={styles.bookmarkBtn}
            >
              <Bookmark
                size={18}
                color={saved ? colors.primary : themeColors.muted}
                fill={saved ? colors.primary : "transparent"}
              />
            </Pressable>
          </View>

          {recipeHasPhoto ? (
            <Text
              style={[styles.listKitchen, { color: themeColors.muted }]}
              numberOfLines={1}
            >
              {visual.kitchenLabel} · {recipe.region}
            </Text>
          ) : null}

          {pickReason ? (
            <Text
              style={[styles.listReason, { color: colors.primary }]}
              numberOfLines={2}
            >
              {pickReason}
            </Text>
          ) : null}

          <View style={styles.listMetaRow}>
            <Text style={[styles.listMeta, { color: themeColors.muted }]}>
              {recipe.prepTime} min · {recipe.dietType}
            </Text>
            <View
              style={[
                styles.matchBadge,
                {
                  backgroundColor:
                    matchPercent >= 70
                      ? "rgba(0,168,107,0.12)"
                      : matchPercent >= 40
                        ? "rgba(255,107,53,0.12)"
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(26,26,46,0.06)",
                },
              ]}
            >
              <Text style={[styles.matchBadgeText, { color: matchColor }]}>
                {matchPercent}% pantry
              </Text>
            </View>
          </View>

          <RecipeTagChips recipe={recipe} />

          {missing.length === 0 && cookPill ? (
            <View style={styles.standaloneCook}>{cookPill}</View>
          ) : null}
        </View>
      </Pressable>

      {cardFooter}
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
    overflow: "hidden",
    ...shadows.card,
  },
  tonightMain: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  tonightBody: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.sm,
    justifyContent: "center",
  },
  tonightTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  tonightTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
    color: colors.charcoal,
  },
  tonightReason: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
    color: colors.primary,
  },
  tonightMeta: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
  },
  standaloneCook: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
  },
  bookmarkBtn: {
    padding: 2,
  },
  listCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.card,
  },
  listHero: {
    minHeight: 128,
  },
  listBody: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  listTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  listTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22,
    color: colors.charcoal,
  },
  listKitchen: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  listReason: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: colors.primary,
  },
  listMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: 4,
  },
  listMeta: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  },
  matchBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  pantryFooter: {
    borderTopWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  pantryFooterCta: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
  },
  pantryFooterItems: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 15,
  },
});
