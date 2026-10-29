import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/context/ThemeContext';

type ShimmerProps = {
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

export function Shimmer({ style, borderRadius = 8 }: ShimmerProps) {
  const { colors: themeColors, isDark } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      -1,
      false,
    );
  }, [progress]);

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -120 + progress.value * 240 }],
  }));

  const baseColor = isDark ? 'rgba(255,255,255,0.08)' : themeColors.border;
  const highlightColor = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.85)';

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: baseColor, borderRadius },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.highlight,
          { backgroundColor: highlightColor, borderRadius },
          highlightStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    opacity: 0.9,
  },
});
