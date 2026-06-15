import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const LAST_HANDLED_NOTIFICATION_KEY = '@rasoi/last_handled_notification_response';

const REMINDER_THANK_YOU_ID = 'rasoi-reminder-thank-you';

export const DAILY_REMINDER_SLOTS = [
  {
    id: 'rasoi-daily-dinner-5pm',
    hour: 17,
    minute: 0,
    label: '5 PM',
    title: "What's for dinner?",
    body: "Open Rasoi for tonight's top pick based on your pantry.",
  },
  {
    id: 'rasoi-daily-dinner-10pm',
    hour: 22,
    minute: 0,
    label: '10 PM',
    title: 'Still cooking tonight?',
    body: 'Browse quick recipes on Rasoi before you call it a night.',
  },
] as const;

export const DAILY_REMINDER_TIME_LABEL = DAILY_REMINDER_SLOTS.map((slot) => slot.label).join(' & ');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureMealPushChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

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
  | { type: 'recipes_tab' };

function responseFingerprint(response: Notifications.NotificationResponse): string {
  const { notification, actionIdentifier } = response;
  return `${notification.request.identifier}:${actionIdentifier}:${notification.date}`;
}

export async function markNotificationResponseHandled(
  response: Notifications.NotificationResponse,
): Promise<void> {
  await AsyncStorage.setItem(LAST_HANDLED_NOTIFICATION_KEY, responseFingerprint(response));
}

export async function isNewNotificationResponse(
  response: Notifications.NotificationResponse,
): Promise<boolean> {
  const last = await AsyncStorage.getItem(LAST_HANDLED_NOTIFICATION_KEY);
  return last !== responseFingerprint(response);
}

export function getNavigationFromNotificationResponse(
  response: Notifications.NotificationResponse,
): NotificationNavigationTarget | null {
  const data = response.notification.request.content.data as MealPushData | undefined;
  const actionId = response.actionIdentifier;

  if (data?.type === 'daily_reminder') {
    return { type: 'recipes_tab' };
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
  if (Platform.OS === 'web') return;

  await ensureMealPushChannel();

  await Notifications.setNotificationCategoryAsync('meal_pick', [
    { identifier: 'cook', buttonTitle: 'Cook This', options: { opensAppToForeground: true } },
    { identifier: 'more', buttonTitle: 'More', options: { opensAppToForeground: true } },
    { identifier: 'save', buttonTitle: 'Save', options: { opensAppToForeground: true } },
  ]);
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync('rasoi-daily-dinner');
  await Promise.all(
    DAILY_REMINDER_SLOTS.map((slot) =>
      Notifications.cancelScheduledNotificationAsync(slot.id),
    ),
  );
}

export async function scheduleDailyReminder(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const granted = await ensureNotificationPermissions();
  if (!granted) return false;

  await cancelDailyReminder();

  await Promise.all(
    DAILY_REMINDER_SLOTS.map((slot) =>
      Notifications.scheduleNotificationAsync({
        identifier: slot.id,
        content: {
          title: slot.title,
          body: slot.body,
          sound: true,
          data: { type: 'daily_reminder' },
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

  const granted = await ensureNotificationPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_THANK_YOU_ID,
    content: {
      title: 'Thank you!',
      body: `Daily reminders are on. We'll nudge you at ${DAILY_REMINDER_TIME_LABEL} with dinner ideas from Rasoi.`,
      sound: true,
    },
    trigger: null,
  });
}

/** Immediate confirmation when a recipe is saved. */
export async function sendRecipeSavedNotification(recipeTitle: string): Promise<void> {
  if (Platform.OS === 'web') return;

  const granted = await ensureNotificationPermissions();
  if (!granted) return;

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

export async function syncDailyReminder(enabled: boolean): Promise<boolean> {
  if (!enabled) {
    await cancelDailyReminder();
    return false;
  }
  return scheduleDailyReminder();
}

export async function getExpoPushToken(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  await setupRemoteMealNotifications();

  const granted = await ensureNotificationPermissions();
  if (!granted) return null;

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const tokenResult = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync();

    return tokenResult.data || null;
  } catch {
    return null;
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
  await Notifications.cancelScheduledNotificationAsync(TRIAL_REMINDER_ID);
}

/** Nudge on day 2 of the free trial (24h after trial start). */
export async function scheduleTrialDayTwoReminder(trialStartedAt: string): Promise<void> {
  if (Platform.OS === 'web') return;

  const granted = await ensureNotificationPermissions();
  if (!granted) return;

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
