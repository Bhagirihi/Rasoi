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

import GuestContinueModal from '@/components/auth/GuestContinueModal';
import { FieldLabel } from '@/components/auth/FieldLabel';
import TermsAcceptanceModal from '@/components/auth/TermsAcceptanceModal';
import { authStyles as styles } from '@/components/auth/authStyles';
import { gradients, scrollIndicator } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import { useAppContext, type AuthNavigationResult } from '@/context/AppContext';
import { authError, authLog, maskEmail } from '@/utils/authLogger';
import { isEmailDeliveryUnavailableError } from '@/utils/emailDeliveryErrors';
import { warmApiConnection } from '@/utils/api';
import {
  getIndianPhoneError,
  getEmailValidationError,
  isValidEmail,
  isValidPhoneLength,
  normalizeEmail,
  normalizeIndianPhone,
} from '@/utils/storage';
import { promptNotificationPermissionOnAuth } from '@/utils/notifications';
import { scrollFieldIntoView } from '@/utils/scrollFieldIntoView';

type RegisterStep = 'details' | 'otp';
type FieldError = 'name' | 'phone' | 'email' | 'otp' | 'general' | null;
type BusyAction = 'send' | 'verify' | 'resend' | 'guest' | null;

export default function RegisterScreen() {
  const router = useRouter();
  const {
    sendEmailOtp,
    verifyEmailOtpAndLogin,
    loginAsGuest,
    userName,
    userPhone,
    userEmail,
    isGuest,
    continueWithPendingEmailVerification,
  } = useAppContext();

  const [step, setStep] = useState<RegisterStep>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const isSubmitting = busyAction !== null;
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestError, setGuestError] = useState('');
  const [emailDeliveryBlocked, setEmailDeliveryBlocked] = useState(false);

  useEffect(() => {
    if (!isGuest && userName && userName !== 'Guest') {
      setName(userName);
      setPhone(userPhone);
      if (userEmail) setEmail(userEmail);
    }
  }, [isGuest, userName, userPhone, userEmail]);

  useEffect(() => {
    if (step === 'otp') warmApiConnection();
  }, [step]);

  const [keyboardInset, setKeyboardInset] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);
  const nameFieldRef = useRef<View>(null);
  const phoneFieldRef = useRef<View>(null);
  const emailFieldRef = useRef<View>(null);
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

  const navigateAfterAuth = ({ showTrialWelcome, hasCompletedOnboarding }: AuthNavigationResult) => {
    if (!hasCompletedOnboarding) {
      router.replace('/(auth)/onboarding');
      return;
    }
    if (showTrialWelcome) {
      router.replace('/(auth)/trial-welcome');
      return;
    }
    router.replace('/(tabs)');
  };

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

    return {
      name: trimmedName,
      phone: normalizedPhone,
      email: normalizedEmail,
    };
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

    await sendOtpForDetails(details);
  };

  const sendOtpForDetails = async (details: { name: string; phone: string; email: string }) => {
    setBusyAction('send');
    setEmailDeliveryBlocked(false);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      authLog('register:sendOtp', { email: maskEmail(details.email) });
      await sendEmailOtp(details.name, details.phone, details.email);
      setStep('otp');
      setOtp('');
    } catch (error) {
      authError('register:sendOtp_failed', error, { email: maskEmail(details.email) });
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

  const handleContinueWithoutEmailVerification = async (details: {
    name: string;
    phone: string;
    email: string;
  }) => {
    setBusyAction('guest');
    try {
      const nav = await continueWithPendingEmailVerification({
        email: details.email,
        flow: 'signup',
        name: details.name,
        phone: details.phone,
        termsAccepted,
      });
      setEmailDeliveryBlocked(false);
      if (nav) {
        navigateAfterAuth(nav);
      }
    } catch (error) {
      setFieldError('general');
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not continue to the app. Please try again.',
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
        details.phone,
        { acceptedTerms: true },
      );
      authLog('register:verifyOtp_success');
      verified = true;
      await promptNotificationPermissionOnAuth();
      navigateAfterAuth(nav);
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

  const handleGuest = async () => {
    setGuestError('');
    setFieldError(null);
    setErrorMessage('');
    setBusyAction('guest');
    try {
      void Haptics.selectionAsync();
      Keyboard.dismiss();
      const trimmed = guestName.trim();
      const nav = await loginAsGuest(trimmed.length >= 2 ? { name: trimmed } : undefined);
      setShowGuestModal(false);
      navigateAfterAuth(nav);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not continue as guest. Please try again.';
      setGuestError(message);
      setFieldError('general');
      setErrorMessage(message);
    } finally {
      setBusyAction(null);
    }
  };

  const requestGuest = () => {
    setGuestName('');
    setGuestError('');
    setShowGuestModal(true);
  };

  const backToDetails = () => {
    setStep('details');
    setOtp('');
    setFieldError(null);
    setErrorMessage('');
  };

  const overlaySteps = useMemo(() => {
    switch (busyAction) {
      case 'guest':
        return [
          { message: 'Starting guest mode…', subtitle: 'Setting up your kitchen' },
          { message: 'Almost ready…', subtitle: 'Opening Rasoi' },
        ];
      case 'verify':
        return [{ message: 'Signing you in…', subtitle: 'Verifying code and setting up your account' }];
      case 'resend':
        return [{ message: 'Sending a new code…', subtitle: 'Check your email inbox' }];
      case 'send':
        return [
          {
            message: 'Sending verification code…',
            subtitle: 'Usually arrives in under a minute',
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
          if (details) void sendOtpForDetails(details);
        }}
      />
      <GuestContinueModal
        visible={showGuestModal}
        name={guestName}
        onChangeName={setGuestName}
        onClose={() => {
          setShowGuestModal(false);
          setGuestError('');
        }}
        onContinue={() => void handleGuest()}
        busy={busyAction === 'guest'}
        errorMessage={guestError}
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

          {step === 'otp' && (
            <Pressable onPress={backToDetails} style={styles.backRow}>
              <ArrowLeft size={18} color="#c45c2a" />
              <Text style={styles.backText}>Edit details</Text>
            </Pressable>
          )}

          <Text style={styles.title}>
            {step === 'details' ? 'Create your account' : 'Verify your email'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'details'
              ? 'Create your account first — you’ll pick diet & cuisines next.'
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
                <Text style={styles.hint}>10 digits, starting with 6–9 · for partner checkout</Text>
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
              onPress={step === 'details' ? handleSendOtp : handleVerifyOtp}
              disabled={isSubmitting}
              testID={step === 'details' ? testIds.registerSendOtp : testIds.registerVerifyOtp}
              style={[styles.submitWrap, isSubmitting && styles.buttonDisabled]}
            >
              <LinearGradient
                colors={[...gradients.cta]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>
                  {step === 'details' ? 'Send verification code' : 'Create account'}
                </Text>
              </LinearGradient>
            </Pressable>

            {emailDeliveryBlocked && step === 'details' ? (
              <Pressable
                onPress={() => {
                  const details = validateDetails();
                  if (details) void handleContinueWithoutEmailVerification(details);
                }}
                disabled={isSubmitting}
                style={styles.guestButton}
              >
                <Text style={styles.guestButtonText}>Continue to app — verify email later</Text>
              </Pressable>
            ) : null}

            {step === 'details' ? (
              <>
                <Pressable
                  onPress={requestGuest}
                  disabled={isSubmitting}
                  testID={testIds.loginGuest}
                  style={styles.guestButton}
                >
                  <Text style={styles.guestButtonText}>Explore as Guest</Text>
                </Pressable>

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
                  Mobile is required for partner checkout. Email is verified with a one-time code.
                </Text>
              </>
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
