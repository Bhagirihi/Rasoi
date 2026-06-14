import { useEffect, useState, type ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const OPEN_MS = 340;
const CLOSE_MS = 280;
const SLIDE_OFFSET = 420;

const openEase = Easing.out(Easing.cubic);
const closeEase = Easing.in(Easing.cubic);

export interface SmoothModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: 'sheet' | 'center';
  dismissOnBackdrop?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function SmoothModal({
  visible,
  onClose,
  children,
  variant = 'sheet',
  dismissOnBackdrop = true,
  contentStyle,
}: SmoothModalProps) {
  const [mounted, setMounted] = useState(visible);
  const backdrop = useSharedValue(0);
  const slideY = useSharedValue(SLIDE_OFFSET);
  const scale = useSharedValue(0.94);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!mounted) return;

    if (visible) {
      backdrop.value = withTiming(1, { duration: OPEN_MS, easing: openEase });

      if (variant === 'sheet') {
        slideY.value = SLIDE_OFFSET;
        slideY.value = withTiming(0, { duration: OPEN_MS, easing: openEase });
      } else {
        scale.value = 0.94;
        cardOpacity.value = 0;
        scale.value = withTiming(1, { duration: OPEN_MS, easing: openEase });
        cardOpacity.value = withTiming(1, { duration: OPEN_MS, easing: openEase });
      }
      return;
    }

    backdrop.value = withTiming(0, { duration: CLOSE_MS, easing: closeEase });

    const finishClose = (finished?: boolean) => {
      'worklet';
      if (finished) {
        runOnJS(setMounted)(false);
      }
    };

    if (variant === 'sheet') {
      slideY.value = withTiming(SLIDE_OFFSET, { duration: CLOSE_MS, easing: closeEase }, finishClose);
    } else {
      scale.value = withTiming(0.96, { duration: CLOSE_MS, easing: closeEase });
      cardOpacity.value = withTiming(0, { duration: CLOSE_MS, easing: closeEase }, finishClose);
    }
  }, [visible, mounted, variant, backdrop, slideY, scale, cardOpacity]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value * 0.55,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const centerStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!mounted) {
    return null;
  }

  const isSheet = variant === 'sheet';

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.root, isSheet ? styles.rootSheet : styles.rootCenter]}>
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, styles.backdrop, backdropStyle]}
        />

        {dismissOnBackdrop ? (
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={onClose}
            accessibilityLabel="Close dialog"
            accessibilityRole="button"
          />
        ) : null}

        <Animated.View
          style={[
            isSheet ? styles.sheetContainer : styles.centerContainer,
            isSheet ? sheetStyle : centerStyle,
            contentStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootSheet: {
    justifyContent: 'flex-end',
  },
  rootCenter: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backdrop: {
    backgroundColor: '#1A1A2E',
  },
  sheetContainer: {
    width: '100%',
  },
  centerContainer: {
    width: '100%',
  },
});
