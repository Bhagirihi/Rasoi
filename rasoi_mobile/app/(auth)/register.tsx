import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react-native';
import { useEffect, useRef, useState, useMemo, type RefObject } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import CuisinePreferenceList from '@/components/CuisinePreferenceList';
import DietPreferenceList from '@/components/DietPreferenceList';
import AuthAtmosphere, { AUTH_ATMOSPHERE_BG } from '@/components/AuthAtmosphere';
import RasoiBrandIcon from '@/components/RasoiBrandIcon';
import {
  colors,
  gradients,
  layout,
  scrollIndicator,
  spacing,
  type CuisineId,
  type DietChoice,
} from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import { useAppContext } from '@/context/AppContext';
import { useReferenceData } from '@/context/ReferenceContext';
import GenderPicker from '@/components/GenderPicker';
import type { Gender } from '@/constants/genderOptions';
import { authError, authLog, maskEmail } from '@/utils/authLogger';
import { isEmailDeliveryUnavailableError } from '@/utils/emailDeliveryErrors';
import { warmApiConnection } from '@/utils/api';
import {
  getIndianPhoneError,
  getEmailValidationError,
  isValidEmail,
  isValidPhoneLength,
  loadSignupPreferences,
  normalizeEmail,
  normalizeIndianPhone,
  dietChoiceToFilter,
} from '@/utils/storage';
import { cuisinesToRegion, getSelectableKitchenStyles } from '@/utils/kitchenStyles';
import { scrollFieldIntoView } from '@/utils/scrollFieldIntoView';

type RegisterStep = 'details' | 'diet' | 'kitchen' | 'email-otp';
type FieldError = 'name' | 'phone' | 'email' | 'gender' | 'diet' | 'cuisine' | 'otp' | 'general' | null;
type BusyAction = 'send' | 'verify' | 'resend' | null;

type SignupDetails = { name: string; phone: string; email: string; gender: Gender };

const COMPACT_HEIGHT = 740;
const SHORT_HEIGHT = 680;

export default function RegisterScreen() {
  const router = useRouter();
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isCompact = windowHeight < COMPACT_HEIGHT;
  const isShort = windowHeight < SHORT_HEIGHT;
  const {
    sendEmailOtp,
    verifyEmailOtpAndLogin,
    saveSignupPreferences,
    userName,
    userPhone,
    userEmail,
    isGuest,
  } = useAppContext();
  const { kitchenStyles } = useReferenceData();

  const [step, setStep] = useState<RegisterStep>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<DietChoice | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineId[]>([]);
  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const isSubmitting = busyAction !== null;

  useEffect(() => {
    if (!isGuest && userName && userName !== 'Guest') {
      setName(userName);
      setPhone(userPhone);
      if (userEmail) setEmail(userEmail);
    }
  }, [isGuest, userName, userPhone, userEmail]);

  useEffect(() => {
    void loadSignupPreferences().then((prefs) => {
      if (!prefs) return;
      setSelectedDiet(prefs.dietChoice);
      setSelectedCuisines(prefs.favoriteCuisines);
    });
  }, []);

  useEffect(() => {
    const activeIds = new Set(getSelectableKitchenStyles(kitchenStyles).map((style) => style.id));
    setSelectedCuisines((current) => current.filter((id) => activeIds.has(id)));
  }, [kitchenStyles]);

  useEffect(() => {
    if (step === 'email-otp') warmApiConnection();
  }, [step]);

  useEffect(() => {
    if (step !== 'email-otp') return;
    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  const [keyboardInset, setKeyboardInset] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const nameFieldRef = useRef<View>(null);
  const phoneFieldRef = useRef<View>(null);
  const emailFieldRef = useRef<View>(null);
  const otpFieldRef = useRef<View>(null);
  const nameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const otpInputRef = useRef<TextInput>(null);
  const focusedFieldRef = useRef<View | null>(null);
  const keyboardLayoutRef = useRef({ height: 0, screenY: 0 });

  const focusField = (fieldRef: RefObject<View | null>) => {
    focusedFieldRef.current = fieldRef.current;
    const { height, screenY } = keyboardLayoutRef.current;
    scrollFieldIntoView(scrollRef, fieldRef, scrollYRef, height, screenY);
  };

  const focusNextInput = (
    inputRef: RefObject<TextInput | null>,
    containerRef: RefObject<View | null>,
  ) => {
    inputRef.current?.focus();
    focusField(containerRef);
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (event) => {
      const { height, screenY } = event.endCoordinates;
      keyboardLayoutRef.current = { height, screenY };
      setKeyboardInset(height);
      // Wait for footer to hide and layout to settle, then bring the focused field above the keyboard.
      const delay = Platform.OS === 'android' ? 320 : 120;
      setTimeout(() => {
        if (focusedFieldRef.current) {
          scrollFieldIntoView(
            scrollRef,
            { current: focusedFieldRef.current },
            scrollYRef,
            height,
            screenY,
          );
        }
      }, delay);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardLayoutRef.current = { height: 0, screenY: 0 };
      setKeyboardInset(0);
      focusedFieldRef.current = null;
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const validateContactDetails = (): SignupDetails | null => {
    const trimmedName = name.trim();
    const normalizedPhone = normalizeIndianPhone(phone);
    const normalizedEmail = normalizeEmail(email);

    if (trimmedName.length < 2) {
      setFieldError('name');
      setErrorMessage('Please enter at least 2 characters for your name.');
      return null;
    }

    if (!isValidPhoneLength(normalizedPhone)) {
      setFieldError('phone');
      setErrorMessage(
        getIndianPhoneError(normalizedPhone) ??
          'Enter a valid 10-digit Indian mobile number (starts with 6–9).',
      );
      return null;
    }

    if (!isValidEmail(normalizedEmail)) {
      setFieldError('email');
      setErrorMessage(
        getEmailValidationError(normalizedEmail) ?? 'Enter a valid email address.',
      );
      return null;
    }

    if (!selectedGender) {
      setFieldError('gender');
      setErrorMessage('Pick your gender to continue.');
      return null;
    }

    return {
      name: trimmedName,
      phone: normalizedPhone,
      email: normalizedEmail,
      gender: selectedGender,
    };
  };

  const validateSignupComplete = (): SignupDetails | null => {
    const details = validateContactDetails();
    if (!details) {
      setStep('details');
      return null;
    }

    if (!selectedDiet) {
      setFieldError('diet');
      setErrorMessage('Pick your diet (e.g. Veg) to continue.');
      setStep('diet');
      return null;
    }

    if (selectedCuisines.length === 0) {
      setFieldError('cuisine');
      setErrorMessage('Pick at least one kitchen style (e.g. Gujarati Home).');
      setStep('kitchen');
      return null;
    }

    return details;
  };

  const toggleCuisine = (id: CuisineId) => {
    void Haptics.selectionAsync();
    setSelectedCuisines((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    if (fieldError === 'cuisine') setFieldError(null);
  };

  const persistSignupPreferences = async () => {
    if (!selectedDiet || selectedCuisines.length === 0) return;
    await saveSignupPreferences({
      dietChoice: selectedDiet,
      dietPreference: dietChoiceToFilter(selectedDiet),
      favoriteCuisines: selectedCuisines,
      regionalCuisine: cuisinesToRegion(selectedCuisines, kitchenStyles),
    });
  };

  const handleContinueFromDetails = () => {
    setFieldError(null);
    setErrorMessage('');
    const details = validateContactDetails();
    if (!details) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('diet');
  };

  const handleContinueFromDiet = () => {
    setFieldError(null);
    setErrorMessage('');
    if (!selectedDiet) {
      setFieldError('diet');
      setErrorMessage('Pick your diet (e.g. Veg) to continue.');
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('kitchen');
  };

  const handleSendOtp = async () => {
    setFieldError(null);
    setErrorMessage('');

    const details = validateSignupComplete();
    if (!details) return;

    await persistSignupPreferences();
    await sendOtpForDetails(details);
  };

  const sendOtpForDetails = async (details: SignupDetails) => {
    setBusyAction('send');
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      authLog('register:sendEmailOtp', { email: maskEmail(details.email) });
      await sendEmailOtp(details.name, details.phone, details.email);
      setStep('email-otp');
      setOtp('');
    } catch (error) {
      authError('register:sendEmailOtp_failed', error, { email: maskEmail(details.email) });
      setFieldError('general');
      if (isEmailDeliveryUnavailableError(error)) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Email delivery is temporarily unavailable. You can keep using Rasoi and verify later.',
        );
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : 'Could not send verification code. Try again.',
        );
      }
    } finally {
      setBusyAction(null);
    }
  };

  const handleVerifyOtp = async () => {
    setFieldError(null);
    setErrorMessage('');

    const details = validateSignupComplete();
    if (!details) return;

    const code = otp.replace(/\D/g, '').trim();
    if (code.length < 6) {
      setFieldError('otp');
      setErrorMessage('Enter the verification code from your email.');
      return;
    }

    setBusyAction('verify');
    let verified = false;
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      authLog('register:verifyOtp', { email: maskEmail(details.email), otpLength: code.length });
      await verifyEmailOtpAndLogin(
        details.email,
        code,
        details.name,
        details.phone,
        { acceptedTerms: true, gender: details.gender },
      );
      authLog('register:verifyOtp_success');
      verified = true;
      router.replace('/(auth)/legal-consent?from=register');
    } catch (error) {
      authError('register:verifyOtp_failed', error, { email: maskEmail(details.email) });
      setFieldError('otp');
      setErrorMessage(
        error instanceof Error ? error.message : 'Invalid or expired code. Please try again.',
      );
    } finally {
      if (!verified) setBusyAction(null);
    }
  };

  const handleResendOtp = async () => {
    setFieldError(null);
    setErrorMessage('');
    setBusyAction('resend');
    try {
      const details = validateSignupComplete();
      if (!details) return;
      await sendEmailOtp(details.name, details.phone, details.email);
      setErrorMessage('A new code was sent to your email.');
    } catch (error) {
      setFieldError('general');
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not resend code. Try again.',
      );
    } finally {
      setBusyAction(null);
    }
  };

  const goBack = () => {
    setFieldError(null);
    setErrorMessage('');
    if (step === 'email-otp') {
      setStep('kitchen');
      setOtp('');
      return;
    }
    if (step === 'kitchen') {
      setStep('diet');
      return;
    }
    if (step === 'diet') {
      setStep('details');
    }
  };

  const stepMeta = useMemo(() => {
    switch (step) {
      case 'details':
        return {
          title: 'Create your account',
          subtitle: '',
          primaryLabel: 'Continue',
          primaryTestId: testIds.registerContinueContact,
          primaryDisabled: false,
          showLoginLink: true,
        };
      case 'diet':
        return {
          title: 'What\'s your diet?',
          subtitle: 'We filter recipes to match how you eat at home.',
          primaryLabel: 'Continue',
          primaryTestId: testIds.registerContinueDiet,
          primaryDisabled: !selectedDiet,
          showLoginLink: false,
        };
      case 'kitchen':
        return {
          title: 'Which kitchen styles?',
          subtitle: 'Pick regional and special collections you cook most often.',
          primaryLabel: 'Send verification code',
          primaryTestId: testIds.registerSendOtp,
          primaryDisabled: selectedCuisines.length === 0,
          showLoginLink: false,
        };
      case 'email-otp':
        return {
          title: 'Verify your email',
          subtitle: `Enter the code sent to ${normalizeEmail(email)}`,
          primaryLabel: 'Create account',
          primaryTestId: testIds.registerVerifyOtp,
          primaryDisabled: false,
          showLoginLink: false,
        };
    }
  }, [step, selectedDiet, selectedCuisines.length, email]);

  const handlePrimaryAction = () => {
    switch (step) {
      case 'details':
        handleContinueFromDetails();
        return;
      case 'diet':
        handleContinueFromDiet();
        return;
      case 'kitchen':
        void handleSendOtp();
        return;
      case 'email-otp':
        void handleVerifyOtp();
        return;
    }
  };

  const overlaySteps = useMemo(() => {
    switch (busyAction) {
      case 'verify':
        return [{ message: 'Creating your account', subtitle: 'Verifying your code and setting things up' }];
      case 'resend':
        return [{ message: 'Sending a new code', subtitle: 'Check your inbox — it usually arrives in a few seconds' }];
      case 'send':
        return [{ message: 'Sending your code', subtitle: 'Check your inbox — it usually arrives in a few seconds' }];
      default:
        return undefined;
    }
  }, [busyAction]);

  return (
    <View style={styles.root}>
      <AuthAtmosphere />

      <SafeAreaView style={styles.flex} edges={['top']} testID={testIds.screenRegister}>
      <AppSavingOverlay visible={isSubmitting} steps={overlaySteps} />
      {step === 'kitchen' ? (
        <View style={[styles.selectionHeader, isCompact && styles.selectionHeaderCompact]}>
          <Text style={styles.selectionHeaderLabel}>Kitchen styles selected</Text>
          <View style={styles.selectionCountBadge}>
            <Text style={styles.selectionCountText}>{selectedCuisines.length}</Text>
          </View>
        </View>
      ) : null}
      <ScrollViewWithFloatingIndicator
          {...scrollIndicator}
          scrollRef={scrollRef}
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            isCompact && styles.scrollContentCompact,
            isShort && styles.scrollContentShort,
            {
              paddingBottom:
                keyboardInset > 0
                  ? keyboardInset + spacing.xxl
                  : spacing.sm,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScroll={(event) => {
            scrollYRef.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {step === 'details' ? (
            <View style={[styles.hero, isCompact && styles.heroCompact]}>
              <RasoiBrandIcon size={isShort ? 64 : isCompact ? 72 : 88} borderRadius={isShort ? 16 : 20} />
              {!isShort ? <Text style={styles.brand}>Rasoi</Text> : null}
            </View>
          ) : (
            <View style={styles.topRow}>
              <Text style={styles.brand}>Rasoi</Text>
            </View>
          )}

          {step !== 'details' && (
            <Pressable onPress={goBack} style={styles.backRow}>
              <ArrowLeft size={16} color={colors.primary} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          )}

          <Text style={[styles.title, isCompact && styles.titleCompact]}>{stepMeta.title}</Text>
          {stepMeta.subtitle ? (
            <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>{stepMeta.subtitle}</Text>
          ) : null}

          {step === 'details' ? (
            <View style={[styles.formPanel, isCompact && styles.formPanelCompact]}>
              <View ref={nameFieldRef} collapsable={false} style={styles.field}>
                <Text style={styles.label}>
                  Your Name <Text style={styles.labelRequired}>*</Text>
                </Text>
                <View style={[styles.inputRow, fieldError === 'name' && styles.inputRowError]}>
                  <User size={18} color={colors.dark.textMuted} />
                  <TextInput
                    ref={nameInputRef}
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      if (fieldError === 'name') setFieldError(null);
                    }}
                    onFocus={() => focusField(nameFieldRef)}
                    placeholder="e.g. Priya Sharma"
                    placeholderTextColor={colors.dark.buttonDisabledText}
                    autoCapitalize="words"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    submitBehavior="submit"
                    onSubmitEditing={() => focusNextInput(phoneInputRef, phoneFieldRef)}
                    style={[styles.input, isCompact && styles.inputCompact]}
                    testID={testIds.registerNameInput}
                  />
                </View>
              </View>

              <View style={[styles.field, fieldError === 'gender' && styles.fieldErrorWrap]}>
                <Text style={styles.label}>
                  Gender <Text style={styles.labelRequired}>*</Text>
                </Text>
                <GenderPicker
                  selected={selectedGender}
                  onSelect={(value) => {
                    setSelectedGender(value);
                    if (fieldError === 'gender') setFieldError(null);
                  }}
                  variant="dark"
                  compact={isCompact}
                />
              </View>

              <View ref={phoneFieldRef} collapsable={false} style={styles.field}>
                <Text style={styles.label}>
                  Mobile Number <Text style={styles.labelRequired}>*</Text>
                </Text>
                <View style={[styles.inputRow, fieldError === 'phone' && styles.inputRowError]}>
                  <Phone size={18} color={colors.dark.textMuted} />
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    ref={phoneInputRef}
                    value={phone}
                    onChangeText={(value) => {
                      setPhone(normalizeIndianPhone(value));
                      if (fieldError === 'phone') setFieldError(null);
                    }}
                    onFocus={() => focusField(phoneFieldRef)}
                    placeholder="9876543210"
                    placeholderTextColor={colors.dark.buttonDisabledText}
                    keyboardType={Platform.OS === 'android' ? 'phone-pad' : 'default'}
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    maxLength={10}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    submitBehavior="submit"
                    onSubmitEditing={() => focusNextInput(emailInputRef, emailFieldRef)}
                    style={[styles.input, isCompact && styles.inputCompact]}
                    testID={testIds.registerPhoneInput}
                  />
                </View>
              </View>

              <View ref={emailFieldRef} collapsable={false} style={styles.field}>
                <Text style={styles.label}>
                  Email <Text style={styles.labelRequired}>*</Text>
                </Text>
                <View style={[styles.inputRow, fieldError === 'email' && styles.inputRowError]}>
                  <Mail size={18} color={colors.dark.textMuted} />
                  <TextInput
                    ref={emailInputRef}
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (fieldError === 'email') setFieldError(null);
                    }}
                    onFocus={() => focusField(emailFieldRef)}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.dark.buttonDisabledText}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    submitBehavior="submit"
                    onSubmitEditing={handleContinueFromDetails}
                    style={[styles.input, isCompact && styles.inputCompact]}
                    testID={testIds.registerEmailInput}
                  />
                </View>
                {!isCompact ? (
                  <Text style={styles.fieldHint}>We send a one-time verification code to this email</Text>
                ) : null}
              </View>
            </View>
          ) : step === 'diet' ? (
            <View style={[styles.formPanel, isCompact && styles.formPanelCompact, fieldError === 'diet' && styles.preferenceFieldError]}>
              <DietPreferenceList
                selected={selectedDiet}
                onSelect={(value) => {
                  setSelectedDiet(value);
                  if (fieldError === 'diet') setFieldError(null);
                }}
                variant="dark"
              />
            </View>
          ) : step === 'kitchen' ? (
            <View style={[styles.formPanel, isCompact && styles.formPanelCompact, fieldError === 'cuisine' && styles.preferenceFieldError]}>
              <CuisinePreferenceList
                selected={selectedCuisines}
                onToggle={toggleCuisine}
                variant="dark"
              />
            </View>
          ) : (
            <View style={[styles.formPanel, isCompact && styles.formPanelCompact]}>
              <View ref={otpFieldRef} collapsable={false} style={styles.field}>
                <Text style={styles.label}>
                  Verification code <Text style={styles.labelRequired}>*</Text>
                </Text>
                <View style={[styles.inputRow, fieldError === 'otp' && styles.inputRowError]}>
                  <Mail size={18} color={colors.dark.textMuted} />
                  <TextInput
                    ref={otpInputRef}
                    value={otp}
                    onChangeText={(value) => {
                      setOtp(value.replace(/\D/g, '').slice(0, 8));
                      if (fieldError === 'otp') setFieldError(null);
                    }}
                    onFocus={() => focusField(otpFieldRef)}
                    placeholder="123456"
                    placeholderTextColor={colors.dark.buttonDisabledText}
                    keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
                    maxLength={8}
                    returnKeyType="done"
                    submitBehavior="submit"
                    onSubmitEditing={handleVerifyOtp}
                    style={[styles.input, styles.otpInput]}
                    testID={testIds.registerOtpInput}
                  />
                </View>
              </View>

              <Pressable onPress={handleResendOtp} disabled={isSubmitting} style={styles.resendWrap}>
                <Text style={styles.resendText}>Resend code</Text>
              </Pressable>
            </View>
          )}

          {errorMessage.length > 0 && (
            <View
              style={[
                styles.messageBox,
                fieldError === null && styles.messageBoxInfo,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  fieldError === null && styles.messageTextInfo,
                ]}
              >
                {errorMessage}
              </Text>
            </View>
          )}
        </ScrollViewWithFloatingIndicator>

        {keyboardInset === 0 ? (
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, spacing.md) },
            ]}
          >
            <View style={[styles.actions, isCompact && styles.actionsCompact]}>
              <Pressable
                onPress={handlePrimaryAction}
                disabled={isSubmitting || stepMeta.primaryDisabled}
                testID={stepMeta.primaryTestId}
                style={[
                  styles.submitWrap,
                  (isSubmitting || stepMeta.primaryDisabled) && styles.buttonDisabled,
                ]}
              >
                <LinearGradient
                  colors={[...gradients.cta]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.submitButton, isCompact && styles.submitButtonCompact]}
                >
                  <Text style={styles.submitButtonText}>{stepMeta.primaryLabel}</Text>
                </LinearGradient>
              </Pressable>

              {stepMeta.showLoginLink ? (
                <Pressable
                  onPress={() => router.push('/(auth)/login')}
                  disabled={isSubmitting}
                  style={styles.switchAuthWrap}
                  testID={testIds.registerGoLogin}
                >
                  <Text style={styles.switchAuthText}>
                    Already have an account?{' '}
                    <Text style={styles.switchAuthLink}>Log in</Text>
                  </Text>
                </Pressable>
              ) : step === 'email-otp' ? (
                <Text style={styles.footerHint}>
                  Did not get the email? Check spam or tap Resend code.
                </Text>
              ) : (
                <Text style={styles.footerHint}>
                  You can change diet and kitchen styles later in Settings.
                </Text>
              )}
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AUTH_ATMOSPHERE_BG,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: layout.screenPadding + 4,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.lg,
  },
  scrollContentCompact: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.md,
  },
  scrollContentShort: {
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  footer: {
    paddingHorizontal: layout.screenPadding + 4,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: colors.dark.bg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  heroCompact: {
    gap: spacing.sm,
    marginBottom: 0,
  },
  topRow: {
    alignItems: 'center',
  },
  brand: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: -spacing.sm,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark.text,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.dark.textMuted,
    textAlign: 'center',
    marginTop: -spacing.sm,
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  formPanel: {
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.lg,
    gap: spacing.md,
  },
  formPanelCompact: {
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: 16,
  },
  field: {
    gap: spacing.sm,
  },
  fieldErrorWrap: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(229,57,53,0.6)',
    padding: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: colors.dark.textMuted,
    textTransform: 'uppercase',
  },
  labelRequired: {
    color: colors.danger,
    textTransform: 'none',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: colors.dark.surface,
    paddingHorizontal: spacing.lg,
  },
  inputRowError: {
    borderColor: 'rgba(229,57,53,0.6)',
    backgroundColor: colors.dark.accentRed,
  },
  countryCode: {
    marginLeft: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.textMuted,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.dark.text,
  },
  inputCompact: {
    paddingVertical: 11,
    fontSize: 15,
  },
  otpInput: {
    letterSpacing: 4,
    fontWeight: '700',
  },
  fieldHint: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.dark.textMuted,
  },
  resendWrap: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  messageBox: {
    borderRadius: 12,
    backgroundColor: 'rgba(229,57,53,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229,57,53,0.25)',
    padding: spacing.md,
  },
  messageBoxInfo: {
    backgroundColor: 'rgba(0,168,107,0.12)',
    borderColor: 'rgba(0,168,107,0.25)',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#F87171',
  },
  messageTextInfo: {
    color: colors.green,
  },
  actions: {
    gap: spacing.md,
  },
  actionsCompact: {
    gap: spacing.sm,
  },
  submitWrap: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonCompact: {
    paddingVertical: 14,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  switchAuthWrap: {
    alignItems: 'center',
  },
  switchAuthText: {
    fontSize: 14,
    color: colors.dark.textMuted,
  },
  switchAuthLink: {
    fontWeight: '700',
    color: colors.primary,
  },
  footerHint: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    color: colors.dark.textMuted,
  },
  preferenceFieldError: {
    borderColor: 'rgba(229,57,53,0.45)',
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: layout.screenPadding + 4,
    marginTop: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: colors.dark.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  selectionHeaderCompact: {
    marginTop: spacing.xs,
    paddingVertical: spacing.sm,
  },
  selectionHeaderLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark.text,
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
