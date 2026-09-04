import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import HomeSectionHeader from '@/components/home/HomeSectionHeader';
import type { Recipe } from '@/data/mockRecipes';
import { fetchRecentCooks } from '@/services/recommendations';
import { appFonts } from '@/constants/fonts';
import { radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

export default function HomeRecentCooks() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const { isLoggedIn, planLimits } = useAppContext();
  const [items, setItems] = useState<Recipe[]>([]);
  const limit = planLimits.recentCooksLimit;

  useEffect(() => {
    if (!isLoggedIn || limit <= 0) {
      setItems([]);
      return;
    }
    void fetchRecentCooks(limit)
      .then((rows) => setItems(rows.map((row) => row.recipe)))
      .catch(() => setItems([]));
  }, [isLoggedIn, limit]);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Cook again" subtitle="Dishes you made recently" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((recipe) => (
          <Pressable
            key={recipe.id}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            style={[
              styles.chip,
              {
                backgroundColor: themeColors.white,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text style={[styles.chipTitle, { color: themeColors.charcoal }]} numberOfLines={2}>
              {recipe.title}
            </Text>
            <Text style={[styles.chipMeta, { color: themeColors.muted }]}>
              {recipe.prepTime} min
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { gap: spacing.sm, paddingRight: spacing.md },
  chip: {
    width: 148,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  chipTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
  },
  chipMeta: {
    marginTop: spacing.xs,
    fontFamily: appFonts.body,
    fontSize: 12,
  },
});
