import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, type CuisineId } from '@/constants/theme';
import { testIds } from '@/constants/testIds';
import { useReferenceData } from '@/context/ReferenceContext';

type CuisinePreferenceListProps = {
  selected: CuisineId[];
  onToggle: (id: CuisineId) => void;
  variant?: 'dark' | 'light';
};

export default function CuisinePreferenceList({
  selected,
  onToggle,
  variant = 'dark',
}: CuisinePreferenceListProps) {
  const { kitchenStyles } = useReferenceData();
  const isDark = variant === 'dark';

  return (
    <View style={styles.list}>
      {kitchenStyles.map((cuisine, index) => {
        const isSelected = selected.includes(cuisine.id);

        return (
          <Pressable
            key={cuisine.id}
            testID={index === 0 ? testIds.onboardingCuisineFirst : undefined}
            onPress={() => {
              void Haptics.selectionAsync();
              onToggle(cuisine.id);
            }}
            style={[
              styles.row,
              isDark ? styles.rowDark : styles.rowLight,
              isSelected && (isDark ? styles.rowDarkSelected : styles.rowLightSelected),
            ]}
          >
            <Image source={{ uri: cuisine.heroImage }} style={styles.hero} />
            <View style={styles.body}>
              <View style={styles.topRow}>
                <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>
                  {cuisine.label}
                </Text>
                <View style={[styles.moodPill, isDark ? styles.moodPillDark : styles.moodPillLight]}>
                  <Text
                    style={[styles.moodText, isDark ? styles.moodTextDark : styles.moodTextLight]}
                  >
                    {cuisine.mood}
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.tagline, isDark ? styles.taglineDark : styles.taglineLight]}
                numberOfLines={2}
              >
                {cuisine.tagline}
              </Text>
            </View>
            <View
              style={[
                styles.check,
                isDark ? styles.checkDark : styles.checkLight,
                isSelected && styles.checkSelected,
              ]}
            >
              {isSelected && <Check size={16} color={colors.white} strokeWidth={3} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: 12,
    gap: 12,
  },
  rowDark: {
    backgroundColor: colors.dark.card,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  rowDarkSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.dark.cardSelected,
  },
  rowLight: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  rowLightSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,107,53,0.06)',
  },
  hero: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  labelDark: {
    color: colors.dark.text,
  },
  labelLight: {
    color: colors.charcoal,
  },
  moodPill: {
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  moodPillDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  moodPillLight: {
    backgroundColor: colors.cream,
  },
  moodText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  moodTextDark: {
    color: colors.dark.textMuted,
  },
  moodTextLight: {
    color: colors.muted,
  },
  tagline: {
    fontSize: 13,
    lineHeight: 18,
  },
  taglineDark: {
    color: colors.dark.textMuted,
  },
  taglineLight: {
    color: colors.muted,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDark: {
    borderColor: '#4A4540',
  },
  checkLight: {
    borderColor: colors.border,
  },
  checkSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
});
