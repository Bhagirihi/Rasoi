import { Check } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PAID_PLAN_FEATURES } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function PaidPlanFeaturesList() {
  const { colors: themeColors } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <Text style={[styles.label, { color: themeColors.charcoal }]}>Included in Rasoi Plus</Text>
      {PAID_PLAN_FEATURES.map((feature) => (
        <View key={feature} style={styles.row}>
          <View style={styles.icon}>
            <Check size={14} color={colors.primary} strokeWidth={3} />
          </View>
          <Text style={[styles.text, { color: themeColors.charcoal }]}>{feature}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  icon: {
    marginTop: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,107,53,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
});
