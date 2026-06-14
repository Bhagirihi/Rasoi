import AsyncStorage from '@react-native-async-storage/async-storage';

import { PlanTier } from '@/constants/plans';

const KEYS = {
  planTier: '@rasoi/plan_tier',
  trialStartedAt: '@rasoi/trial_started_at',
  hasUsedTrial: '@rasoi/has_used_trial',
} as const;

export interface StoredPlanState {
  planTier: PlanTier;
  trialStartedAt: string | null;
  hasUsedTrial: boolean;
}

export async function loadPlanState(): Promise<StoredPlanState> {
  const entries = await AsyncStorage.multiGet(Object.values(KEYS));
  const map = Object.fromEntries(entries) as Record<string, string | null>;

  const tier = map[KEYS.planTier];
  const planTier: PlanTier =
    tier === 'free' || tier === 'trial' || tier === 'paid' ? tier : 'free';

  return {
    planTier,
    trialStartedAt: map[KEYS.trialStartedAt] ?? null,
    hasUsedTrial: map[KEYS.hasUsedTrial] === 'true',
  };
}

export async function savePlanTier(planTier: PlanTier): Promise<void> {
  await AsyncStorage.setItem(KEYS.planTier, planTier);
}

export async function saveTrialStartedAt(iso: string): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.trialStartedAt, iso],
    [KEYS.hasUsedTrial, 'true'],
    [KEYS.planTier, 'trial'],
  ]);
}

export async function markTrialUsed(): Promise<void> {
  await AsyncStorage.setItem(KEYS.hasUsedTrial, 'true');
}

export async function clearPlanState(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
