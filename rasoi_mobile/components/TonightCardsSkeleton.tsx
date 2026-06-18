import { Moon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Shimmer } from '@/components/ui/Shimmer';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type TonightCardsSkeletonProps = {
  label: string;
  count?: number;
  isLateNight?: boolean;
};

function TonightCardSkeleton() {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <Shimmer style={styles.image} borderRadius={radius.lg - 1} />
      <View style={styles.body}>
        <Shimmer style={styles.titleLine} borderRadius={radius.sm} />
        <Shimmer style={styles.titleLineShort} borderRadius={radius.sm} />
        <Shimmer style={styles.metaLine} borderRadius={radius.sm} />
        <Shimmer style={styles.ctaLine} borderRadius={radius.pill} />
      </View>
    </View>
  );
}

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
        <Text style={[styles.label, { color: themeColors.muted }]}>{label}</Text>
      </View>
      {Array.from({ length: count }, (_, index) => (
        <TonightCardSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  card: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    overflow: 'hidden',
    ...shadows.card,
  },
  image: {
    width: 92,
    minHeight: 108,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.sm,
    gap: spacing.sm,
    justifyContent: 'center',
  },
  titleLine: {
    height: 14,
    width: '92%',
  },
  titleLineShort: {
    height: 14,
    width: '68%',
  },
  metaLine: {
    height: 11,
    width: '55%',
    marginTop: 2,
  },
  ctaLine: {
    height: 28,
    width: 108,
    marginTop: spacing.xs,
  },
});
