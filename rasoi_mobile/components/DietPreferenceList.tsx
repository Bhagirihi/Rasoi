import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DIET_PREFERENCE_OPTIONS } from '@/constants/dietOptions';
import { colors, radius, type DietChoice } from '@/constants/theme';

type DietPreferenceListProps = {
  selected: DietChoice | null;
  onSelect: (value: DietChoice) => void;
  variant?: 'dark' | 'light';
};

export default function DietPreferenceList({
  selected,
  onSelect,
  variant = 'dark',
}: DietPreferenceListProps) {
  const isDark = variant === 'dark';

  return (
    <View style={styles.list}>
      {DIET_PREFERENCE_OPTIONS.map((option) => {
        const isActive = selected === option.value;
        const Icon = option.icon;

        return (
          <Pressable
            key={option.value}
            onPress={() => {
              void Haptics.selectionAsync();
              onSelect(option.value);
            }}
            style={[
              styles.card,
              isDark ? styles.cardDark : styles.cardLight,
              isActive && (isDark ? styles.cardDarkActive : styles.cardLightActive),
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: option.iconBg }]}>
              <Icon size={22} color={option.iconColor} />
            </View>
            <View style={styles.textWrap}>
              <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>
                {option.label}
              </Text>
              <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
                {option.subtitle}
              </Text>
            </View>
            <View
              style={[
                styles.radio,
                isDark ? styles.radioDark : styles.radioLight,
                isActive && styles.radioActive,
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 16,
  },
  cardDark: {
    backgroundColor: colors.dark.card,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardDarkActive: {
    borderColor: 'rgba(255,107,53,0.45)',
    backgroundColor: colors.dark.cardSelected,
  },
  cardLight: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  cardLightActive: {
    borderColor: 'rgba(255,107,53,0.45)',
    backgroundColor: 'rgba(255,107,53,0.06)',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
  },
  labelDark: {
    color: colors.dark.text,
  },
  labelLight: {
    color: colors.charcoal,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  subtitleDark: {
    color: colors.dark.textMuted,
  },
  subtitleLight: {
    color: colors.muted,
    letterSpacing: 0.3,
    textTransform: 'none',
    fontSize: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  radioDark: {
    borderColor: '#4A4540',
  },
  radioLight: {
    borderColor: colors.border,
  },
  radioActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
});
