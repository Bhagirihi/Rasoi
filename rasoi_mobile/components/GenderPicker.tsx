import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GENDER_OPTIONS, type Gender } from '@/constants/genderOptions';
import { testIds } from '@/constants/testIds';
import { colors, radius } from '@/constants/theme';

type GenderPickerProps = {
  selected: Gender | null;
  onSelect: (value: Gender) => void;
  variant?: 'dark' | 'light';
  compact?: boolean;
};

const genderTestIds: Partial<Record<Gender, string>> = {
  Male: testIds.registerGenderMale,
  Female: testIds.registerGenderFemale,
  Other: testIds.registerGenderOther,
};

export default function GenderPicker({
  selected,
  onSelect,
  variant = 'dark',
  compact = false,
}: GenderPickerProps) {
  const isDark = variant === 'dark';

  return (
    <View style={styles.row}>
      {GENDER_OPTIONS.map((option) => {
        const isActive = selected === option.value;

        return (
          <Pressable
            key={option.value}
            testID={genderTestIds[option.value]}
            onPress={() => {
              void Haptics.selectionAsync();
              onSelect(option.value);
            }}
            style={[
              styles.chip,
              compact && styles.chipCompact,
              isDark ? styles.chipDark : styles.chipLight,
              isActive && (isDark ? styles.chipDarkActive : styles.chipLightActive),
            ]}
          >
            <Text
              style={[
                styles.chipText,
                compact && styles.chipTextCompact,
                isDark ? styles.chipTextDark : styles.chipTextLight,
                isActive && styles.chipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  chipCompact: {
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  chipDark: {
    backgroundColor: colors.dark.bg,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipDarkActive: {
    borderColor: 'rgba(255,107,53,0.45)',
    backgroundColor: colors.dark.cardSelected,
  },
  chipLight: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  chipLightActive: {
    borderColor: 'rgba(255,107,53,0.45)',
    backgroundColor: 'rgba(255,107,53,0.06)',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '700',
  },
  chipTextCompact: {
    fontSize: 14,
  },
  chipTextDark: {
    color: colors.dark.textMuted,
  },
  chipTextLight: {
    color: colors.muted,
  },
  chipTextActive: {
    color: colors.primary,
  },
});
