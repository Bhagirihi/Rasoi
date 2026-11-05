import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@rasoi/trial_value_moment_shown';

/** One-shot mid-trial prompt after first cook or partner shop. */
export async function wasTrialValueMomentShown(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEY)) === '1';
}

export async function markTrialValueMomentShown(): Promise<void> {
  await AsyncStorage.setItem(KEY, '1');
}
