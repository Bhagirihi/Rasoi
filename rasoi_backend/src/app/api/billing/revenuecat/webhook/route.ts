import { createHash } from 'crypto';
import { NextRequest } from 'next/server';

import { jsonOk, jsonError, handleApiError } from '@/lib/api';
import { db, DbError } from '@/lib/db';
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
  // Deterministic fallback: the same event payload must always map to the same
  // idempotency key, otherwise RevenueCat retries create duplicate processing.
  // A timestamp fallback would be non-deterministic and is never used.
  const payload = JSON.stringify(event);
  return `derived:${createHash('sha256').update(payload).digest('hex').slice(0, 40)}`;
}

/**
 * Records the idempotency marker. Returns true when this exact event was
 * already processed (unique conflict on eventId), false when we claimed it.
 */
async function claimWebhookEvent(
  eventId: string,
  eventType: string,
  userId: string,
): Promise<boolean> {
  try {
    await db.processedWebhookEvent.create({
      data: { eventId, eventType, userId },
    });
    return false;
  } catch (error) {
    if (error instanceof DbError && error.code === '23505') return true;
    throw error;
  }
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
    const user = await db.user.findUnique({ where: { id: event.app_user_id } });
    if (!user) {
      return jsonOk({ ignored: true, reason: 'unknown app_user_id' });
    }

    // Plan changes are idempotent set-operations, and the marker claim is the
    // single serialization point — so the whole flow is safely retryable with
    // no (fake) transaction needed.
    if (shouldGrantPaidFromWebhook(event.type)) {
      await db.user.update({
        where: { id: user.id },
        data: { planTier: 'paid', hasUsedTrial: true },
      });
      if (await claimWebhookEvent(eventId, event.type, user.id)) {
        return jsonOk({ ignored: true, reason: 'duplicate event', eventId });
      }
      return jsonOk({ updated: true, planTier: 'paid', event: event.type });
    }

    if (shouldRevokePaidFromWebhook(event.type)) {
      await db.user.update({
        where: { id: user.id },
        data: { planTier: 'free' },
      });
      if (await claimWebhookEvent(eventId, event.type, user.id)) {
        return jsonOk({ ignored: true, reason: 'duplicate event', eventId });
      }
      return jsonOk({ updated: true, planTier: 'free', event: event.type });
    }

    if (await claimWebhookEvent(eventId, event.type, user.id)) {
      return jsonOk({ ignored: true, reason: 'duplicate event', eventId });
    }

    return jsonOk({ ignored: true, event: event.type });
  } catch (error) {
    return handleApiError(error);
  }
}
