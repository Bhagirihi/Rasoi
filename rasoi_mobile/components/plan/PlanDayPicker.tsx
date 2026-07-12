import * as Haptics from 'expo-haptics';
import { Lock } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { PlanDayOption, PlanDayOffset } from '@/utils/planMenu';

type PlanDayPickerProps = {
  days: PlanDayOption[];
  selectedOffset: PlanDayOffset;
  onSelect: (offset: PlanDayOffset) => void;
  maxDayOffset?: number;
  onLockedDay?: () => void;
};

export default function PlanDayPicker({
  days,
  selectedOffset,
  onSelect,
  maxDayOffset = 2,
  onLockedDay,
}: PlanDayPickerProps) {
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
        const locked = day.offset > maxDayOffset;
        return (
          <Pressable
            key={day.offset}
            onPress={() => {
              void Haptics.selectionAsync();
              if (locked) {
                onLockedDay?.();
                return;
              }
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
                { color: active ? colors.primary : locked ? themeColors.muted : themeColors.charcoal },
              ]}
              numberOfLines={1}
            >
              {day.segmentLabel}
            </Text>
            <View style={styles.captionRow}>
              <Text
                style={[
                  styles.caption,
                  { color: active ? colors.primary : themeColors.muted },
                ]}
                numberOfLines={1}
              >
                {locked ? "Rasoi Plus" : day.caption}
              </Text>
              {locked ? <Lock size={11} color={themeColors.muted} /> : null}
            </View>
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
  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
