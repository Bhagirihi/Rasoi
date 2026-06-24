import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import Text from "@/components/ui/Text";
import { FreeBadge } from "@/components/ui/Primitives";
import { useTheme } from "@/context/ThemeContext";
import { spacing } from "@/constants/theme";
import { a11yHeader } from "@/utils/a11y";

export function AppTabHeader({
  title,
  subtitle,
  eyebrow,
  trailing,
  testID,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  trailing?: ReactNode;
  testID?: string;
  /** Tighter title block for dense screens (e.g. Pantry). */
  compact?: boolean;
}) {
  const { colorScheme } = useTheme();
  return (
    <View style={styles.wrap} testID={testID}>
      <View style={styles.topRow}>
        <Text
          variant="label"
          color="accent"
          scheme={colorScheme}
          style={styles.brand}
          accessibilityRole="text"
        >
          RASOI
        </Text>
        {trailing ?? <FreeBadge />}
      </View>
      {eyebrow ? (
        <Text
          variant="eyebrow"
          color="accent"
          scheme={colorScheme}
          style={styles.eyebrow}
        >
          {eyebrow}
        </Text>
      ) : null}
      <Text
        variant="display"
        scheme={colorScheme}
        style={[styles.title, compact && styles.titleCompact]}
        {...a11yHeader(title)}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          variant="body"
          color="secondary"
          scheme={colorScheme}
          style={[styles.subtitle, compact && styles.subtitleCompact]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    letterSpacing: 2,
  },
  eyebrow: {
    marginTop: spacing.md,
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 28,
    lineHeight: 34,
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 28,
    marginTop: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  subtitleCompact: {
    marginTop: spacing.xs,
    marginBottom: 0,
    fontSize: 13,
    lineHeight: 18,
  },
});
