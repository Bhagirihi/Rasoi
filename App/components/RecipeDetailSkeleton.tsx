import { StyleSheet, View } from "react-native";

import { Shimmer } from "@/components/ui/Shimmer";
import { layout, radius, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

export default function RecipeDetailSkeleton() {
  const { colors: themeColors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: themeColors.cream }]}>
      <Shimmer style={styles.hero} borderRadius={0} />

      <View
        style={[
          styles.sheet,
          {
            backgroundColor: themeColors.cream,
            borderColor: themeColors.border,
          },
        ]}
      >
        <Shimmer style={styles.eyebrow} borderRadius={radius.sm} />
        <Shimmer style={styles.title} borderRadius={radius.sm} />
        <Shimmer style={styles.titleShort} borderRadius={radius.sm} />

        <View style={styles.chipRow}>
          <Shimmer style={styles.chip} borderRadius={radius.pill} />
          <Shimmer style={styles.chip} borderRadius={radius.pill} />
          <Shimmer style={styles.chipWide} borderRadius={radius.pill} />
        </View>

        <Shimmer style={styles.descLine} borderRadius={radius.sm} />
        <Shimmer style={styles.descLineShort} borderRadius={radius.sm} />

        <Shimmer style={styles.calorieCard} borderRadius={radius.md} />

        <Shimmer style={styles.sectionTitle} borderRadius={radius.sm} />
        {(["100%", "92%", "78%", "85%"] as const).map((width, index) => (
          <Shimmer
            key={index}
            style={[styles.ingredientLine, { width }]}
            borderRadius={radius.sm}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  hero: {
    height: 300,
    width: "100%",
  },
  sheet: {
    marginTop: -spacing.xl,
    borderTopLeftRadius: radius.lg + 4,
    borderTopRightRadius: radius.lg + 4,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  eyebrow: {
    height: 14,
    width: 140,
  },
  title: {
    height: 28,
    width: "88%",
  },
  titleShort: {
    height: 28,
    width: "55%",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    height: 30,
    width: 72,
  },
  chipWide: {
    height: 30,
    width: 96,
  },
  descLine: {
    height: 14,
    width: "100%",
  },
  descLineShort: {
    height: 14,
    width: "72%",
  },
  calorieCard: {
    height: 68,
    width: "100%",
    marginTop: spacing.sm,
  },
  sectionTitle: {
    height: 20,
    width: 120,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  ingredientLine: {
    height: 16,
  },
});
