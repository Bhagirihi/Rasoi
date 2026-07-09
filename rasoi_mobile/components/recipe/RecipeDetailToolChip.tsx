import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { appFonts } from "@/constants/fonts";
import { colors, radius, spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";

type RecipeDetailToolChipProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

export default function RecipeDetailToolChip({
  label,
  active = false,
  onPress,
  accessibilityLabel,
}: RecipeDetailToolChipProps) {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      style={[
        styles.chip,
        {
          backgroundColor: themeColors.white,
          borderColor: active ? colors.primary : themeColors.border,
        },
        active && {
          backgroundColor: isDark
            ? "rgba(255,107,53,0.2)"
            : "rgba(255,107,53,0.1)",
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text
        style={[
          styles.label,
          { color: active ? colors.primary : themeColors.muted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  label: {
    fontFamily: appFonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
