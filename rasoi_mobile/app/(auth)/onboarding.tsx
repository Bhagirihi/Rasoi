import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect, Redirect } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  MapPin,
} from 'lucide-react-native';
import { useRef, useState, useCallback, useEffect } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CuisinePreferenceList from '@/components/CuisinePreferenceList';
import DietPreferenceList from '@/components/DietPreferenceList';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import PermissionOnboardingStep, { PermissionIconBadge } from '@/components/auth/PermissionOnboardingStep';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import {
  CuisineId,
  DietChoice,
  colors,
  gradients,
  scrollIndicator,
} from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useReferenceData } from '@/context/ReferenceContext';
import { cuisinesToRegion, getKitchenStyleLabel } from '@/utils/kitchenStyles';
import { dietChoiceToFilter } from '@/utils/storage';
import { DAILY_REMINDER_MEAL_SUMMARY, DAILY_REMINDER_TIME_LABEL, ensureNotificationPermissions, isNotificationPermissionGranted } from '@/utils/notifications';
import {
  ensureLocationPermissions,
  isLocationPermissionGranted,
  requestUserLocation,
} from '@/utils/location';
import { useAppContext } from '@/context/AppContext';

type OnboardingStep = 'diet' | 'cuisine' | 'notifications' | 'location';

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, isHydrated, isLoggedIn, hasCompletedOnboarding, syncUserLocation, pendingPantrySetup } = useAppContext();
  const { kitchenStyles, refreshReference } = useReferenceData();

  useFocusEffect(
    useCallback(() => {
      void refreshReference();
    }, [refreshReference]),
  );

  const [step, setStep] = useState<OnboardingStep>('diet');
  const [selectedDiet, setSelectedDiet] = useState<DietChoice | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineId[]>([]);
  const [notificationsPreference, setNotificationsPreference] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const finishingRef = useRef(false);

  useEffect(() => {
    const activeIds = new Set(kitchenStyles.map((style) => style.id));
    setSelectedCuisines((current) => current.filter((id) => activeIds.has(id)));
  }, [kitchenStyles]);

  const toggleCuisine = (id: CuisineId) => {
    void Haptics.selectionAsync();
    setSelectedCuisines((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleDietContinue = () => {
    if (!selectedDiet) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('cuisine');
  };

  const proceedToLocationOrFinish = async (notificationsEnabled: boolean) => {
    setNotificationsPreference(notificationsEnabled);

    const locationGranted =
      Platform.OS === 'web' || (await isLocationPermissionGranted());
    if (!locationGranted) {
      setStep('location');
      return;
    }

    setIsSubmitting(true);
    try {
      await finishOnboarding(notificationsEnabled);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCuisineContinue = async () => {
    if (selectedCuisines.length === 0) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const notificationsGranted =
      Platform.OS === 'web' || (await isNotificationPermissionGranted());
    if (!notificationsGranted) {
      setStep('notifications');
      return;
    }

    await proceedToLocationOrFinish(true);
  };

  const handleEnableNotifications = async () => {
    setIsSubmitting(true);
    try {
      const enabled =
        Platform.OS !== 'web'
          ? (await isNotificationPermissionGranted()) ||
            (await ensureNotificationPermissions())
          : false;
      await proceedToLocationOrFinish(enabled);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipNotifications = async () => {
    setIsSubmitting(true);
    try {
      await proceedToLocationOrFinish(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnableLocation = async () => {
    setIsSubmitting(true);
    try {
      const granted =
        Platform.OS !== 'web'
          ? (await isLocationPermissionGranted()) || (await ensureLocationPermissions())
          : false;
      if (granted) {
        const snapshot = await requestUserLocation();
        if (snapshot?.latitude != null && snapshot.longitude != null) {
          await syncUserLocation(snapshot);
        }
      }
      await finishOnboarding(notificationsPreference);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipLocation = async () => {
    setIsSubmitting(true);
    try {
      await finishOnboarding(notificationsPreference);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishOnboarding = async (notificationsEnabled: boolean) => {
    if (!selectedDiet || finishingRef.current) return;

    finishingRef.current = true;
    try {
      const showTrialWelcome = await completeOnboarding({
        dietPreference: dietChoiceToFilter(selectedDiet),
        dietChoice: selectedDiet,
        favoriteCuisines: selectedCuisines,
        regionalCuisine: cuisinesToRegion(selectedCuisines, kitchenStyles),
        notificationsEnabled,
      });

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (!isLoggedIn) {
        router.replace('/(auth)/login');
        return;
      }
      if (pendingPantrySetup) {
        router.replace('/(tabs)/pantry');
        return;
      }
      router.replace(showTrialWelcome ? '/(auth)/trial-welcome' : '/(tabs)');
    } catch {
      finishingRef.current = false;
      throw new Error('Could not save onboarding. Please try again.');
    }
  };

  if (isHydrated && !isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isHydrated && hasCompletedOnboarding) {
    return <Redirect href={pendingPantrySetup ? '/(tabs)/pantry' : '/(tabs)'} />;
  }

  if (step === 'notifications') {
    return (
      <PermissionOnboardingStep
        isSubmitting={isSubmitting}
        onEnable={handleEnableNotifications}
        onSkip={handleSkipNotifications}
        skipTestID={testIds.onboardingSkipNotify}
        title={
          <>
            Never ask <Text style={styles.notifyHighlight}>&quot;What&apos;s for dinner?&quot;</Text>{' '}
            again.
          </>
        }
        subtitle={
          <>
            Rasoi sends 5 personalized recipe picks daily at{' '}
            <Text style={styles.notifyBold}>{DAILY_REMINDER_TIME_LABEL}</Text> — for{' '}
            {DAILY_REMINDER_MEAL_SUMMARY}. Enable notifications to get them.
          </>
        }
        icon={
          <PermissionIconBadge>
            <Bell size={36} color={colors.primary} fill={colors.primary} />
          </PermissionIconBadge>
        }
        enableLabel="Enable & Continue"
        enableIcon={<Bell size={18} color={colors.charcoal} />}
        infoText="Recommended — get personalized picks at breakfast, lunch, and dinner"
      />
    );
  }

  if (step === 'location') {
    return (
      <PermissionOnboardingStep
        isSubmitting={isSubmitting}
        onEnable={handleEnableLocation}
        onSkip={handleSkipLocation}
        skipTestID={testIds.onboardingSkipLocation}
        savingSubtitle="Saving your city for local picks"
        title={
          <>
            Discover what&apos;s cooking in{' '}
            <Text style={styles.notifyHighlight}>your city</Text>.
          </>
        }
        subtitle={
          <>
            Allow location so Rasoi can surface local recipes and help sponsors reach home cooks
            near you.
          </>
        }
        icon={
          <PermissionIconBadge>
            <MapPin size={36} color={colors.primary} fill={colors.primary} />
          </PermissionIconBadge>
        }
        enableLabel="Enable & Continue"
        enableIcon={<MapPin size={18} color={colors.charcoal} />}
        infoText="We only use your city — never track you in the background"
      />
    );
  }

  return (
    <View style={styles.darkRoot}>
      <AppSavingOverlay
        visible={isSubmitting}
        message="Setting up your Rasoi…"
        subtitle="Saving tastes and reminders"
      />
      <LinearGradient
        colors={['#0A0908', '#0F1210', '#0A0908']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.glowGreen} />

      <SafeAreaView style={styles.flex} edges={['top', 'bottom']} testID={testIds.screenOnboarding}>
        {step === 'cuisine' && (
          <Pressable
            onPress={() => {
              void Haptics.selectionAsync();
              setStep('diet');
            }}
            style={styles.backButton}
            hitSlop={12}
          >
            <ArrowLeft size={22} color={colors.dark.text} />
          </Pressable>
        )}

        <View style={step === 'cuisine' ? styles.headerWithBack : styles.header}>
          <Text style={styles.brand}>Rasoi</Text>
        </View>

        {step === 'diet' ? (
          <>
            <View style={styles.darkContent}>
              <Text style={styles.darkTitle}>What is your dietary preference?</Text>
              <Text style={styles.darkSubtitle}>This helps us filter dishes you love.</Text>

              <View style={styles.dietList}>
                <DietPreferenceList
                  selected={selectedDiet}
                  onSelect={setSelectedDiet}
                  variant="dark"
                />
              </View>
            </View>

            <View style={styles.darkFooter}>
              <Pressable
                onPress={handleDietContinue}
                disabled={!selectedDiet}
                testID={testIds.onboardingDietContinue}
                style={[
                  styles.darkPrimaryButton,
                  !selectedDiet
                    ? styles.darkPrimaryButtonDisabled
                    : styles.darkPrimaryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.darkPrimaryButtonText,
                    !selectedDiet && styles.darkPrimaryButtonTextDisabled,
                  ]}
                >
                  CONTINUE
                </Text>
                <ArrowRight
                  size={18}
                  color={selectedDiet ? colors.dark.text : colors.dark.buttonDisabledText}
                />
              </Pressable>
              <Text style={styles.footerHint}>Select 1 to continue</Text>
            </View>
          </>
        ) : (
          <>
            <ScrollViewWithFloatingIndicator
              style={styles.flex}
              {...scrollIndicator}
              contentContainerStyle={styles.cuisineContent}
            >
              <Text style={styles.cuisineEyebrow}>Step 2 of 4</Text>
              <Text style={styles.darkTitle}>Shape your Rasoi feed</Text>
              <Text style={styles.darkSubtitle}>
                Which kitchen styles do you actually cook? Choose every vibe that feels like
                yours — we&apos;ll mix them into your daily picks.
              </Text>

              <View style={styles.selectionBar}>
                <Text style={styles.selectionCount}>
                  {selectedCuisines.length === 0
                    ? 'No styles picked yet'
                    : `${selectedCuisines.length} style${selectedCuisines.length > 1 ? 's' : ''} added`}
                </Text>
                {selectedCuisines.length > 0 && (
                  <ScrollView
                    horizontal
                    {...scrollIndicator}
                    contentContainerStyle={styles.selectedChipRow}
                  >
                    {selectedCuisines.map((id) => (
                      <View key={id} style={styles.selectedChip}>
                        <Text style={styles.selectedChipText}>
                          {getKitchenStyleLabel(id, kitchenStyles)}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View style={styles.cuisineList}>
                <CuisinePreferenceList
                  selected={selectedCuisines}
                  onToggle={toggleCuisine}
                  variant="dark"
                />
              </View>
            </ScrollViewWithFloatingIndicator>

            <View style={styles.darkFooter}>
              <Pressable
                onPress={handleCuisineContinue}
                disabled={selectedCuisines.length === 0}
                testID={testIds.onboardingCuisineContinue}
                style={[
                  styles.darkPrimaryButton,
                  selectedCuisines.length === 0 && styles.darkPrimaryButtonDisabled,
                  selectedCuisines.length > 0 && styles.darkPrimaryButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.darkPrimaryButtonText,
                    selectedCuisines.length === 0 && styles.darkPrimaryButtonTextDisabled,
                  ]}
                >
                  {selectedCuisines.length === 0
                    ? 'Pick at least one style'
                    : `Save ${selectedCuisines.length} taste${selectedCuisines.length > 1 ? 's' : ''} & continue`}
                </Text>
                <ArrowRight
                  size={18}
                  color={
                    selectedCuisines.length > 0
                      ? colors.dark.text
                      : colors.dark.buttonDisabledText
                  }
                />
              </Pressable>
              <Text style={styles.footerHint}>
                Mix and match freely — update anytime from Settings.
              </Text>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  darkRoot: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  glowGreen: {
    position: 'absolute',
    right: -80,
    bottom: 120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0,168,107,0.12)',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 56,
    zIndex: 10,
    padding: 4,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerWithBack: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    marginTop: 8,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  darkContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  darkTitle: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
    color: colors.dark.text,
    letterSpacing: -0.5,
  },
  darkSubtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: colors.dark.textMuted,
  },
  dietList: {
    marginTop: 28,
    gap: 14,
  },
  dietCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
  },
  dietCardActive: {
    borderColor: 'rgba(255,107,53,0.45)',
    backgroundColor: colors.dark.cardSelected,
  },
  dietIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dietTextWrap: { flex: 1 },
  dietLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark.text,
  },
  dietSubtitle: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.dark.textMuted,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#4A4540',
  },
  radioActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  cuisineContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 24,
  },
  cuisineEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: 10,
  },
  selectionBar: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    gap: 10,
  },
  selectionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textMuted,
  },
  selectedChipRow: {
    gap: 8,
    paddingRight: 8,
  },
  selectedChip: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,107,53,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  cuisineList: {
    marginTop: 20,
    gap: 12,
  },
  cuisineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 12,
    gap: 12,
  },
  cuisineRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.dark.cardSelected,
  },
  cuisineHero: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },
  cuisineRowBody: {
    flex: 1,
    gap: 4,
  },
  cuisineRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisineLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark.text,
  },
  moodPill: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  moodPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.dark.textMuted,
  },
  cuisineTagline: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.dark.textMuted,
  },
  cuisineCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4A4540',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cuisineCheckSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  darkFooter: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  darkPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.dark.buttonDisabled,
    paddingVertical: 18,
  },
  darkPrimaryButtonDisabled: {
    backgroundColor: colors.dark.buttonDisabled,
  },
  darkPrimaryButtonActive: {
    backgroundColor: colors.primary,
  },
  darkPrimaryButtonText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.dark.text,
  },
  darkPrimaryButtonTextDisabled: {
    color: colors.dark.buttonDisabledText,
  },
  footerHint: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
    color: colors.dark.textMuted,
  },
  buttonDisabled: { opacity: 0.6 },
  notifyContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 8,
    alignItems: 'center',
  },
  notifyTitle: {
    marginTop: 24,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 44,
    textAlign: 'center',
    color: colors.dark.text,
  },
  notifyHighlight: {
    color: colors.primary,
    fontStyle: 'italic',
  },
  notifySubtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    color: colors.dark.textMuted,
  },
  notifyBold: {
    fontWeight: '700',
    color: colors.dark.text,
  },
  bellWrap: {
    marginTop: 48,
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellRingOuter: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.15)',
  },
  bellRingInner: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.25)',
  },
  bellDotGreen: {
    position: 'absolute',
    top: 28,
    right: 36,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  bellDotOrange: {
    position: 'absolute',
    bottom: 36,
    left: 32,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  bellCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  notifyFooter: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  notifyButtonWrap: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  notifyButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.charcoal,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: colors.charcoal,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  infoPillText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  skipNotify: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textMuted,
  },
});
