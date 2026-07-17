import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { appFonts } from "@/constants/fonts";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

type RecipeDetailSectionProps = {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  children: ReactNode;
};

export default function RecipeDetailSection({
  title,
  subtitle,
  toolbar,
  children,
}: RecipeDetailSectionProps) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: themeColors.charcoal }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: themeColors.muted }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {toolbar ? <View style={styles.toolbar}>{toolbar}</View> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: appFonts.display,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: appFonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  toolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
