import { Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { PARTNER_TRIAL_NOTE } from '@/constants/plans';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export default function TrialPartnerBanner() {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: isDark ? 'rgba(255,82,0,0.16)' : 'rgba(255,107,53,0.1)',
        },
      ]}
    >
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
