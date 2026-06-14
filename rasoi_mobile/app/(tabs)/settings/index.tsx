import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Bell,
  Crown,
  Drumstick,
  Egg,
  Hand,
  Leaf,
  SlidersHorizontal,
  User,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdMobBanner from '@/components/AdMobBanner';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import {
  AccountActionsCard,
  getProfileInitial,
  KitchenPrefsCard,
  PartnerStrip,
  SettingsCard,
  SettingsFooter,
  SettingsGroupLabel,
  SettingsProfileHero,
  SettingsQuickTile,
} from '@/components/settings/SettingsBlocks';
import { AppTabHeader } from '@/components/AppTabHeader';
import {
  PAID_PLAN_MONTHLY_PRICE,
  PAID_PLAN_YEARLY_DETAIL,
  PAID_PLAN_YEARLY_PRICE,
  PAID_PLAN_YEARLY_SAVINGS_LABEL,
  PLAN_LABELS,
} from '@/constants/plans';
import { DIET_CHOICE_LABELS, DietChoice, colors, layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { useReferenceData } from '@/context/ReferenceContext';
import { getKitchenStyleLabel, type KitchenStyle } from '@/utils/kitchenStyles';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { useTrialClock } from '@/hooks/useTrialClock';
import { PAYWALL_HREF } from '@/utils/routes';

const DIET_META: Record<
  DietChoice,
  { icon: typeof Leaf; tint: string; bg: string }
> = {
  Veg: { icon: Leaf, tint: colors.green, bg: 'rgba(0,168,107,0.12)' },
  Egg: { icon: Egg, tint: colors.egg, bg: 'rgba(244,196,48,0.15)' },
  'Non-Veg': { icon: Drumstick, tint: colors.danger, bg: 'rgba(229,57,53,0.1)' },
  Jain: { icon: Hand, tint: colors.saffron, bg: 'rgba(255,153,51,0.12)' },
};

function formatCuisineLabels(ids: string[], kitchenStyles: KitchenStyle[]): string[] {
  if (ids.length === 0) return [];
  return ids.map((id) => getKitchenStyleLabel(id, kitchenStyles));
}

export default function SettingsScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
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
    resetAppFlow,
    effectiveTier,
    planLabel,
    trialStartedAt,
    trialDaysLeft,
    showAds,
    showPartners,
  } = useAppContext();
  const { trialTimeLabel, trialEndsAtLabel } = useTrialClock(trialStartedAt, effectiveTier);
  const { showDialog } = useAppDialog();

  const dietMeta = DIET_META[dietChoice];
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

  const openPaywall = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(PAYWALL_HREF);
  };

  const planStatusLine =
    effectiveTier === 'trial' && trialTimeLabel
      ? `${trialTimeLabel}${trialEndsAtLabel ? ` · Ends ${trialEndsAtLabel}` : ''}`
      : effectiveTier === 'paid'
        ? 'All partners · No ads'
        : showAds
          ? 'Free · Ads on · Partners locked'
          : planLabel;

  const openLogin = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(auth)/login');
  };

  const handleNotificationsToggle = async (next: boolean) => {
    void Haptics.selectionAsync();
    await setNotificationsEnabled(next);
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
              await logout();
              router.replace('/(auth)/login');
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
              router.replace('/(auth)/onboarding');
            })();
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollViewWithFloatingIndicator
        floatingBottomOffset={tabBarHeight}
        floatingLabel="More settings"
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

        <SettingsGroupLabel label="Your plan" />
        <SettingsCard style={styles.planCard}>
          <Pressable onPress={openPaywall} style={styles.planRow}>
            <View style={styles.planIcon}>
              <Crown size={20} color={colors.primary} />
            </View>
            <View style={styles.planCopy}>
              <Text style={styles.planTitle}>{PLAN_LABELS[effectiveTier]}</Text>
              <Text style={styles.planSub}>{planStatusLine}</Text>
            </View>
            <Text style={styles.planCta}>Manage →</Text>
          </Pressable>
          <View style={styles.planMeta}>
            <Text style={styles.planMetaText}>
              {showAds ? 'AdMob enabled' : 'No ads'} ·{' '}
              {showPartners ? 'Partners unlocked' : 'Partners locked'}
            </Text>
            {effectiveTier !== 'paid' && (
              <>
                <Text style={styles.planPrice}>
                  Rasoi Plus · {PAID_PLAN_MONTHLY_PRICE} or {PAID_PLAN_YEARLY_PRICE}
                </Text>
                <Text style={styles.planSavings}>{PAID_PLAN_YEARLY_DETAIL}</Text>
              </>
            )}
          </View>
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
          <Text style={styles.revenueTitle}>
            {showPartners ? 'Shop & delivery partners active' : 'Partners require Rasoi Plus'}
          </Text>
          <Text style={styles.revenueBody}>
            {effectiveTier === 'trial'
              ? 'Trial access to Blinkit, Zepto, Instamart, Zomato & Swiggy. Subscribe before trial ends to keep checkout without ads.'
              : effectiveTier === 'paid'
                ? 'Full access to all grocery and food delivery partners with no ads.'
                : 'Free plan shows ads and hides partner checkout. Start a 3-day trial or subscribe from Manage plan.'}
          </Text>
          {showPartners && <PartnerStrip />}
        </SettingsCard>

        <SettingsGroupLabel label="Account" />
        <AccountActionsCard
          isGuest={isGuest}
          onSignIn={openEditProfile}
          onSwitchAccount={openLogin}
          onLogout={handleLogout}
          onReset={handleResetFlow}
        />

        <SettingsFooter />
      </ScrollViewWithFloatingIndicator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
  },
  tileRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  planCard: {
    padding: spacing.lg,
  },
  planRow: {
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.charcoal,
  },
  planSub: {
    marginTop: 2,
    fontSize: 13,
    color: colors.muted,
  },
  planCta: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  planMeta: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  planMetaText: {
    fontSize: 12,
    color: colors.muted,
  },
  planPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  planSavings: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  revenueCard: {
    padding: spacing.lg,
  },
  revenueTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.charcoal,
  },
  revenueBody: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
  },
});
