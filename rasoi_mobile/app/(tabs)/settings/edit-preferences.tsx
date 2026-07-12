import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter, useFocusEffect } from 'expo-router';
import { Bell, ChefHat, Leaf } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import {
  SettingsCard,
  SettingsGroupLabel,
  SettingsNavRow,
  SettingsSubHeader,
} from '@/components/settings/SettingsBlocks';
import { PrimaryButton } from '@/components/ui/Primitives';
import {
  DIET_CHOICE_LABELS,
  colors,
  layout,
  radius,
  scrollIndicator,
  spacing,
} from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { useTheme } from '@/context/ThemeContext';
import { useReferenceData } from '@/context/ReferenceContext';
import { COMMON_ALLERGY_OPTIONS } from '@/utils/kitchenPreferences';
import { useSaveRecipeGate } from '@/hooks/useSaveRecipeGate';
import { usePlanLimitDialog } from '@/hooks/usePlanLimitDialog';
import { getKitchenStyleLabel } from '@/utils/kitchenStyles';
import { DAILY_REMINDER_MEAL_SUMMARY, DAILY_REMINDER_TIME_LABEL, ensureNotificationPermissions } from '@/utils/notifications';

export default function EditPreferencesScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors, colorScheme } = useTheme();
  const { showDialog } = useAppDialog();
  const {
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    notificationsEnabled,
    allergyExclusions,
    householdSize,
    planLimits,
    saveFoodPreferences,
  } = useAppContext();
  const { showAllergyFilterUpsell } = usePlanLimitDialog();
  const { regionalCuisines, kitchenStyles, refreshReference } = useReferenceData();

  useFocusEffect(
    useCallback(() => {
      void refreshReference();
    }, [refreshReference]),
  );

  const [draftRegion, setDraftRegion] = useState(regionalCuisine);
  const [draftNotifications, setDraftNotifications] = useState(notificationsEnabled);
  const [draftAllergies, setDraftAllergies] = useState<string[]>(allergyExclusions);
  const [draftHouseholdSize, setDraftHouseholdSize] = useState(householdSize);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraftRegion(regionalCuisine);
    setDraftNotifications(notificationsEnabled);
    setDraftAllergies(allergyExclusions);
    setDraftHouseholdSize(householdSize);
  }, [regionalCuisine, notificationsEnabled, allergyExclusions, householdSize]);

  const cuisineSummary =
    favoriteCuisines.length === 0
      ? 'Not set'
      : favoriteCuisines
          .slice(0, 2)
          .map((id) => getKitchenStyleLabel(id, kitchenStyles))
          .join(', ') + (favoriteCuisines.length > 2 ? ` +${favoriteCuisines.length - 2}` : '');

  const handleNotificationsToggle = async (next: boolean) => {
    void Haptics.selectionAsync();
    if (!next) {
      setDraftNotifications(false);
      return;
    }
    const granted = await ensureNotificationPermissions();
    if (!granted) {
      setDraftNotifications(false);
      showDialog({
        title: 'Could not enable notifications',
        message:
          'Notification permission is off. Allow notifications for Rasoi in your phone Settings, then try again.',
        buttons: [
          { text: 'Open Settings', onPress: () => void Linking.openSettings() },
          { text: 'OK', style: 'cancel' },
        ],
      });
      return;
    }
    setDraftNotifications(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveFoodPreferences({
        dietChoice,
        regionalCuisine: draftRegion,
        favoriteCuisines,
        notificationsEnabled: draftNotifications,
        allergyExclusions: planLimits.allergyFilter ? draftAllergies : allergyExclusions,
        householdSize: draftHouseholdSize,
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not save your preferences. Please try again.';
      const openSettings = message.toLowerCase().includes('permission');
      showDialog({
        title: 'Could not save preferences',
        message,
        buttons: openSettings
          ? [
              { text: 'Open Settings', onPress: () => void Linking.openSettings() },
              { text: 'OK', style: 'cancel' },
            ]
          : [{ text: 'OK' }],
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.cream }]} edges={['top']}>
      <AppSavingOverlay visible={isSaving} message="Saving your preferences…" />
      <SettingsSubHeader title="Food preferences" onBack={() => router.back()} />

      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.intro, { color: themeColors.muted }]}>
          Region, household, allergies, and notifications. Diet and kitchen styles have their own
          screens.
        </Text>

        <SettingsGroupLabel label="Food profile" />
        <SettingsCard>
          <SettingsNavRow
            icon={Leaf}
            iconBg="rgba(0,168,107,0.12)"
            iconColor={colors.green}
            label="Diet"
            value={DIET_CHOICE_LABELS[dietChoice]}
            onPress={() => router.push('/(tabs)/settings/edit-diet')}
          />
          <SettingsNavRow
            icon={ChefHat}
            iconBg="rgba(255,107,53,0.12)"
            iconColor={colors.primary}
            label="Kitchen styles"
            value={cuisineSummary}
            onPress={() => router.push('/(tabs)/settings/edit-kitchen-styles')}
            isLast
          />
        </SettingsCard>

        <SettingsGroupLabel label="Region" />
        <ScrollView
          horizontal
          {...scrollIndicator}
          contentContainerStyle={styles.chipRow}
        >
          {regionalCuisines.map((region) => {
            const active = draftRegion === region;
            return (
              <Pressable
                key={region}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setDraftRegion(region);
                }}
                style={[
                  styles.chip,
                  { backgroundColor: themeColors.white, borderColor: themeColors.border },
                  active && styles.chipActive,
                ]}
              >
                <Text style={[styles.chipText, { color: themeColors.charcoal }, active && styles.chipTextActive]}>
                  {region}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <SettingsGroupLabel label="Household" />
        <Text style={[styles.sectionHint, { color: themeColors.muted }]}>
          Default serving size on recipe pages
        </Text>
        <ScrollView horizontal {...scrollIndicator} contentContainerStyle={styles.chipRow}>
          {[1, 2, 4, 6].map((size) => {
            const active = draftHouseholdSize === size;
            return (
              <Pressable
                key={size}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setDraftHouseholdSize(size);
                }}
                style={[
                  styles.chip,
                  { backgroundColor: themeColors.white, borderColor: themeColors.border },
                  active && styles.chipActive,
                ]}
              >
                <Text style={[styles.chipText, { color: themeColors.charcoal }, active && styles.chipTextActive]}>
                  Cook for {size}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <SettingsGroupLabel label="Allergies & intolerances" />
        <Text style={[styles.sectionHint, { color: themeColors.muted }]}>
          {planLimits.allergyFilter
            ? 'Recipes with these ingredients will be hidden. Always read the full ingredient list — not a substitute for medical advice.'
            : 'Allergy filtering is a Rasoi Plus feature. Upgrade to hide recipes with ingredients you avoid.'}
        </Text>
        <ScrollView horizontal {...scrollIndicator} contentContainerStyle={styles.chipRow}>
          {COMMON_ALLERGY_OPTIONS.map((item) => {
            const active = draftAllergies.includes(item);
            return (
              <Pressable
                key={item}
                onPress={() => {
                  void Haptics.selectionAsync();
                  if (!planLimits.allergyFilter) {
                    showAllergyFilterUpsell();
                    return;
                  }
                  setDraftAllergies((current) =>
                    active ? current.filter((entry) => entry !== item) : [...current, item],
                  );
                }}
                style={[
                  styles.chip,
                  { backgroundColor: themeColors.white, borderColor: themeColors.border },
                  active && styles.chipActive,
                ]}
              >
                <Text style={[styles.chipText, { color: themeColors.charcoal }, active && styles.chipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <SettingsGroupLabel label="Notifications" />
        <SettingsCard>
          <Pressable
            onPress={() => void handleNotificationsToggle(!draftNotifications)}
            style={({ pressed }) => [styles.notifyRow, pressed && styles.notifyRowPressed]}
            accessibilityRole="switch"
            accessibilityState={{ checked: draftNotifications }}
            accessibilityLabel="Daily reminders"
          >
            <View
              style={[
                styles.notifyIconWrap,
                { backgroundColor: themeColors.cream },
                draftNotifications && styles.notifyIconWrapOn,
              ]}
            >
              <Bell size={20} color={draftNotifications ? colors.green : themeColors.muted} />
            </View>
            <View style={styles.notifyText}>
              <Text style={[styles.notifyTitle, { color: themeColors.charcoal }]}>Daily reminders</Text>
              <Text style={[styles.notifySub, { color: themeColors.muted }]}>
                {DAILY_REMINDER_TIME_LABEL} — {DAILY_REMINDER_MEAL_SUMMARY} picks
              </Text>
            </View>
            <Switch
              value={draftNotifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: themeColors.border, true: 'rgba(0,168,107,0.35)' }}
              thumbColor={draftNotifications ? colors.green : themeColors.white}
            />
          </Pressable>
        </SettingsCard>

        <PrimaryButton
          label="Save preferences"
          onPress={handleSave}
          disabled={isSaving}
          style={styles.saveBtnWrap}
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
    paddingTop: spacing.sm,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  sectionHint: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
    fontSize: 13,
    color: colors.muted,
  },
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.charcoal,
  },
  chipTextActive: {
    color: colors.white,
  },
  notifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  notifyRowPressed: {
    backgroundColor: 'rgba(0,0,0,0.025)',
  },
  notifyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifyIconWrapOn: {
    backgroundColor: 'rgba(0,168,107,0.12)',
  },
  notifyText: {
    flex: 1,
    marginRight: 12,
  },
  notifyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.charcoal,
  },
  notifySub: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
  saveBtnWrap: {
    marginTop: spacing.xxl,
  },
});
