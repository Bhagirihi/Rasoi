import { Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PARTNER_TRIAL_NOTE } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';

export default function TrialPartnerBanner() {
  return (
    <View style={styles.wrap}>
      <Sparkles size={14} color={colors.primary} />
      <Text style={styles.text}>{PARTNER_TRIAL_NOTE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,107,53,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
