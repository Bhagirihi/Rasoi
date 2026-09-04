import * as Haptics from 'expo-haptics';
import { useState } from 'react';
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

import SmoothModal from '@/components/ui/SmoothModal';
import {
  DELETE_ACCOUNT_REASONS,
  type DeleteAccountReason,
} from '@/constants/deleteAccount';
import { colors, radius, spacing } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useTheme } from '@/context/ThemeContext';

type DeleteAccountReasonModalProps = {
  visible: boolean;
  isGuest: boolean;
  onClose: () => void;
  onContinue: (reason: DeleteAccountReason, detail?: string) => void;
};

export default function DeleteAccountReasonModal({
  visible,
  isGuest,
  onClose,
  onContinue,
}: DeleteAccountReasonModalProps) {
  const { colors: themeColors } = useTheme();
  const [selectedReason, setSelectedReason] = useState<DeleteAccountReason | null>(null);
  const [detail, setDetail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const reset = () => {
    setSelectedReason(null);
    setDetail('');
    setErrorMessage('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleContinue = () => {
    if (!selectedReason) {
      setErrorMessage('Please pick a reason to continue.');
      return;
    }

    const trimmedDetail = detail.trim();
    if (selectedReason === 'other' && trimmedDetail.length < 3) {
      setErrorMessage('Tell us a bit more when you choose Other.');
      return;
    }

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onContinue(selectedReason, trimmedDetail || undefined);
    reset();
  };

  return (
    <SmoothModal
      visible={visible}
      onClose={handleClose}
      variant="center"
      dismissOnBackdrop
      contentStyle={styles.modalContent}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.card} testID={testIds.deleteReasonModal}>
          <Text style={[styles.title, { color: themeColors.charcoal }]}>
            {isGuest ? 'Why leave Rasoi?' : 'Why are you deleting your account?'}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.muted }]}>
            Your answer helps us improve. This step comes before permanent deletion.
          </Text>

          <ScrollView
            style={styles.reasonList}
            contentContainerStyle={styles.reasonListContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {DELETE_ACCOUNT_REASONS.map((reason) => {
              const selected = selectedReason === reason.id;
              return (
                <Pressable
                  key={reason.id}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setSelectedReason(reason.id);
                    setErrorMessage('');
                  }}
                  style={[
                    styles.reasonChip,
                    {
                      borderColor: selected ? colors.primary : themeColors.border,
                      backgroundColor: selected ? 'rgba(255,107,53,0.08)' : themeColors.white,
                    },
                  ]}
                  testID={`${testIds.deleteReasonOption}-${reason.id}`}
                >
                  <Text
                    style={[
                      styles.reasonChipText,
                      { color: selected ? colors.primary : themeColors.charcoal },
                    ]}
                  >
                    {reason.label}
                  </Text>
                </Pressable>
              );
            })}

            <Text style={[styles.detailLabel, { color: themeColors.charcoal }]}>
              Anything else? {selectedReason === 'other' ? '(required)' : '(optional)'}
            </Text>
            <TextInput
              value={detail}
              onChangeText={(value) => {
                setDetail(value);
                setErrorMessage('');
              }}
              placeholder="e.g. I wanted more regional recipes…"
              placeholderTextColor={colors.placeholder}
              multiline
              textAlignVertical="top"
              style={[
                styles.detailInput,
                {
                  borderColor: themeColors.border,
                  color: themeColors.charcoal,
                  backgroundColor: themeColors.cream,
                },
              ]}
              testID={testIds.deleteReasonDetail}
            />
          </ScrollView>

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={[styles.cancelButton, { borderColor: themeColors.border }]}
              testID={testIds.deleteReasonCancel}
            >
              <Text style={[styles.cancelButtonText, { color: themeColors.muted }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleContinue}
              style={styles.continueButton}
              testID={testIds.deleteReasonContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SmoothModal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: spacing.lg,
  },
  flex: {
    width: '100%',
  },
  card: {
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    padding: spacing.xl,
    maxHeight: '88%',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  reasonList: {
    marginTop: spacing.lg,
    maxHeight: 320,
  },
  reasonListContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  reasonChip: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  reasonChipText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  detailLabel: {
    marginTop: spacing.md,
    fontSize: 14,
    fontWeight: '700',
  },
  detailInput: {
    marginTop: spacing.sm,
    minHeight: 88,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    lineHeight: 21,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 18,
    color: colors.danger,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  continueButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
});
