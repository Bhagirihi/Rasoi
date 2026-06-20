import { optionalAuthApiFetch } from '@/utils/api';

export type AffiliateEventPayload = {
  partner: 'blinkit' | 'zepto' | 'instamart' | 'zomato' | 'swiggy';
  context?: string;
  recipeId?: string;
  query?: string;
};

export function logAffiliateEvent(payload: AffiliateEventPayload): void {
  void optionalAuthApiFetch<{ id: string }>('/api/affiliate-events', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).catch(() => {
    // Analytics should never block checkout.
  });
}
