import { LinearGradient } from 'expo-linear-gradient';
import { Tag } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type PromoCodeInputProps = {
  disabled?: boolean;
  forceDark?: boolean;
  onRedeem: (code: string) => Promise<{ message: string }>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export default function PromoCodeInput({
  disabled = false,
  forceDark = false,
  onRedeem,
  onSuccess,
  onError,
}: PromoCodeInputProps) {
  const { colors: themeColors, isDark } = useTheme();
  const dark = forceDark || isDark;
  const text = dark ? colors.dark.text : themeColors.charcoal;
  const muted = dark ? colors.dark.textMuted : themeColors.muted;
  const inputBg = dark ? colors.dark.surface : colors.white;
  const inputBorder = dark ? 'rgba(255,107,53,0.45)' : colors.white;
  const applyBg = dark ? colors.primary : colors.charcoal;

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
    <View
      style={[
        styles.wrap,
        {
          borderColor: dark ? 'rgba(255,107,53,0.55)' : 'rgba(255,107,53,0.35)',
          backgroundColor: dark ? 'rgba(255,107,53,0.12)' : 'transparent',
        },
      ]}
    >
      <LinearGradient
        colors={
          dark
            ? ['rgba(255,107,53,0.22)', 'rgba(255,153,51,0.1)']
            : ['rgba(255,107,53,0.14)', 'rgba(255,153,51,0.08)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: dark ? colors.dark.card : colors.white }]}>
            <Tag size={18} color={colors.primary} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: text }]}>Have a promo code?</Text>
            <Text style={[styles.subtitle, { color: muted }]}>
              Apply before checkout for extra savings on yearly
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter your code"
            placeholderTextColor={muted}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!busy && !disabled}
            returnKeyType="done"
            onSubmitEditing={() => void handleApply()}
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: text,
              },
            ]}
          />
          <Pressable
            onPress={() => void handleApply()}
            disabled={busy || disabled || !code.trim()}
            style={[
              styles.applyBtn,
              { backgroundColor: applyBg },
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
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  applyBtn: {
    borderRadius: radius.md,
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
