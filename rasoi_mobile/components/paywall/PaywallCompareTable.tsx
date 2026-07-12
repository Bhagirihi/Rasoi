import { Check, X } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PAYWALL_COMPARE_FOOTNOTE, PAYWALL_COMPARE_ROWS, type PaywallCompareCell } from '@/constants/payments';
import type { PlanTier } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';

type PaywallCompareTableProps = {
  highlightTier?: PlanTier;
};

const TIER_LABELS: Record<PlanTier, string> = {
  free: 'Free',
  trial: 'Trial',
  paid: 'Plus',
};

export default function PaywallCompareTable({ highlightTier }: PaywallCompareTableProps) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHead}>
        <Text style={[styles.cell, styles.cellFeature]}>What you get</Text>
        {(['free', 'trial', 'paid'] as const).map((tier) => (
          <View
            key={tier}
            style={[styles.headCell, highlightTier === tier && styles.headCellActive]}
          >
            <Text style={[styles.cellHead, highlightTier === tier && styles.cellHeadActive]}>
              {TIER_LABELS[tier]}
            </Text>
            {highlightTier === tier ? <Text style={styles.currentBadge}>You</Text> : null}
          </View>
        ))}
      </View>
      {PAYWALL_COMPARE_ROWS.map((row) => (
        <View key={row.label} style={styles.tableRow}>
          <Text style={[styles.cell, styles.cellFeature]}>{row.label}</Text>
          <CellMark value={row.free} />
          <CellMark value={row.trial} />
          <CellMark value={row.paid} accent />
        </View>
      ))}
      <Text style={styles.footnote}>{PAYWALL_COMPARE_FOOTNOTE}</Text>
    </View>
  );
}

function CellMark({ value, accent }: { value: PaywallCompareCell; accent?: boolean }) {
  if (typeof value === 'string') {
    return (
      <View style={styles.cellIcon}>
        <Text style={[styles.cellLimited, accent && styles.cellLimitedAccent]} numberOfLines={2}>
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
        <X size={16} color={colors.muted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.cream,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.charcoal,
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
    color: colors.muted,
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
    color: colors.muted,
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
    color: colors.muted,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
