import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { getDietPreferenceOption } from '@/constants/dietOptions';
import { colors, gradients, radius, shadows, spacing } from '@/constants/theme';
import type { DietChoice } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { PantryPreferenceSummary } from '@/utils/pantryCatalog';

type PantryHeroCardProps = {
  stocked: number;
  total: number;
  percent: number;
  matchCount: number;
  preferenceSummary: PantryPreferenceSummary;
  dietChoice: DietChoice;
};

export function PantryHeroCard({
  stocked,
  total,
  percent,
  matchCount,
  preferenceSummary,
  dietChoice,
}: PantryHeroCardProps) {
  const { colors: themeColors, isDark } = useTheme();
  const dietOption = getDietPreferenceOption(dietChoice);
  const DietIcon = dietOption.icon;
  const ringSize = 52;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: themeColors.white, borderColor: themeColors.border },
      ]}
    >
      <LinearGradient
        colors={gradients.header}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.accent}
      />

      <View style={styles.row}>
        <View
          style={[
            styles.ring,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderColor: isDark ? 'rgba(0,168,107,0.35)' : 'rgba(0,168,107,0.2)',
              backgroundColor: isDark ? 'rgba(0,168,107,0.08)' : 'rgba(0,168,107,0.06)',
            },
          ]}
        >
          <Text style={styles.ringPercent}>{percent}%</Text>
        </View>

        <View style={styles.copy}>
          <Text style={[styles.title, { color: themeColors.charcoal }]}>
            {stocked}/{total} stocked
            {matchCount > 0 ? (
              <Text style={{ color: colors.primary }}>{` · ${matchCount} ready`}</Text>
            ) : null}
          </Text>
          <View style={styles.chipRow}>
            <View
              style={[
                styles.dietChip,
                { backgroundColor: dietOption.iconBg, borderColor: `${dietOption.iconColor}33` },
              ]}
            >
              <DietIcon size={11} color={dietOption.iconColor} strokeWidth={2.5} />
              <Text style={[styles.dietChipText, { color: dietOption.iconColor }]}>
                {preferenceSummary.dietLabel}
              </Text>
            </View>
            {preferenceSummary.cuisineLabels.slice(0, 3).map((label) => (
              <View
                key={label}
                style={[
                  styles.cuisineChip,
                  {
                    backgroundColor: isDark ? 'rgba(255,107,53,0.14)' : 'rgba(255,107,53,0.08)',
                    borderColor: 'rgba(255,107,53,0.22)',
                  },
                ]}
              >
                <Text style={[styles.cuisineChipText, { color: colors.primary }]} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            ))}
            {preferenceSummary.cuisineLabels.length > 3 ? (
              <Text style={[styles.moreCuisines, { color: themeColors.muted }]}>
                +{preferenceSummary.cuisineLabels.length - 3}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card,
  },
  accent: {
    height: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  ringPercent: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.green,
    lineHeight: 16,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  dietChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  dietChipText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cuisineChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    maxWidth: 88,
  },
  cuisineChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  moreCuisines: {
    fontSize: 10,
    fontWeight: '700',
  },
});
