/** Known India partner ids — UI accents may override; any id from admin still works. */
export const PARTNER_IDS = ['blinkit', 'zepto', 'instamart', 'zomato', 'swiggy'] as const;

export type PartnerId = string;
export type AffiliatePartner = string;
export type FoodDeliveryPartner = string;

export function resolveGroceryPartnerId(
  preferred: string | undefined,
  partners: ReadonlyArray<{ id: string }>,
): string | undefined {
  if (preferred && partners.some((partner) => partner.id === preferred)) {
    return preferred;
  }
  return partners[0]?.id;
}

export const PARTNER_UTM = 'utm_source=rasoi&utm_medium=affiliate';

/** Recipe title cleaned for Zomato / Swiggy dish search. */
export function buildDeliverySearchQuery(recipeTitle: string): string {
  return recipeTitle
    .trim()
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reliable HTTPS search URLs for food delivery partners.
 * Custom schemes (zomato://, swiggy://) often open the app home screen without the query.
 */
export function buildDeliveryPartnerSearchUrls(
  partnerId: string,
  recipeTitle: string,
): { deepLink: string; webUrl: string } | null {
  const query = buildDeliverySearchQuery(recipeTitle);
  if (!query) return null;

  const encoded = encodeURIComponent(query);

  if (partnerId === 'zomato') {
    const url = `https://www.zomato.com/search?query=${encoded}&${PARTNER_UTM}`;
    return { deepLink: url, webUrl: url };
  }

  if (partnerId === 'swiggy') {
    const url = `https://www.swiggy.com/search?query=${encoded}&${PARTNER_UTM}`;
    return { deepLink: url, webUrl: url };
  }

  return null;
}

export const DEFAULT_PARTNER_LINKS: Array<{
  partnerId: PartnerId;
  label: string;
  category: 'grocery' | 'delivery';
  deepLinkUrl: string;
  webUrl: string;
}> = [
  {
    partnerId: 'blinkit',
    label: 'Blinkit',
    category: 'grocery',
    deepLinkUrl:
      'https://blinkit.com/s/?q={query}&utm_source=rasoi&utm_medium=affiliate',
    webUrl: 'https://blinkit.com/s/?q={query}&utm_source=rasoi&utm_medium=affiliate',
  },
  {
    partnerId: 'zepto',
    label: 'Zepto',
    category: 'grocery',
    deepLinkUrl:
      'https://www.zeptonow.com/search?query={query}&utm_source=rasoi&utm_medium=affiliate',
    webUrl:
      'https://www.zeptonow.com/search?query={query}&utm_source=rasoi&utm_medium=affiliate',
  },
  {
    partnerId: 'instamart',
    label: 'Instamart',
    category: 'grocery',
    deepLinkUrl:
      'https://www.swiggy.com/instamart/search?query={query}&utm_source=rasoi&utm_medium=affiliate',
    webUrl:
      'https://www.swiggy.com/instamart/search?query={query}&utm_source=rasoi&utm_medium=affiliate',
  },
  {
    partnerId: 'zomato',
    label: 'Zomato',
    category: 'delivery',
    deepLinkUrl: `https://www.zomato.com/search?query={query}&${PARTNER_UTM}`,
    webUrl: `https://www.zomato.com/search?query={query}&${PARTNER_UTM}`,
  },
  {
    partnerId: 'swiggy',
    label: 'Swiggy',
    category: 'delivery',
    deepLinkUrl: `https://www.swiggy.com/search?query={query}&${PARTNER_UTM}`,
    webUrl: `https://www.swiggy.com/search?query={query}&${PARTNER_UTM}`,
  },
];

export function buildPartnerUrl(template: string, query: string): string {
  const encoded = encodeURIComponent(query.trim());
  return template.replace(/\{query\}/g, encoded).replace(/\{items\}/g, encoded);
}

/** Partner apps only support one search term — pick a single item to open. */
export function pickGroceryCheckoutItem(items: string[]): string {
  const trimmed = items.map((item) => item.trim()).filter(Boolean);
  return trimmed[0] ?? '';
}

export function buildGroceryCheckoutQuery(items: string[]): string {
  return pickGroceryCheckoutItem(items);
}
