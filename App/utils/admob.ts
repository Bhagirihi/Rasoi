import { Platform } from 'react-native';

import { isExpoGo } from '@/utils/expoGo';

/** AdMob needs a dev/production build — not available in Expo Go. */
export function isAdMobNativeAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  if (isExpoGo()) return false;
  return true;
}

let initPromise: Promise<void> | null = null;

/**
 * Resolves once Mobile Ads SDK init (+ test-device config in __DEV__) finishes.
 * Banner components should await this before mounting BannerAd.
 */
export function whenMobileAdsReady(): Promise<void> {
  if (!isAdMobNativeAvailable()) return Promise.resolve();
  return initializeMobileAds();
}

export async function initializeMobileAds(): Promise<void> {
  if (!isAdMobNativeAvailable()) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { default: mobileAds } = await import('react-native-google-mobile-ads');

    // Must run BEFORE initialize() — otherwise test-device IDs are ignored and
    // physical phones get ERROR_CODE_INTERNAL_ERROR (Ad failed to load : 0).
    if (__DEV__) {
      // Logcat prints the hashed device id when ads fail on a physical phone, e.g.
      // "Use RequestConfiguration.Builder().setTestDeviceIds(Arrays.asList("…"))".
      await mobileAds().setRequestConfiguration({
        testDeviceIdentifiers: [
          'EMULATOR',
          // Samsung SM-M176B (RZGYC25FJWD) — from Ads logcat during device QA
          'ACF2634CF53AB68DB5E10759AE6F913E',
        ],
      });
    }

    await mobileAds().initialize();
  })().catch((error) => {
    initPromise = null;
    throw error;
  });

  return initPromise;
}
