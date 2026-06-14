import Expo, { type ExpoPushMessage, type ExpoPushTicket } from 'expo-server-sdk';

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

export function buildMealPushMessage(
  expoPushToken: string,
  options: {
    mealSlotLabel: string;
    body: string;
    payload: MealPushPayload;
  },
): ExpoPushMessage {
  return {
    to: expoPushToken,
    sound: 'default',
    title: 'Rasoi',
    subtitle: options.mealSlotLabel,
    body: options.body,
    data: options.payload as unknown as Record<string, unknown>,
    priority: 'high',
    channelId: 'meal-picks',
    richContent: options.payload.imageUrl
      ? { image: options.payload.imageUrl }
      : undefined,
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
