import { useRef, useState } from 'react';
import type { ViewToken } from 'react-native';

/** Track which FlatList row indices are at least half visible (for lazy ad mounts). */
export function useFlatListAdViewability() {
  const [viewableIndices, setViewableIndices] = useState<Set<number>>(() => new Set());
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const next = new Set(
        viewableItems
          .map((token) => token.index)
          .filter((index): index is number => typeof index === 'number'),
      );
      // Diff before setState: viewability fires on every scroll tick, and an
      // unconditional new Set() re-renders the parent (and every visible card)
      // even when nothing changed.
      setViewableIndices((prev) => {
        if (prev.size !== next.size) return next;
        for (const index of prev) {
          if (!next.has(index)) return next;
        }
        return prev;
      });
    },
  ).current;

  return { viewableIndices, viewabilityConfig, onViewableItemsChanged };
}
