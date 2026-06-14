import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Info,
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
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import {
  CuisineId,
  DietChoice,
  colors,
  gradients,
  scrollIndicator,
} from '@/constants/theme';
import { useReferenceData } from '@/context/ReferenceContext';
import { cuisinesToRegion, getKitchenStyleLabel } from '@/utils/kitchenStyles';
import { dietChoiceToFilter } from '@/utils/storage';
import { DAILY_REMINDER_TIME_LABEL } from '@/utils/notifications';
import { useAppContext } from '@/context/AppContext';

type OnboardingStep = 'diet' | 'cuisine' | 'notifications';

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAppContext();
  const { kitchenStyles, refreshReference } = useReferenceData();

  useFocusEffect(
    useCallback(() => {
      void refreshReference();
    }, [refreshReference]),
  );

  const [step, setStep] = useState<OnboardingStep>('diet');
  const [selectedDiet, setSelectedDiet] = useState<DietChoice | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineId[]>([]);
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

  const handleCuisineContinue = () => {
    if (selectedCuisines.length === 0) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('notifications');
  };

  const handleEnableNotifications = async () => {
    setIsSubmitting(true);
    try {
      let enabled = false;
      if (Platform.OS !== 'web') {
        const { status: existing } = await Notifications.getPermissionsAsync();
        let finalStatus = existing;
        if (existing !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        enabled = finalStatus === 'granted';
      }
      await finishOnboarding(enabled);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipNotifications = async () => {
    setIsSubmitting(true);
    try {
      await finishOnboarding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishOnboarding = async (notificationsEnabled: boolean) => {
    if (!selectedDiet || finishingRef.current) return;

    finishingRef.current = true;
    try {
      await completeOnboarding({
        dietPreference: dietChoiceToFilter(selectedDiet),
        dietChoice: selectedDiet,
        favoriteCuisines: selectedCuisines,
        regionalCuisine: cuisinesToRegion(selectedCuisines, kitchenStyles),
        notificationsEnabled,
      });

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(auth)/login');
    } catch {
      finishingRef.current = false;
      throw new Error('Could not save onboarding. Please try again.');
    }
  };

  if (step === 'notifications') {
    return (
      <View style={styles.darkRoot}>
        <LinearGradient
          colors={['#0A0908', '#0F1210', '#0A0908']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.glowGreen} />

        <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Text style={styles.brand}>Rasoi</Text>
          </View>

          <ScrollViewWithFloatingIndicator
            {...scrollIndicator}
            contentContainerStyle={styles.notifyContent}
            floatingLabel="Scroll"
          >
            <Text style={styles.notifyTitle}>
              Never ask <Text style={styles.notifyHighlight}>&quot;What&apos;s for dinner?&quot;</Text>{' '}
              again.
            </Text>
            <Text style={styles.notifySubtitle}>
              Rasoi works best with daily nudges at{' '}
              <Text style={styles.notifyBold}>{DAILY_REMINDER_TIME_LABEL}</Text>. Enable notifications
              to unlock dinner inspiration.
            </Text>

            <View style={styles.bellWrap}>
              <View style={styles.bellRingOuter} />
              <View style={styles.bellRingInner} />
              <View style={styles.bellDotGreen} />
              <View style={styles.bellDotOrange} />
              <View style={styles.bellCircle}>
                <Bell size={36} color={colors.primary} fill={colors.primary} />
              </View>
            </View>
          </ScrollViewWithFloatingIndicator>

          <View style={styles.notifyFooter}>
            <Pressable
              onPress={handleEnableNotifications}
              disabled={isSubmitting}
              style={[styles.notifyButtonWrap, isSubmitting && styles.buttonDisabled]}
            >
              <LinearGradient
                colors={[...gradients.cta]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.notifyButton}
              >
                <Text style={styles.notifyButtonText}>Enable & Continue</Text>
                <Bell size={18} color={colors.charcoal} />
              </LinearGradient>
            </Pressable>

            <View style={styles.infoPill}>
              <Info size={14} color={colors.white} />
              <Text style={styles.infoPillText}>Required for Rasoi&apos;s smart curation</Text>
            </View>

            <Pressable onPress={handleSkipNotifications} disabled={isSubmitting}>
              <Text style={styles.skipNotify}>Maybe later</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.darkRoot}>
      <LinearGradient
        colors={['#0A0908', '#0F1210', '#0A0908']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.glowGreen} />

      <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
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
              floatingLabel="Pick cuisines"
            >
              <Text style={styles.cuisineEyebrow}>Step 2 of 3</Text>
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
