import Expo, { type ExpoPushMessage, type ExpoPushTicket } from 'expo-server-sdk';

import { db } from '@/lib/db';

const expo = new Expo();

export interface MealPushPayload {
  type: 'meal_pick';
  mealSlot: string;
  recipeId: string;
  recipeTitle: string;
  imageUrl: string;
  prepTime: number;
  difficulty: string;
  regionalCuisine: string;
  nextMealSlot: string;
  nextMealInMinutes: number;
  actions: {
    cook: string;
    more: string;
    save: string;
  };
}

export interface SendPushResult {
  token: string;
  ok: boolean;
  ticketId?: string;
  error?: string;
}

export function isValidExpoPushToken(token: string): boolean {
  return Expo.isExpoPushToken(token);
}

export interface CustomPushPayload {
  type: 'admin_message';
  title: string;
  body: string;
}

export function buildMealPushMessage(
  expoPushToken: string,
  options: {
    body: string;
    payload: MealPushPayload;
  },
): ExpoPushMessage {
  return {
    to: expoPushToken,
    sound: 'default',
    title: options.payload.recipeTitle.trim() || 'Suggested recipe',
    body: options.body,
    data: options.payload as unknown as Record<string, unknown>,
    priority: 'high',
    channelId: 'meal-picks',
    categoryId: 'meal_pick',
    richContent: options.payload.imageUrl
      ? { image: options.payload.imageUrl }
      : undefined,
  };
}

export function buildCustomPushMessage(
  expoPushToken: string,
  options: {
    title: string;
    body: string;
  },
): ExpoPushMessage {
  const payload: CustomPushPayload = {
    type: 'admin_message',
    title: options.title,
    body: options.body,
  };

  return {
    to: expoPushToken,
    sound: 'default',
    title: options.title.trim() || 'Rasoi',
    body: options.body.trim(),
    data: payload as unknown as Record<string, unknown>,
    priority: 'high',
    channelId: 'rasoi-updates',
  };
}

export async function sendExpoPushMessages(messages: ExpoPushMessage[]): Promise<SendPushResult[]> {
  const validMessages = messages.filter((m) => {
    const token = typeof m.to === 'string' ? m.to : '';
    return token && isValidExpoPushToken(token);
  });

  if (validMessages.length === 0) return [];

  const chunks = expo.chunkPushNotifications(validMessages);
  const results: SendPushResult[] = [];

  for (const chunk of chunks) {
    let tickets: ExpoPushTicket[];
    try {
      tickets = await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      for (const message of chunk) {
        const token = typeof message.to === 'string' ? message.to : '';
        results.push({
          token,
          ok: false,
          error: error instanceof Error ? error.message : 'send failed',
        });
      }
      continue;
    }

    tickets.forEach((ticket, index) => {
      const token = typeof chunk[index]?.to === 'string' ? chunk[index].to : '';
      if (ticket.status === 'ok') {
        results.push({ token, ok: true, ticketId: ticket.id });
      } else {
        results.push({
          token,
          ok: false,
          error: ticket.message ?? ticket.details?.error ?? 'push error',
        });
      }
    });
  }

  return results;
}

/**
 * Polls Expo for delivery receipts of previously sent tickets and deactivates
 * tokens Expo reports as DeviceNotRegistered. Call after sendExpoPushMessages
 * (build a ticketId -> token map from its results) so dead tokens stop
 * accumulating — every meal slot (5x/day) would otherwise keep wasting sends,
 * and Expo throttles accounts with too many dead-token deliveries.
 *
 * Returns the number of tokens deactivated.
 */
export async function deactivateDeadPushTokens(
  ticketToToken: Map<string, string>,
): Promise<number> {
  const ticketIds = [...ticketToToken.keys()];
  if (ticketIds.length === 0) return 0;

  const deadTokens = new Set<string>();
  for (let i = 0; i < ticketIds.length; i += 100) {
    const chunk = ticketIds.slice(i, i + 100);
    let receipts: Awaited<ReturnType<typeof expo.getPushNotificationReceiptsAsync>>;
    try {
      receipts = await expo.getPushNotificationReceiptsAsync(chunk);
    } catch {
      continue;
    }
    for (const [ticketId, receipt] of Object.entries(receipts)) {
      if (
        receipt.status === 'error' &&
        receipt.details?.error === 'DeviceNotRegistered'
      ) {
        const token = ticketToToken.get(ticketId);
        if (token) deadTokens.add(token);
      }
    }
  }

  for (const token of deadTokens) {
    try {
      await db.pushToken.updateMany({
        where: { expoPushToken: token, active: true },
        data: { active: false },
      });
    } catch {
      // Best-effort cleanup; never fail the caller.
    }
  }
  return deadTokens.size;
}
