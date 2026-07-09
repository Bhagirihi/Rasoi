import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Gauge } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import type { Recipe } from '@/data/mockRecipes';
import { getRecipeImageUrl } from '@/utils/recipeImage';
import { getRecipeVisualIdentity } from '@/utils/recipeVisualIdentity';

export type RecipeVisualBadgeVariant =
  | 'strip'
  | 'banner'
  | 'hero'
  | 'tile'
  | 'backdrop';

type RecipeVisualBadgeProps = {
  recipe: Recipe;
  variant?: RecipeVisualBadgeVariant;
  style?: StyleProp<ViewStyle>;
  /** Dark text on banner (default false = light text on gradient). */
  onLight?: boolean;
  /** Backdrop only: add a light top scrim for nav buttons over photos. */
  topScrim?: boolean;
};

function RecipePhoto({
  uri,
  onError,
  resizeMode = 'cover',
}: {
  uri: string;
  onError: () => void;
  resizeMode?: 'cover' | 'contain';
}) {
  return (
    <Image
      source={{ uri }}
      style={StyleSheet.absoluteFillObject}
      resizeMode={resizeMode}
      onError={onError}
      accessibilityIgnoresInvertColors
    />
  );
}

function DietChip({
  label,
  color,
  style,
}: {
  label: string;
  color: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.dietChip, { borderColor: color }, style]}>
      <View style={[styles.dietChipDot, { backgroundColor: color }]} />
      <Text style={styles.dietChipText}>{label}</Text>
    </View>
  );
}

export default function RecipeVisualBadge({
  recipe,
  variant = 'banner',
  style,
  onLight = false,
  topScrim = false,
}: RecipeVisualBadgeProps) {
  const visual = getRecipeVisualIdentity(recipe);
  const imageUrl = getRecipeImageUrl(recipe);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [recipe.id, recipe.imageUrl]);

  const showImage = Boolean(imageUrl) && !imageFailed;
  const textColor = onLight ? colors.charcoal : colors.white;
  const subColor = onLight ? colors.muted : 'rgba(255,255,255,0.82)';

  if (variant === 'strip') {
    return (
      <View style={[styles.strip, style]}>
        {showImage ? (
          <>
            <RecipePhoto uri={imageUrl!} onError={() => setImageFailed(true)} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.35)']}
              style={StyleSheet.absoluteFillObject}
            />
            <DietChip
              label={visual.dietLabel}
              color={visual.dietColor}
              style={styles.dietChipStrip}
            />
          </>
        ) : (
          <LinearGradient
            colors={visual.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          >
            <DietChip
              label={visual.dietLabel}
              color={visual.dietColor}
              style={styles.dietChipStrip}
            />
            <Text style={styles.stripEmoji}>{visual.emoji}</Text>
            <Text style={styles.stripLabel} numberOfLines={2}>
              {visual.shortCaption}
            </Text>
          </LinearGradient>
        )}
      </View>
    );
  }

  if (variant === 'hero') {
    return (
      <View style={[styles.hero, style]}>
        {showImage ? (
          <>
            <RecipePhoto uri={imageUrl!} onError={() => setImageFailed(true)} />
            <LinearGradient
              colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.42)']}
              style={StyleSheet.absoluteFillObject}
            />
            <DietChip
              label={visual.dietLabel}
              color={visual.dietColor}
              style={styles.dietChipHero}
            />
          </>
        ) : (
          <LinearGradient
            colors={visual.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          >
            <DietChip
              label={visual.dietLabel}
              color={visual.dietColor}
              style={styles.dietChipHero}
            />
            <Text style={styles.heroEmoji}>{visual.emoji}</Text>
            <Text style={styles.heroFallbackCaption} numberOfLines={1}>
              {visual.kitchenLabel}
            </Text>
          </LinearGradient>
        )}
      </View>
    );
  }

  if (variant === 'tile') {
    return (
      <View style={[styles.tile, style]}>
        {showImage ? (
          <>
            <RecipePhoto uri={imageUrl!} onError={() => setImageFailed(true)} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.65)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.dietDot, styles.dietDotTile, { backgroundColor: visual.dietColor }]} />
            <Text style={styles.tileCaption} numberOfLines={1}>
              {visual.shortCaption}
            </Text>
          </>
        ) : (
          <LinearGradient
            colors={visual.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          >
            <View style={[styles.dietDot, styles.dietDotTile, { backgroundColor: visual.dietColor }]} />
            <Text style={styles.tileEmoji}>{visual.emoji}</Text>
            <Text style={styles.tileCaption} numberOfLines={1}>
              {visual.shortCaption}
            </Text>
          </LinearGradient>
        )}
      </View>
    );
  }

  if (variant === 'backdrop') {
    return (
      <View style={[styles.backdrop, style]}>
        {showImage ? (
          <>
            <RecipePhoto uri={imageUrl!} onError={() => setImageFailed(true)} />
            {topScrim ? (
              <LinearGradient
                colors={['rgba(0,0,0,0.55)', 'transparent']}
                style={styles.backdropTopScrim}
              />
            ) : null}
          </>
        ) : (
          <LinearGradient
            colors={visual.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          >
            <Text style={styles.backdropEmoji}>{visual.emoji}</Text>
          </LinearGradient>
        )}
      </View>
    );
  }

  if (variant === 'banner') {
    return (
      <View style={[styles.banner, style]}>
        {showImage ? (
          <>
            <RecipePhoto uri={imageUrl!} onError={() => setImageFailed(true)} />
            <LinearGradient
              colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.78)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </>
        ) : (
          <LinearGradient
            colors={visual.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {!showImage ? (
          <Text style={styles.bannerEmoji}>{visual.emoji}</Text>
        ) : null}
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
      </View>
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
    width: 104,
    alignSelf: 'stretch',
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
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
    color: 'rgba(255,255,255,0.95)',
  },
  hero: {
    minHeight: 136,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 52,
    lineHeight: 58,
    opacity: 0.9,
  },
  heroFallbackCaption: {
    marginTop: spacing.xs,
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: 0.2,
  },
  tile: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
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
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    overflow: 'hidden',
  },
  bannerEmoji: {
    fontSize: 36,
    lineHeight: 42,
    zIndex: 1,
  },
  bannerCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    zIndex: 1,
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
    zIndex: 1,
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
    zIndex: 2,
  },
  dietDotTile: {
    top: 6,
    right: 6,
  },
  dietChip: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  dietChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dietChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.2,
  },
  dietChipStrip: {
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  dietChipHero: {
    top: spacing.md,
    left: spacing.md,
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
    overflow: 'hidden',
  },
  backdropTopScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 120,
  },
  backdropEmoji: {
    fontSize: 88,
    lineHeight: 96,
    opacity: 0.28,
  },
});
