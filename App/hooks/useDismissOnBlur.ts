import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

/** Run `onDismiss` when this screen loses focus (e.g. user switches tabs). */
export function useDismissOnBlur(onDismiss: () => void) {
  useFocusEffect(
    useCallback(() => {
      return onDismiss;
    }, [onDismiss]),
  );
}
