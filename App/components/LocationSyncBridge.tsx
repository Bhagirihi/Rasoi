import { useSegments } from 'expo-router';

import { useSyncUserLocation } from '@/hooks/useSyncUserLocation';

export default function LocationSyncBridge() {
  const segments = useSegments();
  const onMainApp = segments[0] === '(tabs)';
  useSyncUserLocation(onMainApp);
  return null;
}
