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
    deepLinkUrl: 'zomato://search?q={query}&utm_source=rasoi&utm_medium=affiliate',
    webUrl: 'https://www.zomato.com/search?q={query}&utm_source=rasoi&utm_medium=affiliate',
  },
  {
    partnerId: 'swiggy',
    label: 'Swiggy',
    category: 'delivery',
    deepLinkUrl: 'swiggy://explore?query={query}&utm_source=rasoi&utm_medium=affiliate',
    webUrl: 'https://www.swiggy.com/search?q={query}&utm_source=rasoi&utm_medium=affiliate',
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
