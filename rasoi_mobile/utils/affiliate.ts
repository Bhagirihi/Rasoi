import { Linking } from 'react-native';

import type { AffiliatePartner, FoodDeliveryPartner } from '@/constants/partners';
import {
  buildGroceryCheckoutQuery,
  buildPartnerUrls,
  getCachedPartnerLinks,
} from '@/services/partners';

export type { AffiliatePartner, FoodDeliveryPartner };

async function openUrls(deepLink: string, webUrl: string) {
  const url = deepLink.startsWith('http') ? deepLink : webUrl;
  try {
    await Linking.openURL(url);
  } catch {
    if (url !== webUrl) {
      await Linking.openURL(webUrl);
    }
  }
}

export async function openAffiliateCheckout(
  missingIngredients: string[],
  partner: AffiliatePartner = 'blinkit',
): Promise<void> {
  if (missingIngredients.length === 0) return;

  const query = buildGroceryCheckoutQuery(missingIngredients);
  const urls = buildPartnerUrls(partner, query, getCachedPartnerLinks());
  if (!urls) return;

  await openUrls(urls.deepLink, urls.webUrl);
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
  const trimmed = recipeTitle.trim();
  if (!trimmed) return;

  const urls = buildPartnerUrls(partner, trimmed, getCachedPartnerLinks());
  if (!urls) return;

  await openUrls(urls.deepLink, urls.webUrl);
}
