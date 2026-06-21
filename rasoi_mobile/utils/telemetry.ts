import { initFirebase } from '@/utils/firebase';
import { hasLegalConsent } from '@/utils/legalConsent';
import { initSentry } from '@/utils/sentry';

let telemetryStarted = false;

/** Start analytics/crash reporting only after Terms & Privacy consent. */
export async function ensureTelemetryStarted(): Promise<void> {
  if (telemetryStarted) return;
  const consented = await hasLegalConsent();
  if (!consented) return;
  telemetryStarted = true;
  initSentry();
  void initFirebase();
}

export function markTelemetryStarted(): void {
  telemetryStarted = true;
  initSentry();
  void initFirebase();
}
