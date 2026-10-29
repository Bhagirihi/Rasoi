import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, gradients, radius, spacing } from '@/constants/theme';
import { useAppContext, type AuthNavigationResult } from '@/context/AppContext';
import { maskEmail } from '@/utils/authLogger';
import {
  EmailDeliveryUnavailableError,
  isEmailDeliveryUnavailableError,
} from '@/utils/emailDeliveryErrors';

type EmailVerificationModalProps = {
  visible: boolean;
  onClose: () => void;
  onVerified?: (result: AuthNavigationResult) => void;
};

export default function EmailVerificationModal({
  visible,
  onClose,
  onVerified,
}: EmailVerificationModalProps) {
  const {
    pendingEmailVerification,
    verifyPendingEmailOtp,
    resendPendingEmailVerificationOtp,
    clearPendingEmailVerification,
  } = useAppContext();

  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!visible) {
      setOtp('');
      setErrorMessage('');
      setInfoMessage('');
      setBusy(false);
    }
  }, [visible]);

  if (!pendingEmailVerification) return null;

  const masked = maskEmail(pendingEmailVerification.email);
  const isSignup = pendingEmailVerification.flow === 'signup';

  const handleVerify = async () => {
    setErrorMessage('');
    setInfoMessage('');

    const code = otp.replace(/\D/g, '').trim();
    if (code.length < 6) {
      setErrorMessage('Enter the verification code from your email.');
      return;
    }

    setBusy(true);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const nav = await verifyPendingEmailOtp(code);
      onVerified?.(nav);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Invalid or expired code. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setBusy(true);
    try {
      await resendPendingEmailVerificationOtp();
      setInfoMessage('If email delivery is working, a new code was sent.');
    } catch (error) {
      if (isEmailDeliveryUnavailableError(error)) {
        setErrorMessage(
          error instanceof EmailDeliveryUnavailableError
            ? error.message
            : 'Email delivery is still unavailable. Try again later.',
        );
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : 'Could not resend code. Try again.',
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDismissPending = async () => {
    await clearPendingEmailVerification();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Verify your email</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
              <X size={22} color={colors.dark.textMuted} />
            </Pressable>
          </View>

          <Text style={styles.body}>
            {isSignup
              ? 'Finish creating your account with the one-time code we send to your email.'
              : 'Sign in with the one-time code sent to your email.'}
          </Text>

          <View style={styles.emailChip}>
            <Mail size={16} color={colors.primary} />
            <Text style={styles.emailText}>{masked}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Verification code</Text>
            <TextInput
              value={otp}
              onChangeText={(value) => {
                setOtp(value.replace(/\D/g, '').slice(0, 8));
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="123456"
              placeholderTextColor={colors.dark.buttonDisabledText}
              keyboardType="number-pad"
              maxLength={8}
              style={styles.input}
              autoFocus
            />
          </View>

          {errorMessage.length > 0 && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {infoMessage.length > 0 && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{infoMessage}</Text>
            </View>
          )}

          <Pressable onPress={() => void handleVerify()} disabled={busy} style={styles.primaryWrap}>
            <LinearGradient colors={[...gradients.cta]} style={styles.primaryButton}>
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryText}>Verify email</Text>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => void handleResend()} disabled={busy} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Resend code</Text>
          </Pressable>

          <Pressable onPress={() => void handleDismissPending()} disabled={busy}>
            <Text style={styles.dismissText}>Dismiss reminder</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark.text,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.dark.textMuted,
  },
  emailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(0,168,107,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  emailText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.dark.textMuted,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: colors.dark.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 4,
    color: colors.dark.text,
  },
  errorBox: {
    borderRadius: 12,
    backgroundColor: 'rgba(229,57,53,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229,57,53,0.25)',
    padding: spacing.md,
  },
  errorText: {
    fontSize: 13,
    color: '#F87171',
    textAlign: 'center',
  },
  infoBox: {
    borderRadius: 12,
    backgroundColor: 'rgba(0,168,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,168,107,0.25)',
    padding: spacing.md,
  },
  infoText: {
    fontSize: 13,
    color: colors.green,
    textAlign: 'center',
  },
  primaryWrap: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    minHeight: 48,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  dismissText: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.dark.textMuted,
    paddingVertical: 4,
  },
});
