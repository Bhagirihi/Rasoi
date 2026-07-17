import type { ReactNode } from "react";
import { Clock, Flame, Gauge, Leaf, MapPin } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { appFonts } from "@/constants/fonts";
import { colors, radius, spacing } from "@/constants/theme";
import type { Recipe } from "@/data/mockRecipes";
import { useTheme } from "@/context/ThemeContext";
import { hasRecipeImage } from "@/utils/recipeImage";
import { getRecipeMatchStyle } from "@/utils/recipeMatchStyle";
import { getRecipeVisualIdentity } from "@/utils/recipeVisualIdentity";

type RecipeDetailHeaderProps = {
  recipe: Recipe;
  pantryMatchPercent: number;
};

function MetaChip({
  label,
  icon,
  tone = "neutral",
  matchBg,
}: {
  label: string;
  icon: ReactNode;
  tone?: "neutral" | "green" | "accent" | "match";
  matchBg?: string;
}) {
  const { colors: themeColors, isDark } = useTheme();

  const bg =
    tone === "green"
      ? isDark
        ? "rgba(0,168,107,0.18)"
        : "#E8F5EE"
      : tone === "accent"
        ? isDark
          ? "rgba(255,107,53,0.18)"
          : "#FFF0EA"
        : tone === "match"
          ? (matchBg ?? colors.primary)
          : isDark
            ? "rgba(255,255,255,0.08)"
            : "#F3EDE6";

  const textColor =
    tone === "green"
      ? colors.green
      : tone === "accent"
        ? colors.primary
        : tone === "match"
          ? colors.white
          : themeColors.charcoal;

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      {icon}
      <Text style={[styles.chipText, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function RecipeDetailHeader({
  recipe,
  pantryMatchPercent,
}: RecipeDetailHeaderProps) {
  const { colors: themeColors } = useTheme();
  const visual = getRecipeVisualIdentity(recipe);
  const recipeHasPhoto = hasRecipeImage(recipe);
  const matchStyle = getRecipeMatchStyle(pantryMatchPercent, themeColors.muted);

  return (
    <View style={styles.wrap}>
      {recipeHasPhoto ? (
        <Text style={[styles.eyebrow, { color: themeColors.muted }]}>
          {visual.kitchenLabel} · {visual.mood}
        </Text>
      ) : null}

      <Text style={[styles.title, { color: themeColors.charcoal }]}>
        {recipe.title}
      </Text>

      <View style={styles.chipRow}>
        <MetaChip
          label={`${recipe.prepTime} min`}
          icon={<Clock size={13} color={themeColors.charcoal} strokeWidth={2.4} />}
        />
        <MetaChip
          label={recipe.difficulty}
          icon={<Gauge size={13} color={themeColors.charcoal} strokeWidth={2.4} />}
        />
        <MetaChip
          label={recipe.dietType}
          icon={<Leaf size={13} color={colors.green} strokeWidth={2.5} />}
          tone="green"
        />
        <MetaChip
          label={recipe.region}
          icon={<MapPin size={13} color={colors.primary} strokeWidth={2.4} />}
          tone="accent"
        />
        <MetaChip
          label={`${pantryMatchPercent}% pantry`}
          icon={<Flame size={13} color={colors.white} strokeWidth={2.4} />}
          tone="match"
          matchBg={matchStyle.heroBg}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  eyebrow: {
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: 0.2,
  },
  title: {
    fontFamily: appFonts.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  chipText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
