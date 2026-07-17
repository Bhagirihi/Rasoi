import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';

/**
 * Tabs with lazy:false mount immediately but stay lightweight until first focus.
 * Avoids first-tap hang without blocking Home on initial paint.
 */
export function useTabWarmRender(): boolean {
  const isFocused = useIsFocused();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setShouldRender(true);
    }
  }, [isFocused]);

  return shouldRender;
}
