import { Sparkles, type LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import Text from "@/components/ui/Text";
import { appFonts } from "@/constants/fonts";
import { colors, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

type HomeSectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  variant?: "default" | "featured";
};

export default function HomeSectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  variant = "default",
}: HomeSectionHeaderProps) {
  const { colorScheme } = useTheme();
  const isFeatured = variant === "featured";

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        {isFeatured ? <View style={styles.featuredAccent} /> : null}
        {isFeatured ? (
          <Sparkles size={15} color={colors.primary} strokeWidth={2.25} />
        ) : Icon ? (
          <Icon size={16} color={iconColor} />
        ) : null}
        {isFeatured ? (
          <Text style={styles.featuredTitle}>{title}</Text>
        ) : (
          <Text variant="h3" scheme={colorScheme} style={styles.title}>
            {title}
          </Text>
        )}
      </View>
      {subtitle ? (
        <Text
          variant="body"
          color={isFeatured ? "accent" : "secondary"}
          scheme={colorScheme}
          style={[styles.subtitle, isFeatured && styles.featuredSubtitle]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 17,
    lineHeight: 22,
  },
  featuredAccent: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  featuredTitle: {
    flex: 1,
    fontFamily: appFonts.display,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.15,
    color: colors.primary,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: appFonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  featuredSubtitle: {
    marginTop: 4,
    fontFamily: appFonts.bodyMedium,
  },
});
