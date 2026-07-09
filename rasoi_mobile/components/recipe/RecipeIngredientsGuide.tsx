import { Check } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { appFonts } from "@/constants/fonts";
import { colors, radius, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import type { RecipeIngredient } from "@/data/mockRecipes";
import { ingredientKey } from "@/utils/recipeIngredients";

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
  const availableSet = new Set(available.map((item) => ingredientKey(item)));
  const missingSet = new Set(missing.map((item) => ingredientKey(item)));

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
                inPantry && styles.rowInPantry,
                isMissing && styles.rowMissing,
              ]}
            >
              <View
                style={[
                  styles.statusIcon,
                  inPantry && styles.statusIconPantry,
                  isMissing && styles.statusIconMissing,
                  !inPantry &&
                    !isMissing && {
                      backgroundColor: isDark
                        ? themeColors.border
                        : colors.border,
                    },
                ]}
              >
                {inPantry ? (
                  <Check size={11} color={colors.white} strokeWidth={3} />
                ) : null}
              </View>
              <Text style={[styles.text, { color: themeColors.charcoal }]}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                {ingredient.isStaple ? (
                  <Text
                    style={[styles.stapleHint, { color: themeColors.muted }]}
                  >
                    {" "}
                    · staple
                  </Text>
                ) : null}
              </Text>
            </View>
          );
        })}
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
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowInPantry: {
    backgroundColor: "rgba(0,168,107,0.04)",
  },
  rowMissing: {
    backgroundColor: "rgba(255,107,53,0.05)",
  },
  statusIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIconPantry: {
    backgroundColor: colors.green,
  },
  statusIconMissing: {
    backgroundColor: colors.primary,
  },
  text: {
    flex: 1,
    fontFamily: appFonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  ingredientName: {
    fontFamily: appFonts.bodyBold,
  },
  stapleHint: {
    fontFamily: appFonts.body,
    fontSize: 13,
  },
});
