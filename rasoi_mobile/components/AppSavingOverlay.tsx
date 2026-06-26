import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
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

import RasoiBrandIcon from '@/components/RasoiBrandIcon';
import { colors, spacing } from '@/constants/theme';

type LoadingStep = {
  message: string;
  subtitle?: string;
};

type AppSavingOverlayProps = {
  visible: boolean;
  message?: string;
  subtitle?: string;
  /** When set, cycles through messages while visible (good for multi-step auth). */
  steps?: LoadingStep[];
};

const STEP_INTERVAL_MS = 2400;

function LoadingDot({ delay }: { delay: number }) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        withTiming(0, { duration: delay }),
        withTiming(-5, { duration: 280, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 280, easing: Easing.in(Easing.quad) }),
        withTiming(0, { duration: 560 }),
      ),
      -1,
      false,
    );
  }, [delay, offset]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
    opacity: 0.35 + (1 - Math.abs(offset.value) / 5) * 0.65,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

function LoadingDots() {
  return (
    <View style={styles.dotsRow} accessibilityElementsHidden>
      <LoadingDot delay={0} />
      <LoadingDot delay={120} />
      <LoadingDot delay={240} />
    </View>
  );
}

export default function AppSavingOverlay({
  visible,
  message = 'Saving your preferences…',
  subtitle = 'Just a moment',
  steps,
}: AppSavingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const resolvedSteps = useMemo(() => {
    if (steps && steps.length > 0) return steps;
    return [{ message, subtitle }];
  }, [message, steps, subtitle]);

  const activeStep = resolvedSteps[stepIndex % resolvedSteps.length] ?? resolvedSteps[0];

  const breathe = useSharedValue(1);
  const ringRotation = useSharedValue(0);
  const ringPulse = useSharedValue(0.55);

  useEffect(() => {
    if (!visible) {
      setStepIndex(0);
      return;
    }

    breathe.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    ringRotation.value = withRepeat(
      withTiming(360, { duration: 1800, easing: Easing.linear }),
      -1,
      false,
    );

    ringPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.45, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [breathe, ringPulse, ringRotation, visible]);

  useEffect(() => {
    if (!visible || resolvedSteps.length <= 1) return;

    const timer = setInterval(() => {
      setStepIndex((current) => (current + 1) % resolvedSteps.length);
    }, STEP_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [resolvedSteps.length, visible]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
    opacity: ringPulse.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + ringPulse.value * 0.25,
    transform: [{ scale: 0.92 + ringPulse.value * 0.08 }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.root}>
        <LinearGradient
          colors={['#0A0908', '#12100E', '#0A0908']}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.glowGreen} />
        <View style={styles.glowOrange} />

        <View style={styles.content}>
          <View style={styles.logoStage}>
            <Animated.View style={[styles.logoGlow, glowStyle]} />
            <Animated.View style={[styles.progressRing, ringStyle]} />
            <Animated.View style={logoStyle}>
              <RasoiBrandIcon size={88} borderRadius={22} />
            </Animated.View>
          </View>

          <Animated.View
            key={`step-${stepIndex}`}
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(160)}
            style={styles.copy}
          >
            <Text style={styles.message}>{activeStep.message}</Text>
            {activeStep.subtitle ? (
              <Text style={styles.subtitle}>{activeStep.subtitle}</Text>
            ) : null}
          </Animated.View>

          <LoadingDots />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  glowGreen: {
    position: 'absolute',
    top: '18%',
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,168,107,0.14)',
  },
  glowOrange: {
    position: 'absolute',
    bottom: '20%',
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,107,53,0.12)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  logoStage: {
    width: 148,
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,107,53,0.18)',
  },
  progressRing: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: 'rgba(255,107,53,0.22)',
  },
  copy: {
    alignItems: 'center',
    minHeight: 72,
    paddingHorizontal: spacing.md,
  },
  message: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: colors.dark.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xxl,
    height: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
