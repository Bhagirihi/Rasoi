import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Gauge } from 'lucide-react-native';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import type { Recipe } from '@/data/mockRecipes';
import { getRecipeVisualIdentity } from '@/utils/recipeVisualIdentity';

export type RecipeVisualBadgeVariant = 'strip' | 'banner' | 'tile' | 'backdrop';

type RecipeVisualBadgeProps = {
  recipe: Recipe;
  variant?: RecipeVisualBadgeVariant;
  style?: StyleProp<ViewStyle>;
  /** Dark text on banner (default false = light text on gradient). */
  onLight?: boolean;
};

export default function RecipeVisualBadge({
  recipe,
  variant = 'banner',
  style,
  onLight = false,
}: RecipeVisualBadgeProps) {
  const visual = getRecipeVisualIdentity(recipe);
  const textColor = onLight ? colors.charcoal : colors.white;
  const subColor = onLight ? colors.muted : 'rgba(255,255,255,0.82)';

  if (variant === 'strip') {
    return (
      <LinearGradient
        colors={visual.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.strip, style]}
      >
        <View style={[styles.dietDot, { backgroundColor: visual.dietColor }]} />
        <Text style={styles.stripEmoji}>{visual.emoji}</Text>
        <Text style={styles.stripLabel} numberOfLines={2}>
          {visual.shortCaption}
        </Text>
      </LinearGradient>
    );
  }

  if (variant === 'tile') {
    return (
      <LinearGradient
        colors={visual.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.tile, style]}
      >
        <View style={[styles.dietDot, styles.dietDotTile, { backgroundColor: visual.dietColor }]} />
        <Text style={styles.tileEmoji}>{visual.emoji}</Text>
        <Text style={styles.tileCaption} numberOfLines={1}>
          {visual.shortCaption}
        </Text>
      </LinearGradient>
    );
  }

  if (variant === 'backdrop') {
    return (
      <LinearGradient
        colors={visual.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.backdrop, style]}
      >
        <Text style={styles.backdropEmoji}>{visual.emoji}</Text>
        <View style={[styles.dietDot, styles.backdropDiet, { backgroundColor: visual.dietColor }]} />
      </LinearGradient>
    );
  }

  if (variant === 'banner') {
    return (
      <LinearGradient
        colors={visual.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.banner, style]}
      >
        <Text style={styles.bannerEmoji}>{visual.emoji}</Text>
        <View style={styles.bannerCopy}>
          <Text style={[styles.bannerKitchen, { color: textColor }]} numberOfLines={1}>
            {visual.kitchenLabel}
          </Text>
          <Text style={[styles.bannerMeta, { color: subColor }]} numberOfLines={1}>
            {visual.mood} · {visual.dietLabel}
          </Text>
        </View>
        <View style={styles.bannerPills}>
          <View style={[styles.pill, { borderColor: visual.dietColor }]}>
            <View style={[styles.pillDot, { backgroundColor: visual.dietColor }]} />
            <Text style={[styles.pillText, { color: textColor }]}>{visual.dietLabel}</Text>
          </View>
          <View style={styles.pillMuted}>
            <Clock size={11} color={subColor} />
            <Text style={[styles.pillText, { color: subColor }]}>{recipe.prepTime}m</Text>
          </View>
          <View style={styles.pillMuted}>
            <Gauge size={11} color={subColor} />
            <Text style={[styles.pillText, { color: subColor }]}>{recipe.difficulty}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return null;
}

type RecipeTagChipsProps = {
  recipe: Recipe;
};

export function RecipeTagChips({ recipe }: RecipeTagChipsProps) {
  const visual = getRecipeVisualIdentity(recipe);
  if (visual.tagLabels.length === 0) return null;

  return (
    <View style={styles.tagRow}>
      {visual.tagLabels.map((label) => (
        <View key={label} style={[styles.tagChip, { borderColor: visual.accent }]}>
          <Text style={[styles.tagChipText, { color: visual.accent }]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    width: 92,
    alignSelf: 'stretch',
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    borderTopLeftRadius: radius.lg - 1,
    borderBottomLeftRadius: radius.lg - 1,
  },
  stripEmoji: {
    fontSize: 32,
    lineHeight: 38,
  },
  stripLabel: {
    marginTop: spacing.xs,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
  },
  tile: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileEmoji: {
    fontSize: 30,
    lineHeight: 36,
  },
  tileCaption: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  banner: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  bannerEmoji: {
    fontSize: 36,
    lineHeight: 42,
  },
  bannerCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  bannerKitchen: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  bannerMeta: {
    fontSize: 12,
    fontWeight: '600',
  },
  bannerPills: {
    alignItems: 'flex-end',
    gap: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  pillMuted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dietDot: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  dietDotTile: {
    top: 6,
    right: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tagChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,107,53,0.06)',
  },
  tagChipText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdropEmoji: {
    fontSize: 88,
    lineHeight: 96,
    opacity: 0.28,
  },
  backdropDiet: {
    top: spacing.lg,
    right: spacing.lg,
  },
});
