import { CalendarClock } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { Recipe } from '@/data/mockRecipes';

type HomePlanTomorrowProps = {
  lateNightPick?: Recipe;
  tomorrowPick?: Recipe;
  onRecipePress: (recipe: Recipe) => void;
};

export default function HomePlanTomorrow({
  lateNightPick,
  tomorrowPick,
  onRecipePress,
}: HomePlanTomorrowProps) {
  const { colors: themeColors } = useTheme();
  if (!lateNightPick && !tomorrowPick) return null;

  return (
    <View style={[styles.card, { backgroundColor: themeColors.white, borderColor: themeColors.border }]}>
      <View style={styles.header}>
        <CalendarClock size={18} color={colors.saffron} />
        <Text style={[styles.title, { color: themeColors.charcoal }]}>Plan for tomorrow</Text>
      </View>
      {lateNightPick ? (
        <Pressable onPress={() => onRecipePress(lateNightPick)} style={styles.row}>
          <Text style={[styles.eyebrow, { color: themeColors.muted }]}>Tonight snack</Text>
          <Text style={[styles.recipeTitle, { color: themeColors.charcoal }]}>{lateNightPick.title}</Text>
        </Pressable>
      ) : null}
      {tomorrowPick ? (
        <Pressable onPress={() => onRecipePress(tomorrowPick)} style={styles.row}>
          <Text style={[styles.eyebrow, { color: themeColors.muted }]}>Tomorrow breakfast</Text>
          <Text style={[styles.recipeTitle, { color: themeColors.charcoal }]}>{tomorrowPick.title}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    paddingVertical: spacing.xs,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
  },
  recipeTitle: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '600',
  },
});
