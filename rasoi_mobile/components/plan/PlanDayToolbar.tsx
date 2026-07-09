import * as Haptics from 'expo-haptics';
import { Bookmark, RefreshCw } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type PlanDayToolbarProps = {
  readyCount: number;
  totalMeals: number;
  avgPantryMatch: number;
  unsavedCount: number;
  onShuffle: () => void;
  onSaveAll: () => void;
};

export default function PlanDayToolbar({
  readyCount,
  totalMeals,
  avgPantryMatch,
  unsavedCount,
  onShuffle,
  onSaveAll,
}: PlanDayToolbarProps) {
  const { colors: themeColors } = useTheme();
  const allReady = readyCount === totalMeals && totalMeals > 0;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.statsChip,
          {
            backgroundColor: allReady
              ? 'rgba(0,168,107,0.1)'
              : 'rgba(255,107,53,0.08)',
            borderColor: allReady
              ? 'rgba(0,168,107,0.25)'
              : 'rgba(255,107,53,0.2)',
          },
        ]}
      >
        <Text
          style={[
            styles.statsText,
            { color: allReady ? colors.green : colors.primary },
          ]}
          numberOfLines={1}
        >
          {allReady
            ? `${totalMeals} meals ready`
            : `${readyCount}/${totalMeals} ready · ${avgPantryMatch}% pantry`}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => {
            void Haptics.selectionAsync();
            onShuffle();
          }}
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: themeColors.white,
              borderColor: themeColors.border,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Shuffle meals for this day"
        >
          <RefreshCw size={15} color={colors.primary} strokeWidth={2.2} />
          <Text style={[styles.actionLabel, { color: themeColors.charcoal }]}>
            Shuffle
          </Text>
        </Pressable>

        {unsavedCount > 0 ? (
          <Pressable
            onPress={() => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onSaveAll();
            }}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.saveBtn,
              { opacity: pressed ? 0.88 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Save all ${unsavedCount} meals`}
          >
            <Bookmark size={15} color={colors.charcoal} strokeWidth={2.2} />
            <Text style={styles.saveLabel}>Save all</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statsChip: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
  },
  statsText: {
    fontFamily: appFonts.bodyBold,
    fontSize: 12,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minHeight: 36,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  actionLabel: {
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  saveLabel: {
    fontFamily: appFonts.bodyBold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.charcoal,
  },
});
