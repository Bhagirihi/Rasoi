import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const OTA_FIRST_SESSION_KEY = 'rasoi:ota_first_session_done';

export type EasUpdateLaunchResult = 'reloaded' | 'none' | 'skipped' | 'deferred';

export type EasUpdateOptions = {
  /**
   * Called after an update is downloaded, before reloading. Return true to
   * reload now. Defaults to auto-reload. Pass a user prompt here — a broken
   * JS update applied silently can crash-loop with no rollback path.
   */
  confirmReload?: () => Promise<boolean>;
};

/** OTA applies only on release native builds — not Metro, Expo Go, or web. */
export function isEasUpdateSupported(): boolean {
  if (__DEV__) return false;
  if (Platform.OS === 'web') return false;
  if (Constants.appOwnership === 'expo') return false;
  return true;
}

/**
 * Check EAS Update on cold start. Downloads the update, then reloads only with
 * user consent (see confirmReload).
 * Call once during launch splash so users get JS fixes without a new APK/AAB.
 */
export async function checkForEasUpdateOnLaunch(
  options?: EasUpdateOptions,
): Promise<EasUpdateLaunchResult> {
  if (!isEasUpdateSupported()) return 'skipped';

  const Updates = await import('expo-updates');
  if (!Updates.isEnabled) return 'skipped';

  try {
    const firstSessionDone = await AsyncStorage.getItem(OTA_FIRST_SESSION_KEY);
    if (!firstSessionDone) {
      // Fresh install / Play review: show embedded bundle first; OTA can apply next launch.
      await AsyncStorage.setItem(OTA_FIRST_SESSION_KEY, '1');
      return 'skipped';
    }

    const check = await Updates.checkForUpdateAsync();
    if (!check.isAvailable) return 'none';

    await Updates.fetchUpdateAsync();

    const confirm = options?.confirmReload ?? (async () => true);
    if (await confirm()) {
      await Updates.reloadAsync();
      return 'reloaded';
    }
    return 'deferred';
  } catch (error) {
    if (__DEV__) console.warn('[eas-update] launch check failed', error);
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
