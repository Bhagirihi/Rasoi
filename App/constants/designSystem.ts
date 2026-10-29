import { colors, layout, radius, shadows, spacing } from '@/constants/theme';

/** Minimum touch target per Apple HIG / WCAG mobile guidance. */
export const MIN_TOUCH_TARGET = 44;

export const semanticColors = {
  light: {
    primary: colors.primary,
    primarySoft: '#FFF0EA',
    primaryStrong: '#C44A00',
    secondary: colors.saffron,
    accent: colors.green,
    success: colors.green,
    warning: '#F59E0B',
    error: colors.danger,
    bg: colors.cream,
    surface: colors.white,
    surfaceMuted: '#F3F4F6',
    border: colors.border,
    text: colors.charcoal,
    textSecondary: colors.muted,
    textInverse: colors.white,
    overlay: 'rgba(26, 26, 46, 0.55)',
  },
  dark: {
    primary: colors.primary,
    primarySoft: colors.dark.accentOrange,
    primaryStrong: '#FF8F66',
    secondary: colors.saffron,
    accent: colors.green,
    success: colors.green,
    warning: '#FBBF24',
    error: '#F87171',
    bg: colors.dark.bg,
    surface: colors.dark.card,
    surfaceMuted: colors.dark.surface,
    border: 'rgba(245, 240, 232, 0.12)',
    text: colors.dark.text,
    textSecondary: colors.dark.textMuted,
    textInverse: colors.charcoal,
    overlay: 'rgba(0, 0, 0, 0.65)',
  },
} as const;

export type ColorScheme = keyof typeof semanticColors;

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800' as const,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;

export const designSystem = {
  colors: semanticColors.light,
  spacing,
  radius,
  layout: {
    ...layout,
    screenPadding: 20,
  },
  shadows,
  typography,
  touchTarget: MIN_TOUCH_TARGET,
} as const;
