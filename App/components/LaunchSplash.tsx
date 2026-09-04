import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import RasoiBrandIcon from '@/components/RasoiBrandIcon';
import RasoiWordmark from '@/components/RasoiWordmark';
import SplashFoodCollage from '@/components/SplashFoodCollage';
import { colors, spacing } from '@/constants/theme';

/** Minimum branded splash — dismiss early once app is ready (see _layout). */
export const LAUNCH_SPLASH_MIN_MS = 900;
/** Hard cap so cold start never feels stuck on splash. */
export const LAUNCH_SPLASH_MAX_MS = 1800;
/** Fade-out before unmount — avoids Reanimated/Fabric crashes on abrupt teardown. */
export const LAUNCH_SPLASH_EXIT_MS = 220;

type LaunchSplashProps = {
  dismissing?: boolean;
  onDismissed?: () => void;
};

export default function LaunchSplash({ dismissing = false, onDismissed }: LaunchSplashProps) {
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0.6);
  const rootOpacity = useSharedValue(1);

  const handleDismissed = useCallback(() => {
    onDismissed?.();
  }, [onDismissed]);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.96, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.55, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(rootOpacity);
    };
  }, [opacity, rootOpacity, scale]);

  useEffect(() => {
    if (!dismissing) return;

    cancelAnimation(scale);
    cancelAnimation(opacity);
    rootOpacity.value = withTiming(
      0,
      { duration: LAUNCH_SPLASH_EXIT_MS, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished) {
          runOnJS(handleDismissed)();
        }
      },
    );

    const fallback = setTimeout(() => {
      handleDismissed();
    }, LAUNCH_SPLASH_EXIT_MS + 300);

    return () => clearTimeout(fallback);
  }, [dismissing, handleDismissed, opacity, rootOpacity, scale]);

  const rootStyle = useAnimatedStyle(() => ({
    opacity: rootOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.root, rootStyle]} pointerEvents={dismissing ? 'none' : 'auto'}>
      <LinearGradient
        colors={['#0A0908', '#0F1210', '#0A0908']}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.glowGreen} />
      <View style={styles.glowOrange} />
      <SplashFoodCollage variant="fullscreen" />

      <View style={styles.center}>
        <Animated.View style={[styles.ringOuter, ringStyle]} />
        <Animated.View style={[styles.ringInner, ringStyle]} />

        <Animated.View style={iconStyle}>
          <RasoiBrandIcon size={120} borderRadius={28} />
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <RasoiWordmark size="splash" />
        <View style={styles.brandAccent} />
        <Text style={styles.tagline}>Loading your kitchen…</Text>
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dark.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  glowGreen: {
    position: 'absolute',
    right: -60,
    bottom: 160,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(0,168,107,0.12)',
  },
  glowOrange: {
    position: 'absolute',
    left: -80,
    top: 120,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,107,53,0.1)',
  },
  center: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  ringOuter: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.2)',
  },
  ringInner: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  footer: {
    position: 'absolute',
    bottom: 72,
    alignItems: 'center',
    gap: spacing.sm,
    zIndex: 2,
  },
  brandAccent: {
    height: 2,
    width: 40,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textMuted,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 18,
  },
});
