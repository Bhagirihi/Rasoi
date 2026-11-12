import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';

const SNOOZED_UNTIL_KEY = '@rasoi/play_update_snoozed_until_ms';
/** Don't nag: once the user taps Later (or dismisses the flow), wait a day. */
const SNOOZE_MS = 24 * 60 * 60 * 1000;

let checkedThisSession = false;
let listenerInstalled = false;

/**
 * Play in-app update is Android-only and needs a real store build — the
 * native Play Core module isn't in Expo Go or dev clients.
 */
function isPlayUpdateSupported(): boolean {
  if (__DEV__) return false;
  if (Platform.OS !== 'android') return false;
  if (Constants.appOwnership === 'expo') return false;
  return true;
}

async function isSnoozed(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(SNOOZED_UNTIL_KEY);
    if (!raw) return false;
    return Date.now() < Number(raw);
  } catch {
    return false;
  }
}

async function snooze(): Promise<void> {
  try {
    await AsyncStorage.setItem(SNOOZED_UNTIL_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    // non-fatal
  }
}

function askUserToUpdate(isImmediate: boolean, start: () => Promise<void>): void {
  Alert.alert(
    'Update available',
    'A new version of Rasoi is available on Google Play. Update now to get the latest features and fixes?',
    [
      { text: 'Later', style: 'cancel', onPress: () => void snooze() },
      { text: 'Update now', onPress: () => void start().catch(() => undefined) },
    ],
    { cancelable: true, onDismiss: () => void snooze() },
  );
}

/**
 * Check Google Play for a newer Rasoi build and prompt the user to update.
 *
 * Flexible update: downloads in the background while the user keeps using
 * the app, then a second prompt restarts into the new version. If Play
 * Console marks the release immediate (priority 4+), the blocking immediate
 * flow is used instead. A flexible update that already finished downloading
 * is resumed on launch.
 *
 * Needs a native build to work (the Play Core module ships in the AAB, not
 * over OTA). Safe no-op in Expo Go / dev / iOS / when Play is unavailable.
 */
export async function checkForPlayAppUpdateOnLaunch(): Promise<
  'updated' | 'none' | 'skipped' | 'deferred'
> {
  if (checkedThisSession) return 'skipped';
  checkedThisSession = true;
  if (!isPlayUpdateSupported()) return 'skipped';
  if (await isSnoozed()) return 'deferred';

  let InAppUpdates: typeof import('expo-in-app-updates');
  try {
    InAppUpdates = await import('expo-in-app-updates');
  } catch {
    return 'skipped';
  }

  try {
    const info = await InAppUpdates.checkForUpdate();

    // A flexible update that already downloaded: resume it so it installs.
    if (info.updateInProgress) {
      await InAppUpdates.startUpdate();
      return 'updated';
    }
    if (!info.updateAvailable) return 'none';

    const isImmediate = info.serverUpdateType === 'IMMEDIATE';

    if (!listenerInstalled) {
      listenerInstalled = true;
      InAppUpdates.addUpdateListener('updateDownloaded', () => {
        Alert.alert(
          'Update ready',
          'The new version of Rasoi has downloaded. Restart now to install it?',
          [
            { text: 'Later', style: 'cancel', onPress: () => void snooze() },
            {
              text: 'Restart now',
              onPress: () => void InAppUpdates.startUpdate().catch(() => undefined),
            },
          ],
          { cancelable: true, onDismiss: () => void snooze() },
        );
      });
      InAppUpdates.addUpdateListener('updateCancelled', () => {
        void snooze();
      });
    }

    askUserToUpdate(isImmediate, async () => {
      await InAppUpdates.startUpdate(isImmediate);
    });
    return 'deferred';
  } catch {
    return 'skipped';
  }
}
