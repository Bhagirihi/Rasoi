import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CuisinePreferenceList from '@/components/CuisinePreferenceList';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { SettingsSubHeader } from '@/components/settings/SettingsBlocks';
import { PrimaryButton } from '@/components/ui/Primitives';
import { CuisineId, colors, layout, scrollIndicator, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useAppDialog } from '@/context/AppDialogContext';
import { useTheme } from '@/context/ThemeContext';
import { useReferenceData } from '@/context/ReferenceContext';
import { cuisinesToRegion, getSelectableKitchenStyles } from '@/utils/kitchenStyles';

export default function EditKitchenStylesScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
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
  const { kitchenStyles, refreshReference } = useReferenceData();

  useFocusEffect(
    useCallback(() => {
      void refreshReference();
    }, [refreshReference]),
  );

  const [draftCuisines, setDraftCuisines] = useState<CuisineId[]>(favoriteCuisines);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraftCuisines(favoriteCuisines);
  }, [favoriteCuisines]);

  useEffect(() => {
    const activeIds = new Set(getSelectableKitchenStyles(kitchenStyles).map((style) => style.id));
    setDraftCuisines((current) => current.filter((id) => activeIds.has(id)));
  }, [kitchenStyles]);

  const toggleCuisine = (id: CuisineId) => {
    void Haptics.selectionAsync();
    setDraftCuisines((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleSave = async () => {
    if (draftCuisines.length === 0) {
      showDialog({
        title: 'Pick at least one style',
        message: 'Choose one or more kitchen styles to personalize your picks.',
        buttons: [{ text: 'OK' }],
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveFoodPreferences({
        dietChoice,
        regionalCuisine: cuisinesToRegion(draftCuisines, kitchenStyles) || regionalCuisine,
        favoriteCuisines: draftCuisines,
        notificationsEnabled,
        allergyExclusions,
        householdSize,
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      showDialog({
        title: 'Could not save kitchen styles',
        message: error instanceof Error ? error.message : 'Please try again.',
        buttons: [{ text: 'OK' }],
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBackground }]} edges={['top']}>
      <AppSavingOverlay visible={isSaving} message="Saving kitchen styles…" />
      <SettingsSubHeader title="Kitchen styles" onBack={() => router.back()} />
      <View
        style={[
          styles.selectionHeader,
          { backgroundColor: themeColors.white, borderColor: themeColors.border },
        ]}
      >
        <Text style={[styles.selectionHeaderLabel, { color: themeColors.charcoal }]}>
          Styles selected
        </Text>
        <View style={styles.selectionCountBadge}>
          <Text style={styles.selectionCountText}>{draftCuisines.length}</Text>
        </View>
      </View>

      <ScrollViewWithFloatingIndicator
        {...scrollIndicator}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.intro, { color: themeColors.muted }]}>
          Pick regional and special collections you cook most — same choices as onboarding.
        </Text>

        <CuisinePreferenceList
          selected={draftCuisines}
          onToggle={toggleCuisine}
          variant={prefVariant}
        />

        <PrimaryButton
          label="Save kitchen styles"
          onPress={handleSave}
          disabled={isSaving || draftCuisines.length === 0}
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
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  selectionHeaderLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  selectionCountBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  selectionCountText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
});
