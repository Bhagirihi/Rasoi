export const PARTNER_IDS = ['blinkit', 'zepto', 'instamart', 'zomato', 'swiggy'] as const;

export type PartnerId = (typeof PARTNER_IDS)[number];
export type AffiliatePartner = 'blinkit' | 'zepto' | 'instamart';
export type FoodDeliveryPartner = 'zomato' | 'swiggy';

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
      'blinkit://cart/checkout?items={query}&affiliate_id=rasoi_india&source=recipe_detail',
    webUrl: 'https://blinkit.com/s/?q={query}',
  },
  {
    partnerId: 'zepto',
    label: 'Zepto',
    category: 'grocery',
    deepLinkUrl:
      'zepto://checkout/cart?products={query}&ref=rasoi_partner&campaign=cook_today',
    webUrl: 'https://www.zeptonow.com/search?query={query}',
  },
  {
    partnerId: 'instamart',
    label: 'Instamart',
    category: 'grocery',
    deepLinkUrl:
      'swiggy://instamart/cart?item_list={query}&partner=rasoi&medium=affiliate',
    webUrl: 'https://www.swiggy.com/instamart/search?query={query}',
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

export function buildGroceryCheckoutQuery(items: string[]): string {
  return items.map((item) => item.trim()).filter(Boolean).join(', ');
}
