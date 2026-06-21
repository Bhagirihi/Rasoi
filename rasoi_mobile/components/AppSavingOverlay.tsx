import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, spacing } from '@/constants/theme';
import RasoiBrandIcon from '@/components/RasoiBrandIcon';
import SplashFoodCollage from '@/components/SplashFoodCollage';

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

const STEP_INTERVAL_MS = 2200;

function AnimatedDot({ active }: { active: boolean }) {
  const width = useSharedValue(active ? 18 : 7);
  const opacity = useSharedValue(active ? 1 : 0.35);

  useEffect(() => {
    width.value = withTiming(active ? 18 : 7, { duration: 280, easing: Easing.out(Easing.quad) });
    opacity.value = withTiming(active ? 1 : 0.35, { duration: 280 });
  }, [active, opacity, width]);

  const style = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, style, active && styles.dotActive]} />;
}

export default function AppSavingOverlay({
  visible,
  message = 'Saving your preferences…',
  subtitle = 'Just a moment',
  steps,
}: AppSavingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [dotIndex, setDotIndex] = useState(0);

  const resolvedSteps = useMemo(() => {
    if (steps && steps.length > 0) return steps;
    return [{ message, subtitle }];
  }, [message, steps, subtitle]);

  const activeStep = resolvedSteps[stepIndex % resolvedSteps.length] ?? resolvedSteps[0];

  const scale = useSharedValue(0.94);
  const ringOpacity = useSharedValue(0.5);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      setStepIndex(0);
      setDotIndex(0);
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.96, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.45, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 2400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [ringOpacity, rotation, scale, visible]);

  useEffect(() => {
    if (!visible || resolvedSteps.length <= 1) return;

    const timer = setInterval(() => {
      setStepIndex((current) => (current + 1) % resolvedSteps.length);
    }, STEP_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [resolvedSteps.length, visible]);

  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setDotIndex((current) => (current + 1) % 3);
    }, 450);

    return () => clearInterval(timer);
  }, [visible]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <LinearGradient
          colors={['rgba(10,9,8,0.92)', 'rgba(15,18,16,0.94)', 'rgba(10,9,8,0.92)']}
          style={StyleSheet.absoluteFillObject}
        />
        <SplashFoodCollage variant="fullscreen" />

        <View style={styles.card}>
          <View style={styles.logoStage}>
            <SplashFoodCollage variant="card" />
            <Animated.View style={[styles.ringOuter, ringStyle]} />
            <Animated.View style={[styles.ringInner, ringStyle]} />
            <Animated.View style={[styles.spinnerArc, spinnerStyle]} />

            <Animated.View style={iconStyle}>
              <RasoiBrandIcon size={80} borderRadius={18} />
            </Animated.View>
          </View>

          <Text style={styles.message} key={`msg-${stepIndex}`}>
            {activeStep.message}
          </Text>
          {activeStep.subtitle ? (
            <Text style={styles.subtitle} key={`sub-${stepIndex}`}>
              {activeStep.subtitle}
            </Text>
          ) : null}

          <View style={styles.dotsRow}>
            {[0, 1, 2].map((index) => (
              <AnimatedDot key={index} active={index === dotIndex} />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    zIndex: 2,
    overflow: 'visible',
  },
  logoStage: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  ringOuter: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.35)',
  },
  ringInner: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  spinnerArc: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: 'rgba(255,107,53,0.25)',
  },
  message: {
    marginTop: spacing.xl,
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark.textMuted,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.lg,
    height: 10,
  },
  dot: {
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});
