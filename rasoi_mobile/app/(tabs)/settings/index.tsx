import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Crown,
  Drumstick,
  Egg,
  Hand,
  Leaf,
  Moon,
  SlidersHorizontal,
  Sun,
  Trash2,
  User,
} from 'lucide-react-native';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdMobBanner from '@/components/AdMobBanner';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import { PAYMENTS_DISABLED_NOTE } from '@/constants/monetizationConfig';
import type { DeleteAccountReason } from '@/constants/deleteAccount';
import DeleteAccountReasonModal from '@/components/settings/DeleteAccountReasonModal';
import RateRasoiCard from '@/components/settings/RateRasoiCard';
import FeedbackLinkCard from '@/components/settings/FeedbackLinkCard';
import LocationCard from '@/components/settings/LocationCard';
import SyncStatusCard from '@/components/settings/SyncStatusCard';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import {
  AccountActionsCard,
  getProfileInitial,
  KitchenPrefsCard,
  PartnerStrip,
  SettingsCard,
  SettingsFooter,
  SettingsGroupLabel,
  SettingsNavRow,
  SettingsProfileHero,
  SettingsQuickTile,
} from '@/components/settings/SettingsBlocks';
import { AppTabHeader } from '@/components/AppTabHeader';
import {
  PAID_PLAN_MONTHLY_PRICE,
  PAID_PLAN_YEARLY_SAVINGS_LABEL,
  PLAN_LABELS,
} from '@/constants/plans';
import { DIET_CHOICE_LABELS, DietChoice, colors as brandColors, layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useReferenceData } from '@/context/ReferenceContext';
import { useTheme } from '@/context/ThemeContext';
import { getKitchenStyleLabel, type KitchenStyle } from '@/utils/kitchenStyles';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { useTrialClock } from '@/hooks/useTrialClock';
import { PAYWALL_HREF } from '@/utils/routes';

const DIET_META: Record<
  DietChoice,
  { icon: typeof Leaf; tint: string; bg: string }
> = {
  Veg: { icon: Leaf, tint: brandColors.green, bg: 'rgba(0,168,107,0.12)' },
  Egg: { icon: Egg, tint: brandColors.egg, bg: 'rgba(244,196,48,0.15)' },
  'Non-Veg': { icon: Drumstick, tint: brandColors.danger, bg: 'rgba(229,57,53,0.1)' },
  Jain: { icon: Hand, tint: brandColors.saffron, bg: 'rgba(255,153,51,0.12)' },
};

function formatCuisineLabels(ids: string[], kitchenStyles: KitchenStyle[]): string[] {
  if (ids.length === 0) return [];
  return ids.map((id) => getKitchenStyleLabel(id, kitchenStyles));
}

export default function SettingsScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors, colorScheme, setColorScheme } = useTheme();
  const { kitchenStyles } = useReferenceData();
  const {
    userName,
    userPhone,
    userEmail,
    isGuest,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    notificationsEnabled,
    setNotificationsEnabled,
    logout,
    deleteAccount,
    resetAppFlow,
    effectiveTier,
    trialStartedAt,
    trialExpired,
    showAds,
    showPaywall,
    paymentsEnabled,
    partnerAccess,
    pendingEmailVerification,
    openEmailVerificationModal,
    isLoggedIn,
    lastProfileSyncedAt,
    refreshSyncedProfile,
  } = useAppContext();
  const { trialTimeLabel, trialEndsAtLabel } = useTrialClock(trialStartedAt, effectiveTier);
  const { showDialog } = useAppDialog();
  const [isSessionEnding, setIsSessionEnding] = useState(false);
  const [crashTestRequested, setCrashTestRequested] = useState(false);
  const [deleteReasonModalVisible, setDeleteReasonModalVisible] = useState(false);

  if (crashTestRequested) {
    throw new Error('Rasoi crash screen test (settings)');
  }

  const dietMeta = DIET_META[dietChoice];
  const hasPlusPartners = effectiveTier === 'trial' || effectiveTier === 'paid';
  const displayName = userName || 'Guest';
  const profileSub = isGuest
    ? 'Sign in to sync recipes & preferences'
    : userEmail
      ? userEmail
      : userPhone
        ? `+91 ${userPhone}`
        : 'Add your mobile number';

  const openEditProfile = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/settings/edit-profile');
  };

  const openEditPreferences = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/settings/edit-preferences');
  };

  const openFeedback = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/settings/feedback');
  };

  const openPaywall = () => {
    if (!showPaywall) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(PAYWALL_HREF);
  };

  const planStatusLine = !paymentsEnabled
    ? PAYMENTS_DISABLED_NOTE
    : effectiveTier === 'trial' && trialTimeLabel
      ? `${trialTimeLabel} left${trialEndsAtLabel ? ` · Ends ${trialEndsAtLabel}` : ''}`
      : effectiveTier === 'paid'
        ? 'Active subscription'
        : trialExpired
          ? 'Trial ended · Upgrade to unlock partners'
          : 'Upgrade to unlock partners and remove ads';

  const planCtaLabel =
    !showPaywall
      ? null
      : effectiveTier === 'paid'
        ? 'Manage subscription'
        : effectiveTier === 'trial'
          ? 'Subscribe before trial ends'
          : 'View Rasoi Plus plans';

  const openLogin = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(auth)/login');
  };

  const handleNotificationsToggle = async (next: boolean) => {
    void Haptics.selectionAsync();
    const result = await setNotificationsEnabled(next);
    if (!result.ok) {
      const openSettings = result.reason.toLowerCase().includes('permission');
      showDialog({
        title: 'Could not enable notifications',
        message: result.reason,
        buttons: openSettings
          ? [
              { text: 'Open Settings', onPress: () => void Linking.openSettings() },
              { text: 'OK', style: 'cancel' },
            ]
          : [{ text: 'OK' }],
      });
    }
  };

  const handleSwitchAccount = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showDialog({
      title: 'Switch account?',
      message:
        'Your current session will be logged out so you can sign in with a different account.',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Okay',
          onPress: () => {
            void (async () => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              setIsSessionEnding(true);
              try {
                await logout();
                router.replace('/(auth)/login');
              } finally {
                setIsSessionEnding(false);
              }
            })();
          },
        },
      ],
    });
  };

  const handleLogout = () => {
    showDialog({
      title: 'Log out?',
      message: 'Your diet and cuisine preferences stay saved on this device.',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              setIsSessionEnding(true);
              try {
                await logout();
                router.replace('/(auth)/login');
              } finally {
                setIsSessionEnding(false);
              }
            })();
          },
        },
      ],
    });
  };

  const handleResetFlow = () => {
    showDialog({
      title: 'Reset everything?',
      message: 'Clears onboarding, login, and all preferences. For testing only.',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await resetAppFlow();
              router.replace('/(auth)/legal-consent');
            })();
          },
        },
      ],
    });
  };

  const proceedWithAccountDeletion = (
    reason: DeleteAccountReason,
    reasonDetail?: string,
  ) => {
    const deleteWarningMessage = isGuest
      ? 'Google Play subscriptions are not cancelled automatically.\n\nAfter deletion, this guest session is permanently removed and you will not be able to log in again.'
      : 'Google Play subscriptions are not cancelled automatically.\n\nAfter deletion, your account is permanently removed and you will not be able to log in again.';

    showDialog({
      title: isGuest ? 'Delete guest session?' : 'Delete account permanently?',
      message: deleteWarningMessage,
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (isGuest) {
              void (async () => {
                setIsSessionEnding(true);
                try {
                  await deleteAccount({ reason, reasonDetail });
                  router.replace('/(auth)/login');
                } finally {
                  setIsSessionEnding(false);
                }
              })();
              return;
            }

            showDialog({
              title: 'Confirm your email',
              message: `Your email (${userEmail ?? 'your account email'}) must match to confirm deletion.`,
              buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Continue',
                  style: 'destructive',
                  onPress: () => {
                    if (!userEmail) {
                      showDialog({
                        title: 'Email required',
                        message: 'Add your email to your profile before deleting, or contact cooking@rasoiapplication.in.',
                        buttons: [{ text: 'OK' }],
                      });
                      return;
                    }
                    void (async () => {
                      setIsSessionEnding(true);
                      try {
                        await deleteAccount({
                          confirmEmail: userEmail,
                          reason,
                          reasonDetail,
                        });
                        router.replace('/(auth)/login');
                      } catch {
                        showDialog({
                          title: 'Deletion failed',
                          message: 'Could not delete your account. Email cooking@rasoiapplication.in for help.',
                          buttons: [{ text: 'OK' }],
                        });
                      } finally {
                        setIsSessionEnding(false);
                      }
                    })();
                  },
                },
              ],
            });
          },
        },
      ],
    });
  };

  const handleDeleteAccount = () => {
    setDeleteReasonModalVisible(true);
  };

  const handleAppearanceChange = async (next: 'light' | 'dark') => {
    void Haptics.selectionAsync();
    await setColorScheme(next);
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.cream }]}
      edges={['top']}
      testID={testIds.screenSettings}
    >
      <AppSavingOverlay
        visible={isSessionEnding}
        steps={[
          { message: 'Signing you out…', subtitle: 'Saving your preferences on this device' },
          { message: 'Almost done…', subtitle: 'Clearing your session' },
        ]}
      />
      <DeleteAccountReasonModal
        visible={deleteReasonModalVisible}
        isGuest={isGuest}
        onClose={() => {
          setDeleteReasonModalVisible(false);
        }}
        onContinue={(reason, reasonDetail) => {
          setDeleteReasonModalVisible(false);
          proceedWithAccountDeletion(reason, reasonDetail);
        }}
      />
      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + spacing.xxxl }]}
      >
        <AppTabHeader
          title="Settings"
          subtitle="Profile, cooking preferences, and account."
        />

        <SettingsProfileHero
          name={displayName}
          subtitle={profileSub}
          initial={getProfileInitial(displayName)}
          isGuest={isGuest}
          onPress={openEditProfile}
        />

        {pendingEmailVerification ? (
          <Pressable
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              openEmailVerificationModal();
            }}
            style={[styles.verifyBanner, { backgroundColor: colors.white, borderColor: colors.border }]}
          >
            <Text style={[styles.verifyBannerTitle, { color: colors.charcoal }]}>
              Email verification pending
            </Text>
            <Text style={[styles.verifyBannerBody, { color: colors.muted }]}>
              Tap to enter your code or resend when email delivery is back.
            </Text>
          </Pressable>
        ) : null}

        <View style={styles.tileRow}>
          <SettingsQuickTile
            label="Food prefs"
            sublabel="Diet, region, cuisines"
            icon={SlidersHorizontal}
            onPress={openEditPreferences}
          />
          <SettingsQuickTile
            label="Profile"
            sublabel={isGuest ? 'Sign in' : 'Name & phone'}
            icon={User}
            onPress={openEditProfile}
          />
        </View>

        <SettingsGroupLabel label="Sync" />
        {isLoggedIn ? (
          <SyncStatusCard
            lastSyncedAt={lastProfileSyncedAt}
            onRefresh={() => {
              void refreshSyncedProfile();
            }}
          />
        ) : null}

        <SettingsGroupLabel label="Location" />
        <LocationCard />

        <SettingsGroupLabel label="Appearance" />
        <SettingsCard style={styles.appearanceCard}>
          <Text style={[styles.appearanceTitle, { color: colors.charcoal }]}>Theme</Text>
          <Text style={[styles.appearanceBody, { color: colors.muted }]}>
            Choose light or dark mode for the app.
          </Text>
          <View style={styles.appearanceRow}>
            {(['light', 'dark'] as const).map((mode) => {
              const active = colorScheme === mode;
              const Icon = mode === 'light' ? Sun : Moon;
              return (
                <Pressable
                  key={mode}
                  testID={mode === 'light' ? testIds.settingsThemeLight : testIds.settingsThemeDark}
                  onPress={() => void handleAppearanceChange(mode)}
                  style={[
                    styles.appearanceOption,
                    { borderColor: colors.border, backgroundColor: colors.white },
                    active && styles.appearanceOptionActive,
                  ]}
                >
                  <Icon size={18} color={active ? colors.primary : colors.muted} />
                  <Text
                    style={[
                      styles.appearanceOptionText,
                      { color: active ? colors.primary : colors.charcoal },
                    ]}
                  >
                    {mode === 'light' ? 'Light' : 'Dark'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </SettingsCard>

        <SettingsGroupLabel label="Your plan" />
        <SettingsCard style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={styles.planIcon}>
              <Crown size={20} color={colors.primary} />
            </View>
            <View style={styles.planCopy}>
              <Text style={[styles.planTitle, { color: colors.charcoal }]}>
                {!paymentsEnabled ? 'Early access' : PLAN_LABELS[effectiveTier]}
              </Text>
              <Text style={[styles.planSub, { color: colors.muted }]}>{planStatusLine}</Text>
            </View>
          </View>

          <View style={styles.planBenefits}>
            <View style={[styles.planBenefitChip, showAds && styles.planBenefitChipMuted]}>
              <Text style={[styles.planBenefitText, { color: showAds ? colors.muted : brandColors.green }]}>
                {showAds ? 'Ads on' : 'No ads'}
              </Text>
            </View>
            <View style={[styles.planBenefitChip, !hasPlusPartners && styles.planBenefitChipMuted]}>
              <Text style={[styles.planBenefitText, { color: hasPlusPartners ? brandColors.green : colors.muted }]}>
                {hasPlusPartners ? 'Partners unlocked' : 'Partners locked'}
              </Text>
            </View>
          </View>

          {showPaywall ? (
            <Pressable onPress={openPaywall} style={[styles.planActionBtn, { borderColor: colors.primary }]}>
              <Text style={[styles.planActionText, { color: colors.primary }]}>{planCtaLabel}</Text>
            </Pressable>
          ) : null}

          {paymentsEnabled && effectiveTier !== 'paid' && showPaywall ? (
            <Text style={[styles.planPriceHint, { color: colors.muted }]}>
              From {PAID_PLAN_MONTHLY_PRICE} · {PAID_PLAN_YEARLY_SAVINGS_LABEL}
            </Text>
          ) : null}
        </SettingsCard>

        <AdMobBanner placement="settings" />

        <SettingsGroupLabel
          label="Your kitchen"
          action="Edit all"
          onAction={openEditPreferences}
        />
        <KitchenPrefsCard
          dietLabel={DIET_CHOICE_LABELS[dietChoice]}
          dietIcon={dietMeta.icon}
          dietTint={dietMeta.tint}
          dietBg={dietMeta.bg}
          region={regionalCuisine}
          cuisineLabels={formatCuisineLabels(favoriteCuisines, kitchenStyles)}
          notificationsEnabled={notificationsEnabled}
          onEdit={openEditPreferences}
          onNotificationsChange={handleNotificationsToggle}
        />

        <SettingsGroupLabel label="Partner checkout" />
        <SettingsCard style={styles.revenueCard}>
          <Text style={[styles.revenueTitle, { color: colors.charcoal }]}>
            {hasPlusPartners
              ? 'Shop & delivery partners active'
              : partnerAccess.remainingFreeShops > 0
                ? 'Limited partner checkout'
                : 'Partners require Rasoi Plus'}
          </Text>
          <Text style={[styles.revenueBody, { color: colors.muted }]}>
            {effectiveTier === 'trial'
              ? 'Trial access to Blinkit, Zepto, Instamart, Zomato & Swiggy. Subscribe before trial ends to keep checkout without ads.'
              : effectiveTier === 'paid'
                ? 'Full access to all grocery and food delivery partners with no ads.'
                : partnerAccess.remainingFreeShops > 0
                  ? `${partnerAccess.remainingFreeShops} free partner shop${partnerAccess.remainingFreeShops === 1 ? '' : 's'} left this month. Start a trial or subscribe for unlimited checkout.`
                  : 'Free plan shows ads and hides partner checkout. Start a 3-day trial or subscribe from Manage plan.'}
          </Text>
          {hasPlusPartners ? <PartnerStrip /> : null}
        </SettingsCard>

        <SettingsGroupLabel label="Support" />
        <FeedbackLinkCard onPress={openFeedback} />
        <View style={styles.supportSpacer} />
        <RateRasoiCard />

        <SettingsGroupLabel label="Privacy & data" />
        <SettingsCard>
          <SettingsNavRow
            icon={Trash2}
            iconBg="rgba(229,57,53,0.1)"
            iconColor={brandColors.danger}
            label="Delete account"
            value={isGuest ? 'Guest session' : 'Permanent'}
            onPress={handleDeleteAccount}
            testID={testIds.settingsDeleteAccount}
            destructive
            isLast
          />
        </SettingsCard>

        <SettingsGroupLabel label="Account" />
        <AccountActionsCard
          isGuest={isGuest}
          onSignIn={openEditProfile}
          onSwitchAccount={handleSwitchAccount}
          onLogout={handleLogout}
          onReset={handleResetFlow}
        />

        <SettingsFooter
          onTestCrash={() => {
            setCrashTestRequested(true);
          }}
        />
      </ScrollViewWithFloatingIndicator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
  },
  verifyBanner: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
  },
  verifyBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  verifyBannerBody: {
    marginTop: spacing.xs,
    fontSize: 13,
    lineHeight: 18,
  },
  appearanceCard: {
    padding: spacing.lg,
  },
  appearanceTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  appearanceBody: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
  },
  appearanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  appearanceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing.md,
  },
  appearanceOptionActive: {
    borderColor: brandColors.primary,
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  appearanceOptionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  tileRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  planCard: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,107,53,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCopy: {
    flex: 1,
  },
  planTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  planSub: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  planBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  planBenefitChip: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,168,107,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  planBenefitChipMuted: {
    backgroundColor: 'rgba(107,114,128,0.1)',
  },
  planBenefitText: {
    fontSize: 12,
    fontWeight: '700',
  },
  planActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 2,
    paddingVertical: spacing.md,
  },
  planActionText: {
    fontSize: 15,
    fontWeight: '800',
  },
  planPriceHint: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  revenueCard: {
    padding: spacing.lg,
  },
  revenueTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  revenueBody: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
  },
  supportSpacer: {
    height: spacing.md,
  },
});
