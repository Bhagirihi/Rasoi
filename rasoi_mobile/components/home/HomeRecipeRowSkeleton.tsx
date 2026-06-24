import { StyleSheet, View } from 'react-native';

import { Shimmer } from '@/components/ui/Shimmer';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function HomeRecipeRowSkeleton() {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <View style={styles.body}>
        <Shimmer style={styles.titleLine} borderRadius={radius.sm} />
        <Shimmer style={styles.titleLineShort} borderRadius={radius.sm} />
        <View style={styles.metaRow}>
          <Shimmer style={styles.pill} borderRadius={radius.pill} />
          <Shimmer style={styles.pill} borderRadius={radius.pill} />
          <Shimmer style={styles.pillWide} borderRadius={radius.pill} />
        </View>
        <View style={styles.actions}>
          <Shimmer style={styles.actionBtn} borderRadius={10} />
          <Shimmer style={styles.actionBtnWide} borderRadius={10} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    overflow: 'hidden',
    ...shadows.card,
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  titleLine: {
    height: 16,
    width: '88%',
  },
  titleLineShort: {
    height: 12,
    width: '62%',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
  },
  pill: {
    height: 24,
    width: 56,
  },
  pillWide: {
    height: 24,
    width: 72,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,107,53,0.14)',
  },
  actionBtn: {
    flex: 0.42,
    height: 40,
  },
  actionBtnWide: {
    flex: 0.58,
    height: 40,
  },
});
