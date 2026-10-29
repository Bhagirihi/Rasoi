import { NativeModules, Platform } from 'react-native';

import { authError, authLog } from '@/utils/authLogger';
import { assertAllowedIndianPhone } from '@/utils/identityValidation';

type AuthModule = typeof import('@react-native-firebase/auth').default;
type ConfirmationResult = import('@react-native-firebase/auth').FirebaseAuthTypes.ConfirmationResult;

let authModule: AuthModule | null | undefined;
let pendingConfirmation: ConfirmationResult | null = null;
let verifiedPhoneDigits: string | null = null;

function maskPhone(digits: string): string {
  if (digits.length < 4) return '****';
  return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
}

export function isPhoneVerificationSkipped(): boolean {
  // Dev-only escape hatch: the flag alone is not enough — it must also be a
  // dev build. Otherwise a misbuilt release APK could claim any phone number.
  if (!__DEV__) return false;
  const flag = process.env.EXPO_PUBLIC_SKIP_PHONE_VERIFY?.trim().toLowerCase();
  return flag === '1' || flag === 'true';
}

export function isFirebasePhoneAuthAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  return Boolean(NativeModules.RNFBAppModule);
}

async function getAuth(): Promise<AuthModule | null> {
  if (!isFirebasePhoneAuthAvailable()) return null;

  if (authModule !== undefined) {
    return authModule;
  }

  try {
    authModule = (await import('@react-native-firebase/auth')).default;
    return authModule;
  } catch (error) {
    authError('firebasePhoneAuth:module_load_failed', error);
    authModule = null;
    return null;
  }
}

function toE164IndianPhone(digits: string): string {
  assertAllowedIndianPhone(digits);
  return `+91${digits}`;
}

function mapFirebasePhoneError(error: unknown): Error {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String((error as { code?: string }).code ?? '')
      : '';

  if (code.includes('invalid-phone-number')) {
    return new Error('Enter a valid 10-digit Indian mobile number.');
  }
  if (code.includes('too-many-requests')) {
    return new Error('Too many SMS attempts. Wait a few minutes and try again.');
  }
  if (code.includes('invalid-verification-code')) {
    return new Error('Invalid SMS code. Check the message and try again.');
  }
  if (code.includes('code-expired') || code.includes('session-expired')) {
    return new Error('SMS code expired. Tap Resend code to get a new one.');
  }
  if (code.includes('quota-exceeded')) {
    return new Error('SMS verification is temporarily unavailable. Try again later.');
  }

  const message = error instanceof Error ? error.message : String(error);
  return new Error(message || 'Could not verify your mobile number. Try again.');
}

export function getVerifiedPhoneDigits(): string | null {
  return verifiedPhoneDigits;
}

export function clearVerifiedPhoneSignup(): void {
  verifiedPhoneDigits = null;
  pendingConfirmation = null;
}

export async function signOutFirebasePhoneAuth(): Promise<void> {
  const auth = await getAuth();
  if (!auth) return;

  try {
    await auth().signOut();
  } catch {
    // no-op
  } finally {
    clearVerifiedPhoneSignup();
  }
}

export async function sendFirebasePhoneOtp(indianPhone10: string): Promise<void> {
  if (isPhoneVerificationSkipped()) {
    verifiedPhoneDigits = indianPhone10.replace(/\D/g, '').slice(-10);
    authLog('firebasePhoneAuth:skipped');
    return;
  }

  const auth = await getAuth();
  if (!auth) {
    throw new Error(
      'Mobile verification is not available on this build. Install the latest Rasoi app and try again.',
    );
  }

  const digits = indianPhone10.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
  const e164 = toE164IndianPhone(digits);

  authLog('firebasePhoneAuth:send_start', { phone: maskPhone(digits) });

  try {
    pendingConfirmation = await auth().signInWithPhoneNumber(e164);
    verifiedPhoneDigits = null;
    authLog('firebasePhoneAuth:send_success', { phone: maskPhone(digits) });
  } catch (error) {
    pendingConfirmation = null;
    authError('firebasePhoneAuth:send_failed', error, { phone: maskPhone(digits) });
    throw mapFirebasePhoneError(error);
  }
}

export async function verifyFirebasePhoneOtp(code: string): Promise<string> {
  const token = code.replace(/\D/g, '').trim();

  if (isPhoneVerificationSkipped()) {
    if (token.length < 4) {
      throw new Error('Enter the SMS verification code.');
    }
    const digits = verifiedPhoneDigits ?? '';
    if (!digits) {
      throw new Error('Start mobile verification again from the previous step.');
    }
    authLog('firebasePhoneAuth:verify_skipped', { phone: maskPhone(digits) });
    return digits;
  }

  if (token.length < 6) {
    throw new Error('Enter the 6-digit SMS code.');
  }

  if (!pendingConfirmation) {
    throw new Error('SMS session expired. Go back and request a new code.');
  }

  authLog('firebasePhoneAuth:verify_start', { otpLength: token.length });

  try {
    await pendingConfirmation.confirm(token);
    const auth = await getAuth();
    const firebasePhone = auth?.().currentUser?.phoneNumber ?? '';
    const digits = firebasePhone.replace(/\D/g, '').replace(/^91/, '').slice(-10);

    if (digits.length !== 10) {
      throw new Error('Phone verification failed. Try again.');
    }

    verifiedPhoneDigits = digits;
    pendingConfirmation = null;

    if (auth) {
      await auth().signOut();
    }

    authLog('firebasePhoneAuth:verify_success', { phone: maskPhone(digits) });
    return digits;
  } catch (error) {
    authError('firebasePhoneAuth:verify_failed', error);
    throw mapFirebasePhoneError(error);
  }
}

export async function resendFirebasePhoneOtp(indianPhone10: string): Promise<void> {
  clearVerifiedPhoneSignup();
  await sendFirebasePhoneOtp(indianPhone10);
}
