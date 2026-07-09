import { StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function PlanSectionLabel({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: themeColors.charcoal }]}>{title}</Text>
      {hint ? (
        <Text style={[styles.hint, { color: themeColors.muted }]} numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 2,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 17,
    lineHeight: 22,
  },
  hint: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
});
