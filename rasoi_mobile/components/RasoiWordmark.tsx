import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { appFonts } from '@/constants/fonts';
import { colors } from '@/constants/theme';

type RasoiWordmarkSize = 'bar' | 'hero' | 'splash';

const SIZE_STYLES: Record<
  RasoiWordmarkSize,
  { fontSize: number; lineHeight: number; letterSpacing: number }
> = {
  /** Matches Home / tab headers — shared bridge into the light app. */
  bar: { fontSize: 13, lineHeight: 16, letterSpacing: 2 },
  /** Login / register under the app icon. */
  hero: { fontSize: 15, lineHeight: 20, letterSpacing: 2 },
  /** Launch splash only. */
  splash: { fontSize: 18, lineHeight: 24, letterSpacing: 2.5 },
};

type RasoiWordmarkProps = {
  size?: RasoiWordmarkSize;
  style?: StyleProp<TextStyle>;
};

/**
 * Single Rasoi wordmark used on dark auth and light tabs.
 * Keep weight, tracking, and primary orange identical across the funnel.
 */
export default function RasoiWordmark({ size = 'bar', style }: RasoiWordmarkProps) {
  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="Rasoi"
      style={[styles.base, SIZE_STYLES[size], style]}
    >
      RASOI
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: appFonts.bodyBold,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
  },
});
