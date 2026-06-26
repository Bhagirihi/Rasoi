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
  leading,
  trailing,
  testID,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** Icon or control shown to the left of the title (e.g. back). */
  leading?: ReactNode;
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
      <View style={styles.titleRow}>
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <Text
          variant="display"
          scheme={colorScheme}
          style={[
            styles.title,
            compact && styles.titleCompact,
            leading ? styles.titleWithLeading : null,
          ]}
          {...a11yHeader(title)}
        >
          {title}
        </Text>
      </View>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  leading: {
    marginTop: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: 28,
    lineHeight: 34,
  },
  titleWithLeading: {
    marginTop: 0,
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
