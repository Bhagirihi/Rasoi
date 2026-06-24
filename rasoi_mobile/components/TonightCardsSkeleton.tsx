import { Moon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

type TonightCardsSkeletonProps = {
  label: string;
  count?: number;
  isLateNight?: boolean;
};

export default function TonightCardsSkeleton({
  label,
  count = 3,
  isLateNight = false,
}: TonightCardsSkeletonProps) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        {isLateNight && <Moon size={14} color={themeColors.muted} />}
        <Text style={[styles.label, { color: themeColors.muted }]}>
          {label}
        </Text>
      </View>
      {Array.from({ length: count }, (_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
});
