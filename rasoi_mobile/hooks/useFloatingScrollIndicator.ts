import { useCallback, useRef, useState } from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

const SCROLL_THRESHOLD = 32;

export function useFloatingScrollIndicator() {
  const [visible, setVisible] = useState(false);
  const layoutHeight = useRef(0);
  const contentHeight = useRef(0);
  const scrollOffset = useRef(0);

  const refresh = useCallback(() => {
    const canScroll = contentHeight.current > layoutHeight.current + SCROLL_THRESHOLD;
    const nearBottom =
      scrollOffset.current + layoutHeight.current >= contentHeight.current - SCROLL_THRESHOLD;
    setVisible(canScroll && !nearBottom);
  }, []);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      layoutHeight.current = event.nativeEvent.layout.height;
      refresh();
    },
    [refresh],
  );

  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      contentHeight.current = height;
      refresh();
    },
    [refresh],
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffset.current = event.nativeEvent.contentOffset.y;
      refresh();
    },
    [refresh],
  );

  return {
    visible,
    onLayout,
    onContentSizeChange,
    onScroll,
    scrollEventThrottle: 16 as const,
  };
}
