import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Crown, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AdMobBanner from '@/components/AdMobBanner';
import PaywallActions from '@/components/paywall/PaywallActions';
import PaywallCompareTable from '@/components/paywall/PaywallCompareTable';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { PLAN_LABELS, PAID_PLAN_YEARLY_DETAIL, PAID_PLAN_YEARLY_SAVINGS_LABEL, TRIAL_DURATION_DAYS, type BillingInterval } from '@/constants/plans';
import { colors, layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { usePaywall } from '@/hooks/usePaywall';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    effectiveTier,
    trialDaysLeft,
    canStartTrial,
    trialExpired,
    startTrial,
    upgradeToPaid,
    restorePurchases,
    refreshPlan,
  } = useAppContext();
  const { showDialog } = useAppDialog();

  const paywall = usePaywall({ upgradeToPaid, restorePurchases });

  const handleStartTrial = async () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await startTrial();
    await refreshPlan();
    showDialog({
      title: 'Trial started',
      message: `Enjoy partner checkout for ${TRIAL_DURATION_DAYS} days. Subscribe anytime to keep access ad-free.`,
    });
  };

  const handleSubscribe = async (interval: BillingInterval) => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const result = await paywall.purchasePlus(interval);
    if (!result.ok) {
      if (!result.cancelled) {
        showDialog({ title: 'Subscribe', message: result.error });
      }
      return;
    }
    showDialog({
      title: 'Welcome to Rasoi Plus',
      message: 'Ads removed and all partners unlocked.',
      buttons: [{ text: 'Great', onPress: () => router.back() }],
    });
  };

  const handleRestore = async () => {
    const result = await paywall.restorePurchases();
    if (!result.ok) {
      showDialog({ title: 'Restore purchases', message: result.error });
      return;
    }
    showDialog({
      title: 'Restored',
      message: 'Your Rasoi Plus subscription is active.',
      buttons: [{ text: 'Continue', onPress: () => router.back() }],
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ArrowLeft size={22} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>Rasoi Plus</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollViewWithFloatingIndicator
        floatingBottomOffset={insets.bottom + 16}
        floatingLabel="See plans"
        {...scrollIndicator}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      >
        <LinearGradient colors={['#FF6B35', '#FF9933']} style={styles.hero}>
          <Crown size={28} color={colors.white} />
          <Text style={styles.heroTitle}>Cook smarter with Rasoi Plus</Text>
          <Text style={styles.heroSub}>
            Free plan includes ads and no shop/delivery partners. Trial unlocks partners for{' '}
            {TRIAL_DURATION_DAYS} days. Paid removes ads and keeps partners forever.
          </Text>
        </LinearGradient>

        {effectiveTier === 'trial' && trialDaysLeft !== null && trialDaysLeft > 0 && (
          <View style={styles.statusCard}>
            <Sparkles size={18} color={colors.primary} />
            <Text style={styles.statusText}>
              Trial active · {trialDaysLeft} day{trialDaysLeft === 1 ? '' : 's'} left
            </Text>
          </View>
        )}

        {effectiveTier === 'paid' && (
          <View style={[styles.statusCard, styles.statusPaid]}>
            <Crown size={18} color={colors.white} />
            <Text style={[styles.statusText, styles.statusTextPaid]}>
              You&apos;re on {PLAN_LABELS.paid}
            </Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Compare plans</Text>
        <Text style={styles.pricingNote}>
          Yearly: {PAID_PLAN_YEARLY_DETAIL} · {PAID_PLAN_YEARLY_SAVINGS_LABEL}
        </Text>
        <PaywallCompareTable />

        <Text style={styles.trialNote}>
          Trial partners show a badge: included in Rasoi Plus — you can use them during trial,
          then subscribe to keep access without ads.
        </Text>

        <AdMobBanner placement="paywall" />

        <View style={styles.actions}>
          <PaywallActions
            effectiveTier={effectiveTier}
            trialExpired={trialExpired}
            canStartTrial={canStartTrial}
            isBusy={paywall.isBusy}
            paymentDisclaimer={paywall.paymentDisclaimer}
            providerLabel={paywall.providerLabel}
            supportsRestore={paywall.supportsRestore}
            lastError={paywall.lastError}
            onStartTrial={() => void handleStartTrial()}
            onSubscribe={(interval) => void handleSubscribe(interval)}
            onRestore={() => void handleRestore()}
          />
        </View>
      </ScrollViewWithFloatingIndicator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.charcoal,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
  },
  hero: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.92)',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,107,53,0.12)',
    padding: spacing.lg,
  },
  statusPaid: {
    backgroundColor: colors.primary,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  statusTextPaid: {
    color: colors.white,
  },
  sectionLabel: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  pricingNote: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.charcoal,
  },
  trialNote: {
    marginTop: spacing.lg,
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
  },
  actions: {
    marginTop: spacing.xxl,
  },
});
