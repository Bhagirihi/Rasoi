import * as Sentry from '@sentry/react-native';

import { isExpoGo } from '@/utils/expoGo';
import { recordFirebaseError } from '@/utils/firebase';

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();

export type SentryEnvironment = 'Development' | 'Production';

let initialized = false;

function parseEnvironmentOverride(value: string | undefined): SentryEnvironment | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'development' || normalized === 'dev') return 'Development';
  if (normalized === 'production' || normalized === 'prod') return 'Production';
  return null;
}

/** Sentry environment tag — `Development` for Expo dev, `Production` for release builds. */
export function getSentryEnvironment(): SentryEnvironment {
  const override = parseEnvironmentOverride(process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT);
  if (override) return override;
  return __DEV__ ? 'Development' : 'Production';
}

function shouldEnableSentry(): boolean {
  if (!DSN) return false;
  if (!__DEV__) return true;
  return process.env.EXPO_PUBLIC_SENTRY_DISABLE_IN_DEV !== '1';
}

export function initSentry(): void {
  // Sentry's native SDK is not in the Expo Go binary.
  if (initialized || isExpoGo() || !shouldEnableSentry()) {
    return;
  }

  initialized = true;

  const environment = getSentryEnvironment();
  const isDevelopment = environment === 'Development';

  Sentry.init({
    dsn: DSN,
    enabled: true,
    environment,
    debug: isDevelopment && process.env.EXPO_PUBLIC_SENTRY_DEBUG === '1',
    tracesSampleRate: isDevelopment ? 1.0 : 0.2,
    enableAutoSessionTracking: true,
    attachStacktrace: true,
    enableLogs: true,
    replaysSessionSampleRate: isDevelopment ? 1.0 : 0.1,
    replaysOnErrorSampleRate: isDevelopment ? 1.0 : 0.5,
    integrations: [
      Sentry.reactNativeTracingIntegration(),
      Sentry.expoRouterIntegration(),
      Sentry.mobileReplayIntegration({
        maskAllText: !isDevelopment,
        maskAllImages: !isDevelopment,
        maskAllVectors: !isDevelopment,
        screenshotStrategy: 'pixelCopy',
        captureSurfaceViews: !isDevelopment,
        enableViewRendererV2: true,
      }),
      Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
      Sentry.screenshotIntegration(),
      Sentry.viewHierarchyIntegration(),
    ],
    initialScope: {
      tags: {
        rasoi_env: environment,
      },
    },
  });
}

export function isSentryEnabled(): boolean {
  return Boolean(DSN) && initialized;
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  void recordFirebaseError(
    error,
    context as Record<string, string | number | boolean | null | undefined> | undefined,
  );

  if (!isSentryEnabled()) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('extra', context);
    }
    Sentry.captureException(error);
  });
}

/** Capture a crash and return the Sentry event id for the support reference field. */
export function captureAppCrash(
  error: unknown,
  context?: Record<string, unknown>,
): string | null {
  void recordFirebaseError(
    error,
    context as Record<string, string | number | boolean | null | undefined> | undefined,
  );

  if (!isSentryEnabled()) {
    return null;
  }

  let eventId: string | undefined;
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('crash', context);
    }
    eventId = Sentry.captureException(error);
  });

  return eventId ?? Sentry.lastEventId() ?? null;
}

/** Attach optional user note to the crash event already sent to Sentry. */
export function sendCrashUserNote(
  message: string,
  associatedEventId?: string | null,
): void {
  const trimmed = message.trim();
  if (!trimmed || !isSentryEnabled()) {
    return;
  }

  try {
    Sentry.captureFeedback({
      message: trimmed,
      associatedEventId: associatedEventId ?? undefined,
    });
  } catch {
    // Feedback must never block retry.
  }
}

export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
): void {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.captureMessage(message, level);
}

export function setSentryUser(user: {
  id: string;
  email?: string | null;
  name?: string;
  isGuest?: boolean;
}): void {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email ?? undefined,
    username: user.name,
    isGuest: String(Boolean(user.isGuest)),
  });
}

export function clearSentryUser(): void {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.setUser(null);
}

export function addSentryBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>,
): void {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}

export { Sentry };

