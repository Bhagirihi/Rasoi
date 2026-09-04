import { type LucideIcon } from "lucide-react-native";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

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
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function HomeSectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  variant = "default",
  trailing,
  style,
}: HomeSectionHeaderProps) {
  const { colorScheme } = useTheme();
  const isFeatured = variant === "featured";

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.titleRow}>
        <View style={styles.titleMain}>
          {Icon ? <Icon size={16} color={iconColor} /> : null}
          {isFeatured ? (
            <Text style={styles.featuredTitle}>{title}</Text>
          ) : (
            <Text variant="h3" scheme={colorScheme} style={styles.title}>
              {title}
            </Text>
          )}
        </View>
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
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
  wrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  titleMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minWidth: 0,
  },
  trailing: {
    flexShrink: 0,
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 17,
    lineHeight: 22,
  },
  featuredTitle: {
    flex: 1,
    fontFamily: appFonts.display,
    fontSize: 18,
    lineHeight: 23,
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
