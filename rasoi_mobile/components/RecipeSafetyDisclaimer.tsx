import { StyleSheet, Text, View } from 'react-native';

import { RECIPE_SAFETY_DISCLAIMER } from '@/constants/legalHighlights';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function RecipeSafetyDisclaimer({ compact = false }: { compact?: boolean }) {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.box,
        compact && styles.boxCompact,
        { backgroundColor: themeColors.cream, borderColor: themeColors.border },
      ]}
    >
      <Text style={[styles.text, { color: themeColors.muted }]}>{RECIPE_SAFETY_DISCLAIMER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  boxCompact: {
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
  },
});
