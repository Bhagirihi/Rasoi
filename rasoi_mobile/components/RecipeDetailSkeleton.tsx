import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Shimmer } from "@/components/ui/Shimmer";
import { layout, radius, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

export default function RecipeDetailSkeleton() {
  const { colors: themeColors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: themeColors.cream }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Shimmer style={styles.backBtn} borderRadius={radius.pill} />
        <View style={styles.headerActions}>
          <Shimmer style={styles.iconBtn} borderRadius={radius.pill} />
          <Shimmer style={styles.iconBtn} borderRadius={radius.pill} />
        </View>
      </View>

      <Shimmer style={styles.heroImage} borderRadius={radius.lg} />

      <View style={styles.body}>
        <Shimmer style={styles.title} borderRadius={radius.sm} />
        <Shimmer style={styles.titleShort} borderRadius={radius.sm} />
        <View style={styles.metaRow}>
          <Shimmer style={styles.metaChip} borderRadius={radius.pill} />
          <Shimmer style={styles.metaChip} borderRadius={radius.pill} />
          <Shimmer style={styles.metaChipWide} borderRadius={radius.pill} />
        </View>

        <Shimmer style={styles.sectionLabel} borderRadius={radius.sm} />
        {(["92%", "78%", "85%", "70%"] as const).map((width, index) => (
          <Shimmer
            key={index}
            style={[styles.ingredientLine, { width }]}
            borderRadius={radius.sm}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
  },
  heroImage: {
    marginHorizontal: layout.screenPadding,
    height: 220,
  },
  body: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    height: 22,
    width: "88%",
  },
  titleShort: {
    height: 22,
    width: "62%",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  metaChip: {
    height: 28,
    width: 72,
  },
  metaChipWide: {
    height: 28,
    width: 96,
  },
  sectionLabel: {
    height: 14,
    width: 120,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  ingredientLine: {
    height: 16,
  },
});
