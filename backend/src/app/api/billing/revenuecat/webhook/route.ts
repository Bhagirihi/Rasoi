import { NextRequest } from 'next/server';

import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { db } from '@/lib/db';
import {
  isRasoiPlusEntitlementEvent,
  RevenueCatWebhookEvent,
  shouldGrantPaidFromWebhook,
  shouldRevokePaidFromWebhook,
  verifyRevenueCatWebhookAuth,
} from '@/lib/revenuecat';

type RevenueCatWebhookBody = {
  event?: RevenueCatWebhookEvent;
};

function webhookEventId(event: RevenueCatWebhookEvent): string {
  if (event.id) return event.id;
  return `${event.type ?? 'unknown'}:${event.app_user_id ?? 'none'}:${event.expiration_at_ms ?? Date.now()}`;
}

/**
 * RevenueCat → Rasoi plan sync.
 * Configure in RevenueCat: Project → Integrations → Webhooks
 * URL: https://rasoiapplication.in/api/billing/revenuecat/webhook
 * Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>
 */
export async function POST(request: NextRequest) {
  try {
    if (!verifyRevenueCatWebhookAuth(request.headers.get('authorization'))) {
      return jsonError('Unauthorized', 401);
    }

    const body = (await request.json()) as RevenueCatWebhookBody;
    const event = body.event;
    if (!event?.type || !event.app_user_id) {
      return jsonOk({ ignored: true, reason: 'missing event fields' });
    }

    if (!isRasoiPlusEntitlementEvent(event)) {
      return jsonOk({ ignored: true, reason: 'not rasoi_plus entitlement' });
    }

    const eventId = webhookEventId(event);
    const existing = await db.processedWebhookEvent.findUnique({
      where: { eventId },
    });
    if (existing) {
      return jsonOk({ ignored: true, reason: 'duplicate event', eventId });
    }

    const user = await db.user.findUnique({ where: { id: event.app_user_id } });
    if (!user) {
      return jsonOk({ ignored: true, reason: 'unknown app_user_id' });
    }

    if (shouldGrantPaidFromWebhook(event.type)) {
      await db.$transaction([
        db.user.update({
          where: { id: user.id },
          data: { planTier: 'paid', hasUsedTrial: true },
        }),
        db.processedWebhookEvent.create({
          data: {
            eventId,
            eventType: event.type,
            userId: user.id,
          },
        }),
      ]);
      return jsonOk({ updated: true, planTier: 'paid', event: event.type });
    }

    if (shouldRevokePaidFromWebhook(event.type)) {
      await db.$transaction([
        db.user.update({
          where: { id: user.id },
          data: { planTier: 'free' },
        }),
        db.processedWebhookEvent.create({
          data: {
            eventId,
            eventType: event.type,
            userId: user.id,
          },
        }),
      ]);
      return jsonOk({ updated: true, planTier: 'free', event: event.type });
    }

    await db.processedWebhookEvent.create({
      data: {
        eventId,
        eventType: event.type,
        userId: user.id,
      },
    });

    return jsonOk({ ignored: true, event: event.type });
  } catch (error) {
    return handleApiError(error);
  }
}
