import * as Haptics from 'expo-haptics';
import { ChevronRight, UtensilsCrossed } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

type PlanRecipesLinkProps = {
  recipeCount: number;
  onPress: () => void;
};

export default function PlanRecipesLink({ recipeCount, onPress }: PlanRecipesLinkProps) {
  const { colors: themeColors } = useTheme();
  const subtitle =
    recipeCount > 0 ? `${recipeCount} recipes to explore` : 'Search the full catalog';

  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        shadows.card,
        {
          backgroundColor: themeColors.white,
          borderColor: themeColors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Browse all recipes"
    >
      <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,107,53,0.1)' }]}>
        <UtensilsCrossed size={18} color={colors.primary} strokeWidth={2.2} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: themeColors.charcoal }]} numberOfLines={1}>
          All recipes
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.muted }]} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 72,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: appFonts.bodyBold,
    fontSize: 14,
    lineHeight: 18,
  },
  subtitle: {
    fontFamily: appFonts.body,
    fontSize: 11,
    lineHeight: 15,
  },
});
