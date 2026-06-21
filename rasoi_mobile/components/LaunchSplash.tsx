import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import RasoiBrandIcon from '@/components/RasoiBrandIcon';
import SplashFoodCollage from '@/components/SplashFoodCollage';
import { colors, spacing } from '@/constants/theme';

export const LAUNCH_SPLASH_DURATION_MS = 2600;

export default function LaunchSplash() {
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0.6);

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
  }, [opacity, scale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.root}>
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
        <Text style={styles.brand}>Rasoi</Text>
        <Text style={styles.tagline}>Loading your kitchen…</Text>
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
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
  brand: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.primary,
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
