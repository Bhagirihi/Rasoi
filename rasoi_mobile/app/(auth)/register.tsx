import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PreferencesSummaryCard from '@/components/auth/PreferencesSummaryCard';
import { authStyles as styles } from '@/components/auth/authStyles';
import { gradients, scrollIndicator } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useReferenceData } from '@/context/ReferenceContext';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import { useAppContext } from '@/context/AppContext';
import { authError, authLog, maskEmail } from '@/utils/authLogger';
import { FreeBadge } from '@/components/ui/Primitives';
import {
  isValidEmail,
  isValidPhoneLength,
  normalizeEmail,
  normalizeIndianPhone,
} from '@/utils/storage';

type RegisterStep = 'details' | 'otp';
type FieldError = 'name' | 'phone' | 'email' | 'otp' | 'general' | null;

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
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
  } = useAppContext();
  const { kitchenStyles } = useReferenceData();

  const [step, setStep] = useState<RegisterStep>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isGuest && userName && userName !== 'Guest') {
      setName(userName);
      setPhone(userPhone);
      if (userEmail) setEmail(userEmail);
    }
  }, [isGuest, userName, userPhone, userEmail]);

  const navigateAfterAuth = (showTrialWelcome: boolean) => {
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
      setErrorMessage('Enter your 10-digit mobile number for Blinkit, Zepto & delivery partners.');
      return null;
    }

    if (!isValidEmail(normalizedEmail)) {
      setFieldError('email');
      setErrorMessage('Enter a valid email address.');
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

    setIsSubmitting(true);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      authLog('register:sendOtp', { email: maskEmail(details.email) });
      await sendEmailOtp(details.name, details.phone, details.email);
      setStep('otp');
      setOtp('');
    } catch (error) {
      authError('register:sendOtp_failed', error, { email: maskEmail(details.email) });
      setFieldError('general');
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not send verification code. Try again.',
      );
    } finally {
      setIsSubmitting(false);
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

    setIsSubmitting(true);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      authLog('register:verifyOtp', { email: maskEmail(details.email), otpLength: code.length });
      const showTrialWelcome = await verifyEmailOtpAndLogin(
        details.email,
        code,
        details.name,
        details.phone,
      );
      authLog('register:verifyOtp_success');
      navigateAfterAuth(showTrialWelcome);
    } catch (error) {
      authError('register:verifyOtp_failed', error, { email: maskEmail(details.email) });
      setFieldError('otp');
      setErrorMessage(
        error instanceof Error ? error.message : 'Invalid or expired code. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setFieldError(null);
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const details = validateDetails();
      if (!details) {
        setStep('details');
        return;
      }
      await sendEmailOtp(details.name, details.phone, details.email);
      setErrorMessage('A new code was sent to your email.');
    } catch (error) {
      setFieldError('general');
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not resend code. Try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setFieldError(null);
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      void Haptics.selectionAsync();
      await loginAsGuest();
      navigateAfterAuth(false);
    } catch (error) {
      setFieldError('general');
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not continue as guest. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const backToDetails = () => {
    setStep('details');
    setOtp('');
    setFieldError(null);
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} testID={testIds.screenRegister}>
      <AppSavingOverlay
        visible={isSubmitting}
        message={
          step === 'otp'
            ? 'Creating your Rasoi account…'
            : 'Sending verification code…'
        }
        subtitle={step === 'otp' ? 'Syncing preferences and trial' : 'Check your email in a moment'}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollViewWithFloatingIndicator
          {...scrollIndicator}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topRow}>
            <Text style={styles.brand}>RASOI</Text>
            <FreeBadge />
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
              ? 'Add your details — we’ll send a one-time code to verify your email.'
              : `Enter the code sent to ${normalizeEmail(email)}`}
          </Text>

          <PreferencesSummaryCard
            dietChoice={dietChoice}
            regionalCuisine={regionalCuisine}
            favoriteCuisines={favoriteCuisines}
            kitchenStyles={kitchenStyles ?? []}
          />

          {step === 'details' ? (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Your Name</Text>
                <View style={[styles.inputRow, fieldError === 'name' && styles.inputRowError]}>
                  <User size={20} color="#6b6560" />
                  <TextInput
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      if (fieldError === 'name') setFieldError(null);
                    }}
                    placeholder="e.g. Priya Sharma"
                    placeholderTextColor="#a39e96"
                    autoCapitalize="words"
                    returnKeyType="next"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={[styles.inputRow, fieldError === 'phone' && styles.inputRowError]}>
                  <Phone size={20} color="#6b6560" />
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    value={phone}
                    onChangeText={(value) => {
                      setPhone(normalizeIndianPhone(value));
                      if (fieldError === 'phone') setFieldError(null);
                    }}
                    placeholder="9876543210"
                    placeholderTextColor="#a39e96"
                    keyboardType="phone-pad"
                    maxLength={10}
                    returnKeyType="next"
                    style={styles.input}
                  />
                </View>
                <Text style={styles.hint}>Required for Blinkit, Zepto, Instamart, Zomato & Swiggy checkout</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputRow, fieldError === 'email' && styles.inputRowError]}>
                  <Mail size={20} color="#6b6560" />
                  <TextInput
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (fieldError === 'email') setFieldError(null);
                    }}
                    placeholder="you@example.com"
                    placeholderTextColor="#a39e96"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSendOtp}
                    style={styles.input}
                  />
                </View>
                <Text style={styles.hint}>We send a one-time verification code to this email</Text>
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Verification code</Text>
                <View style={[styles.inputRow, fieldError === 'otp' && styles.inputRowError]}>
                  <Mail size={20} color="#6b6560" />
                  <TextInput
                    value={otp}
                    onChangeText={(value) => {
                      setOtp(value.replace(/\D/g, '').slice(0, 8));
                      if (fieldError === 'otp') setFieldError(null);
                    }}
                    placeholder="123456"
                    placeholderTextColor="#a39e96"
                    keyboardType="number-pad"
                    maxLength={8}
                    returnKeyType="done"
                    onSubmitEditing={handleVerifyOtp}
                    style={[styles.input, styles.otpInput]}
                    autoFocus
                  />
                </View>
              </View>

              <Pressable onPress={handleResendOtp} disabled={isSubmitting} style={styles.resendWrap}>
                <Text style={styles.resendText}>Resend code</Text>
              </Pressable>
            </View>
          )}

          {errorMessage.length > 0 && (
            <View style={[styles.errorBox, fieldError !== 'general' && fieldError !== 'otp' && styles.infoBox]}>
              <Text style={[styles.error, fieldError !== 'general' && fieldError !== 'otp' && styles.infoText]}>
                {errorMessage}
              </Text>
            </View>
          )}
        </ScrollViewWithFloatingIndicator>

        <View style={styles.footer}>
          <Pressable
            onPress={step === 'details' ? handleSendOtp : handleVerifyOtp}
            disabled={isSubmitting}
            testID={step === 'details' ? testIds.registerSendOtp : undefined}
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

          {step === 'details' && (
            <>
              <Pressable
                onPress={handleGuest}
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
              >
                <Text style={styles.switchAuthText}>
                  Already have an account?{' '}
                  <Text style={styles.switchAuthLink}>Log in</Text>
                </Text>
              </Pressable>
            </>
          )}

          <Text style={styles.disclaimer}>
            {step === 'details'
              ? 'Mobile is required for partner checkout. Email is verified with a one-time code.'
              : 'Did not get the email? Check spam or tap Resend code.'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
