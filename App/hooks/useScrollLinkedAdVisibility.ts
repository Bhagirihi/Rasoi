import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, View, type LayoutChangeEvent } from 'react-native';

const VISIBILITY_RATIO = 0.5;
const DWELL_MS = 300;

/** Mount ad children only after the slot is ≥50% on screen for a short dwell. */
export function useScrollLinkedAdVisibility(enabled: boolean) {
  const slotRef = useRef<View>(null);
  const [ready, setReady] = useState(!enabled);
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDwell = useCallback(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
  }, []);

  const evaluate = useCallback(() => {
    if (!enabled || ready) return;

    slotRef.current?.measureInWindow((_x, y, _width, height) => {
      if (height <= 0) return;

      const windowHeight = Dimensions.get('window').height;
      const visibleHeight = Math.min(y + height, windowHeight) - Math.max(y, 0);
      const ratio = visibleHeight / height;

      if (ratio >= VISIBILITY_RATIO) {
        if (!dwellTimerRef.current) {
          dwellTimerRef.current = setTimeout(() => {
            setReady(true);
            dwellTimerRef.current = null;
          }, DWELL_MS);
        }
        return;
      }

      clearDwell();
    });
  }, [clearDwell, enabled, ready]);

  const onLayout = useCallback(
    (_event: LayoutChangeEvent) => {
      evaluate();
    },
    [evaluate],
  );

  useEffect(() => clearDwell, [clearDwell]);

  return { slotRef, ready, evaluate, onLayout };
}
