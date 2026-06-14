/** Rasoi App Store — Jamvanu competitor layout. See docs/RASOI_APP_STORE_DESIGN_SYSTEM.md */

export const CANVAS = { width: 1290, height: 2796 } as const;

/** Jamvanu orange headline band (~32%) — App Store search crop */
export const ORANGE_BAND_HEIGHT = 900;
export const CONTENT_OVERLAP = 72;
export const CONTENT_TOP = ORANGE_BAND_HEIGHT - CONTENT_OVERLAP;

export const CREAM_BODY = '#FFF9F6';
export const HERO_BG = '#FFFFFF';

export const STORE_BG = `linear-gradient(180deg, #FF9933 0%, #FF6B35 100%)`;
export const BAND_GRADIENT = 'linear-gradient(180deg, #FF9933 0%, #FF6B35 100%)';

export const rasoi = {
  primary: '#FF6B35',
  saffron: '#FF9933',
  green: '#00A86B',
  cream: '#FAFAFA',
  charcoal: '#1A1A2E',
  danger: '#E53935',
  egg: '#F4C430',
  white: '#FFFFFF',
} as const;

export const partners = {
  blinkit: { name: 'Blinkit', bg: '#F7E06E', color: '#1A7A3A' },
  zepto: { name: 'Zepto', bg: '#6B21A8', color: '#FFFFFF' },
  instamart: { name: 'Instamart', bg: '#FF6B35', color: '#FFFFFF' },
  zomato: { name: 'Zomato', bg: '#E23744', color: '#FFFFFF' },
  swiggy: { name: 'Swiggy', bg: '#FC8019', color: '#FFFFFF' },
} as const;

export const spacing = { screenX: 56, contentX: 48 } as const;

export const storeDesign = {
  cardRadius: 28,
  cardRadiusSm: 20,
  cardShadow: '0 12px 36px rgba(26,26,46,0.08)',
  cardShadowLg: '0 20px 52px rgba(26,26,46,0.12)',
  cardBorder: '1px solid rgba(26,26,46,0.06)',
  headlineShadow: '0 4px 28px rgba(0,0,0,0.16)',
  taglineShadow: '0 2px 12px rgba(0,0,0,0.12)',
  warmWhite: '#FFFBF8',
  warmGlow: 'radial-gradient(ellipse 80% 55% at 50% 38%, rgba(255,153,51,0.12) 0%, transparent 72%)',
} as const;

export const FOOD_IMAGES = {
  dosa: 'https://images.unsplash.com/photo-1743615467204-8fdaa85ff2db?w=800&q=85',
  pavBhaji: 'https://images.unsplash.com/photo-1753357303396-704b5abe8945?w=800&q=85',
  vadaPav: 'https://images.unsplash.com/photo-1750767397012-3413ba4fdbc7?w=800&q=85',
  dal: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=85',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=85',
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=85',
  thali: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=85',
  fish: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=85',
} as const;

export type ScreenId =
  | 'hero'
  | 'todays-picks'
  | 'pantry-match'
  | 'indian-regions'
  | 'smart-filters'
  | 'cook-shop-order'
  | 'personalization'
  | 'final';

export const SCREEN_META: Array<{
  id: ScreenId;
  file: string;
  title: string;
  headline: string;
  competitor: string;
}> = [
  { id: 'hero', file: '01-hero.png', title: '01 — Hero', headline: 'Aaj Kya Banaye?', competitor: 'Jamvanu hook + Taco Bell clarity' },
  { id: 'todays-picks', file: '02-todays-picks.png', title: '02 — Dinner Decided', headline: 'Dinner,\nDecided.', competitor: 'Jamvanu notification story' },
  { id: 'pantry-match', file: '03-pantry-match.png', title: '03 — Pantry Match', headline: 'Cook From\nYour Pantry', competitor: 'Blinkit ingredient clarity' },
  { id: 'indian-regions', file: '04-indian-region-recipes.png', title: '04 — Explore India', headline: '1,200+\nRecipes', competitor: 'Swiggy number-led trust' },
  { id: 'smart-filters', file: '05-partners.png', title: '05 — Shop & Order', headline: 'Shop. Order.\nEat.', competitor: 'Plat partners + Zepto minimal' },
  { id: 'cook-shop-order', file: '06-notifications.png', title: '06 — Daily Picks', headline: '5 Daily\nMeal Picks', competitor: 'Jamvanu push cards' },
  { id: 'personalization', file: '07-fuel-kitchen.png', title: '07 — Fuel Kitchen', headline: 'Fuel Your\nKitchen', competitor: 'Zomato emotion split' },
  { id: 'final', file: '08-recipes.png', title: '08 — Final CTA', headline: 'Cook Smarter\nWith Rasoi', competitor: 'Feature credibility + CTA' },
];

export const SCREEN_IDS = SCREEN_META.map((s) => s.id);
