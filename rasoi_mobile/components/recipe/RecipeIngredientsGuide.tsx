import { Check } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { appFonts } from "@/constants/fonts";
import { colors, radius, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import type { RecipeIngredient } from "@/data/mockRecipes";
import { ingredientMatchesMainName } from "@/utils/recipeMainIngredients";

type RecipeIngredientsGuideProps = {
  ingredients: RecipeIngredient[];
  available: string[];
  missing: string[];
};

function LegendDot({ color, label }: { color: string; label: string }) {
  const { colors: themeColors } = useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, { color: themeColors.muted }]}>
        {label}
      </Text>
    </View>
  );
}

export default function RecipeIngredientsGuide({
  ingredients,
  available,
  missing,
}: RecipeIngredientsGuideProps) {
  const { colors: themeColors, isDark } = useTheme();
  const availableSet = new Set(available);
  const missingSet = new Set(missing);

  const chipStatus = (ingredientName: string) => {
    if ([...availableSet].some((name) => ingredientMatchesMainName(ingredientName, name))) {
      return "pantry" as const;
    }
    if ([...missingSet].some((name) => ingredientMatchesMainName(ingredientName, name))) {
      return "missing" as const;
    }
    return "other" as const;
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.legend}>
        <LegendDot color={colors.green} label="In pantry" />
        <LegendDot color={colors.primary} label="Missing" />
        <LegendDot
          color={isDark ? themeColors.border : colors.border}
          label="Other"
        />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.border,
          },
        ]}
      >
        <View style={styles.grid}>
          {ingredients.map((ingredient, index) => {
            const status = chipStatus(ingredient.name);
            const inPantry = status === "pantry";
            const isMissing = status === "missing";
            const label = ingredient.isStaple
              ? `${ingredient.name} · staple`
              : ingredient.name;

            return (
              <View
                key={`${ingredient.name}-${index}`}
                style={[
                  styles.chip,
                  {
                    backgroundColor: inPantry
                      ? isDark
                        ? "rgba(0,168,107,0.16)"
                        : "rgba(0,168,107,0.08)"
                      : isMissing
                        ? isDark
                          ? "rgba(255,107,53,0.16)"
                          : "rgba(255,107,53,0.08)"
                        : themeColors.cream,
                    borderColor: inPantry
                      ? colors.green
                      : isMissing
                        ? colors.primary
                        : themeColors.border,
                  },
                ]}
              >
                {inPantry ? (
                  <View style={styles.chipCheck}>
                    <Check size={10} color={colors.white} strokeWidth={3} />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.chipDot,
                      {
                        borderColor: isMissing
                          ? colors.primary
                          : themeColors.border,
                        backgroundColor: isMissing
                          ? colors.primary
                          : "transparent",
                      },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: inPantry
                        ? colors.green
                        : isMissing
                          ? colors.primary
                          : themeColors.charcoal,
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingHorizontal: 2,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: appFonts.body,
    fontSize: 11,
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    padding: spacing.md,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexGrow: 0,
    flexShrink: 1,
    maxWidth: "100%",
    minHeight: 40,
  },
  chipCheck: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chipDot: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    flexShrink: 0,
  },
  chipText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 1,
    lineHeight: 16,
  },
});
