import * as Sentry from '@sentry/react-native';

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();

let initialized = false;

export function initSentry(): void {
  if (initialized || !DSN) {
    return;
  }

  initialized = true;

  Sentry.init({
    dsn: DSN,
    enabled: !__DEV__,
    debug: __DEV__ && Boolean(process.env.EXPO_PUBLIC_SENTRY_DEBUG),
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    enableAutoSessionTracking: true,
    attachStacktrace: true,
    enableLogs: true,
    replaysSessionSampleRate: __DEV__ ? 0 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.reactNativeTracingIntegration(),
      Sentry.expoRouterIntegration(),
      Sentry.mobileReplayIntegration(),
      Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
      Sentry.screenshotIntegration(),
      Sentry.viewHierarchyIntegration(),
    ],
  });
}

export function isSentryEnabled(): boolean {
  return Boolean(DSN) && initialized;
}

export function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (!DSN) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('extra', context);
    }
    Sentry.captureException(error);
  });
}

export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
): void {
  if (!DSN) {
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
  if (!DSN) {
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
  if (!DSN) {
    return;
  }

  Sentry.setUser(null);
}

export function addSentryBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>,
): void {
  if (!DSN) {
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
