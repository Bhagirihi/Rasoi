import { useRef, useState } from 'react';
import type { ViewToken } from 'react-native';

/** Track which FlatList row indices are at least half visible (for lazy ad mounts). */
export function useFlatListAdViewability() {
  const [viewableIndices, setViewableIndices] = useState<Set<number>>(() => new Set());
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setViewableIndices(
        new Set(
          viewableItems
            .map((token) => token.index)
            .filter((index): index is number => typeof index === 'number'),
        ),
      );
    },
  ).current;

  return { viewableIndices, viewabilityConfig, onViewableItemsChanged };
}
