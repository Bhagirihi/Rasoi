import AsyncStorage from '@react-native-async-storage/async-storage';

export type TrialNudgeKind = 't1' | 't0';

const KEYS: Record<TrialNudgeKind, string> = {
  t1: '@rasoi/trial_nudge_t1_trial_at',
  t0: '@rasoi/trial_nudge_t0_trial_at',
};

export async function wasTrialNudgeShown(
  kind: TrialNudgeKind,
  trialStartedAt: string,
): Promise<boolean> {
  const stored = await AsyncStorage.getItem(KEYS[kind]);
  return stored === trialStartedAt;
}

export async function markTrialNudgeShown(
  kind: TrialNudgeKind,
  trialStartedAt: string,
): Promise<void> {
  await AsyncStorage.setItem(KEYS[kind], trialStartedAt);
}

export async function clearTrialNudgeFlags(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
