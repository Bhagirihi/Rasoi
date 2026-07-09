import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { PlanDayOption, PlanDayOffset } from '@/utils/planMenu';

type PlanDayPickerProps = {
  days: PlanDayOption[];
  selectedOffset: PlanDayOffset;
  onSelect: (offset: PlanDayOffset) => void;
};

export default function PlanDayPicker({ days, selectedOffset, onSelect }: PlanDayPickerProps) {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
        },
        shadows.card,
      ]}
    >
      {days.map((day) => {
        const active = day.offset === selectedOffset;
        return (
          <Pressable
            key={day.offset}
            onPress={() => {
              void Haptics.selectionAsync();
              onSelect(day.offset);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${day.heading}, ${day.caption}`}
            style={[
              styles.segment,
              active && styles.segmentActive,
              active && {
                backgroundColor: isDark ? 'rgba(255,107,53,0.22)' : '#FFF0EA',
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: active ? colors.primary : themeColors.charcoal },
              ]}
              numberOfLines={1}
            >
              {day.segmentLabel}
            </Text>
            <Text
              style={[
                styles.caption,
                { color: active ? colors.primary : themeColors.muted },
              ]}
              numberOfLines={1}
            >
              {day.caption}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 52,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segmentActive: {
    borderWidth: 1,
  },
  label: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },
  caption: {
    fontFamily: appFonts.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
});
