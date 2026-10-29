import AsyncStorage from '@react-native-async-storage/async-storage';

import { CURRENT_TERMS_VERSION } from '@/constants/legalHighlights';

const LEGAL_CONSENT_KEY = '@rasoi/legal_consent';

type LegalConsentRecord = {
  acceptedAt: string;
  termsVersion: string;
};

export async function hasLegalConsent(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(LEGAL_CONSENT_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as LegalConsentRecord;
    return parsed.termsVersion === CURRENT_TERMS_VERSION;
  } catch {
    return false;
  }
}

export async function saveLegalConsent(): Promise<void> {
  const record: LegalConsentRecord = {
    acceptedAt: new Date().toISOString(),
    termsVersion: CURRENT_TERMS_VERSION,
  };
  await AsyncStorage.setItem(LEGAL_CONSENT_KEY, JSON.stringify(record));
}

export async function clearLegalConsent(): Promise<void> {
  await AsyncStorage.removeItem(LEGAL_CONSENT_KEY);
}
