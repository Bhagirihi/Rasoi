import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { semanticColors, type ColorScheme } from '@/constants/designSystem';
import { colors as brandColors } from '@/constants/theme';

const APPEARANCE_KEY = '@rasoi/appearance';

export type AppColors = {
  primary: string;
  green: string;
  cream: string;
  saffron: string;
  egg: string;
  danger: string;
  charcoal: string;
  muted: string;
  white: string;
  border: string;
  placeholder: string;
  dark: typeof brandColors.dark;
};

type ThemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
  colors: AppColors;
  semantic: (typeof semanticColors)[ColorScheme];
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function buildAppColors(scheme: ColorScheme): AppColors {
  const semantic = semanticColors[scheme];
  return {
    primary: brandColors.primary,
    green: brandColors.green,
    saffron: brandColors.saffron,
    egg: brandColors.egg,
    danger: brandColors.danger,
    dark: brandColors.dark,
    cream: semantic.bg,
    charcoal: semantic.text,
    muted: semantic.textSecondary,
    white: semantic.surface,
    border: semantic.border,
    placeholder: scheme === 'dark' ? '#6B7280' : brandColors.placeholder,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('light');

  useEffect(() => {
    void (async () => {
      try {
        const storedAppearance = await AsyncStorage.getItem(APPEARANCE_KEY);
        if (storedAppearance === 'light' || storedAppearance === 'dark') {
          setColorSchemeState(storedAppearance);
        }
      } catch {
        // keep defaults
      }
    })();
  }, []);

  const setColorScheme = useCallback(async (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    await AsyncStorage.setItem(APPEARANCE_KEY, scheme);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      setColorScheme,
      colors: buildAppColors(colorScheme),
      semantic: semanticColors[colorScheme],
      isDark: colorScheme === 'dark',
    }),
    [colorScheme, setColorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function useAppColors(): AppColors {
  return useTheme().colors;
}
