import { optionalAuthApiFetch } from '@/utils/api';

export type SponsorEventPayload = {
  eventType: 'impression' | 'tap';
  brandName: string;
  placement: string;
  sponsorId?: string;
  partner?: 'blinkit' | 'zepto' | 'instamart' | 'zomato' | 'swiggy';
  query?: string;
  city?: string;
};

export function logSponsorEvent(payload: SponsorEventPayload): void {
  void optionalAuthApiFetch<{ id: string }>('/api/sponsor-events', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).catch(() => {
    // Analytics should never block UI or spam the console.
  });
}
