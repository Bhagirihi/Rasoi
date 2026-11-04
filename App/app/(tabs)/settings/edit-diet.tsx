import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DietPreferenceList from '@/components/DietPreferenceList';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { SettingsSubHeader } from '@/components/settings/SettingsBlocks';
import { PrimaryButton } from '@/components/ui/Primitives';
import { DietChoice, colors, layout, scrollIndicator, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { useTheme } from '@/context/ThemeContext';

export default function EditDietScreen() {
  const router = useRouter();
  const tabBarHeight = useTabBarHeight();
  const { colors: themeColors, colorScheme, screenBackground } = useTheme();
  const prefVariant = colorScheme === 'dark' ? 'dark' : 'light';
  const { showDialog } = useAppDialog();
  const {
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
    notificationsEnabled,
    allergyExclusions,
    householdSize,
    saveFoodPreferences,
  } = useAppContext();

  const [draftDiet, setDraftDiet] = useState<DietChoice>(dietChoice);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraftDiet(dietChoice);
  }, [dietChoice]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveFoodPreferences({
        dietChoice: draftDiet,
        regionalCuisine,
        favoriteCuisines,
        notificationsEnabled,
        allergyExclusions,
        householdSize,
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      showDialog({
        title: 'Could not save diet',
        message: error instanceof Error ? error.message : 'Please try again.',
        buttons: [{ text: 'OK' }],
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBackground }]} edges={['top']}>
      <AppSavingOverlay visible={isSaving} message="Saving your diet…" />
      <SettingsSubHeader title="Diet" onBack={() => router.back()} />

      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.intro, { color: themeColors.muted }]}>
          Choose what you eat — recipes and filters update to match.
        </Text>

        <DietPreferenceList
          selected={draftDiet}
          onSelect={setDraftDiet}
          variant={prefVariant}
        />

        <PrimaryButton
          label="Save diet"
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
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  saveBtnWrap: {
    marginTop: spacing.xxl,
  },
});


