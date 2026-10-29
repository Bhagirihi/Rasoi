import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@rasoi/pending_email_verification';

export type PendingEmailVerificationFlow = 'login' | 'signup';

export type PendingEmailVerification = {
  email: string;
  flow: PendingEmailVerificationFlow;
  name?: string;
  phone?: string;
  termsAccepted?: boolean;
  reason: 'email_delivery_unavailable';
  savedAt: string;
};

export async function loadPendingEmailVerification(): Promise<PendingEmailVerification | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingEmailVerification;
    if (!parsed?.email || !parsed.flow) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function savePendingEmailVerification(
  pending: PendingEmailVerification,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
}

export async function clearPendingEmailVerification(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
