import { useRouter } from 'expo-router';
import { Crown, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { QA_MONETIZATION_QUERY, QA_MONETIZATION_UI_ENABLED } from '@/constants/qaMonetization';
import { colors, radius, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';

export default function HomeQaMonetizationBar() {
  const router = useRouter();

  if (!QA_MONETIZATION_UI_ENABLED) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>QA only — monetization screens</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/paywall',
              params: { qa: QA_MONETIZATION_QUERY },
            })
          }
          testID={testIds.qaOpenPaywall}
          style={styles.btn}
        >
          <Crown size={14} color={colors.primary} />
          <Text style={styles.btnText}>Paywall</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/(auth)/trial-welcome',
              params: { qa: QA_MONETIZATION_QUERY },
            })
          }
          testID={testIds.qaOpenTrialWelcome}
          style={styles.btn}
        >
          <Sparkles size={14} color={colors.primary} />
          <Text style={styles.btnText}>Trial welcome</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.35)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,107,53,0.06)',
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
  },
});
