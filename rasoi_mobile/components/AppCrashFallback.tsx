import * as Clipboard from 'expo-clipboard';
import { AlertCircle, Check, Copy } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
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

import { colors, radius, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { sendCrashUserNote } from '@/utils/sentry';

type AppCrashFallbackProps = {
  error?: Error | null;
  eventId?: string | null;
  reportSent?: boolean;
  onRetry: () => void | Promise<void>;
};

export default function AppCrashFallback({
  error,
  eventId,
  reportSent = false,
  onRetry,
}: AppCrashFallbackProps) {
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [noteSent, setNoteSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const supportRef = eventId ?? 'unavailable';

  const handleCopyRef = useCallback(async () => {
    if (!eventId) return;
    await Clipboard.setStringAsync(eventId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [eventId]);

  const handleSend = useCallback(async () => {
    const trimmed = note.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      sendCrashUserNote(trimmed, eventId);
      setNoteSent(true);
      setNote('');
    } finally {
      setSending(false);
    }
  }, [eventId, note, sending]);

  const handleRetry = useCallback(async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  }, [onRetry, retrying]);

  return (
    <SafeAreaView style={styles.safe} testID={testIds.screenCrashFallback}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <View style={styles.iconGlow} />
              <View style={styles.iconCircle}>
                <AlertCircle size={28} color={colors.danger} strokeWidth={2.2} />
              </View>
            </View>

            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              Don&apos;t worry — your recipes and pantry are safe. Tap Retry to pick up where you
              left off.
            </Text>

            {reportSent ? (
              <View style={styles.reportBadge}>
                <Check size={14} color={colors.green} strokeWidth={2.5} />
                <Text style={styles.reportBadgeText}>Report sent automatically</Text>
              </View>
            ) : null}

            <View style={styles.feedbackBlock}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.feedbackLabel}>What were you doing?</Text>
                <Text style={styles.optional}>Optional</Text>
              </View>
              <Text style={styles.feedbackHint}>
                A quick note helps our team reproduce and fix this faster.
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="e.g. I was browsing recipes on the home screen…"
                placeholderTextColor={colors.placeholder}
                multiline
                textAlignVertical="top"
                style={styles.input}
                editable={!sending && !noteSent}
                testID={testIds.crashFeedbackInput}
              />
              {noteSent ? (
                <Text style={styles.noteSent}>Thanks — your note was sent.</Text>
              ) : null}
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() => {
                  void handleSend();
                }}
                disabled={!note.trim() || sending || noteSent}
                style={[
                  styles.sendButton,
                  (!note.trim() || sending || noteSent) && styles.sendButtonDisabled,
                ]}
                testID={testIds.crashSendFeedback}
              >
                {sending ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  void handleRetry();
                }}
                disabled={retrying}
                style={[styles.retryButton, retrying && styles.retryButtonDisabled]}
                testID={testIds.crashRetry}
              >
                {retrying ? (
                  <ActivityIndicator color={colors.primary} size="small" />
                ) : (
                  <Text style={styles.retryButtonText}>Retry</Text>
                )}
              </Pressable>
            </View>

            <Text style={styles.refLabel}>SUPPORT REFERENCE</Text>
            <Pressable
              onPress={() => {
                void handleCopyRef();
              }}
              disabled={!eventId}
              style={[styles.refBox, !eventId && styles.refBoxDisabled]}
              testID={testIds.crashSupportRef}
            >
              <Text style={styles.refText} selectable>
                {supportRef}
              </Text>
              {eventId ? <Copy size={18} color={colors.primary} /> : null}
            </Pressable>
            <Text style={styles.refHint}>{copied ? 'Copied!' : 'Tap to copy'}</Text>

            {__DEV__ && error?.message ? (
              <Text style={styles.devError}>{error.message}</Text>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ECEFF3',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  iconWrap: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  iconGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(229,57,53,0.12)',
    top: -8,
    left: -8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  reportBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,168,107,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginBottom: spacing.xl,
  },
  reportBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.green,
  },
  feedbackBlock: {
    marginBottom: spacing.xl,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  feedbackLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.charcoal,
  },
  optional: {
    fontSize: 13,
    color: colors.muted,
  },
  feedbackHint: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  input: {
    minHeight: 96,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    lineHeight: 21,
    color: colors.charcoal,
    backgroundColor: colors.cream,
  },
  noteSent: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: colors.green,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sendButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  retryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonDisabled: {
    opacity: 0.6,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  refLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.placeholder,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  refBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  refBoxDisabled: {
    opacity: 0.7,
  },
  refText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    color: colors.charcoal,
  },
  refHint: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.placeholder,
    textAlign: 'center',
  },
  devError: {
    marginTop: spacing.lg,
    fontSize: 12,
    lineHeight: 18,
    color: colors.danger,
  },
});
