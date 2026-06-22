import AsyncStorage from '@react-native-async-storage/async-storage';

import { CuisineId, DietChoice } from '@/constants/theme';
import { DietType } from '@/data/mockRecipes';
import { clearAuthToken } from '@/utils/authToken';
import {
  getDisposableEmailError,
  getDummyPhoneError,
  isDisposableEmail,
  isDummyIndianPhone,
} from '@/utils/identityValidation';

const KEYS = {
  onboardingComplete: '@rasoi/onboarding_complete',
  dietPreference: '@rasoi/diet_preference',
  dietChoice: '@rasoi/diet_choice',
  regionalCuisine: '@rasoi/regional_cuisine',
  favoriteCuisines: '@rasoi/favorite_cuisines',
  notificationsEnabled: '@rasoi/notifications_enabled',
  pendingTrialWelcome: '@rasoi/pending_trial_welcome',
} as const;

export const DEFAULT_PANTRY: string[] = [];

export interface LocalOnboardingState {
  hasCompletedOnboarding: boolean;
  dietPreference: DietType;
  dietChoice: DietChoice;
  regionalCuisine: string;
  favoriteCuisines: CuisineId[];
  notificationsEnabled: boolean;
}

export interface OnboardingPayload {
  dietPreference: DietType;
  dietChoice: DietChoice;
  regionalCuisine: string;
  favoriteCuisines: CuisineId[];
  notificationsEnabled: boolean;
}

export function localStateToOnboardingPayload(
  local: LocalOnboardingState,
): OnboardingPayload | null {
  if (!local.hasCompletedOnboarding) return null;
  return {
    dietPreference: local.dietPreference,
    dietChoice: local.dietChoice,
    regionalCuisine: local.regionalCuisine,
    favoriteCuisines: local.favoriteCuisines,
    notificationsEnabled: local.notificationsEnabled,
  };
}

export async function loadLocalOnboardingState(): Promise<LocalOnboardingState> {
  const entries = await AsyncStorage.multiGet(Object.values(KEYS));
  const map = Object.fromEntries(entries) as Record<string, string | null>;

  const dietValue = map[KEYS.dietPreference];
  const validDiet: DietType =
    dietValue === 'Veg' || dietValue === 'Egg' || dietValue === 'Non-Veg'
      ? dietValue
      : 'Veg';

  const dietChoiceValue = map[KEYS.dietChoice];
  const dietChoice: DietChoice =
    dietChoiceValue === 'Veg' ||
    dietChoiceValue === 'Egg' ||
    dietChoiceValue === 'Non-Veg' ||
    dietChoiceValue === 'Jain'
      ? dietChoiceValue
      : 'Veg';

  let favoriteCuisines: CuisineId[] = [];
  try {
    favoriteCuisines = JSON.parse(map[KEYS.favoriteCuisines] ?? '[]') as CuisineId[];
  } catch {
    favoriteCuisines = [];
  }

  return {
    hasCompletedOnboarding: map[KEYS.onboardingComplete] === 'true',
    dietPreference: validDiet,
    dietChoice,
    regionalCuisine: map[KEYS.regionalCuisine] ?? 'All India',
    favoriteCuisines,
    notificationsEnabled: map[KEYS.notificationsEnabled] === 'true',
  };
}

export async function saveOnboardingComplete(payload: OnboardingPayload): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.onboardingComplete, 'true'],
    [KEYS.dietPreference, payload.dietPreference],
    [KEYS.dietChoice, payload.dietChoice],
    [KEYS.regionalCuisine, payload.regionalCuisine],
    [KEYS.favoriteCuisines, JSON.stringify(payload.favoriteCuisines)],
    [KEYS.notificationsEnabled, payload.notificationsEnabled ? 'true' : 'false'],
  ]);
}

export async function clearAuthState(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
  await clearAuthToken();
  const { clearCachedUserProfile } = await import('@/utils/userProfileCache');
  await clearCachedUserProfile();
}

export async function loadPendingTrialWelcome(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.pendingTrialWelcome);
  return value === 'true';
}

export async function savePendingTrialWelcome(pending: boolean): Promise<void> {
  if (pending) {
    await AsyncStorage.setItem(KEYS.pendingTrialWelcome, 'true');
  } else {
    await AsyncStorage.removeItem(KEYS.pendingTrialWelcome);
  }
}

export function normalizeIndianPhone(input: string): string {
  let digits = input.replace(/\D/g, '');

  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 10);
}

export function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizeIndianPhone(phone);
  return /^[6-9]\d{9}$/.test(normalized) && !isDummyIndianPhone(normalized);
}

export function isValidPhoneLength(phone: string): boolean {
  return isValidIndianPhone(phone);
}

/** User-facing copy when mobile validation fails. */
export function getIndianPhoneError(phone: string): string | null {
  const normalized = normalizeIndianPhone(phone);
  if (normalized.length === 0) {
    return 'Enter your 10-digit mobile number.';
  }
  if (normalized.length < 10) {
    return `Enter all 10 digits (${normalized.length}/10 so far).`;
  }
  if (!/^[6-9]/.test(normalized)) {
    return 'Indian mobile numbers start with 6, 7, 8, or 9 — e.g. 9876543210.';
  }
  if (isDummyIndianPhone(normalized)) {
    return getDummyPhoneError();
  }
  return null;
}

export function isValidEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) && !isDisposableEmail(normalized);
}

export function getEmailValidationError(email: string): string | null {
  const normalized = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return 'Enter a valid email address.';
  }
  if (isDisposableEmail(normalized)) {
    return getDisposableEmailError();
  }
  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function dietChoiceToFilter(dietChoice: DietChoice): DietType {
  if (dietChoice === 'Non-Veg') return 'Non-Veg';
  if (dietChoice === 'Egg') return 'Egg';
  return 'Veg';
}
