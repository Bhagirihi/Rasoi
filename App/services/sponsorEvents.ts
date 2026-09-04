import { logFirebaseEvent } from '@/utils/firebase';
import { optionalAuthApiFetch } from '@/utils/api';
import { getRasoiDb, isSupabaseDirectMode } from '@/utils/rasoiDb';
import { getOwnRasoiUserId } from '@/services/user';

export type SponsorEventPayload = {
  eventType: 'impression' | 'tap';
  brandName: string;
  placement: string;
  sponsorId?: string;
  partner?: string;
  query?: string;
  city?: string;
};

export function logSponsorEvent(payload: SponsorEventPayload): void {
  void logFirebaseEvent('sponsor_event', {
    event_type: payload.eventType,
    brand_name: payload.brandName,
    placement: payload.placement,
    partner: payload.partner ?? '',
    city: payload.city ?? '',
  });

  void (async () => {
    if (isSupabaseDirectMode()) {
      try {
        const userId = await getOwnRasoiUserId();
        const { error } = await getRasoiDb().from('SponsorEvent').insert({
          userId,
          eventType: payload.eventType,
          brandName: payload.brandName,
          placement: payload.placement,
          sponsorId: payload.sponsorId ?? null,
          partner: payload.partner ?? null,
          query: payload.query ?? null,
          city: payload.city ?? null,
        });
        if (!error) {
          return;
        }
      } catch {
        // Fall through to API.
      }
    }

    await optionalAuthApiFetch<{ id: string }>('/api/sponsor-events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  })().catch(() => {
    // Analytics should never block UI or spam the console.
  });
}
