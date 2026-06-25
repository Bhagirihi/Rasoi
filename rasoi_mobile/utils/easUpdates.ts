import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type EasUpdateLaunchResult = 'reloaded' | 'none' | 'skipped';

/** OTA applies only on release native builds — not Metro, Expo Go, or web. */
export function isEasUpdateSupported(): boolean {
  if (__DEV__) return false;
  if (Platform.OS === 'web') return false;
  if (Constants.appOwnership === 'expo') return false;
  return true;
}

/**
 * Check EAS Update on cold start. Downloads and reloads when an update is available.
 * Call once during launch splash so users get JS fixes without a new APK/AAB.
 */
export async function checkForEasUpdateOnLaunch(): Promise<EasUpdateLaunchResult> {
  if (!isEasUpdateSupported()) return 'skipped';

  const Updates = await import('expo-updates');
  if (!Updates.isEnabled) return 'skipped';

  try {
    const check = await Updates.checkForUpdateAsync();
    if (!check.isAvailable) return 'none';

    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
    return 'reloaded';
  } catch (error) {
    console.warn('[eas-update] launch check failed', error);
    return 'none';
  }
}

export async function getEasUpdateDebugInfo(): Promise<{
  enabled: boolean;
  updateId: string | null;
  channel: string | null;
  runtimeVersion: string | null;
}> {
  if (!isEasUpdateSupported()) {
    return {
      enabled: false,
      updateId: null,
      channel: null,
      runtimeVersion: null,
    };
  }

  const Updates = await import('expo-updates');
  return {
    enabled: Updates.isEnabled,
    updateId: Updates.updateId ?? null,
    channel: Updates.channel ?? null,
    runtimeVersion: Updates.runtimeVersion ?? null,
  };
}
