import Constants from 'expo-constants';

/**
 * True when running inside Expo Go (the store client). Expo Go is a prebuilt
 * binary: native-only modules (Google Mobile Ads, RevenueCat, Sentry's native
 * SDK) are NOT included in it, so any code touching them must skip in Expo Go
 * or the app crashes at startup. `executionEnvironment` is the reliable
 * signal; `appOwnership` is deprecated and kept only as a fallback.
 */
export function isExpoGo(): boolean {
  return (
    Constants.executionEnvironment === 'storeClient' ||
    Constants.appOwnership === 'expo'
  );
}
