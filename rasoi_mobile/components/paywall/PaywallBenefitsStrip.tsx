import { Check, ShoppingBag, UtensilsCrossed, Zap } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

const BENEFITS = [
  { icon: Zap, label: 'No ads', color: colors.primary },
  { icon: ShoppingBag, label: 'Grocery partners', color: colors.green },
  { icon: UtensilsCrossed, label: 'Food delivery', color: colors.saffron },
] as const;

export default function PaywallBenefitsStrip() {
  return (
    <View style={styles.wrap}>
      {BENEFITS.map(({ icon: Icon, label, color }, index) => (
        <View
          key={label}
          style={[styles.row, index < BENEFITS.length - 1 && styles.rowBorder]}
        >
          <View style={[styles.icon, { backgroundColor: `${color}18` }]}>
            <Icon size={16} color={color} />
          </View>
          <Text style={styles.label}>{label}</Text>
          <Check size={16} color={colors.green} strokeWidth={3} />
        </View>
      ))}
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
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.charcoal,
  },
});
