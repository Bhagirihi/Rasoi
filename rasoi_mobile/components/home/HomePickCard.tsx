import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bookmark,
  ChevronRight,
  Info,
  Leaf,
  Sparkles,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import RecipeVisualBadge from "@/components/RecipeVisualBadge";
import { appFonts } from "@/constants/fonts";
import { colors, radius, shadows, spacing } from "@/constants/theme";
import type { Recipe } from "@/data/mockRecipes";
import { useAppContext } from "@/context/AppContext";
import { useAppDialog } from "@/context/AppDialogContext";
import { useTheme } from "@/context/ThemeContext";
import type { AffiliatePartner } from "@/utils/affiliate";
import { hasRecipeImage } from "@/utils/recipeImage";
import { getRecipeMatchStyle } from "@/utils/recipeMatchStyle";
import { getRecipeVisualIdentity } from "@/utils/recipeVisualIdentity";
import { partitionIngredients } from "@/utils/recipes";

const ORDER_PARTNERS_LINE = "Missing items · Blinkit · Zepto · Instamart";
const ACTION_RADIUS = 12;
const PICK_HERO_HEIGHT = Math.round(
  Math.min(152, Dimensions.get("window").width * 0.38),
);

export { HomePickShuffleButton } from "@/components/home/HomeRecipeRow";

type HomePickCardProps = {
  recipe: Recipe;
  eyebrow: string;
  pickReason?: string;
  pantryMatchPercent: number;
  cookCtaLabel: string;
  headerTrailing?: ReactNode;
  onPress: () => void;
  onCookTonight: () => void;
  onShopMissing: (missing: string[], partner?: AffiliatePartner) => void;
  onNotInterested?: () => void;
};

function formatMissingList(missing: string[]): string {
  return missing.join(", ");
}

export default function HomePickCard({
  recipe,
  eyebrow,
  pickReason,
  pantryMatchPercent,
  cookCtaLabel,
  headerTrailing,
  onPress,
  onCookTonight,
  onShopMissing,
  onNotInterested,
}: HomePickCardProps) {
  const { colors: themeColors, isDark } = useTheme();
  const { isRecipeSaved, toggleSavedRecipe, pantryIngredients } =
    useAppContext();
  const { showDialog } = useAppDialog();

  const visual = getRecipeVisualIdentity(recipe);
  const recipeHasPhoto = hasRecipeImage(recipe);
  const saved = isRecipeSaved(recipe.id);
  const hasDescription = Boolean(recipe.description?.trim());
  const missing = useMemo(
    () => partitionIngredients(recipe, pantryIngredients).missing,
    [recipe.id, recipe.ingredients, pantryIngredients],
  );
  const hasMissing = missing.length > 0;
  const matchStyle = getRecipeMatchStyle(pantryMatchPercent, themeColors.muted);

  return (
    <View
      style={[
        styles.card,
        shadows.cta,
        {
          backgroundColor: isDark ? themeColors.white : "#FFFBF8",
          borderColor: isDark
            ? "rgba(255,107,53,0.35)"
            : "rgba(255,107,53,0.22)",
        },
      ]}
    >
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        accessibilityRole="button"
        accessibilityLabel={`${eyebrow}: ${recipe.title}`}
      >
        <View style={[styles.heroWrap, { height: PICK_HERO_HEIGHT }]}>
          <RecipeVisualBadge
            recipe={recipe}
            variant="hero"
            style={[styles.heroImage, { height: PICK_HERO_HEIGHT }]}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.62)", "transparent", "rgba(0,0,0,0.5)"]}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.heroTopRow}>
            <View style={styles.heroTopActions}>
              {headerTrailing}
              <Pressable
                onPress={(event) => {
                  event.stopPropagation?.();
                  void Haptics.selectionAsync();
                  toggleSavedRecipe(recipe.id);
                }}
                hitSlop={10}
                style={styles.heroIconBtn}
                accessibilityRole="button"
                accessibilityLabel={saved ? "Remove from saved" : "Save recipe"}
              >
                <Bookmark
                  size={18}
                  color={colors.white}
                  fill={saved ? colors.white : "transparent"}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.heroBottomRow}>
            <View style={styles.eyebrowPill}>
              <Sparkles size={12} color={colors.white} strokeWidth={2.4} />
              <Text style={styles.eyebrowText} numberOfLines={1}>
                {eyebrow}
              </Text>
            </View>
            <View
              style={[
                styles.matchBadge,
                { backgroundColor: matchStyle.heroBg },
              ]}
            >
              <Text style={styles.matchBadgeText}>
                {pantryMatchPercent}% pantry match
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, { color: themeColors.charcoal }]}
              numberOfLines={2}
            >
              {recipe.title}
            </Text>
            {hasDescription ? (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation?.();
                  void Haptics.selectionAsync();
                  showDialog({
                    title: recipe.title,
                    message: recipe.description,
                  });
                }}
                hitSlop={10}
                style={styles.infoBtn}
                accessibilityLabel="Recipe description"
                accessibilityRole="button"
              >
                <Info size={18} color={themeColors.muted} strokeWidth={2.25} />
              </Pressable>
            ) : null}
          </View>

          {recipeHasPhoto ? (
            <Text
              style={[styles.kitchenLine, { color: themeColors.muted }]}
              numberOfLines={1}
            >
              {visual.kitchenLabel} · {visual.mood}
            </Text>
          ) : null}

          {pickReason ? (
            <Text style={styles.pickReason} numberOfLines={2}>
              {pickReason}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <View
              style={[
                styles.metaPill,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "#F3EDE6",
                },
              ]}
            >
              <Text
                style={[styles.metaPillText, { color: themeColors.charcoal }]}
              >
                {recipe.prepTime} min
              </Text>
            </View>
            <View
              style={[
                styles.metaPill,
                {
                  backgroundColor: isDark ? "rgba(0,168,107,0.18)" : "#E8F5EE",
                },
              ]}
            >
              <Leaf size={11} color={colors.green} strokeWidth={2.5} />
              <Text style={[styles.metaPillText, { color: colors.green }]}>
                {recipe.dietType}
              </Text>
            </View>
            <View
              style={[
                styles.metaPill,
                {
                  borderColor: `${visual.accent}55`,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.9)",
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.metaPillText, { color: visual.accent }]}>
                {visual.shortCaption}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      {hasMissing ? (
        <View style={styles.missingBand}>
          <Text
            style={[
              styles.missingBandLabel,
              isDark && styles.missingBandLabelDark,
            ]}
          >
            {ORDER_PARTNERS_LINE}
          </Text>
          <Text style={[styles.missingBandItems, { color: themeColors.muted }]}>
            Missing: {formatMissingList(missing)}
          </Text>
        </View>
      ) : null}

      <View
        style={[
          styles.actions,
          isDark && styles.actionsDark,
          hasMissing && styles.actionsWithMissing,
        ]}
      >
        <View style={styles.actionRow}>
          {hasMissing ? (
            <Pressable
              onPress={() => {
                void Haptics.selectionAsync();
                onShopMissing(missing);
              }}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.orderBtn,
                {
                  backgroundColor: themeColors.white,
                  borderColor: colors.primary,
                },
                pressed && styles.actionBtnPressed,
              ]}
            >
              <Text style={styles.orderBtnText} numberOfLines={1}>
                Order missing
              </Text>
              <ChevronRight
                size={14}
                color={colors.primary}
                strokeWidth={2.5}
              />
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              onCookTonight();
            }}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.cookBtn,
              hasMissing ? styles.cookBtnSplit : styles.cookBtnFull,
              pressed && styles.actionBtnPressed,
            ]}
          >
            <Text style={styles.cookBtnText} numberOfLines={1}>
              {cookCtaLabel}
            </Text>
            <ChevronRight size={14} color={colors.white} strokeWidth={2.5} />
          </Pressable>
        </View>

        {onNotInterested ? (
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              onNotInterested();
            }}
            style={styles.notInterestedBtn}
          >
            <Text
              style={[styles.notInterestedText, { color: themeColors.muted }]}
            >
              Not for me
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg + 2,
    borderWidth: 1,
    overflow: "hidden",
  },
  heroWrap: {
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
  },
  heroTopRow: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  eyebrowPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    maxWidth: "52%",
    paddingVertical: 7,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: "rgba(0,0,0,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  eyebrowText: {
    flex: 1,
    fontFamily: appFonts.bodyBold,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.3,
    color: colors.white,
    textTransform: "uppercase",
  },
  heroTopActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  heroIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  heroBottomRow: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  matchBadgeText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 11,
    color: colors.white,
    letterSpacing: 0.2,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  title: {
    flex: 1,
    fontFamily: appFonts.display,
    fontSize: 21,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  infoBtn: {
    marginTop: 4,
    padding: 2,
  },
  kitchenLine: {
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
  },
  pickReason: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  metaPillText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.3,
  },
  missingBand: {
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,107,53,0.08)",
    gap: 2,
  },
  missingBandLabel: {
    fontFamily: appFonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.4,
    color: "#C44A00",
  },
  missingBandLabelDark: {
    color: "#FF8F66",
  },
  missingBandItems: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 11,
    lineHeight: 15,
  },
  actions: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,107,53,0.14)",
  },
  actionsWithMissing: {
    paddingTop: spacing.sm,
  },
  actionsDark: {
    borderTopColor: "rgba(255,107,53,0.22)",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: spacing.sm,
  },
  actionBtn: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: ACTION_RADIUS,
  },
  actionBtnPressed: {
    opacity: 0.9,
  },
  orderBtn: {
    flex: 0.42,
    borderWidth: 1.5,
  },
  orderBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 12,
    color: colors.primary,
  },
  cookBtn: {
    backgroundColor: colors.primary,
    ...shadows.cta,
  },
  cookBtnSplit: {
    flex: 0.58,
  },
  cookBtnFull: {
    flex: 1,
  },
  cookBtnText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    color: colors.white,
  },
  notInterestedBtn: {
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  notInterestedText: {
    fontFamily: appFonts.body,
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
