import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { isLocationPermissionGranted } from '@/utils/location';
import { isNotificationPermissionGranted } from '@/utils/notifications';

const PERMISSIONS_ONBOARDING_KEY = '@rasoi/permissions_onboarding_complete';

export async function isPermissionsOnboardingComplete(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(PERMISSIONS_ONBOARDING_KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function markPermissionsOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(PERMISSIONS_ONBOARDING_KEY, 'true');
}

/** True when the branded notification + location steps still need to run. */
export async function shouldShowPermissionsOnboarding(userCity: string | null): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (await isPermissionsOnboardingComplete()) return false;

  const [notifGranted, locGranted] = await Promise.all([
    isNotificationPermissionGranted(),
    isLocationPermissionGranted(),
  ]);

  // Already granted everything we ask for — no need to show the flow again.
  if (notifGranted && (locGranted || Boolean(userCity?.trim()))) {
    await markPermissionsOnboardingComplete();
    return false;
  }

  return true;
}
