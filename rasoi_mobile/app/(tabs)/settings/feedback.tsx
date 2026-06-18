import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Mail, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Linking,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppSavingOverlay from '@/components/AppSavingOverlay';
import { ScrollViewWithFloatingIndicator } from '@/components/ScrollableScreen';
import { SettingsSubHeader } from '@/components/settings/SettingsBlocks';
import { PrimaryButton } from '@/components/ui/Primitives';
import { CONTACT_EMAIL, CONTACT_MAILTO } from '@/constants/links';
import { FEEDBACK_CATEGORIES, type FeedbackCategory } from '@/constants/feedback';
import { colors, layout, radius, scrollIndicator, shadows, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { submitFeedback } from '@/services/feedback';

type FieldError = 'category' | 'message' | 'email' | 'general' | null;

export default function FeedbackScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { colors: themeColors } = useTheme();
  const { userName, userEmail } = useAppContext();

  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<FieldError>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userName) setName(userName);
    if (userEmail) setEmail(userEmail);
  }, [userName, userEmail]);

  const handleSubmit = async () => {
    setFieldError(null);
    setErrorMessage('');
    setSuccessMessage('');

    if (!category) {
      setFieldError('category');
      setErrorMessage('Choose what kind of feedback you are sending.');
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
      setFieldError('message');
      setErrorMessage('Please write at least 10 characters so we can help.');
      return;
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFieldError('email');
      setErrorMessage('Enter a valid email or leave it blank.');
      return;
    }

    setIsSubmitting(true);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const result = await submitFeedback({
        category,
        message: trimmedMessage,
        name: name.trim() || undefined,
        email: trimmedEmail || undefined,
      });
      setSuccessMessage(result.message);
      setMessage('');
      setCategory(null);
    } catch {
      setFieldError('general');
      setErrorMessage('Could not send feedback. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.cream }]} edges={['top']}>
      <AppSavingOverlay visible={isSubmitting} message="Sending feedback…" />
      <SettingsSubHeader title="Send feedback" onBack={() => router.back()} />

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
          <Text style={[styles.title, { color: themeColors.charcoal }]}>Tell us what you think</Text>
          <Text style={[styles.subtitle, { color: themeColors.muted }]}>
            Report bugs, suggest features, or share anything that would make Rasoi better for you.
          </Text>

          <View
            style={[
              styles.formCard,
              { backgroundColor: themeColors.white, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.field}>
              <Text style={[styles.label, { color: themeColors.charcoal }]}>Type</Text>
              <View style={styles.categoryList}>
                {FEEDBACK_CATEGORIES.map((option) => {
                  const active = category === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => {
                        void Haptics.selectionAsync();
                        setCategory(option.id);
                        if (fieldError === 'category') setFieldError(null);
                      }}
                      style={[
                        styles.categoryOption,
                        { borderColor: themeColors.border, backgroundColor: themeColors.cream },
                        active && styles.categoryOptionActive,
                        fieldError === 'category' && !active && styles.inputError,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryLabel,
                          { color: active ? colors.primary : themeColors.charcoal },
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={[styles.categoryDescription, { color: themeColors.muted }]}>
                        {option.description}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: themeColors.charcoal }]}>Message</Text>
              <TextInput
                value={message}
                onChangeText={(value) => {
                  setMessage(value);
                  if (fieldError === 'message') setFieldError(null);
                }}
                placeholder="Describe the issue or your idea…"
                placeholderTextColor={themeColors.placeholder}
                multiline
                textAlignVertical="top"
                style={[
                  styles.textArea,
                  {
                    color: themeColors.charcoal,
                    borderColor: themeColors.border,
                    backgroundColor: themeColors.cream,
                  },
                  fieldError === 'message' && styles.inputError,
                ]}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: themeColors.charcoal }]}>Name (optional)</Text>
              <View
                style={[
                  styles.inputRow,
                  { borderColor: themeColors.border, backgroundColor: themeColors.cream },
                ]}
              >
                <User size={20} color={themeColors.muted} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={themeColors.placeholder}
                  autoCapitalize="words"
                  style={[styles.input, { color: themeColors.charcoal }]}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: themeColors.charcoal }]}>Email (optional)</Text>
              <View
                style={[
                  styles.inputRow,
                  { borderColor: themeColors.border, backgroundColor: themeColors.cream },
                  fieldError === 'email' && styles.inputError,
                ]}
              >
                <Mail size={20} color={themeColors.muted} />
                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (fieldError === 'email') setFieldError(null);
                  }}
                  placeholder="you@example.com"
                  placeholderTextColor={themeColors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, { color: themeColors.charcoal }]}
                />
              </View>
              <Text style={[styles.hint, { color: themeColors.muted }]}>
                Add your email if you want us to follow up.
              </Text>
            </View>

            {errorMessage ? (
              <Text style={[styles.errorText, { color: colors.danger }]}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
              <Text style={[styles.successText, { color: colors.green }]}>{successMessage}</Text>
            ) : null}

            <PrimaryButton
              label="Submit feedback"
              onPress={() => void handleSubmit()}
              disabled={isSubmitting}
              style={styles.submitButton}
            />

            <Pressable onPress={() => void Linking.openURL(CONTACT_MAILTO)} style={styles.contactRow}>
              <Text style={[styles.hint, { color: themeColors.muted }]}>
                Prefer email? Write to{' '}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>{CONTACT_EMAIL}</Text>
              </Text>
            </Pressable>
          </View>
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
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
  },
  formCard: {
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.card,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  categoryList: {
    gap: spacing.sm,
  },
  categoryOption: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  categoryOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  categoryDescription: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: spacing.sm,
  },
  hint: {
    marginTop: spacing.xs,
    fontSize: 12,
    lineHeight: 18,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    marginBottom: spacing.md,
    fontSize: 13,
    lineHeight: 20,
  },
  successText: {
    marginBottom: spacing.md,
    fontSize: 13,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  contactRow: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
});
