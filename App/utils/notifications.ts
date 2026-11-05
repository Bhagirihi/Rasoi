import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { NotificationResponse } from 'expo-notifications';

import { isRemotePushAvailable, canLoadExpoNotifications } from '@/utils/notificationCapability';

const LAST_HANDLED_NOTIFICATION_KEY = '@rasoi/last_handled_notification_response';

const REMINDER_THANK_YOU_ID = 'rasoi-reminder-thank-you';

type ExpoNotifications = typeof import('expo-notifications');

let notificationsModule: ExpoNotifications | null = null;
let notificationsLoad: Promise<ExpoNotifications> | null = null;

async function getNotifications(): Promise<ExpoNotifications | null> {
  if (!canLoadExpoNotifications()) return null;

  if (notificationsModule) return notificationsModule;

  if (!notificationsLoad) {
    notificationsLoad = import('expo-notifications').then((mod) => {
      mod.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      notificationsModule = mod;
      return mod;
    });
  }

  return notificationsLoad;
}

export const DAILY_REMINDER_SLOTS = [
  {
    id: 'rasoi-daily-breakfast',
    hour: 6,
    minute: 0,
    label: '6 AM',
    title: "What's for breakfast?",
    body: 'Open Rasoi for today’s breakfast pick — tap to cook when you’re ready.',
  },
  {
    id: 'rasoi-daily-lunch',
    hour: 10,
    minute: 30,
    label: '10:30 AM',
    title: 'Planning lunch?',
    body: 'Your lunch pick is waiting on Home — open Rasoi to cook or shop missing items.',
  },
  {
    id: 'rasoi-daily-snack',
    hour: 14,
    minute: 0,
    label: '2 PM',
    title: 'Time for a snack?',
    body: 'Quick snack ideas matched to your kitchen — open Rasoi to cook now.',
  },
  {
    id: 'rasoi-daily-dinner',
    hour: 17,
    minute: 30,
    label: '5:30 PM',
    title: "What's for dinner?",
    body: "Tonight’s top pick is on Home — open Rasoi to start cooking.",
  },
  {
    id: 'rasoi-daily-late-night',
    hour: 20,
    minute: 0,
    label: '8 PM',
    title: 'Still cooking tonight?',
    body: 'Open Rasoi for a quick late-night pick before you call it a night.',
  },
] as const;

const LEGACY_DAILY_REMINDER_IDS = [
  'rasoi-daily-dinner',
  'rasoi-daily-dinner-5pm',
  'rasoi-daily-dinner-10pm',
] as const;

export const DAILY_REMINDER_TIME_LABEL = DAILY_REMINDER_SLOTS.map((slot) => slot.label).join(' · ');

export const DAILY_REMINDER_MEAL_SUMMARY =
  'breakfast, lunch, snack, dinner & late-night';

export async function ensureMealPushChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.setNotificationChannelAsync('meal-picks', {
    name: 'Meal picks',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF6B35',
    sound: 'default',
    description: 'Personalized breakfast, lunch, dinner & snack ideas from Rasoi',
  });
}

export type MealPushData = {
  type?: string;
  mealSlot?: string;
  recipeId?: string;
  recipeTitle?: string;
  imageUrl?: string;
  prepTime?: number;
  difficulty?: string;
  nextMealInMinutes?: number;
  actions?: { cook?: string; more?: string; save?: string };
};

export type NotificationNavigationTarget =
  | { type: 'recipe'; recipeId: string; cook?: boolean; save?: boolean }
  | { type: 'recipes_tab' }
  | { type: 'home_tab' };

function responseFingerprint(response: NotificationResponse): string {
  const { notification, actionIdentifier } = response;
  return `${notification.request.identifier}:${actionIdentifier}:${notification.date}`;
}

export async function markNotificationResponseHandled(
  response: NotificationResponse,
): Promise<void> {
  await AsyncStorage.setItem(LAST_HANDLED_NOTIFICATION_KEY, responseFingerprint(response));
}

export async function isNewNotificationResponse(
  response: NotificationResponse,
): Promise<boolean> {
  const last = await AsyncStorage.getItem(LAST_HANDLED_NOTIFICATION_KEY);
  return last !== responseFingerprint(response);
}

export function getNavigationFromNotificationResponse(
  response: NotificationResponse,
): NotificationNavigationTarget | null {
  const data = response.notification.request.content.data as MealPushData | undefined;
  const actionId = response.actionIdentifier;

  if (data?.type === 'daily_reminder') {
    // Prefer a concrete recipe deep-link when the payload includes one.
    if (data.recipeId) {
      return { type: 'recipe', recipeId: data.recipeId, cook: true };
    }
    return { type: 'home_tab' };
  }

  if (data?.type === 'admin_message') {
    return { type: 'recipes_tab' };
  }

  if (data?.type === 'meal_pick' && data.recipeId) {
    if (actionId === 'cook') {
      return { type: 'recipe', recipeId: data.recipeId, cook: true };
    }
    if (actionId === 'save') {
      return { type: 'recipe', recipeId: data.recipeId, save: true };
    }
    if (actionId === 'more') {
      return { type: 'recipes_tab' };
    }
    return { type: 'recipe', recipeId: data.recipeId };
  }

  return null;
}

export async function setupRemoteMealNotifications(): Promise<void> {
  if (Platform.OS === 'web' || !isRemotePushAvailable()) return;

  const Notifications = await getNotifications();
  if (!Notifications) return;

  await ensureMealPushChannel();

  await Notifications.setNotificationCategoryAsync('meal_pick', [
    { identifier: 'cook', buttonTitle: 'Cook This', options: { opensAppToForeground: true } },
    { identifier: 'more', buttonTitle: 'More', options: { opensAppToForeground: true } },
    { identifier: 'save', buttonTitle: 'Save', options: { opensAppToForeground: true } },
  ]);
}

export async function isNotificationPermissionGranted(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const Notifications = await getNotifications();
  if (!Notifications) return false;

  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  if (await isNotificationPermissionGranted()) return true;

  const Notifications = await getNotifications();
  if (!Notifications) return false;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** @deprecated Use branded onboarding at /(auth)/onboarding?permissionsOnly=1 */
export async function promptNotificationPermissionOnAuth(): Promise<void> {
  // Intentionally no-op — permissions are requested on PermissionOnboardingStep only.
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.cancelScheduledNotificationAsync('rasoi-daily-dinner');
  await Promise.all(
    [...LEGACY_DAILY_REMINDER_IDS, ...DAILY_REMINDER_SLOTS.map((slot) => slot.id)].map((id) =>
      Notifications.cancelScheduledNotificationAsync(id),
    ),
  );
}

function resolveReminderSlots(
  slotIds: readonly string[] | 'all' = ['rasoi-daily-breakfast', 'rasoi-daily-dinner'],
) {
  if (slotIds === 'all') return DAILY_REMINDER_SLOTS;
  const allowed = new Set(slotIds);
  return DAILY_REMINDER_SLOTS.filter((slot) => allowed.has(slot.id));
}

export async function scheduleDailyReminder(
  slotIds: readonly string[] | 'all' = ['rasoi-daily-breakfast', 'rasoi-daily-dinner'],
): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const Notifications = await getNotifications();
  if (!Notifications) return false;

  if (!(await isNotificationPermissionGranted())) return false;

  await cancelDailyReminder();

  const slots = resolveReminderSlots(slotIds);
  if (slots.length === 0) return false;

  await Promise.all(
    slots.map((slot) =>
      Notifications.scheduleNotificationAsync({
        identifier: slot.id,
        content: {
          title: slot.title,
          body: slot.body,
          sound: true,
          // Opens Home; when a recipeId is later attached by server pushes,
          // getNavigationFromNotificationResponse routes to cook mode.
          data: {
            type: 'daily_reminder',
            mealSlot: slot.id.replace('rasoi-daily-', ''),
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: slot.hour,
          minute: slot.minute,
        },
      }),
    ),
  );

  return true;
}

/** One-time thank-you when the user turns on daily reminders. */
export async function sendDailyReminderThankYouNotification(): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = await getNotifications();
  if (!Notifications) return;

  if (!(await isNotificationPermissionGranted())) return;

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_THANK_YOU_ID,
    content: {
      title: 'Thank you!',
      body: `Daily reminders are on. We'll send personalized recipe picks at ${DAILY_REMINDER_TIME_LABEL}.`,
      sound: true,
    },
    trigger: null,
  });
}

/** Immediate confirmation when a recipe is saved. */
export async function sendRecipeSavedNotification(recipeTitle: string): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = await getNotifications();
  if (!Notifications) return;

  if (!(await isNotificationPermissionGranted())) return;

  await Notifications.scheduleNotificationAsync({
    identifier: `rasoi-recipe-saved-${Date.now()}`,
    content: {
      title: 'Recipe saved!',
      body: `${recipeTitle} is in Saved — open the Saved tab anytime to cook it again.`,
      sound: true,
    },
    trigger: null,
  });
}

/**
 * Single choke point for local meal reminders.
 *
 * The server Expo push is the single source of truth for meal picks: when
 * this device has an active push token synced to the server
 * (`serverPushActive`), local reminders are NOT scheduled — and any
 * previously scheduled ones are cancelled, so users upgrading from an older
 * build stop getting two notifications at each meal time. Local reminders
 * remain only as a fallback when there is no synced server token (remote
 * push unavailable, e.g. Expo Go, or token registration failed).
 *
 * `enabled` (the notifications toggle) still gates both paths: off cancels
 * local reminders, exactly as before. Returns true only when local
 * reminders were actually scheduled.
 */
export async function syncDailyReminder(
  enabled: boolean,
  slotIds: readonly string[] | 'all' = ['rasoi-daily-breakfast', 'rasoi-daily-dinner'],
  serverPushActive = false,
): Promise<boolean> {
  if (!enabled) {
    await cancelDailyReminder();
    return false;
  }
  if (serverPushActive) {
    await cancelDailyReminder();
    return false;
  }
  return scheduleDailyReminder(slotIds);
}

export async function getExpoPushToken(): Promise<string | null> {
  const result = await getExpoPushTokenDetailed();
  return result.ok ? result.token : null;
}

export type ExpoPushTokenResult =
  | { ok: true; token: string }
  | { ok: false; reason: string };

export async function getExpoPushTokenDetailed(): Promise<ExpoPushTokenResult> {
  if (Platform.OS === 'web') {
    return { ok: false, reason: 'Push tokens are not supported on web' };
  }

  if (!isRemotePushAvailable()) {
    return { ok: false, reason: 'Remote push is unavailable in Expo Go on Android — use a release APK' };
  }

  await setupRemoteMealNotifications();

  const Notifications = await getNotifications();
  if (!Notifications) {
    return { ok: false, reason: 'Notifications module failed to load' };
  }

  if (!(await isNotificationPermissionGranted())) {
    return { ok: false, reason: 'Notification permission not granted' };
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId?.trim() ||
    Constants.easConfig?.projectId?.trim() ||
    '';

  if (!projectId) {
    return {
      ok: false,
      reason: 'Missing EXPO_PUBLIC_EAS_PROJECT_ID — run npm run setup:push and rebuild the APK',
    };
  }

  try {
    const tokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenResult.data?.trim();
    if (!token) {
      return { ok: false, reason: 'Expo returned an empty push token' };
    }
    return { ok: true, token };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/google-services|FirebaseApp|FCM/i.test(message)) {
      return {
        ok: false,
        reason: 'Missing google-services.json — add Firebase config and rebuild (see docs/PUSH_SETUP.md)',
      };
    }
    return { ok: false, reason: message || 'Failed to get Expo push token' };
  }
}

export function getPushPlatform(): 'ios' | 'android' | 'web' {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

const TRIAL_REMINDER_ID = 'rasoi-trial-day-2';

export async function cancelTrialReminder(): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.cancelScheduledNotificationAsync(TRIAL_REMINDER_ID);
}

/** Nudge on day 2 of the free trial (24h after trial start). */
export async function scheduleTrialDayTwoReminder(trialStartedAt: string): Promise<void> {
  if (Platform.OS === 'web') return;

  const Notifications = await getNotifications();
  if (!Notifications) return;

  if (!(await isNotificationPermissionGranted())) return;

  await cancelTrialReminder();

  const startMs = new Date(trialStartedAt).getTime();
  if (Number.isNaN(startMs)) return;

  const fireAt = startMs + 24 * 60 * 60 * 1000;
  const secondsUntil = Math.floor((fireAt - Date.now()) / 1000);
  if (secondsUntil <= 60) return;

  await Notifications.scheduleNotificationAsync({
    identifier: TRIAL_REMINDER_ID,
    content: {
      title: 'Rasoi Plus trial — day 2',
      body: 'Try grocery checkout tonight, or subscribe to keep partners after your trial.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsUntil,
    },
  });
}

/** Subscribe to notification taps (local + remote). Returns unsubscribe. */
export async function subscribeToNotificationResponses(
  handler: (response: NotificationResponse) => void,
): Promise<() => void> {
  if (Platform.OS === 'web') return () => undefined;

  const Notifications = await getNotifications();
  if (!Notifications) return () => undefined;

  const subscription = Notifications.addNotificationResponseReceivedListener(handler);
  return () => subscription.remove();
}

export async function getLastNotificationResponse(): Promise<NotificationResponse | null> {
  if (Platform.OS === 'web') return null;

  const Notifications = await getNotifications();
  if (!Notifications) return null;

  return Notifications.getLastNotificationResponseAsync();
}

