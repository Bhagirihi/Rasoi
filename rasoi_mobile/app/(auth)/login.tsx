import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { useState } from 'react';
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
import { isValidEmail, normalizeEmail } from '@/utils/storage';

type LoginStep = 'email' | 'otp';
type FieldError = 'email' | 'otp' | 'general' | null;

export default function LoginScreen() {
  const router = useRouter();
  const {
    sendLoginEmailOtp,
    verifyLoginEmailOtp,
    dietChoice,
    regionalCuisine,
    favoriteCuisines,
  } = useAppContext();
  const { kitchenStyles } = useReferenceData();

  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigateAfterAuth = (showTrialWelcome: boolean) => {
    if (showTrialWelcome) {
      router.replace('/(auth)/trial-welcome');
      return;
    }
    router.replace('/(tabs)');
  };

  const validateEmail = (): string | null => {
    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
      setFieldError('email');
      setErrorMessage('Enter a valid email address.');
      return null;
    }
    return normalizedEmail;
  };

  const handleSendOtp = async () => {
    setFieldError(null);
    setErrorMessage('');

    const normalizedEmail = validateEmail();
    if (!normalizedEmail) return;

    setIsSubmitting(true);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      authLog('login:sendOtp', { email: maskEmail(normalizedEmail) });
      await sendLoginEmailOtp(normalizedEmail);
      setStep('otp');
      setOtp('');
    } catch (error) {
      authError('login:sendOtp_failed', error, { email: maskEmail(normalizedEmail) });
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

    const normalizedEmail = validateEmail();
    if (!normalizedEmail) {
      setStep('email');
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
      authLog('login:verifyOtp', { email: maskEmail(normalizedEmail), otpLength: code.length });
      const showTrialWelcome = await verifyLoginEmailOtp(normalizedEmail, code);
      authLog('login:verifyOtp_success');
      navigateAfterAuth(showTrialWelcome);
    } catch (error) {
      authError('login:verifyOtp_failed', error, { email: maskEmail(normalizedEmail) });
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
      const normalizedEmail = validateEmail();
      if (!normalizedEmail) {
        setStep('email');
        return;
      }
      await sendLoginEmailOtp(normalizedEmail);
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

  const backToEmail = () => {
    setStep('email');
    setOtp('');
    setFieldError(null);
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} testID={testIds.screenLogin}>
      <AppSavingOverlay
        visible={isSubmitting}
        message={step === 'otp' ? 'Signing you in…' : 'Sending verification code…'}
        subtitle={step === 'otp' ? 'Loading your saved preferences' : 'Check your email in a moment'}
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
            <Pressable onPress={backToEmail} style={styles.backRow}>
              <ArrowLeft size={18} color="#c45c2a" />
              <Text style={styles.backText}>Change email</Text>
            </Pressable>
          )}

          <Text style={styles.title}>
            {step === 'email' ? 'Welcome back' : 'Check your email'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'email'
              ? 'Enter the email you used to register — we’ll send a one-time sign-in code.'
              : `Enter the code sent to ${normalizeEmail(email)}`}
          </Text>

          <PreferencesSummaryCard
            dietChoice={dietChoice}
            regionalCuisine={regionalCuisine}
            favoriteCuisines={favoriteCuisines}
            kitchenStyles={kitchenStyles ?? []}
          />

          {step === 'email' ? (
            <View style={styles.form}>
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
            onPress={step === 'email' ? handleSendOtp : handleVerifyOtp}
            disabled={isSubmitting}
            testID={step === 'email' ? testIds.loginSendOtp : undefined}
            style={[styles.submitWrap, isSubmitting && styles.buttonDisabled]}
          >
            <LinearGradient
              colors={[...gradients.cta]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>
                {step === 'email' ? 'Send sign-in code' : 'Sign in'}
              </Text>
            </LinearGradient>
          </Pressable>

          {step === 'email' && (
            <Pressable
              onPress={() => router.push('/(auth)/register')}
              disabled={isSubmitting}
              style={styles.switchAuthWrap}
            >
              <Text style={styles.switchAuthText}>
                New to Rasoi?{' '}
                <Text style={styles.switchAuthLink}>Create account</Text>
              </Text>
            </Pressable>
          )}

          <Text style={styles.disclaimer}>
            {step === 'email'
              ? 'Use the same email you registered with. No password needed.'
              : 'Did not get the email? Check spam or tap Resend code.'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
