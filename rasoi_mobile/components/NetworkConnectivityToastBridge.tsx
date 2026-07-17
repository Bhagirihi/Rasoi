import { useEffect, useRef } from 'react';

import { useAppToast } from '@/context/AppToastContext';
import { useNetworkConnectivity } from '@/context/NetworkConnectivityContext';

const LOW_INTERNET_TOAST = 'Low internet connection';
const TOAST_COOLDOWN_MS = 4000;

/** Shows a toast when NetInfo (or QA force) transitions to offline. */
export default function NetworkConnectivityToastBridge() {
  const { isOffline } = useNetworkConnectivity();
  const { showToast } = useAppToast();
  const wasOfflineRef = useRef(false);
  const lastToastAtRef = useRef(0);

  useEffect(() => {
    if (isOffline && !wasOfflineRef.current) {
      const now = Date.now();
      if (now - lastToastAtRef.current >= TOAST_COOLDOWN_MS) {
        lastToastAtRef.current = now;
        showToast(LOW_INTERNET_TOAST);
      }
    }
    wasOfflineRef.current = isOffline;
  }, [isOffline, showToast]);

  return null;
}
