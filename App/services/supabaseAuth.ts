import type { AuthError, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authError, authLog, maskEmail } from '@/utils/authLogger';
import { mapSupabaseOtpSendError } from '@/utils/emailDeliveryErrors';
import {
  assertAllowedEmail,
  assertAllowedIndianPhone,
  assertLoginAllowedEmail,
} from '@/utils/identityValidation';
import {
  clearSupabaseSessionCache,
  getSupabaseClient,
  getSupabaseSessionCache,
  requireSupabaseClient,
  setSupabaseSessionCache,
} from '@/utils/supabase';

export type OtpFlow = 'signup' | 'login' | 'guest_upgrade';

const ANONYMOUS_AUTH_DISABLED_KEY = '@rasoi/anonymous_auth_disabled';

export class AnonymousAuthDisabledError extends Error {
  constructor() {
    super('Anonymous sign-ins are disabled');
    this.name = 'AnonymousAuthDisabledError';
  }
}

export function isAnonymousAuthDisabledError(error: unknown): boolean {
  if (error instanceof AnonymousAuthDisabledError) return true;
  const authErrorLike = error as AuthError | null;
  if (authErrorLike?.code === 'anonymous_provider_disabled') return true;
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  return (
    lower.includes('anonymous sign-ins are disabled') ||
    lower.includes('anonymous_provider_disabled') ||
    lower.includes('guest mode is temporarily unavailable')
  );
}

export async function isAnonymousAuthKnownDisabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ANONYMOUS_AUTH_DISABLED_KEY)) === 'true';
  } catch {
    return false;
  }
}

async function markAnonymousAuthDisabled(): Promise<void> {
  try {
    await AsyncStorage.setItem(ANONYMOUS_AUTH_DISABLED_KEY, 'true');
  } catch {
    // Non-fatal — we will retry anonymous once per install if storage fails.
  }
}

/** Returns a session when anonymous auth works; null when disabled (API-only guest). */
export async function trySignInAnonymously(): Promise<Session | null> {
  if (await isAnonymousAuthKnownDisabled()) {
    authLog('trySignInAnonymously:skipped_known_disabled');
    return null;
  }

  try {
    return await signInAnonymously();
  } catch (error) {
    if (isAnonymousAuthDisabledError(error)) {
      await markAnonymousAuthDisabled();
      authLog('trySignInAnonymously:disabled');
      return null;
    }
    throw error;
  }
}

type OtpVerifyType = 'email' | 'email_change';

const OTP_TYPE_STORAGE_PREFIX = '@rasoi/otp_verify_type/';
const otpTypeByKey = new Map<string, OtpVerifyType>();

function otpCacheKey(email: string, flow: OtpFlow): string {
  return `${flow}:${email.trim().toLowerCase()}`;
}

async function rememberOtpType(email: string, flow: OtpFlow, type: OtpVerifyType): Promise<void> {
  const key = otpCacheKey(email, flow);
  otpTypeByKey.set(key, type);
  try {
    await AsyncStorage.setItem(`${OTP_TYPE_STORAGE_PREFIX}${key}`, type);
  } catch {
    // Non-fatal — in-memory cache still works for the current session.
  }
}

async function getRememberedOtpType(email: string, flow: OtpFlow): Promise<OtpVerifyType | undefined> {
  const key = otpCacheKey(email, flow);
  const cached = otpTypeByKey.get(key);
  if (cached) return cached;

  try {
    const stored = await AsyncStorage.getItem(`${OTP_TYPE_STORAGE_PREFIX}${key}`);
    if (stored === 'email' || stored === 'email_change') {
      otpTypeByKey.set(key, stored);
      return stored;
    }
  } catch {
    // Fall back to flow default below.
  }

  return undefined;
}

async function clearRememberedOtpType(email: string, flow: OtpFlow): Promise<void> {
  const key = otpCacheKey(email, flow);
  otpTypeByKey.delete(key);
  try {
    await AsyncStorage.removeItem(`${OTP_TYPE_STORAGE_PREFIX}${key}`);
  } catch {
    // Non-fatal.
  }
}

/** signInWithOtp codes always verify with `email`; guest email updates use `email_change`. */
function defaultOtpType(flow: OtpFlow): OtpVerifyType {
  return flow === 'guest_upgrade' ? 'email_change' : 'email';
}

function mapVerifyOtpError(error: AuthError): Error {
  const lower = error.message.toLowerCase();
  if (lower.includes('expired') && !lower.includes('invalid')) {
    return new Error('Code expired. Tap Resend code and try again.');
  }
  if (lower.includes('expired') || lower.includes('invalid')) {
    return new Error('Invalid verification code. Check the latest email and try again.');
  }
  return new Error(error.message || 'Invalid verification code. Please try again.');
}

async function getActiveSession(): Promise<Session | null> {
  return getSupabaseSession();
}

export async function signInAnonymously(): Promise<Session> {
  authLog('signInAnonymously:start');

  const existing = await getActiveSession();
  if (existing?.user?.is_anonymous) {
    authLog('signInAnonymously:reuse', { userId: existing.user.id.slice(0, 8) });
    return existing;
  }

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    if (isAnonymousAuthDisabledError(error)) {
      authLog('signInAnonymously:disabled', { code: error.code });
      throw new AnonymousAuthDisabledError();
    }
    authError('signInAnonymously:supabase_error', error, {
      status: error.status,
      code: error.code,
    });
    throw new Error(error.message || 'Could not start guest session. Try again.');
  }

  if (!data.session?.access_token) {
    throw new Error('Guest sign-in failed. Please try again.');
  }

  setSupabaseSessionCache(data.session);
  authLog('signInAnonymously:success', { userId: data.user?.id?.slice(0, 8) });
  return data.session;
}

export async function sendEmailOtp(name: string, phone: string, email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  assertAllowedEmail(normalizedEmail);
  assertAllowedIndianPhone(phone);
  authLog('sendEmailOtp:start', {
    email: maskEmail(normalizedEmail),
    nameLength: name.trim().length,
    phoneLength: phone.length,
  });

  let supabase;
  try {
    supabase = requireSupabaseClient();
  } catch (error) {
    authError('sendEmailOtp:supabase_not_configured', error);
    throw error;
  }

  const session = await getActiveSession();
  const upgradingGuest = session?.user?.is_anonymous === true;

  if (upgradingGuest) {
    authLog('sendEmailOtp:guest_upgrade', { email: maskEmail(normalizedEmail) });
    const { error } = await supabase.auth.updateUser({
      email: normalizedEmail,
      data: {
        name: name.trim(),
        phone,
      },
    });

    if (error) {
      authError('sendEmailOtp:guest_upgrade_error', error, {
        email: maskEmail(normalizedEmail),
        status: error.status,
        code: error.code,
      });
      if (error.message.toLowerCase().includes('already registered')) {
        throw new Error('This email is already registered. Log in instead.');
      }
      throw mapSupabaseOtpSendError(error);
    }

    authLog('sendEmailOtp:guest_upgrade_success', { email: maskEmail(normalizedEmail) });
    await rememberOtpType(normalizedEmail, 'guest_upgrade', 'email_change');
    return;
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
      data: {
        name: name.trim(),
        phone,
      },
    },
  });

  if (error) {
    authError('sendEmailOtp:supabase_error', error, {
      email: maskEmail(normalizedEmail),
      status: error.status,
      code: error.code,
    });
    if (error.message.toLowerCase().includes('rate limit')) {
      throw new Error('Too many attempts. Wait a minute and try again.');
    }
    if (error.message.toLowerCase().includes('invalid') && error.message.toLowerCase().includes('email')) {
      throw new Error('Enter a valid email address.');
    }
    throw mapSupabaseOtpSendError(error);
  }

  authLog('sendEmailOtp:success', {
    email: maskEmail(normalizedEmail),
    hasSession: Boolean(data.session),
  });
  await rememberOtpType(normalizedEmail, 'signup', 'email');
}

export async function sendLoginEmailOtp(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  assertLoginAllowedEmail(normalizedEmail);
  authLog('sendLoginEmailOtp:start', { email: maskEmail(normalizedEmail) });

  const supabase = requireSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    authError('sendLoginEmailOtp:supabase_error', error, {
      email: maskEmail(normalizedEmail),
      status: error.status,
      code: error.code,
    });
    if (error.message.toLowerCase().includes('signups not allowed')) {
      throw new Error('No account found for this email. Create an account first.');
    }
    if (error.message.toLowerCase().includes('rate limit')) {
      throw new Error('Too many attempts. Wait a minute and try again.');
    }
    throw mapSupabaseOtpSendError(error);
  }

  authLog('sendLoginEmailOtp:success', { email: maskEmail(normalizedEmail) });
  await rememberOtpType(normalizedEmail, 'login', 'email');
}

export async function verifyEmailOtp(
  email: string,
  otp: string,
  flow: OtpFlow = 'login',
): Promise<Session> {
  const normalizedEmail = email.trim().toLowerCase();
  const token = otp.replace(/\D/g, '').trim();

  authLog('verifyEmailOtp:start', {
    email: maskEmail(normalizedEmail),
    otpLength: token.length,
    flow,
  });

  if (token.length < 6) {
    throw new Error('Enter the verification code from your email.');
  }

  const supabase = requireSupabaseClient();
  const remembered = await getRememberedOtpType(normalizedEmail, flow);
  const type = remembered ?? defaultOtpType(flow);

  const { data, error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token,
    type,
  });

  if (error) {
    authError('verifyEmailOtp:supabase_error', error, {
      email: maskEmail(normalizedEmail),
      status: error.status,
      code: error.code,
      type,
      remembered: Boolean(remembered),
    });
    throw mapVerifyOtpError(error);
  }

  authLog('verifyEmailOtp:type', { type, remembered: Boolean(remembered) });

  const session = data?.session;
  if (!session?.access_token) {
    authError('verifyEmailOtp:no_session', new Error('Missing session after verify'), {
      email: maskEmail(normalizedEmail),
    });
    throw new Error('Email verification failed. Please try again.');
  }

  setSupabaseSessionCache(session);
  await clearRememberedOtpType(normalizedEmail, flow);
  // Ensure the logged-out gate cannot block cold-start restore after a fresh OTP.
  const { clearUserLoggedOut, persistAuthToken } = await import('@/utils/authToken');
  await clearUserLoggedOut();
  // Backup access token for hydrate when SecureStore session read races on cold start.
  await persistAuthToken(session.access_token);
  // Re-read so persistSession has flushed to SecureStore before navigation continues.
  await supabase.auth.getSession();

  authLog('verifyEmailOtp:success', {
    email: maskEmail(normalizedEmail),
    userId: data?.user?.id?.slice(0, 8),
    expiresAt: session.expires_at,
  });

  return session;
}

const SESSION_REFRESH_BUFFER_SEC = 120;

/** Refresh Supabase access token when near expiry so persisted login survives app restarts. */
export async function ensureValidSupabaseSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    authError('ensureValidSupabaseSession:getSession', error);
    setSupabaseSessionCache(null);
    return null;
  }

  const session = data.session;
  if (!session) {
    setSupabaseSessionCache(null);
    return null;
  }

  const expiresAt = session.expires_at ?? 0;
  const nowSec = Math.floor(Date.now() / 1000);

  if (expiresAt > nowSec + SESSION_REFRESH_BUFFER_SEC) {
    setSupabaseSessionCache(session);
    return session;
  }

  const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) {
    authError('ensureValidSupabaseSession:refresh', refreshError);
    if (expiresAt > nowSec) {
      setSupabaseSessionCache(session);
      return session;
    }
    setSupabaseSessionCache(null);
    return null;
  }

  setSupabaseSessionCache(refreshed.session);
  return refreshed.session;
}

export async function getSupabaseSession(): Promise<Session | null> {
  const cached = getSupabaseSessionCache();
  if (cached !== undefined) {
    return cached;
  }

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    authError('getSupabaseSession:error', error);
    setSupabaseSessionCache(null);
    return null;
  }

  setSupabaseSessionCache(data.session);
  return data.session;
}

export async function signOutSupabase(): Promise<void> {
  clearSupabaseSessionCache();

  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) {
    authError('signOutSupabase:error', error);
  }
}
