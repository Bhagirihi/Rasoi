import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import { isLocationPermissionGranted } from '@/utils/location';
import { isNotificationPermissionGranted } from '@/utils/notifications';

const PERMISSIONS_ONBOARDING_KEY = '@rasoi/permissions_onboarding_complete';

export type MissingPermissionsState = {
  needsFlow: boolean;
  needsNotifications: boolean;
  needsLocation: boolean;
  initialStep: 'notifications' | 'location' | null;
};

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

export async function clearPermissionsOnboardingComplete(): Promise<void> {
  await AsyncStorage.removeItem(PERMISSIONS_ONBOARDING_KEY);
}

/** Which branded permission steps still need to run (based on OS permission + profile city). */
export async function getMissingPermissionsState(
  userCity: string | null,
): Promise<MissingPermissionsState> {
  if (Platform.OS === 'web') {
    return {
      needsFlow: false,
      needsNotifications: false,
      needsLocation: false,
      initialStep: null,
    };
  }

  const [notifGranted, locGranted] = await Promise.all([
    isNotificationPermissionGranted(),
    isLocationPermissionGranted(),
  ]);

  const hasCity = Boolean(userCity?.trim());
  const needsNotifications = !notifGranted;
  const needsLocation = !locGranted && !hasCity;
  const needsFlow = needsNotifications || needsLocation;

  let initialStep: 'notifications' | 'location' | null = null;
  if (needsFlow) {
    initialStep = needsNotifications ? 'notifications' : 'location';
  }

  return { needsFlow, needsNotifications, needsLocation, initialStep };
}

/** True when notification and/or location permission screens should run after login. */
export async function shouldShowPermissionsOnboarding(userCity: string | null): Promise<boolean> {
  const state = await getMissingPermissionsState(userCity);
  if (!state.needsFlow) {
    await markPermissionsOnboardingComplete();
  }
  return state.needsFlow;
}

export function permissionsOnboardingHref(step?: 'notifications' | 'location' | null): string {
  const base = '/(auth)/onboarding?permissionsOnly=1';
  if (step) return `${base}&step=${step}`;
  return base;
}
