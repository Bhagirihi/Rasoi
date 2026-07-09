import * as Haptics from "expo-haptics";
import {
  CalendarDays,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { appFonts } from "@/constants/fonts";
import { colors, radius, shadows, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

type HomeScreenLinksProps = {
  recipeCount: number;
  onPlanPress: () => void;
  onRecipesPress: () => void;
};

function LinkCard({
  title,
  subtitle,
  Icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  Icon: typeof CalendarDays;
  onPress: () => void;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        shadows.card,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View
        style={[styles.iconWrap, { backgroundColor: "rgba(255,107,53,0.1)" }]}
      >
        <Icon size={18} color={colors.primary} strokeWidth={2.2} />
      </View>
      <View style={styles.copy}>
        <Text
          style={[styles.title, { color: themeColors.charcoal }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[styles.subtitle, { color: themeColors.muted }]}
          numberOfLines={2}
        >
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.primary} />
    </Pressable>
  );
}

export default function HomeScreenLinks({
  recipeCount,
  onPlanPress,
  onRecipesPress,
}: HomeScreenLinksProps) {
  const recipesSubtitle = recipeCount > 0 ? `${recipeCount} more` : "Find Best";

  return (
    <View style={styles.row}>
      <LinkCard
        title="3-day plan"
        subtitle="Meal plans"
        Icon={CalendarDays}
        onPress={onPlanPress}
      />
      <LinkCard
        title="All recipes"
        subtitle={recipesSubtitle}
        Icon={UtensilsCrossed}
        onPress={onRecipesPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: 72,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
  },
  subtitle: {
    fontFamily: appFonts.body,
    fontSize: 11,
    lineHeight: 15,
  },
});
