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
      <Shimmer style={styles.hero} borderRadius={0} />
      <View style={styles.body}>
        <Shimmer style={styles.titleLine} borderRadius={radius.sm} />
        <Shimmer style={styles.titleLineShort} borderRadius={radius.sm} />
        <Shimmer style={styles.reasonLine} borderRadius={radius.sm} />
        <View style={styles.metaRow}>
          <Shimmer style={styles.pill} borderRadius={radius.pill} />
          <Shimmer style={styles.pill} borderRadius={radius.pill} />
          <Shimmer style={styles.pillWide} borderRadius={radius.pill} />
        </View>
        <View style={styles.actions}>
          <Shimmer style={styles.actionBtnWide} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg + 2,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  hero: {
    height: 152,
    width: '100%',
  },
  body: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  titleLine: {
    height: 22,
    width: '88%',
  },
  titleLineShort: {
    height: 14,
    width: '48%',
  },
  reasonLine: {
    height: 14,
    width: '72%',
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
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,107,53,0.14)',
  },
  actionBtnWide: {
    height: 44,
    width: '100%',
  },
});
