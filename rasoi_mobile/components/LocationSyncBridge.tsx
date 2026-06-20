import { useSyncUserLocation } from '@/hooks/useSyncUserLocation';

export default function LocationSyncBridge() {
  useSyncUserLocation();
  return null;
}
