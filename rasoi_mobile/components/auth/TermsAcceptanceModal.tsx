import * as Linking from 'expo-linking';
import { Check } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { authStyles as styles } from '@/components/auth/authStyles';
import { colors, radius, spacing } from '@/constants/theme';

const TERMS_URL = 'https://rasoiapplication.in/terms';
const PRIVACY_URL = 'https://rasoiapplication.in/privacy';

type TermsAcceptanceModalProps = {
  visible: boolean;
  checked: boolean;
  onToggleChecked: () => void;
  onCancel: () => void;
  onContinue: () => void;
};

export default function TermsAcceptanceModal({
  visible,
  checked,
  onToggleChecked,
  onCancel,
  onContinue,
}: TermsAcceptanceModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={localStyles.backdrop}>
        <View style={localStyles.card}>
          <Text style={localStyles.title}>Terms & Privacy</Text>
          <Text style={localStyles.body}>
            Before creating your Rasoi account, review our Terms of Service and Privacy Policy.
          </Text>

          <Pressable onPress={onToggleChecked} style={localStyles.checkRow}>
            <View style={[localStyles.checkbox, checked && localStyles.checkboxChecked]}>
              {checked ? <Check size={14} color={colors.white} strokeWidth={3} /> : null}
            </View>
            <Text style={localStyles.checkLabel}>
              I agree to the{' '}
              <Text style={localStyles.link} onPress={() => void Linking.openURL(TERMS_URL)}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={localStyles.link} onPress={() => void Linking.openURL(PRIVACY_URL)}>
                Privacy Policy
              </Text>
              .
            </Text>
          </Pressable>

          <Pressable
            onPress={onContinue}
            disabled={!checked}
            style={[styles.submitButton, localStyles.continueBtn, !checked && styles.buttonDisabled]}
          >
            <Text style={styles.submitButtonText}>Continue</Text>
          </Pressable>

          <Pressable onPress={onCancel} style={localStyles.cancelBtn}>
            <Text style={localStyles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 9, 8, 0.55)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.charcoal,
  },
  body: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.charcoal,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  continueBtn: {
    marginTop: spacing.lg,
  },
  cancelBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
});
