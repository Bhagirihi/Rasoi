import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';

import { useScrollLinkedAdVisibility } from '@/hooks/useScrollLinkedAdVisibility';

type ViewportLazyAdSlotProps = {
  children: ReactNode;
  enabled?: boolean;
  /** Bump when the parent ScrollView scrolls so visibility is re-checked. */
  scrollGeneration?: number;
};

export default function ViewportLazyAdSlot({
  children,
  enabled = true,
  scrollGeneration = 0,
}: ViewportLazyAdSlotProps) {
  const { slotRef, ready, evaluate, onLayout } = useScrollLinkedAdVisibility(enabled);

  useEffect(() => {
    evaluate();
  }, [evaluate, scrollGeneration]);

  if (!enabled) return null;

  return (
    <View ref={slotRef} onLayout={onLayout} collapsable={false}>
      {ready ? children : null}
    </View>
  );
}
