import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import HomeSectionHeader from '@/components/home/HomeSectionHeader';
import type { Recipe } from '@/data/mockRecipes';
import { appFonts } from '@/constants/fonts';
import { colors, radius, spacing } from '@/constants/theme';

type HomeSeasonalRailProps = {
  title: string;
  subtitle: string;
  picks: Recipe[];
};

export default function HomeSeasonalRail({ title, subtitle, picks }: HomeSeasonalRailProps) {
  const router = useRouter();

  if (picks.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title={title} subtitle={subtitle} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {picks.map((recipe) => (
          <Pressable
            key={recipe.id}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            style={styles.card}
          >
            <Text style={styles.title} numberOfLines={2}>
              {recipe.title}
            </Text>
            <Text style={styles.meta}>
              {recipe.region} · {recipe.prepTime} min
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
  card: {
    width: 160,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#F0D4B8',
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.charcoal,
  },
  meta: {
    marginTop: spacing.xs,
    fontFamily: appFonts.body,
    fontSize: 12,
    color: colors.muted,
  },
});
