import { Check, X } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PAYWALL_COMPARE_ROWS } from '@/constants/payments';
import { colors, radius, spacing } from '@/constants/theme';

export default function PaywallCompareTable() {
  return (
    <View style={styles.table}>
      <View style={styles.tableHead}>
        <Text style={[styles.cell, styles.cellFeature]}>Feature</Text>
        <Text style={styles.cellHead}>Free</Text>
        <Text style={styles.cellHead}>Trial</Text>
        <Text style={styles.cellHead}>Paid</Text>
      </View>
      {PAYWALL_COMPARE_ROWS.map((row) => (
        <View key={row.label} style={styles.tableRow}>
          <Text style={[styles.cell, styles.cellFeature]}>{row.label}</Text>
          <CellMark value={row.free} />
          <CellMark value={row.trial} />
          <CellMark value={row.paid} accent />
        </View>
      ))}
    </View>
  );
}

function CellMark({ value, accent }: { value: boolean; accent?: boolean }) {
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
    alignItems: 'center',
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
  cellHead: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
    textAlign: 'center',
  },
  cellIcon: {
    flex: 1,
    alignItems: 'center',
  },
});
