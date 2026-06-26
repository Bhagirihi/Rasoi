export const PARTNER_REGIONS = ['IN', 'US', 'CA', 'AU'] as const;

export type PartnerRegion = (typeof PARTNER_REGIONS)[number];

export type PartnerCategory = 'grocery' | 'delivery';

export const PARTNER_REGION_LABELS: Record<PartnerRegion, string> = {
  IN: 'India',
  US: 'United States',
  CA: 'Canada',
  AU: 'Australia',
};

/** Legacy union — India partners still referenced in mobile types. */
export const INDIA_PARTNER_IDS = ['blinkit', 'zepto', 'instamart', 'zomato', 'swiggy'] as const;

export type PartnerId = (typeof INDIA_PARTNER_IDS)[number];

export type PartnerDefinition = {
  partnerId: string;
  label: string;
  category: PartnerCategory;
  region: PartnerRegion;
  deepLinkUrl: string;
  webUrl: string;
};

const UTM = 'utm_source=rasoi&utm_medium=affiliate';

export function buildDefaultPartnerUrls(region: PartnerRegion): {
  deepLinkUrl: string;
  webUrl: string;
} {
  const host =
    region === 'IN'
      ? 'https://example.in'
      : region === 'CA'
        ? 'https://example.ca'
        : region === 'AU'
          ? 'https://example.com.au'
          : 'https://example.com';
  const webUrl = `${host}/search?q={query}&${UTM}`;
  return { deepLinkUrl: webUrl, webUrl };
}

export const DEFAULT_PARTNER_LINKS: PartnerDefinition[] = [
  // India
  {
    partnerId: 'blinkit',
    label: 'Blinkit',
    category: 'grocery',
    region: 'IN',
    deepLinkUrl: `https://blinkit.com/s/?q={query}&${UTM}`,
    webUrl: `https://blinkit.com/s/?q={query}&${UTM}`,
  },
  {
    partnerId: 'zepto',
    label: 'Zepto',
    category: 'grocery',
    region: 'IN',
    deepLinkUrl: `https://www.zeptonow.com/search?query={query}&${UTM}`,
    webUrl: `https://www.zeptonow.com/search?query={query}&${UTM}`,
  },
  {
    partnerId: 'instamart',
    label: 'Instamart',
    category: 'grocery',
    region: 'IN',
    deepLinkUrl: `https://www.swiggy.com/instamart/search?query={query}&${UTM}`,
    webUrl: `https://www.swiggy.com/instamart/search?query={query}&${UTM}`,
  },
  {
    partnerId: 'zomato',
    label: 'Zomato',
    category: 'delivery',
    region: 'IN',
    deepLinkUrl: `zomato://search?q={query}&${UTM}`,
    webUrl: `https://www.zomato.com/search?q={query}&${UTM}`,
  },
  {
    partnerId: 'swiggy',
    label: 'Swiggy',
    category: 'delivery',
    region: 'IN',
    deepLinkUrl: `swiggy://explore?query={query}&${UTM}`,
    webUrl: `https://www.swiggy.com/search?q={query}&${UTM}`,
  },
  // United States
  {
    partnerId: 'instacart',
    label: 'Instacart',
    category: 'grocery',
    region: 'US',
    deepLinkUrl: `https://www.instacart.com/store/s?k={query}&${UTM}`,
    webUrl: `https://www.instacart.com/store/s?k={query}&${UTM}`,
  },
  {
    partnerId: 'amazon_us',
    label: 'Amazon',
    category: 'grocery',
    region: 'US',
    deepLinkUrl: `https://www.amazon.com/s?k={query}&${UTM}`,
    webUrl: `https://www.amazon.com/s?k={query}&${UTM}`,
  },
  {
    partnerId: 'doordash_us',
    label: 'DoorDash',
    category: 'delivery',
    region: 'US',
    deepLinkUrl: `https://www.doordash.com/search/store/{query}/?${UTM}`,
    webUrl: `https://www.doordash.com/search/store/{query}/?${UTM}`,
  },
  {
    partnerId: 'ubereats_us',
    label: 'Uber Eats',
    category: 'delivery',
    region: 'US',
    deepLinkUrl: `https://www.ubereats.com/search?q={query}&${UTM}`,
    webUrl: `https://www.ubereats.com/search?q={query}&${UTM}`,
  },
  // Canada
  {
    partnerId: 'instacart_ca',
    label: 'Instacart',
    category: 'grocery',
    region: 'CA',
    deepLinkUrl: `https://www.instacart.ca/store/s?k={query}&${UTM}`,
    webUrl: `https://www.instacart.ca/store/s?k={query}&${UTM}`,
  },
  {
    partnerId: 'amazon_ca',
    label: 'Amazon',
    category: 'grocery',
    region: 'CA',
    deepLinkUrl: `https://www.amazon.ca/s?k={query}&${UTM}`,
    webUrl: `https://www.amazon.ca/s?k={query}&${UTM}`,
  },
  {
    partnerId: 'skip',
    label: 'SkipTheDishes',
    category: 'delivery',
    region: 'CA',
    deepLinkUrl: `https://www.skipthedishes.com/search/{query}?${UTM}`,
    webUrl: `https://www.skipthedishes.com/search/{query}?${UTM}`,
  },
  {
    partnerId: 'ubereats_ca',
    label: 'Uber Eats',
    category: 'delivery',
    region: 'CA',
    deepLinkUrl: `https://www.ubereats.com/ca/search?q={query}&${UTM}`,
    webUrl: `https://www.ubereats.com/ca/search?q={query}&${UTM}`,
  },
  // Australia
  {
    partnerId: 'woolworths',
    label: 'Woolworths',
    category: 'grocery',
    region: 'AU',
    deepLinkUrl: `https://www.woolworths.com.au/shop/search/products?searchTerm={query}&${UTM}`,
    webUrl: `https://www.woolworths.com.au/shop/search/products?searchTerm={query}&${UTM}`,
  },
  {
    partnerId: 'coles',
    label: 'Coles',
    category: 'grocery',
    region: 'AU',
    deepLinkUrl: `https://www.coles.com.au/search?q={query}&${UTM}`,
    webUrl: `https://www.coles.com.au/search?q={query}&${UTM}`,
  },
  {
    partnerId: 'doordash_au',
    label: 'DoorDash',
    category: 'delivery',
    region: 'AU',
    deepLinkUrl: `https://www.doordash.com/en-AU/search/store/{query}/?${UTM}`,
    webUrl: `https://www.doordash.com/en-AU/search/store/{query}/?${UTM}`,
  },
  {
    partnerId: 'menulog',
    label: 'Menulog',
    category: 'delivery',
    region: 'AU',
    deepLinkUrl: `https://www.menulog.com.au/search/{query}?${UTM}`,
    webUrl: `https://www.menulog.com.au/search/{query}?${UTM}`,
  },
];

export function buildPartnerUrl(template: string, query: string): string {
  const encoded = encodeURIComponent(query.trim());
  return template.replace(/\{query\}/g, encoded).replace(/\{items\}/g, encoded);
}

export function isPartnerRegion(value: string): value is PartnerRegion {
  return (PARTNER_REGIONS as readonly string[]).includes(value);
}
