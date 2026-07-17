import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppToast } from '@/context/AppToastContext';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { appFonts } from '@/constants/fonts';
import { testIds } from '@/constants/testIds';

export default function AppToastHost() {
  const { message } = useAppToast();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setDisplayed(message);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (!displayed) return;
    Animated.timing(opacity, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setDisplayed(null);
    });
  }, [message, displayed, opacity]);

  if (!displayed) return null;

  return (
    <Animated.View
      pointerEvents="none"
      testID={testIds.appToast}
      accessibilityRole="alert"
      style={[
        styles.wrap,
        {
          opacity,
          bottom: Math.max(insets.bottom, spacing.md) + spacing.lg,
        },
      ]}
    >
      <Text style={styles.text}>{displayed}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
    backgroundColor: colors.charcoal,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...shadows.card,
  },
  text: {
    fontFamily: appFonts.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
});
