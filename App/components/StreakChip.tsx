import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Flame } from "lucide-react-native";

import { colors, radius, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { fetchStreak, type CookingStreak } from "@/services/streak";

/**
 * Self-contained streak pill: fetches on focus, renders nothing while
 * loading or on error (guests and offline states simply show no chip).
 */
export default function StreakChip() {
  const { colors: themeColors } = useTheme();
  const [streak, setStreak] = useState<CookingStreak | null>(null);

  const refresh = useCallback(() => {
    void fetchStreak()
      .then(setStreak)
      .catch(() => undefined);
  }, []);

  useFocusEffect(refresh);

  if (!streak) return null;

  return (
    <View
      testID="streak-chip"
      style={[
        styles.chip,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
        },
      ]}
    >
      <Flame size={16} color={colors.primary} />
      <Text style={[styles.text, { color: themeColors.charcoal }]}>
        {streak.current > 0
          ? `${streak.current}-day streak${
              streak.cookedToday ? " · cooked today" : ""
            }`
          : "Start your streak — cook something today"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.pill,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
