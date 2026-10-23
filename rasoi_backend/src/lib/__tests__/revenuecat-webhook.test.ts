import { describe, expect, it } from 'vitest';

import {
  isRasoiPlusEntitlementEvent,
  shouldGrantPaidFromWebhook,
  shouldRevokePaidFromWebhook,
} from '@/lib/revenuecat';

describe('RevenueCat webhook event mapping', () => {
  it('grants paid on purchase lifecycle events', () => {
    for (const type of [
      'INITIAL_PURCHASE',
      'RENEWAL',
      'UNCANCELLATION',
      'PRODUCT_CHANGE',
      'SUBSCRIPTION_EXTENDED',
      'NON_RENEWING_PURCHASE',
    ]) {
      expect(shouldGrantPaidFromWebhook(type)).toBe(true);
    }
  });

  it('revokes paid on churn events', () => {
    for (const type of [
      'EXPIRATION',
      'CANCELLATION',
      'REFUND',
      'BILLING_ISSUE',
      'SUBSCRIPTION_PAUSED',
    ]) {
      expect(shouldRevokePaidFromWebhook(type)).toBe(true);
    }
  });

  it('does nothing for unknown event types', () => {
    expect(shouldGrantPaidFromWebhook('TRIAL_STARTED')).toBe(false);
    expect(shouldRevokePaidFromWebhook('TRIAL_STARTED')).toBe(false);
  });

  it('matches only the rasoi_plus entitlement', () => {
    expect(isRasoiPlusEntitlementEvent({ entitlement_ids: ['rasoi_plus'] })).toBe(true);
    expect(isRasoiPlusEntitlementEvent({ entitlement_ids: ['other_entitlement'] })).toBe(false);
    expect(isRasoiPlusEntitlementEvent({})).toBe(false);
    expect(isRasoiPlusEntitlementEvent({ entitlement_ids: null })).toBe(false);
  });
});
