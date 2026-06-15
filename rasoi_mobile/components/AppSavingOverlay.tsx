import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, spacing } from '@/constants/theme';

const splashIcon = require('../assets/images/splash-icon.png');

type AppSavingOverlayProps = {
  visible: boolean;
  message?: string;
  subtitle?: string;
};

export default function AppSavingOverlay({
  visible,
  message = 'Saving your preferences…',
  subtitle = 'Just a moment',
}: AppSavingOverlayProps) {
  const scale = useSharedValue(0.94);
  const ringOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (!visible) return;

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
  }, [ringOpacity, scale, visible]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <LinearGradient
          colors={['rgba(10,9,8,0.92)', 'rgba(15,18,16,0.94)', 'rgba(10,9,8,0.92)']}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.card}>
          <Animated.View style={[styles.ringOuter, ringStyle]} />
          <Animated.View style={[styles.ringInner, ringStyle]} />

          <Animated.View style={iconStyle}>
            <Image source={splashIcon} style={styles.icon} resizeMode="contain" />
          </Animated.View>

          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
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
  },
  ringOuter: {
    position: 'absolute',
    top: 28,
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.35)',
  },
  ringInner: {
    position: 'absolute',
    top: 44,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  icon: {
    width: 88,
    height: 88,
    borderRadius: 22,
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
    gap: 8,
    marginTop: spacing.lg,
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
