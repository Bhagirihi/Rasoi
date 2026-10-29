import type { User } from '@/lib/db/types';

export type KitchenPreferences = {
  allergyExclusions?: string[];
  householdSize?: number;
  freePartnerShopsUsed?: number;
  freePartnerShopsMonthKey?: string;
};

export const DEFAULT_HOUSEHOLD_SIZE = 4;
export const FREE_PARTNER_SHOPS_PER_MONTH = 2;

export function parseKitchenPreferences(raw: string | null | undefined): KitchenPreferences {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as KitchenPreferences;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function serializeKitchenPreferences(prefs: KitchenPreferences): string {
  return JSON.stringify(prefs);
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

export function kitchenPreferencesFromUser(user: User): KitchenPreferences {
  return parseKitchenPreferences((user as User & { kitchenPreferences?: string }).kitchenPreferences);
}
