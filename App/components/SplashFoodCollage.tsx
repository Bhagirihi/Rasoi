import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { SPLASH_DISHES } from '@/constants/splashDishes';
import { colors } from '@/constants/theme';

type CollageVariant = 'fullscreen' | 'card';

type TileLayout = {
  top?: number | `${number}%`;
  left?: number | `${number}%`;
  right?: number | `${number}%`;
  bottom?: number | `${number}%`;
  size: number;
  rotate: string;
  delay: number;
};

const FULLSCREEN_TILES: TileLayout[] = [
  { top: '8%', left: '4%', size: 88, rotate: '-8deg', delay: 0 },
  { top: '14%', right: '2%', size: 96, rotate: '10deg', delay: 120 },
  { top: '38%', left: '-2%', size: 72, rotate: '6deg', delay: 240 },
  { top: '42%', right: '-4%', size: 80, rotate: '-12deg', delay: 360 },
  { bottom: '22%', left: '6%', size: 76, rotate: '14deg', delay: 480 },
  { bottom: '18%', right: '5%', size: 92, rotate: '-6deg', delay: 600 },
];

const CARD_TILES: TileLayout[] = [
  { top: -8, left: -28, size: 52, rotate: '-10deg', delay: 0 },
  { top: -4, right: -32, size: 48, rotate: '12deg', delay: 150 },
  { bottom: 8, left: -24, size: 44, rotate: '8deg', delay: 300 },
  { bottom: 4, right: -26, size: 50, rotate: '-14deg', delay: 450 },
];

function FloatingDishTile({
  dish,
  layout,
  variant,
}: {
  dish: (typeof SPLASH_DISHES)[number];
  layout: TileLayout;
  variant: CollageVariant;
}) {
  const drift = useSharedValue(0);
  const opacity = useSharedValue(variant === 'fullscreen' ? 0.55 : 0.85);

  useEffect(() => {
    drift.value = withDelay(
      layout.delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(6, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
    opacity.value = withDelay(
      layout.delay,
      withRepeat(
        withSequence(
          withTiming(variant === 'fullscreen' ? 0.72 : 1, { duration: 1600 }),
          withTiming(variant === 'fullscreen' ? 0.45 : 0.75, { duration: 1600 }),
        ),
        -1,
        true,
      ),
    );

    return () => {
      cancelAnimation(drift);
      cancelAnimation(opacity);
    };
  }, [drift, layout.delay, opacity, variant]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: drift.value }, { rotate: layout.rotate }],
    opacity: opacity.value,
  }));

  const positionStyle = {
    top: layout.top,
    left: layout.left,
    right: layout.right,
    bottom: layout.bottom,
  };

  return (
    <Animated.View
      style={[
        styles.tile,
        positionStyle,
        { width: layout.size, height: layout.size, borderRadius: layout.size * 0.22 },
        animatedStyle,
      ]}
    >
      <Image source={{ uri: dish.uri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={styles.tileOverlay} />
      {variant === 'card' ? (
        <Text style={styles.tileLabel} numberOfLines={1}>
          {dish.label}
        </Text>
      ) : null}
    </Animated.View>
  );
}

function FeaturedDish({ variant }: { variant: CollageVariant }) {
  const [index, setIndex] = useState(0);
  const fade = useSharedValue(1);

  useEffect(() => {
    if (variant !== 'fullscreen') return;

    const timer = setInterval(() => {
      fade.value = withSequence(
        withTiming(0, { duration: 350 }),
        withTiming(1, { duration: 450 }),
      );
      setTimeout(() => {
        setIndex((current) => (current + 1) % SPLASH_DISHES.length);
      }, 350);
    }, 2800);

    return () => {
      clearInterval(timer);
      cancelAnimation(fade);
    };
  }, [fade, variant]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value * 0.38 }));
  const dish = SPLASH_DISHES[index] ?? SPLASH_DISHES[0];

  if (variant !== 'fullscreen') return null;

  return (
    <Animated.View style={[styles.featuredWrap, fadeStyle]}>
      <Image source={{ uri: dish.uri }} style={styles.featuredImage} resizeMode="cover" />
      <View style={styles.featuredScrim} />
      <Text style={styles.featuredLabel}>{dish.label}</Text>
    </Animated.View>
  );
}

export default function SplashFoodCollage({ variant = 'fullscreen' }: { variant?: CollageVariant }) {
  const tiles = variant === 'fullscreen' ? FULLSCREEN_TILES : CARD_TILES;
  const dishes = variant === 'fullscreen' ? SPLASH_DISHES : SPLASH_DISHES.slice(0, 4);

  return (
    <View style={variant === 'fullscreen' ? styles.fullscreenRoot : styles.cardRoot} pointerEvents="none">
      {variant === 'fullscreen' ? <FeaturedDish variant={variant} /> : null}
      {dishes.map((dish, index) => (
        <FloatingDishTile
          key={dish.label}
          dish={dish}
          layout={tiles[index % tiles.length]!}
          variant={variant}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenRoot: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  cardRoot: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
  },
  tile: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,9,8,0.08)',
  },
  tileLabel: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 4,
    fontSize: 9,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featuredWrap: {
    position: 'absolute',
    top: '26%',
    width: '76%',
    alignSelf: 'center',
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,9,8,0.55)',
  },
  featuredLabel: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.4,
  },
});
