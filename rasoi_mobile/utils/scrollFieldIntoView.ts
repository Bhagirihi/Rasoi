import type { MutableRefObject, RefObject } from 'react';
import { Dimensions, Platform, type ScrollView, type View } from 'react-native';

/** Scrolls a form field above the software keyboard when it receives focus. */
export function scrollFieldIntoView(
  scrollRef: RefObject<ScrollView | null>,
  fieldRef: RefObject<View | null>,
  scrollY: MutableRefObject<number>,
  keyboardHeight: number,
  keyboardScreenY?: number,
  extraOffset = 48,
): void {
  const run = () => {
    const field = fieldRef.current;
    const scroll = scrollRef.current;
    if (!field || !scroll) return;

    field.measureInWindow((_x, y, _width, height) => {
      const visibleBottom =
        keyboardScreenY != null && keyboardScreenY > 0
          ? keyboardScreenY - extraOffset
          : Dimensions.get('window').height -
            (keyboardHeight > 0 ? keyboardHeight : 300) -
            extraOffset;
      const fieldBottom = y + height;

      if (fieldBottom > visibleBottom) {
        const delta = fieldBottom - visibleBottom + 20;
        scroll.scrollTo({
          y: scrollY.current + delta,
          animated: true,
        });
        scrollY.current += delta;
      }
    });
  };

  requestAnimationFrame(() => {
    setTimeout(run, Platform.OS === 'android' ? 280 : 80);
  });
}
