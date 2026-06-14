import type { AffiliatePartner, FoodDeliveryPartner } from '@/constants/partners';

export type { FoodDeliveryPartner };

export const FREE_APP_BADGE = 'Free · Trial · Rasoi Plus';

export const REVENUE_DISCLOSURE =
  'Rasoi Plus unlocks Blinkit, Zepto, Instamart, Zomato & Swiggy. Free and trial plans may show ads.';

export const FOOD_DELIVERY_DISCLOSURE =
  'Opens Zomato or Swiggy with affiliate tracking when their partner program applies.';

export const GROCERY_PARTNER_UI: Record<
  AffiliatePartner,
  { delivery: string; accent: string; textOnAccent: string }
> = {
  blinkit: {
    delivery: '~10 min',
    accent: '#F8CB46',
    textOnAccent: '#1A1A2E',
  },
  zepto: {
    delivery: '~15 min',
    accent: '#7C3AED',
    textOnAccent: '#FFFFFF',
  },
  instamart: {
    delivery: '~20 min',
    accent: '#FF5200',
    textOnAccent: '#FFFFFF',
  },
};

export const DELIVERY_PARTNER_UI: Record<
  FoodDeliveryPartner,
  { tagline: string; accent: string }
> = {
  zomato: {
    tagline: 'Restaurants nearby',
    accent: '#E23744',
  },
  swiggy: {
    tagline: 'Food delivery',
    accent: '#FC8019',
  },
};

/** Fallback list for static UI when PartnersContext is unavailable. */
export const AFFILIATE_PARTNERS: Array<{
  id: AffiliatePartner;
  label: string;
  delivery: string;
  accent: string;
  textOnAccent: string;
}> = [
  {
    id: 'blinkit',
    label: 'Blinkit',
    delivery: GROCERY_PARTNER_UI.blinkit.delivery,
    accent: GROCERY_PARTNER_UI.blinkit.accent,
    textOnAccent: GROCERY_PARTNER_UI.blinkit.textOnAccent,
  },
  {
    id: 'zepto',
    label: 'Zepto',
    delivery: GROCERY_PARTNER_UI.zepto.delivery,
    accent: GROCERY_PARTNER_UI.zepto.accent,
    textOnAccent: GROCERY_PARTNER_UI.zepto.textOnAccent,
  },
  {
    id: 'instamart',
    label: 'Instamart',
    delivery: GROCERY_PARTNER_UI.instamart.delivery,
    accent: GROCERY_PARTNER_UI.instamart.accent,
    textOnAccent: GROCERY_PARTNER_UI.instamart.textOnAccent,
  },
];

export const FOOD_DELIVERY_PARTNERS: Array<{
  id: FoodDeliveryPartner;
  label: string;
  tagline: string;
  accent: string;
}> = [
  {
    id: 'zomato',
    label: 'Zomato',
    tagline: DELIVERY_PARTNER_UI.zomato.tagline,
    accent: DELIVERY_PARTNER_UI.zomato.accent,
  },
  {
    id: 'swiggy',
    label: 'Swiggy',
    tagline: DELIVERY_PARTNER_UI.swiggy.tagline,
    accent: DELIVERY_PARTNER_UI.swiggy.accent,
  },
];

export const HOME_SPONSOR = {
  brandName: 'Amul',
  productLabel: 'Amul Paneer — tonight\'s dinner sorted',
  tagline: 'Fresh block paneer, perfect for curries',
  logoUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png',
  cta: 'View deal',
};

export const PANTRY_SPONSOR = {
  brandName: 'Tata Sampann',
  productLabel: 'Restock dal & spices in one order',
  tagline: 'Sponsored pantry essentials bundle',
  logoUrl:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/120px-Tata_logo.svg.png',
};
