import { logFirebaseEvent } from '@/utils/firebase';
import { optionalAuthApiFetch } from '@/utils/api';
import { getRasoiDb, isSupabaseDirectMode } from '@/utils/rasoiDb';
import { getOwnRasoiUserId } from '@/services/user';

export type AffiliateEventPayload = {
  partner: 'blinkit' | 'zepto' | 'instamart' | 'zomato' | 'swiggy';
  context?: string;
  recipeId?: string;
  query?: string;
};

export function logAffiliateEvent(payload: AffiliateEventPayload): void {
  void logFirebaseEvent('partner_checkout_tap', {
    partner: payload.partner,
    context: payload.context ?? 'unknown',
    recipe_id: payload.recipeId ?? '',
  });

  void (async () => {
    if (isSupabaseDirectMode()) {
      try {
        const userId = await getOwnRasoiUserId();
        const { error } = await getRasoiDb().from('AffiliateEvent').insert({
          userId,
          partner: payload.partner,
          context: payload.context ?? null,
          recipeId: payload.recipeId ?? null,
          query: payload.query ?? null,
        });
        if (!error) {
          return;
        }
      } catch {
        // Fall through to API.
      }
    }

    await optionalAuthApiFetch<{ id: string }>('/api/affiliate-events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  })().catch(() => {
    // Analytics should never block checkout.
  });
}
