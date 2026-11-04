import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

/**
 * Tabs with lazy:false mount immediately but stay lightweight until first focus.
 * Avoids first-tap hang without blocking Home on initial paint.
 *
 * SDK 58 note: useIsFocused came from the old navigation package, which Expo
 * Router 58 no longer ships. This keeps the same behavior — false until the
 * tab first gains focus, true ever after — via expo-router's useFocusEffect.
 */
export function useTabWarmRender(): boolean {
  const [shouldRender, setShouldRender] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setShouldRender(true);
    }, []),
  );

  return shouldRender;
}


