import { LinearGradient } from 'expo-linear-gradient';
import { User, X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { authStyles as styles } from '@/components/auth/authStyles';
import { testIds } from '@/constants/testIds';
import { colors, gradients, radius, spacing } from '@/constants/theme';

type GuestContinueModalProps = {
  visible: boolean;
  name: string;
  onChangeName: (value: string) => void;
  onClose: () => void;
  onContinue: () => void;
  busy?: boolean;
};

export default function GuestContinueModal({
  visible,
  name,
  onChangeName,
  onClose,
  onContinue,
  busy = false,
}: GuestContinueModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={localStyles.backdrop} testID={testIds.guestContinue}>
        <View style={localStyles.card}>
          <Pressable onPress={onClose} hitSlop={12} style={localStyles.closeBtn}>
            <X size={20} color={colors.muted} />
          </Pressable>

          <Text style={localStyles.title}>Continue as guest</Text>
          <Text style={localStyles.body}>
            Browse recipes without an account. Add your name if you like — totally optional.
          </Text>

          <View style={localStyles.field}>
            <Text style={styles.label}>Your name (optional)</Text>
            <View style={styles.inputRow}>
              <User size={20} color="#6b6560" />
              <TextInput
                value={name}
                onChangeText={onChangeName}
                placeholder="e.g. Priya"
                placeholderTextColor="#a39e96"
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={onContinue}
                style={styles.input}
              />
            </View>
          </View>

          <Pressable
            onPress={onContinue}
            disabled={busy}
            testID={`${testIds.guestContinue}-button`}
            style={[localStyles.continueWrap, busy && styles.buttonDisabled]}
          >
            <LinearGradient
              colors={[...gradients.cta]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>
                {busy ? 'Please wait…' : 'Continue as guest'}
              </Text>
            </LinearGradient>
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
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xs,
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
  field: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  continueWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
