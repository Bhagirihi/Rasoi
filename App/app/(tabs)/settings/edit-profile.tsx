import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Mail, Phone, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import AppSavingOverlay from '@/components/AppSavingOverlay';
import { SettingsSubHeader } from '@/components/settings/SettingsBlocks';
import { PrimaryButton } from '@/components/ui/Primitives';
import { colors, layout, radius, scrollIndicator, shadows, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { getIndianPhoneError, isValidPhoneLength, normalizeIndianPhone } from '@/utils/storage';

type FieldError = 'name' | 'phone' | 'general' | null;

export default function EditProfileScreen() {
  const router = useRouter();
  const tabBarHeight = useTabBarHeight();
  const { colors: themeColors, screenBackground } = useTheme();
  const { userName, userPhone, userEmail, isGuest, updateProfile } =
    useAppContext();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isGuest) {
      setName('');
      setPhone('');
      return;
    }
    setName(userName);
    setPhone(userPhone);
  }, [isGuest, userName, userPhone]);

  const handleSave = async () => {
    if (isGuest) {
      router.push('/(auth)/register');
      return;
    }

    setFieldError(null);
    setErrorMessage('');

    const trimmedName = name.trim();
    const normalizedPhone = normalizeIndianPhone(phone);

    if (trimmedName.length < 2) {
      setFieldError('name');
      setErrorMessage('Please enter at least 2 characters for your name.');
      return;
    }

    if (!isValidPhoneLength(normalizedPhone)) {
      setFieldError('phone');
      setErrorMessage(
        getIndianPhoneError(normalizedPhone) ??
          'Enter a valid 10-digit Indian mobile number (starts with 6–9).',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await updateProfile(trimmedName, normalizedPhone);
      router.back();
    } catch {
      setFieldError('general');
      setErrorMessage('Could not save your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBackground }]} edges={['top']}>
      <AppSavingOverlay
        visible={isSubmitting}
        message="Saving your profile…"
        subtitle="Updating your account"
      />
      <SettingsSubHeader
        title={isGuest ? 'Sign up' : 'Edit profile'}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollViewWithFloatingIndicator
          {...scrollIndicator}
          contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + spacing.xxxl }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: themeColors.charcoal }]}>
            {isGuest ? 'Join Rasoi' : 'Your account'}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.muted }]}>
            {isGuest
              ? 'Create your account on the register screen to verify your email.'
              : 'Update your name or mobile anytime. Email is verified at sign-in.'}
          </Text>

          <View
            style={[
              styles.formCard,
              { backgroundColor: themeColors.white, borderColor: themeColors.border },
            ]}
          >
            {!isGuest && userEmail.length > 0 && (
              <View style={styles.field}>
                <Text style={[styles.label, { color: themeColors.charcoal }]}>Email</Text>
                <View
                  style={[
                    styles.inputRow,
                    styles.inputRowDisabled,
                    { borderColor: themeColors.border, backgroundColor: themeColors.cream },
                  ]}
                >
                  <Mail size={20} color={themeColors.muted} />
                  <Text style={[styles.readOnlyValue, { color: themeColors.muted }]}>{userEmail}</Text>
                </View>
                <Text style={[styles.hint, { color: themeColors.muted }]}>Verified via email OTP</Text>
              </View>
            )}
            <View style={styles.field}>
              <Text style={[styles.label, { color: themeColors.charcoal }]}>Full name</Text>
              <View
                style={[
                  styles.inputRow,
                  { borderColor: themeColors.border, backgroundColor: themeColors.cream },
                  fieldError === 'name' && styles.inputError,
                ]}
              >
                <User size={20} color={themeColors.muted} />
                <TextInput
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    if (fieldError === 'name') setFieldError(null);
                  }}
                  placeholder="e.g. Priya Sharma"
                  placeholderTextColor={themeColors.placeholder}
                  autoCapitalize="words"
                  style={[styles.input, { color: themeColors.charcoal }]}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: themeColors.charcoal }]}>Mobile number</Text>
              <View
                style={[
                  styles.inputRow,
                  { borderColor: themeColors.border, backgroundColor: themeColors.cream },
                  fieldError === 'phone' && styles.inputError,
                ]}
              >
                <Phone size={20} color={themeColors.muted} />
                <Text style={[styles.countryCode, { color: themeColors.muted }]}>+91</Text>
                <TextInput
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(normalizeIndianPhone(value));
                    if (fieldError === 'phone') setFieldError(null);
                  }}
                  placeholder="9876543210"
                  placeholderTextColor={themeColors.placeholder}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={[styles.input, { color: themeColors.charcoal }]}
                />
              </View>
              <Text style={[styles.hint, { color: themeColors.muted }]}>10-digit Indian mobile</Text>
            </View>
          </View>

          {errorMessage.length > 0 && (
            <View style={styles.errorBox}>
              <Text style={styles.error}>{errorMessage}</Text>
            </View>
          )}

          <PrimaryButton
            label={isGuest ? 'Sign up to Rasoi' : 'Save changes'}
            onPress={handleSave}
            disabled={isSubmitting}
            style={styles.cta}
          />

        </ScrollViewWithFloatingIndicator>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.charcoal,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  formCard: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.lg,
  },
  inputRowDisabled: {
    backgroundColor: colors.white,
  },
  readOnlyValue: {
    flex: 1,
    marginLeft: spacing.md,
    paddingVertical: spacing.lg,
    fontSize: 16,
    color: colors.muted,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(229,57,53,0.04)',
  },
  countryCode: {
    marginLeft: spacing.md,
    fontSize: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  input: {
    flex: 1,
    marginLeft: spacing.md,
    paddingVertical: spacing.lg,
    fontSize: 16,
    color: colors.charcoal,
  },
  hint: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.muted,
  },
  errorBox: {
    marginTop: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(229,57,53,0.08)',
    padding: spacing.md,
  },
  error: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.danger,
  },
  cta: {
    marginTop: spacing.xxl,
  },
  secondaryBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: spacing.lg - 2,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.charcoal,
  },
});


