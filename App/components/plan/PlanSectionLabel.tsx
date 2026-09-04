import { StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function PlanSectionLabel({
  title,
  note,
  hint,
}: {
  title: string;
  note?: string;
  hint?: string;
}) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: themeColors.charcoal }]}>{title}</Text>
      {note ? (
        <Text style={[styles.note, { color: themeColors.muted }]}>{note}</Text>
      ) : null}
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
  note: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  hint: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
  },
});
