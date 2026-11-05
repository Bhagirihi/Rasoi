import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Flame } from "lucide-react-native";

import { colors, radius, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { fetchStreak, type CookingStreak } from "@/services/streak";

type StreakChipProps = {
  /** Opens cook sheet for tonight’s pick — turns streak into a habit CTA. */
  onPress?: () => void;
};

/**
 * Self-contained streak pill: fetches on focus, renders nothing while
 * loading or on error (guests and offline states simply show no chip).
 */
export default function StreakChip({ onPress }: StreakChipProps) {
  const { colors: themeColors } = useTheme();
  const [streak, setStreak] = useState<CookingStreak | null>(null);

  const refresh = useCallback(() => {
    void fetchStreak()
      .then(setStreak)
      .catch(() => undefined);
  }, []);

  useFocusEffect(refresh);

  if (!streak) return null;

  const atRisk = streak.current > 0 && !streak.cookedToday;
  const label = streak.current > 0
    ? atRisk
      ? `Keep your ${streak.current}-day streak — cook today’s pick`
      : `${streak.current}-day streak · cooked today`
    : "Start your streak — cook something today";

  const content = (
    <>
      <Flame size={16} color={colors.primary} />
      <Text style={[styles.text, { color: themeColors.charcoal }]}>{label}</Text>
    </>
  );

  if (onPress && (atRisk || streak.current === 0)) {
    return (
      <Pressable
        testID="streak-chip"
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[
          styles.chip,
          {
            backgroundColor: themeColors.white,
            borderColor: themeColors.border,
          },
        ]}
      >
        {content}
      </Pressable>
    );
  }

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
      {content}
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
