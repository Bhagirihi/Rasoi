import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import HomeSectionHeader from '@/components/home/HomeSectionHeader';
import type { Recipe } from '@/data/mockRecipes';
import { appFonts } from '@/constants/fonts';
import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type HomeSeasonalRailProps = {
  title: string;
  subtitle: string;
  picks: Recipe[];
};

export default function HomeSeasonalRail({ title, subtitle, picks }: HomeSeasonalRailProps) {
  const router = useRouter();
  const { colors: themeColors, isDark } = useTheme();

  if (picks.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title={title} subtitle={subtitle} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {picks.map((recipe) => (
          <Pressable
            key={recipe.id}
            onPress={() => router.push(`/recipe/${recipe.id}`)}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? themeColors.white : '#FFF8F0',
                borderColor: isDark ? themeColors.border : '#F0D4B8',
              },
            ]}
          >
            <Text style={[styles.title, { color: themeColors.charcoal }]} numberOfLines={2}>
              {recipe.title}
            </Text>
            <Text style={[styles.meta, { color: themeColors.muted }]}>
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
    borderWidth: 1,
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
  },
  meta: {
    marginTop: spacing.xs,
    fontFamily: appFonts.body,
    fontSize: 12,
  },
});
