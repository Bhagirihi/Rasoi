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
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldLabel } from '@/components/auth/FieldLabel';
import TermsAcceptanceModal from '@/components/auth/TermsAcceptanceModal';
import { authStyles as styles } from '@/components/auth/authStyles';
import CuisinePreferenceList from '@/components/CuisinePreferenceList';
import DietPreferenceList from '@/components/DietPreferenceList';
import { gradients, scrollIndicator, type CuisineId, type DietChoice } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import { useAppContext } from '@/context/AppContext';
import { useReferenceData } from '@/context/ReferenceContext';
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
import { cuisinesToRegion } from '@/utils/kitchenStyles';
import { scrollFieldIntoView } from '@/utils/scrollFieldIntoView';
import {
  clearVerifiedPhoneSignup,
  getVerifiedPhoneDigits,
  isPhoneVerificationSkipped,
  resendFirebasePhoneOtp,
  sendFirebasePhoneOtp,
  verifyFirebasePhoneOtp,
} from '@/services/firebasePhoneAuth';

type RegisterStep = 'details' | 'phone-otp' | 'email-otp';
type FieldError = 'name' | 'phone' | 'email' | 'diet' | 'cuisine' | 'phone-otp' | 'otp' | 'general' | null;
type BusyAction = 'send' | 'verify-phone' | 'resend-phone' | 'verify' | 'resend' | null;

export default function RegisterScreen() {
  const router = useRouter();
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
  const [selectedDiet, setSelectedDiet] = useState<DietChoice | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineId[]>([]);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const isSubmitting = busyAction !== null;
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailDeliveryBlocked, setEmailDeliveryBlocked] = useState(false);

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
    const activeIds = new Set(kitchenStyles.map((style) => style.id));
    setSelectedCuisines((current) => current.filter((id) => activeIds.has(id)));
  }, [kitchenStyles]);

  useEffect(() => {
    if (step === 'phone-otp' || step === 'email-otp') warmApiConnection();
  }, [step]);

  useEffect(() => {
    return () => {
      clearVerifiedPhoneSignup();
    };
  }, []);

  const [keyboardInset, setKeyboardInset] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const nameFieldRef = useRef<View>(null);
  const phoneFieldRef = useRef<View>(null);
  const emailFieldRef = useRef<View>(null);
  const phoneOtpFieldRef = useRef<View>(null);
  const otpFieldRef = useRef<View>(null);
  const focusedFieldRef = useRef<View | null>(null);
  const keyboardLayoutRef = useRef({ height: 0, screenY: 0 });

  const focusField = (fieldRef: RefObject<View | null>) => {
    focusedFieldRef.current = fieldRef.current;
    const { height, screenY } = keyboardLayoutRef.current;
    scrollFieldIntoView(scrollRef, fieldRef, scrollYRef, height, screenY);
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (event) => {
      const { height, screenY } = event.endCoordinates;
      keyboardLayoutRef.current = { height, screenY };
      setKeyboardInset(height);
      if (focusedFieldRef.current) {
        scrollFieldIntoView(
          scrollRef,
          { current: focusedFieldRef.current },
          scrollYRef,
          height,
          screenY,
        );
      }
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

  const validateDetails = (): { name: string; phone: string; email: string } | null => {
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

    if (!selectedDiet) {
      setFieldError('diet');
      setErrorMessage('Pick your diet (e.g. Veg) to continue.');
      return null;
    }

    if (selectedCuisines.length === 0) {
      setFieldError('cuisine');
      setErrorMessage('Pick at least one kitchen style (e.g. Gujarati Home).');
      return null;
    }

    return {
      name: trimmedName,
      phone: normalizedPhone,
      email: normalizedEmail,
    };
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

  const handleSendOtp = async () => {
    setFieldError(null);
    setErrorMessage('');

    const details = validateDetails();
    if (!details) return;

    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }

    await persistSignupPreferences();
    await sendOtpForDetails(details);
  };

  const sendOtpForDetails = async (details: { name: string; phone: string; email: string }) => {
    setBusyAction('send');
    setEmailDeliveryBlocked(false);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      authLog('register:sendPhoneOtp', { phoneLength: details.phone.length });

      if (isPhoneVerificationSkipped()) {
        await sendFirebasePhoneOtp(details.phone);
        setPhoneVerified(true);
        authLog('register:sendEmailOtp_after_phone_skip', { email: maskEmail(details.email) });
        await sendEmailOtp(details.name, details.phone, details.email);
        setStep('email-otp');
        setOtp('');
        return;
      }

      await sendFirebasePhoneOtp(details.phone);
      setStep('phone-otp');
      setPhoneOtp('');
      setPhoneVerified(false);
    } catch (error) {
      authError('register:sendPhoneOtp_failed', error, { email: maskEmail(details.email) });
      setFieldError('general');
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not send SMS verification code. Try again.',
      );
    } finally {
      setBusyAction(null);
    }
  };

  const sendEmailOtpAfterPhone = async (details: { name: string; phone: string; email: string }) => {
    setBusyAction('send');
    setEmailDeliveryBlocked(false);
    try {
      authLog('register:sendEmailOtp', { email: maskEmail(details.email) });
      await sendEmailOtp(details.name, details.phone, details.email);
      setStep('email-otp');
      setOtp('');
    } catch (error) {
      authError('register:sendEmailOtp_failed', error, { email: maskEmail(details.email) });
      setFieldError('general');
      if (isEmailDeliveryUnavailableError(error)) {
        setEmailDeliveryBlocked(true);
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

  const handleVerifyPhoneOtp = async () => {
    setFieldError(null);
    setErrorMessage('');

    const details = validateDetails();
    if (!details) {
      setStep('details');
      return;
    }

    const code = phoneOtp.replace(/\D/g, '').trim();
    if (code.length < 4) {
      setFieldError('phone-otp');
      setErrorMessage('Enter the SMS verification code.');
      return;
    }

    setBusyAction('verify-phone');
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const verifiedPhone = await verifyFirebasePhoneOtp(code);
      if (verifiedPhone !== details.phone) {
        throw new Error('Verified mobile number does not match. Edit details and try again.');
      }
      setPhoneVerified(true);
      authLog('register:verifyPhoneOtp_success', { phoneLength: verifiedPhone.length });
      await sendEmailOtpAfterPhone(details);
    } catch (error) {
      authError('register:verifyPhoneOtp_failed', error);
      setFieldError('phone-otp');
      setErrorMessage(
        error instanceof Error ? error.message : 'Invalid or expired SMS code. Please try again.',
      );
      setBusyAction(null);
    }
  };

  const handleResendPhoneOtp = async () => {
    setFieldError(null);
    setErrorMessage('');
    setBusyAction('resend-phone');
    try {
      const details = validateDetails();
      if (!details) {
        setStep('details');
        return;
      }
      await resendFirebasePhoneOtp(details.phone);
      setErrorMessage('A new SMS code was sent to your mobile.');
    } catch (error) {
      setFieldError('general');
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not resend SMS code. Try again.',
      );
    } finally {
      setBusyAction(null);
    }
  };

  const handleVerifyOtp = async () => {
    setFieldError(null);
    setErrorMessage('');

    const details = validateDetails();
    if (!details) {
      setStep('details');
      return;
    }

    if (!phoneVerified && !isPhoneVerificationSkipped()) {
      setFieldError('general');
      setErrorMessage('Verify your mobile number before creating your account.');
      setStep('phone-otp');
      return;
    }

    const verifiedPhone = getVerifiedPhoneDigits() ?? details.phone;

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
      const nav = await verifyEmailOtpAndLogin(
        details.email,
        code,
        details.name,
        verifiedPhone,
        { acceptedTerms: true, phoneVerified: true },
      );
      authLog('register:verifyOtp_success', { onboardingDone: nav.hasCompletedOnboarding });
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
      const details = validateDetails();
      if (!details) {
        setStep('details');
        return;
      }
      await sendEmailOtp(details.name, details.phone, details.email);
      setEmailDeliveryBlocked(false);
      setErrorMessage('A new code was sent to your email.');
    } catch (error) {
      setFieldError('general');
      if (isEmailDeliveryUnavailableError(error)) {
        setEmailDeliveryBlocked(true);
      }
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not resend code. Try again.',
      );
    } finally {
      setBusyAction(null);
    }
  };

  const backToDetails = () => {
    setStep('details');
    setPhoneOtp('');
    setOtp('');
    setPhoneVerified(false);
    clearVerifiedPhoneSignup();
    setFieldError(null);
    setErrorMessage('');
  };

  const backToPhoneOtp = () => {
    setStep('phone-otp');
    setOtp('');
    setFieldError(null);
    setErrorMessage('');
  };

  const overlaySteps = useMemo(() => {
    switch (busyAction) {
      case 'verify':
        return [{ message: 'Creating your account', subtitle: 'Verifying your code and setting things up' }];
      case 'verify-phone':
        return [{ message: 'Verifying your mobile', subtitle: 'Checking the SMS code from Firebase' }];
      case 'resend-phone':
        return [{ message: 'Sending SMS code', subtitle: 'Check your phone — it usually arrives in a few seconds' }];
      case 'resend':
        return [{ message: 'Sending a new code', subtitle: 'Check your inbox — it usually arrives in a few seconds' }];
      case 'send':
        return [
          {
            message: isPhoneVerificationSkipped() ? 'Sending your code' : 'Sending SMS code',
            subtitle: isPhoneVerificationSkipped()
              ? 'Check your inbox — it usually arrives in a few seconds'
              : 'Check your phone for the verification SMS',
          },
        ];
      default:
        return undefined;
    }
  }, [busyAction]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} testID={testIds.screenRegister}>
      <AppSavingOverlay visible={isSubmitting} steps={overlaySteps} />
      <TermsAcceptanceModal
        visible={showTermsModal}
        checked={termsAccepted}
        onToggleChecked={() => setTermsAccepted((value) => !value)}
        onCancel={() => setShowTermsModal(false)}
        onContinue={() => {
          if (!termsAccepted) return;
          setShowTermsModal(false);
          const details = validateDetails();
          if (details) {
            void persistSignupPreferences().then(() => sendOtpForDetails(details));
          }
        }}
      />
      <ScrollViewWithFloatingIndicator
          {...scrollIndicator}
          scrollRef={scrollRef}
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardInset > 0 ? keyboardInset + 32 : 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScroll={(event) => {
            scrollYRef.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          <View style={styles.topRow}>
            <Text style={styles.brand}>RASOI</Text>
          </View>

          {(step === 'phone-otp' || step === 'email-otp') && (
            <Pressable
              onPress={
                step === 'email-otp'
                  ? isPhoneVerificationSkipped()
                    ? backToDetails
                    : backToPhoneOtp
                  : backToDetails
              }
              style={styles.backRow}
            >
              <ArrowLeft size={18} color="#c45c2a" />
              <Text style={styles.backText}>
                {step === 'email-otp' ? 'Back to mobile verification' : 'Edit details'}
              </Text>
            </Pressable>
          )}

          <Text style={styles.title}>
            {step === 'details'
              ? 'Create your account'
              : step === 'phone-otp'
                ? 'Verify your mobile'
                : 'Verify your email'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'details'
              ? 'Pick your diet and kitchen styles, then verify your mobile and email.'
              : step === 'phone-otp'
                ? `Enter the SMS code sent to +91 ${normalizeIndianPhone(phone)}`
                : `Enter the code sent to ${normalizeEmail(email)}`}
          </Text>

          {step === 'details' ? (
            <View style={styles.form}>
              <View ref={nameFieldRef} collapsable={false} style={styles.field}>
                <FieldLabel required>Your Name</FieldLabel>
                <View style={[styles.inputRow, fieldError === 'name' && styles.inputRowError]}>
                  <User size={20} color="#6b6560" />
                  <TextInput
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      if (fieldError === 'name') setFieldError(null);
                    }}
                    onFocus={() => focusField(nameFieldRef)}
                    placeholder="e.g. Priya Sharma"
                    placeholderTextColor="#a39e96"
                    autoCapitalize="words"
                    returnKeyType="next"
                    style={styles.input}
                    testID={testIds.registerNameInput}
                  />
                </View>
              </View>

              <View ref={phoneFieldRef} collapsable={false} style={styles.field}>
                <FieldLabel required>Mobile Number</FieldLabel>
                <View style={[styles.inputRow, fieldError === 'phone' && styles.inputRowError]}>
                  <Phone size={20} color="#6b6560" />
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    value={phone}
                    onChangeText={(value) => {
                      setPhone(normalizeIndianPhone(value));
                      if (fieldError === 'phone') setFieldError(null);
                    }}
                    onFocus={() => focusField(phoneFieldRef)}
                    placeholder="9876543210"
                    placeholderTextColor="#a39e96"
                    keyboardType="phone-pad"
                    maxLength={10}
                    returnKeyType="next"
                    style={styles.input}
                    testID={testIds.registerPhoneInput}
                  />
                </View>
                <Text style={styles.hint}>
                  10 digits, starting with 6–9 · verified by SMS before signup
                </Text>
              </View>

              <View ref={emailFieldRef} collapsable={false} style={styles.field}>
                <FieldLabel required>Email</FieldLabel>
                <View style={[styles.inputRow, fieldError === 'email' && styles.inputRowError]}>
                  <Mail size={20} color="#6b6560" />
                  <TextInput
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (fieldError === 'email') setFieldError(null);
                    }}
                    onFocus={() => focusField(emailFieldRef)}
                    placeholder="you@example.com"
                    placeholderTextColor="#a39e96"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSendOtp}
                    style={styles.input}
                    testID={testIds.registerEmailInput}
                  />
                </View>
                <Text style={styles.hint}>We send a one-time verification code to this email</Text>
              </View>

              <View style={[styles.field, fieldError === 'diet' && styles.preferenceFieldError]}>
                <FieldLabel required>Diet</FieldLabel>
                <DietPreferenceList
                  selected={selectedDiet}
                  onSelect={(value) => {
                    setSelectedDiet(value);
                    if (fieldError === 'diet') setFieldError(null);
                  }}
                  variant="light"
                />
              </View>

              <View style={[styles.field, fieldError === 'cuisine' && styles.preferenceFieldError]}>
                <FieldLabel required>Kitchen styles</FieldLabel>
                <Text style={styles.hint}>
                  {selectedCuisines.length === 0
                    ? 'Pick at least one — e.g. Gujarati Home'
                    : `${selectedCuisines.length} style${selectedCuisines.length > 1 ? 's' : ''} selected`}
                </Text>
                <CuisinePreferenceList
                  selected={selectedCuisines}
                  onToggle={toggleCuisine}
                  variant="light"
                />
              </View>
            </View>
          ) : step === 'phone-otp' ? (
            <View style={styles.form}>
              <View ref={phoneOtpFieldRef} collapsable={false} style={styles.field}>
                <FieldLabel required>SMS verification code</FieldLabel>
                <View style={[styles.inputRow, fieldError === 'phone-otp' && styles.inputRowError]}>
                  <Phone size={20} color="#6b6560" />
                  <TextInput
                    value={phoneOtp}
                    onChangeText={(value) => {
                      setPhoneOtp(value.replace(/\D/g, '').slice(0, 6));
                      if (fieldError === 'phone-otp') setFieldError(null);
                    }}
                    onFocus={() => focusField(phoneOtpFieldRef)}
                    placeholder="123456"
                    placeholderTextColor="#a39e96"
                    keyboardType="number-pad"
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={handleVerifyPhoneOtp}
                    style={[styles.input, styles.otpInput]}
                    autoFocus
                    testID={testIds.registerPhoneOtpInput}
                  />
                </View>
              </View>

              <Pressable
                onPress={handleResendPhoneOtp}
                disabled={isSubmitting}
                style={styles.resendWrap}
                testID={testIds.registerResendPhoneOtp}
              >
                <Text style={styles.resendText}>Resend SMS code</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.form}>
              <View ref={otpFieldRef} collapsable={false} style={styles.field}>
                <FieldLabel required>Verification code</FieldLabel>
                <View style={[styles.inputRow, fieldError === 'otp' && styles.inputRowError]}>
                  <Mail size={20} color="#6b6560" />
                  <TextInput
                    value={otp}
                    onChangeText={(value) => {
                      setOtp(value.replace(/\D/g, '').slice(0, 8));
                      if (fieldError === 'otp') setFieldError(null);
                    }}
                    onFocus={() => focusField(otpFieldRef)}
                    placeholder="123456"
                    placeholderTextColor="#a39e96"
                    keyboardType="number-pad"
                    maxLength={8}
                    returnKeyType="done"
                    onSubmitEditing={handleVerifyOtp}
                    style={[styles.input, styles.otpInput]}
                    autoFocus
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
                styles.errorBox,
                fieldError === null && styles.infoBox,
              ]}
            >
              <Text
                style={[
                  styles.error,
                  fieldError === null && styles.infoText,
                ]}
              >
                {errorMessage}
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={
                step === 'details'
                  ? handleSendOtp
                  : step === 'phone-otp'
                    ? handleVerifyPhoneOtp
                    : handleVerifyOtp
              }
              disabled={isSubmitting}
              testID={
                step === 'details'
                  ? testIds.registerSendOtp
                  : step === 'phone-otp'
                    ? testIds.registerVerifyPhoneOtp
                    : testIds.registerVerifyOtp
              }
              style={[styles.submitWrap, isSubmitting && styles.buttonDisabled]}
            >
              <LinearGradient
                colors={[...gradients.cta]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>
                  {step === 'details'
                    ? 'Verify mobile number'
                    : step === 'phone-otp'
                      ? 'Continue to email verification'
                      : 'Create account'}
                </Text>
              </LinearGradient>
            </Pressable>

            {step === 'details' ? (
              <>
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

                <Text style={styles.disclaimer}>
                  Mobile is verified by SMS. Email is verified with a one-time code.
                </Text>
              </>
            ) : step === 'phone-otp' ? (
              <Text style={styles.disclaimer}>
                Did not get the SMS? Wait a minute or tap Resend SMS code.
              </Text>
            ) : (
              <Text style={styles.disclaimer}>
                Did not get the email? Check spam or tap Resend code.
              </Text>
            )}
          </View>
        </ScrollViewWithFloatingIndicator>
    </SafeAreaView>
  );
}
