import { optionalAuthApiFetch } from '@/utils/api';

export type AffiliateEventPayload = {
  partner: 'blinkit' | 'zepto' | 'instamart' | 'zomato' | 'swiggy';
  context?: string;
  recipeId?: string;
  query?: string;
};

export async function logAffiliateEvent(payload: AffiliateEventPayload): Promise<void> {
  try {
    await optionalAuthApiFetch<{ id: string }>('/api/affiliate-events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    // Analytics should never block checkout.
  }
}
