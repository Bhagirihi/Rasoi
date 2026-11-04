import { Platform } from 'react-native';

/**
 * Tab bar geometry, shared by (tabs)/_layout.tsx (which sets tabBarStyle)
 * and useTabBarHeight (which reports the same height to tab screens).
 * Kept here so the two can never drift apart.
 */
export const TAB_BAR_TOP_PADDING = 8;
export const TAB_BAR_BODY_HEIGHT = Platform.OS === 'ios' ? 49 : 48;

export function getTabBarLayout(bottomInset: number) {
  const paddingBottom = Math.max(bottomInset, Platform.OS === 'ios' ? 24 : 8);

  return {
    height: TAB_BAR_BODY_HEIGHT + TAB_BAR_TOP_PADDING + paddingBottom,
    paddingBottom,
    paddingTop: TAB_BAR_TOP_PADDING,
  };
}

