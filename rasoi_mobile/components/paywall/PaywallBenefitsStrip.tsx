import { Bookmark, CalendarDays, Check, Download, ShoppingBag, Zap } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PAYWALL_BENEFIT_HIGHLIGHTS } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';

const ICONS = {
  calendar: CalendarDays,
  bookmark: Bookmark,
  offline: Download,
  partners: ShoppingBag,
  zap: Zap,
} as const;

const ICON_COLORS = {
  calendar: colors.primary,
  bookmark: colors.saffron,
  offline: colors.green,
  partners: colors.green,
  zap: colors.primary,
} as const;

export default function PaywallBenefitsStrip() {
  return (
    <View style={styles.wrap}>
      {PAYWALL_BENEFIT_HIGHLIGHTS.map(({ icon, label, sub }, index) => {
        const Icon = ICONS[icon];
        const color = ICON_COLORS[icon];
        return (
          <View
            key={label}
            style={[styles.row, index < PAYWALL_BENEFIT_HIGHLIGHTS.length - 1 && styles.rowBorder]}
          >
            <View style={[styles.icon, { backgroundColor: `${color}18` }]}>
              <Icon size={16} color={color} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.sub}>{sub}</Text>
            </View>
            <Check size={16} color={colors.green} strokeWidth={3} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.charcoal,
  },
  sub: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.muted,
  },
});
