import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import {
  semanticColors,
  typography,
  type ColorScheme,
  type TypographyVariant,
} from '@/constants/designSystem';
import { useTheme } from '@/context/ThemeContext';

type TextColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'inverse';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: TextColor;
  scheme?: ColorScheme;
  align?: 'left' | 'center' | 'right';
}

const COLOR_KEY: Record<TextColor, keyof (typeof semanticColors)['light']> = {
  primary: 'text',
  secondary: 'textSecondary',
  accent: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  inverse: 'textInverse',
};

export default function Text({
  variant = 'body',
  color = 'primary',
  scheme,
  align = 'left',
  style,
  maxFontSizeMultiplier = 1.4,
  ...rest
}: TextProps) {
  const { colorScheme } = useTheme();
  const activeScheme = scheme ?? colorScheme;
  const palette = semanticColors[activeScheme];
  const tone = palette[COLOR_KEY[color]];

  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[
        typography[variant],
        { color: tone, textAlign: align },
        variant === 'eyebrow' && styles.eyebrow,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    textTransform: 'uppercase',
  },
});
