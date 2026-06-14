/** Prisma models in the `rasoi` schema — used for Supabase Realtime publication setup. */
export const RASOI_REALTIME_TABLES = [
  'User',
  'Admin',
  'Recipe',
  'Sponsor',
  'PartnerLink',
  'KitchenStyle',
  'RegionalCuisineOption',
  'PantrySection',
  'SponsorApplication',
  'AffiliateEvent',
  'PushToken',
] as const;

export const RASOI_REALTIME_SCHEMA = 'rasoi';
