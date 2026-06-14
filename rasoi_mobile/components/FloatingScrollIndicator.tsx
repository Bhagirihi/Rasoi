import { ChevronDown } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, shadows, spacing } from '@/constants/theme';

interface FloatingScrollIndicatorProps {
  visible: boolean;
  bottomOffset?: number;
  label?: string;
}

export default function FloatingScrollIndicator({
  visible,
  bottomOffset = 0,
  label = 'Scroll',
}: FloatingScrollIndicatorProps) {
  const bounce = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    bounce.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 650, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 650, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.82, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      false,
    );
  }, [visible, bounce, pulse]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(180)}
      pointerEvents="none"
      style={[styles.wrap, { bottom: bottomOffset + spacing.lg }]}
    >
      <Animated.View style={[styles.pill, pillStyle, shadows.cta]}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotDim]} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotDim]} />
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={18} color={colors.white} strokeWidth={2.5} />
        </Animated.View>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  dots: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  dotDim: {
    opacity: 0.45,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: colors.white,
  },
});
