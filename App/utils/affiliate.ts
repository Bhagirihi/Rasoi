import type { AffiliatePartner, FoodDeliveryPartner } from '@/constants/partners';
import { buildDeliverySearchQuery } from '@/constants/partners';
import {
  buildGroceryCheckoutQuery,
  buildPartnerUrls,
  getCachedPartnerLinks,
} from '@/services/partners';
import { openPartnerUrls } from '@/utils/openPartnerUrl';

export type { AffiliatePartner, FoodDeliveryPartner };

export async function openAffiliateCheckout(
  missingIngredients: string[],
  partner: AffiliatePartner = 'blinkit',
): Promise<void> {
  if (missingIngredients.length === 0) return;

  const query = buildGroceryCheckoutQuery(missingIngredients);
  const urls = buildPartnerUrls(partner, query, getCachedPartnerLinks());
  if (!urls) return;

  await openPartnerUrls(urls.deepLink, urls.webUrl);
}

export async function openBrandSearch(
  query: string,
  partner: AffiliatePartner = 'blinkit',
): Promise<void> {
  await openAffiliateCheckout([query], partner);
}

export async function openFoodDelivery(
  recipeTitle: string,
  partner: FoodDeliveryPartner,
): Promise<void> {
  const trimmed = buildDeliverySearchQuery(recipeTitle);
  if (!trimmed) return;

  const urls = buildPartnerUrls(partner, trimmed, getCachedPartnerLinks());
  if (!urls) return;

  await openPartnerUrls(urls.deepLink, urls.webUrl);
}
