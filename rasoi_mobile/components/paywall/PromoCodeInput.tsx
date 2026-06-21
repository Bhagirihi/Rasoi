import { LinearGradient } from 'expo-linear-gradient';
import { Tag } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

type PromoCodeInputProps = {
  disabled?: boolean;
  onRedeem: (code: string) => Promise<{ message: string }>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export default function PromoCodeInput({
  disabled = false,
  onRedeem,
  onSuccess,
  onError,
}: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed || busy || disabled) return;

    setBusy(true);
    try {
      const result = await onRedeem(trimmed);
      setCode('');
      onSuccess(result.message);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Could not apply promo code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['rgba(255,107,53,0.14)', 'rgba(255,153,51,0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Tag size={18} color={colors.primary} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Have a promo code?</Text>
            <Text style={styles.subtitle}>Apply before checkout for extra savings on yearly</Text>
          </View>
        </View>

        <View style={styles.row}>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter your code"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!busy && !disabled}
            returnKeyType="done"
            onSubmitEditing={() => void handleApply()}
            style={styles.input}
          />
          <Pressable
            onPress={() => void handleApply()}
            disabled={busy || disabled || !code.trim()}
            style={[
              styles.applyBtn,
              (busy || disabled || !code.trim()) && styles.applyBtnDisabled,
            ]}
          >
            <Text style={styles.applyText}>{busy ? '…' : 'Apply'}</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,107,53,0.35)',
  },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.charcoal,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '700',
    color: colors.charcoal,
    letterSpacing: 1,
  },
  applyBtn: {
    borderRadius: radius.md,
    backgroundColor: colors.charcoal,
    paddingHorizontal: spacing.lg,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    opacity: 0.45,
  },
  applyText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
});
