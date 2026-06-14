import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** AdMob needs a dev/production build — not available in Expo Go. */
export function isAdMobNativeAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  if (Constants.appOwnership === 'expo') return false;
  return true;
}
