export type KitchenPreferences = {
  allergyExclusions?: string[];
  householdSize?: number;
  freePartnerShopsUsed?: number;
  freePartnerShopsMonthKey?: string;
};

export const DEFAULT_HOUSEHOLD_SIZE = 4;
export const FREE_PARTNER_SHOPS_PER_MONTH = 2;

export const COMMON_ALLERGY_OPTIONS = [
  'Peanuts',
  'Doodh',
  'Dahi',
  'Besan',
  'Gehu Atta',
  'Soy',
  'Eggs',
  'Paneer',
] as const;

export function parseKitchenPreferences(raw: unknown): KitchenPreferences {
  if (!raw || typeof raw !== 'object') return {};
  return raw as KitchenPreferences;
}

function currentMonthKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getFreePartnerShopsRemaining(
  prefs: KitchenPreferences,
  now = new Date(),
): number {
  const monthKey = currentMonthKey(now);
  const used =
    prefs.freePartnerShopsMonthKey === monthKey ? (prefs.freePartnerShopsUsed ?? 0) : 0;
  return Math.max(0, FREE_PARTNER_SHOPS_PER_MONTH - used);
}

export function recordPartnerCheckout(prefs: KitchenPreferences, now = new Date()): KitchenPreferences {
  const monthKey = currentMonthKey(now);
  const used =
    prefs.freePartnerShopsMonthKey === monthKey ? (prefs.freePartnerShopsUsed ?? 0) : 0;

  return {
    ...prefs,
    freePartnerShopsMonthKey: monthKey,
    freePartnerShopsUsed: used + 1,
  };
}
