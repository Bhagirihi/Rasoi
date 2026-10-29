import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** AdMob needs a dev/production build — not available in Expo Go. */
export function isAdMobNativeAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  if (Constants.appOwnership === 'expo') return false;
  return true;
}

export async function initializeMobileAds(): Promise<void> {
  if (!isAdMobNativeAvailable()) return;

  const { default: mobileAds } = await import('react-native-google-mobile-ads');
  await mobileAds().initialize();

  if (__DEV__) {
    await mobileAds().setRequestConfiguration({
      testDeviceIdentifiers: ['EMULATOR'],
    });
  }
}
