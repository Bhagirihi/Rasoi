import { Check, X } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PAYWALL_COMPARE_FOOTNOTE, PAYWALL_COMPARE_ROWS, type PaywallCompareCell } from '@/constants/payments';
import type { PlanTier } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type PaywallCompareTableProps = {
  highlightTier?: PlanTier;
  forceDark?: boolean;
};

const TIER_LABELS: Record<PlanTier, string> = {
  free: 'Free',
  trial: 'Trial',
  paid: 'Plus',
};

export default function PaywallCompareTable({
  highlightTier,
  forceDark = false,
}: PaywallCompareTableProps) {
  const { colors: themeColors, isDark } = useTheme();
  const dark = forceDark || isDark;
  const text = dark ? colors.dark.text : themeColors.charcoal;
  const muted = dark ? colors.dark.textMuted : themeColors.muted;
  const surface = dark ? colors.dark.card : themeColors.white;
  const headBg = dark ? colors.dark.surface : themeColors.cream;
  const border = dark ? 'rgba(245, 240, 232, 0.12)' : themeColors.border;

  return (
    <View style={[styles.table, { backgroundColor: surface, borderColor: border }]}>
      <View style={[styles.tableHead, { backgroundColor: headBg }]}>
        <Text style={[styles.cell, styles.cellFeature, { color: text }]}>What you get</Text>
        {(['free', 'trial', 'paid'] as const).map((tier) => (
          <View
            key={tier}
            style={[styles.headCell, highlightTier === tier && styles.headCellActive]}
          >
            <Text
              style={[
                styles.cellHead,
                { color: muted },
                highlightTier === tier && styles.cellHeadActive,
              ]}
            >
              {TIER_LABELS[tier]}
            </Text>
            {highlightTier === tier ? <Text style={styles.currentBadge}>You</Text> : null}
          </View>
        ))}
      </View>
      {PAYWALL_COMPARE_ROWS.map((row) => (
        <View key={row.label} style={[styles.tableRow, { borderTopColor: border }]}>
          <Text style={[styles.cell, styles.cellFeature, { color: text }]}>{row.label}</Text>
          <CellMark value={row.free} muted={muted} />
          <CellMark value={row.trial} muted={muted} />
          <CellMark value={row.paid} accent muted={muted} />
        </View>
      ))}
      <Text style={[styles.footnote, { color: muted, borderTopColor: border }]}>
        {PAYWALL_COMPARE_FOOTNOTE}
      </Text>
    </View>
  );
}

function CellMark({
  value,
  accent,
  muted,
}: {
  value: PaywallCompareCell;
  accent?: boolean;
  muted: string;
}) {
  if (typeof value === 'string') {
    return (
      <View style={styles.cellIcon}>
        <Text style={[styles.cellLimited, { color: muted }, accent && styles.cellLimitedAccent]} numberOfLines={2}>
          {value}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.cellIcon}>
      {value ? (
        <Check size={16} color={accent ? colors.primary : colors.green} />
      ) : (
        <X size={16} color={muted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cellFeature: {
    flex: 2,
    textAlign: 'left',
    fontWeight: '700',
  },
  headCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  headCellActive: {
    backgroundColor: 'rgba(255,107,53,0.12)',
  },
  cellHead: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  cellHeadActive: {
    color: colors.primary,
  },
  currentBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cellIcon: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  cellLimited: {
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 12,
  },
  cellLimitedAccent: {
    color: colors.primary,
  },
  footnote: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 10,
    lineHeight: 14,
    borderTopWidth: 1,
  },
});
