import * as Haptics from 'expo-haptics';
import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { SettingsCard } from '@/components/settings/SettingsBlocks';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { submitAppStoreRating } from '@/utils/storeReview';

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

export default function RateRasoiCard() {
  const { colors: themeColors } = useTheme();
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedStars || submitting) return;

    setSubmitting(true);
    setMessage(null);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const result = await submitAppStoreRating();
      if (result === 'native') {
        setMessage('Thanks! Use the popup to rate Rasoi on the store.');
      } else if (result === 'store') {
        setMessage('Thanks! We opened the store page so you can leave your rating.');
      } else {
        setMessage('Store rating is available in the release app on your phone.');
      }
    } catch {
      setMessage('Could not open the store right now. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SettingsCard style={styles.card}>
      <Text style={[styles.title, { color: themeColors.charcoal }]}>Rate Rasoi</Text>
      <Text style={[styles.body, { color: themeColors.muted }]}>
        Enjoying the app? Tap a star, then submit to rate on Google Play or the App Store.
      </Text>

      <View style={styles.starRow}>
        {STAR_VALUES.map((value) => {
          const active = selectedStars !== null && value <= selectedStars;
          return (
            <Pressable
              key={value}
              onPress={() => {
                void Haptics.selectionAsync();
                setSelectedStars(value);
                setMessage(null);
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`${value} star${value === 1 ? '' : 's'}`}
              style={styles.starButton}
            >
              <Star
                size={28}
                color={active ? colors.saffron : themeColors.border}
                fill={active ? colors.saffron : 'transparent'}
              />
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => void handleSubmit()}
        disabled={!selectedStars || submitting}
        style={[
          styles.submitBtn,
          (!selectedStars || submitting) && styles.submitBtnDisabled,
        ]}
      >
        {submitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.submitText}>Submit rating</Text>
        )}
      </Pressable>

      {message ? <Text style={[styles.message, { color: themeColors.muted }]}>{message}</Text> : null}
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  body: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  starButton: {
    padding: spacing.xs,
  },
  submitBtn: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.55,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  message: {
    marginTop: spacing.md,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
