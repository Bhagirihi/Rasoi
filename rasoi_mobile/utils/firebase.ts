import { NativeModules, Platform } from 'react-native';

type AnalyticsModule = typeof import('@react-native-firebase/analytics').default;
type CrashlyticsModule = typeof import('@react-native-firebase/crashlytics').default;

let analyticsModule: AnalyticsModule | null | undefined;
let crashlyticsModule: CrashlyticsModule | null | undefined;
let initialized = false;

export function isFirebaseNativeAvailable(): boolean {
  return Platform.OS !== 'web' && Boolean(NativeModules.RNFBAppModule);
}

function isFirebaseAnalyticsEnabled(): boolean {
  const flag = process.env.EXPO_PUBLIC_FIREBASE_ANALYTICS_ENABLED?.trim().toLowerCase();
  if (flag === '0' || flag === 'false') return false;
  if (flag === '1' || flag === 'true') return true;
  return !__DEV__;
}

function isFirebaseCrashlyticsEnabled(): boolean {
  const flag = process.env.EXPO_PUBLIC_FIREBASE_CRASHLYTICS_ENABLED?.trim().toLowerCase();
  if (flag === '0' || flag === 'false') return false;
  if (flag === '1' || flag === 'true') return true;
  return !__DEV__;
}

async function getAnalytics(): Promise<AnalyticsModule | null> {
  if (!isFirebaseNativeAvailable() || !isFirebaseAnalyticsEnabled()) {
    return null;
  }

  if (analyticsModule !== undefined) {
    return analyticsModule;
  }

  try {
    analyticsModule = (await import('@react-native-firebase/analytics')).default;
    return analyticsModule;
  } catch {
    analyticsModule = null;
    return null;
  }
}

async function getCrashlytics(): Promise<CrashlyticsModule | null> {
  if (!isFirebaseNativeAvailable() || !isFirebaseCrashlyticsEnabled()) {
    return null;
  }

  if (crashlyticsModule !== undefined) {
    return crashlyticsModule;
  }

  try {
    crashlyticsModule = (await import('@react-native-firebase/crashlytics')).default;
    return crashlyticsModule;
  } catch {
    crashlyticsModule = null;
    return null;
  }
}

function sanitizeEventParams(
  params?: Record<string, string | number | boolean | null | undefined>,
): Record<string, string | number> | undefined {
  if (!params) return undefined;

  const sanitized: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'boolean') {
      sanitized[key] = value ? 1 : 0;
      continue;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      sanitized[key] = value;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

/** Initialize Firebase Analytics + Crashlytics on native release builds. */
export async function initFirebase(): Promise<void> {
  if (initialized || !isFirebaseNativeAvailable()) {
    return;
  }

  initialized = true;

  const analyticsEnabled = isFirebaseAnalyticsEnabled();
  const crashlyticsEnabled = isFirebaseCrashlyticsEnabled();

  const analytics = analyticsEnabled ? await getAnalytics() : null;
  if (analytics) {
    await analytics().setAnalyticsCollectionEnabled(true);
  }

  const crashlytics = crashlyticsEnabled ? await getCrashlytics() : null;
  if (crashlytics) {
    await crashlytics().setCrashlyticsCollectionEnabled(true);
  }
}

export async function logFirebaseEvent(
  name: string,
  params?: Record<string, string | number | boolean | null | undefined>,
): Promise<void> {
  const analytics = await getAnalytics();
  if (!analytics) return;

  try {
    await analytics().logEvent(name, sanitizeEventParams(params));
  } catch {
    // Analytics must never block UI.
  }
}

export async function logFirebaseScreenView(screenName: string): Promise<void> {
  const analytics = await getAnalytics();
  if (!analytics) return;

  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  } catch {
    // no-op
  }
}

export async function setFirebaseUserId(userId: string | null): Promise<void> {
  const analytics = await getAnalytics();
  const crashlytics = await getCrashlytics();

  try {
    if (analytics) {
      await analytics().setUserId(userId);
    }
    if (crashlytics) {
      await crashlytics().setUserId(userId ?? '');
    }
  } catch {
    // no-op
  }
}

export async function setFirebaseUserProperties(
  properties: Record<string, string | null | undefined>,
): Promise<void> {
  const analytics = await getAnalytics();
  if (!analytics) return;

  try {
    for (const [key, value] of Object.entries(properties)) {
      if (value == null) continue;
      await analytics().setUserProperty(key, value);
    }
  } catch {
    // no-op
  }
}

export async function recordFirebaseError(
  error: unknown,
  context?: Record<string, string | number | boolean | null | undefined>,
): Promise<void> {
  const crashlytics = await getCrashlytics();
  if (!crashlytics) return;

  try {
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        if (value == null) continue;
        await crashlytics().setAttribute(key, String(value));
      }
    }

    if (error instanceof Error) {
      await crashlytics().recordError(error);
      return;
    }

    await crashlytics().recordError(new Error(String(error)));
  } catch {
    // no-op
  }
}
