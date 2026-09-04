import { StyleSheet, View } from "react-native";

import { Shimmer } from "@/components/ui/Shimmer";
import { radius, shadows, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

export function RecipeCardSkeleton() {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <Shimmer style={styles.hero} borderRadius={0} />
      <View style={styles.body}>
        <Shimmer style={styles.titleLine} borderRadius={radius.sm} />
        <Shimmer style={styles.titleLineShort} borderRadius={radius.sm} />
        <Shimmer style={styles.kitchenLine} borderRadius={radius.sm} />
        <View style={styles.metaRow}>
          <Shimmer style={styles.metaLine} borderRadius={radius.sm} />
          <Shimmer style={styles.matchPill} borderRadius={radius.pill} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.card,
  },
  hero: {
    width: "100%",
    minHeight: 128,
  },
  body: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  titleLine: {
    height: 18,
    width: "88%",
  },
  titleLineShort: {
    height: 18,
    width: "62%",
  },
  kitchenLine: {
    height: 12,
    width: "48%",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: 4,
  },
  metaLine: {
    flex: 1,
    height: 12,
  },
  matchPill: {
    height: 24,
    width: 72,
  },
});
