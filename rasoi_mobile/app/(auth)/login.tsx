import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DIET_CHOICE_LABELS, DietChoice, colors, gradients, scrollIndicator } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { getDietPreferenceOption } from '@/constants/dietOptions';
import { useReferenceData } from '@/context/ReferenceContext';
import { getKitchenStyleLabel, type KitchenStyle } from '@/utils/kitchenStyles';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { useAppContext } from '@/context/AppContext';
import { authError, authLog, maskEmail } from '@/utils/authLogger';
import { FreeBadge } from '@/components/ui/Primitives';
import {
  isValidEmail,
  isValidPhoneLength,
  normalizeEmail,
  normalizeIndianPhone,
} from '@/utils/storage';

type LoginStep = 'details' | 'otp';
type FieldError = 'name' | 'phone' | 'email' | 'otp' | 'general' | null;

function formatPreferencesSummary(
  dietChoice: DietChoice,
  regionalCuisine: string,
  favoriteCuisines: string[],
  kitchenStyles: KitchenStyle[],
): string {
  const cuisineLabels = favoriteCuisines
    .map((id) => getKitchenStyleLabel(id, kitchenStyles))
    .filter(Boolean);

  const cuisineText =
    cuisineLabels.length > 0 ? cuisineLabels.join(', ') : regionalCuisine;

  return `${DIET_CHOICE_LABELS[dietChoice]} · ${cuisineText}`;
}

export default function LoginScreen() {
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

  const [step, setStep] = useState<LoginStep>('details');
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
      authLog('login:sendOtp', { email: maskEmail(details.email) });
      await sendEmailOtp(details.name, details.phone, details.email);
      setStep('otp');
      setOtp('');
    } catch (error) {
      authError('login:sendOtp_failed', error, { email: maskEmail(details.email) });
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
      authLog('login:verifyOtp', { email: maskEmail(details.email), otpLength: code.length });
      const showTrialWelcome = await verifyEmailOtpAndLogin(details.email, code, details.name, details.phone);
      authLog('login:verifyOtp_success');
      navigateAfterAuth(showTrialWelcome);
    } catch (error) {
      authError('login:verifyOtp_failed', error, { email: maskEmail(details.email) });
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} testID={testIds.screenLogin}>
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
              <ArrowLeft size={18} color={colors.primary} />
              <Text style={styles.backText}>Edit details</Text>
            </Pressable>
          )}

          <Text style={styles.title}>
            {step === 'details' ? 'Almost there!' : 'Check your email'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'details'
              ? 'Add your details — we verify your email with a one-time code.'
              : `Enter the code sent to ${normalizeEmail(email)}`}
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Your preferences</Text>
            <View style={styles.summaryRow}>
              {(() => {
                const dietOption = getDietPreferenceOption(dietChoice);
                const DietIcon = dietOption.icon;
                const leadCuisine = favoriteCuisines[0]
                  ? kitchenStyles?.find((item) => item.id === favoriteCuisines[0])
                  : null;
                return (
                  <>
                    <View style={[styles.summaryDietIcon, { backgroundColor: dietOption.iconBg }]}>
                      <DietIcon size={20} color={dietOption.iconColor} />
                    </View>
                    {leadCuisine && (
                      <Image source={{ uri: leadCuisine.heroImage }} style={styles.summaryCuisineImage} />
                    )}
                    <Text style={styles.summaryValue}>
                      {formatPreferencesSummary(
                        dietChoice,
                        regionalCuisine,
                        favoriteCuisines,
                        kitchenStyles ?? [],
                      )}
                    </Text>
                  </>
                );
              })()}
            </View>
          </View>

          {step === 'details' ? (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Your Name</Text>
                <View style={[styles.inputRow, fieldError === 'name' && styles.inputRowError]}>
                  <User size={20} color={colors.muted} />
                  <TextInput
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      if (fieldError === 'name') setFieldError(null);
                    }}
                    placeholder="e.g. Priya Sharma"
                    placeholderTextColor={colors.placeholder}
                    autoCapitalize="words"
                    returnKeyType="next"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Mobile Number (optional)</Text>
                <View style={[styles.inputRow, fieldError === 'phone' && styles.inputRowError]}>
                  <Phone size={20} color={colors.muted} />
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    value={phone}
                    onChangeText={(value) => {
                      setPhone(normalizeIndianPhone(value));
                      if (fieldError === 'phone') setFieldError(null);
                    }}
                    placeholder="9876543210"
                    placeholderTextColor={colors.placeholder}
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
                  <Mail size={20} color={colors.muted} />
                  <TextInput
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (fieldError === 'email') setFieldError(null);
                    }}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSendOtp}
                    style={styles.input}
                  />
                </View>
                <Text style={styles.hint}>Supabase sends a one-time code to this email</Text>
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Verification code</Text>
                <View style={[styles.inputRow, fieldError === 'otp' && styles.inputRowError]}>
                  <Mail size={20} color={colors.muted} />
                  <TextInput
                    value={otp}
                    onChangeText={(value) => {
                      setOtp(value.replace(/\D/g, '').slice(0, 8));
                      if (fieldError === 'otp') setFieldError(null);
                    }}
                    placeholder="123456"
                    placeholderTextColor={colors.placeholder}
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
            testID={step === 'details' ? testIds.loginSendOtp : undefined}
            style={[styles.submitWrap, isSubmitting && styles.buttonDisabled]}
          >
            <LinearGradient
              colors={[...gradients.cta]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting
                  ? step === 'details'
                    ? 'Sending code...'
                    : 'Verifying...'
                  : step === 'details'
                    ? 'Send email code'
                    : 'Verify & continue'}
              </Text>
            </LinearGradient>
          </Pressable>

          {step === 'details' && (
            <Pressable
              onPress={handleGuest}
              disabled={isSubmitting}
              testID={testIds.loginGuest}
              style={styles.guestButton}
            >
              <Text style={styles.guestButtonText}>Explore as Guest</Text>
            </Pressable>
          )}

          <Text style={styles.disclaimer}>
            {step === 'details'
              ? 'Mobile is required for partner checkout. Email is verified with a Supabase OTP.'
              : 'Did not get the email? Check spam or tap Resend code.'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.primary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '700',
    color: colors.charcoal,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  summaryCard: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryDietIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCuisineImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  summaryValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.charcoal,
  },
  form: {
    marginTop: 24,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.charcoal,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  inputRowError: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(229,57,53,0.04)',
  },
  countryCode: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.charcoal,
  },
  otpInput: {
    letterSpacing: 4,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
  },
  resendWrap: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  errorBox: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(229,57,53,0.08)',
    padding: 12,
  },
  infoBox: {
    backgroundColor: 'rgba(0,168,107,0.08)',
  },
  error: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.danger,
  },
  infoText: {
    color: colors.green,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
  submitWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  guestButton: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: 14,
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.charcoal,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
  },
});
