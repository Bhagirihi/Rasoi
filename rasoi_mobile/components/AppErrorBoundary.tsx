import { type ErrorBoundaryProps } from 'expo-router';
import { useEffect, useState } from 'react';

import AppCrashFallback from '@/components/AppCrashFallback';
import { captureAppCrash } from '@/utils/sentry';
import { ensureTelemetryStarted } from '@/utils/telemetry';

/** Expo Router error boundary — friendly UI + automatic Sentry report. */
export function AppErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    void (async () => {
      await ensureTelemetryStarted().catch(() => undefined);
      const id = captureAppCrash(error, { source: 'expo_router_error_boundary' });
      setEventId(id);
      setReportSent(id != null);
    })();
  }, [error]);

  return (
    <AppCrashFallback
      error={error}
      eventId={eventId}
      reportSent={reportSent}
      onRetry={retry}
    />
  );
}
