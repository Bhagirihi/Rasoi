import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabBarLayout } from '@/constants/tabBar';

/**
 * SDK 58 replacement for the old bottom-tab height hook. Expo Router 58
 * dropped that package as a dependency, so the import no longer resolves — but the tab bar height is
 * set explicitly in (tabs)/_layout.tsx, so this reproduces it exactly:
 * body height + top padding + bottom inset.
 */
export function useTabBarHeight(): number {
  const insets = useSafeAreaInsets();
  return getTabBarLayout(insets.bottom).height;
}

