import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import HomeSectionHeader from '@/components/home/HomeSectionHeader';
import type { Recipe } from '@/data/mockRecipes';
import { fetchRecentCooks } from '@/services/recommendations';
import { appFonts } from '@/constants/fonts';
import { colors, radius, spacing } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

export default function HomeRecentCooks() {
  const router = useRouter();
  const { isLoggedIn } = useAppContext();
  const [items, setItems] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      return;
    }
    void fetchRecentCooks(8)
      .then((rows) => setItems(rows.map((row) => row.recipe)))
      .catch(() => setItems([]));
  }, [isLoggedIn]);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Cook again" subtitle="Dishes you made recently" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((recipe) => (
          <Pressable
            key={recipe.id}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            style={styles.chip}
          >
            <Text style={styles.chipTitle} numberOfLines={2}>
              {recipe.title}
            </Text>
            <Text style={styles.chipMeta}>{recipe.prepTime} min</Text>
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EDE6DC',
  },
  chipTitle: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.charcoal,
  },
  chipMeta: {
    marginTop: spacing.xs,
    fontFamily: appFonts.body,
    fontSize: 12,
    color: colors.muted,
  },
});
