import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useRouter, useFocusEffect } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CuisinePreferenceList from '@/components/CuisinePreferenceList';
import DietPreferenceList from '@/components/DietPreferenceList';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import {
  SettingsCard,
  SettingsGroupLabel,
  SettingsSubHeader,
} from '@/components/settings/SettingsBlocks';
import { PrimaryButton } from '@/components/ui/Primitives';
import { CuisineId, DietChoice, colors, layout, radius, scrollIndicator, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useReferenceData } from '@/context/ReferenceContext';
import { DAILY_REMINDER_TIME_LABEL } from '@/utils/notifications';

export default function EditPreferencesScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    notificationsEnabled,
    setDietChoice,
    setRegionalCuisine,
    setFavoriteCuisines,
    setNotificationsEnabled,
  } = useAppContext();
  const { regionalCuisines, kitchenStyles, refreshReference } = useReferenceData();

  useFocusEffect(
    useCallback(() => {
      void refreshReference();
    }, [refreshReference]),
  );

  const [draftDiet, setDraftDiet] = useState<DietChoice>(dietChoice);
  const [draftRegion, setDraftRegion] = useState(regionalCuisine);
  const [draftCuisines, setDraftCuisines] = useState<CuisineId[]>(favoriteCuisines);
  const [draftNotifications, setDraftNotifications] = useState(notificationsEnabled);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraftDiet(dietChoice);
    setDraftRegion(regionalCuisine);
    setDraftCuisines(favoriteCuisines);
    setDraftNotifications(notificationsEnabled);
  }, [dietChoice, regionalCuisine, favoriteCuisines, notificationsEnabled]);

  useEffect(() => {
    const activeIds = new Set(kitchenStyles.map((style) => style.id));
    setDraftCuisines((current) => current.filter((id) => activeIds.has(id)));
  }, [kitchenStyles]);

  const toggleCuisine = (id: CuisineId) => {
    void Haptics.selectionAsync();
    setDraftCuisines((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleNotificationsToggle = async (next: boolean) => {
    void Haptics.selectionAsync();
    if (next) {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      setDraftNotifications(finalStatus === 'granted');
      return;
    }
    setDraftNotifications(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await setDietChoice(draftDiet);
      await setFavoriteCuisines(draftCuisines);
      setRegionalCuisine(draftRegion);
      await setNotificationsEnabled(draftNotifications);
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SettingsSubHeader title="Food preferences" onBack={() => router.back()} />

      <ScrollViewWithFloatingIndicator
        floatingBottomOffset={tabBarHeight}
        floatingLabel="More options"
        {...scrollIndicator}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.intro}>
          Diet and region are set during signup — update them here anytime. Home only uses these
          for recipe picks.
        </Text>

        <SettingsGroupLabel label="Diet" />
        <DietPreferenceList
          selected={draftDiet}
          onSelect={setDraftDiet}
          variant="light"
        />

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
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{region}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <SettingsGroupLabel label="Favourite cuisines" />
        <Text style={styles.sectionHint}>Pick one or more — same as onboarding</Text>
        <CuisinePreferenceList
          selected={draftCuisines}
          onToggle={toggleCuisine}
          variant="light"
        />

        <SettingsGroupLabel label="Notifications" />
        <SettingsCard>
          <View style={styles.notifyRow}>
            <View style={[styles.notifyIconWrap, draftNotifications && styles.notifyIconWrapOn]}>
              <Bell size={20} color={draftNotifications ? colors.green : colors.muted} />
            </View>
            <View style={styles.notifyText}>
              <Text style={styles.notifyTitle}>Daily reminders</Text>
              <Text style={styles.notifySub}>
                {DAILY_REMINDER_TIME_LABEL} nudges — &quot;What&apos;s for dinner?&quot;
              </Text>
            </View>
            <Switch
              value={draftNotifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: colors.border, true: 'rgba(0,168,107,0.35)' }}
              thumbColor={draftNotifications ? colors.green : colors.white}
            />
          </View>
        </SettingsCard>

        <PrimaryButton
          label={isSaving ? 'Saving…' : 'Save preferences'}
          onPress={handleSave}
          disabled={isSaving}
          style={styles.saveBtnWrap}
        />
      </ScrollViewWithFloatingIndicator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
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
