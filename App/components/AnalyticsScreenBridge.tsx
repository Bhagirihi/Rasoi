import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';

import { logFirebaseScreenView } from '@/utils/firebase';

/** Logs Firebase screen_view on route changes — wire once in root layout. */
export default function AnalyticsScreenBridge() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;
    void logFirebaseScreenView(pathname);
  }, [pathname]);

  return null;
}
