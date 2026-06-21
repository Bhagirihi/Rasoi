import { timingSafeEqual } from 'crypto';

/** Server-side RevenueCat API helpers (subscription verification + webhooks). */

export const REVENUECAT_ENTITLEMENT_LOOKUP = 'rasoi_plus';

const PROJECT_ID = process.env.REVENUECAT_PROJECT_ID?.trim() || 'proj1100e927';
const SECRET_API_KEY = process.env.REVENUECAT_SECRET_API_KEY?.trim() ?? '';
const WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET?.trim() ?? '';

export function isRevenueCatServerConfigured(): boolean {
  return Boolean(SECRET_API_KEY && PROJECT_ID);
}

function safeEqualStrings(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function verifyRevenueCatWebhookAuth(authorizationHeader: string | null): boolean {
  if (!WEBHOOK_SECRET) return false;
  if (!authorizationHeader?.startsWith('Bearer ')) return false;
  const token = authorizationHeader.slice('Bearer '.length).trim();
  return safeEqualStrings(token, WEBHOOK_SECRET);
}

type ActiveEntitlementItem = {
  lookup_key?: string;
  entitlement_id?: string;
  object?: string;
};

type ActiveEntitlementsResponse = {
  items?: ActiveEntitlementItem[];
};

export async function customerHasActiveRasoiPlus(customerId: string): Promise<boolean> {
  if (!isRevenueCatServerConfigured()) {
    throw new Error('RevenueCat server API is not configured.');
  }

  const url = `https://api.revenuecat.com/v2/projects/${PROJECT_ID}/customers/${encodeURIComponent(customerId)}/active_entitlements`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${SECRET_API_KEY}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (response.status === 404) return false;
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`RevenueCat API error (${response.status}): ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as ActiveEntitlementsResponse;
  return (
    data.items?.some(
      (item) =>
        item.lookup_key === REVENUECAT_ENTITLEMENT_LOOKUP ||
        item.entitlement_id === REVENUECAT_ENTITLEMENT_LOOKUP,
    ) ?? false
  );
}

/** RevenueCat webhook v1 event envelope. */
export type RevenueCatWebhookEvent = {
  id?: string;
  type?: string;
  app_user_id?: string;
  product_id?: string;
  entitlement_ids?: string[] | null;
  expiration_at_ms?: number | null;
};

export function isRasoiPlusEntitlementEvent(event: RevenueCatWebhookEvent): boolean {
  if (!event.entitlement_ids?.length) return false;
  return event.entitlement_ids.includes(REVENUECAT_ENTITLEMENT_LOOKUP);
}

export function shouldGrantPaidFromWebhook(eventType: string): boolean {
  return [
    'INITIAL_PURCHASE',
    'RENEWAL',
    'UNCANCELLATION',
    'PRODUCT_CHANGE',
    'SUBSCRIPTION_EXTENDED',
    'NON_RENEWING_PURCHASE',
  ].includes(eventType);
}

export function shouldRevokePaidFromWebhook(eventType: string): boolean {
  return [
    'EXPIRATION',
    'CANCELLATION',
    'REFUND',
    'BILLING_ISSUE',
    'SUBSCRIPTION_PAUSED',
  ].includes(eventType);
}
