import type { Session } from '@supabase/supabase-js';

import { authError, authLog, maskEmail } from '@/utils/authLogger';
import { mapSupabaseOtpSendError } from '@/utils/emailDeliveryErrors';
import { assertAllowedEmail, assertAllowedIndianPhone } from '@/utils/identityValidation';
import {
  clearSupabaseSessionCache,
  getSupabaseClient,
  getSupabaseSessionCache,
  requireSupabaseClient,
  setSupabaseSessionCache,
} from '@/utils/supabase';

export type OtpFlow = 'signup' | 'login' | 'guest_upgrade';

type OtpVerifyType = 'signup' | 'email' | 'email_change';

const otpTypeByKey = new Map<string, OtpVerifyType>();

function otpCacheKey(email: string, flow: OtpFlow): string {
  return `${flow}:${email.trim().toLowerCase()}`;
}

function rememberOtpType(email: string, flow: OtpFlow, type: OtpVerifyType): void {
  otpTypeByKey.set(otpCacheKey(email, flow), type);
}

function getRememberedOtpType(email: string, flow: OtpFlow): OtpVerifyType | undefined {
  return otpTypeByKey.get(otpCacheKey(email, flow));
}

function clearRememberedOtpType(email: string, flow: OtpFlow): void {
  otpTypeByKey.delete(otpCacheKey(email, flow));
}

function defaultOtpTypes(flow: OtpFlow): readonly OtpVerifyType[] {
  if (flow === 'guest_upgrade') return ['email_change', 'email', 'signup'];
  if (flow === 'signup') return ['signup', 'email'];
  return ['email', 'signup'];
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
    authError('signInAnonymously:supabase_error', error, {
      status: error.status,
      code: error.code,
    });
    if (error.message.toLowerCase().includes('anonymous')) {
      throw new Error('Guest mode is temporarily unavailable. Please create an account or try again later.');
    }
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
    rememberOtpType(normalizedEmail, 'guest_upgrade', 'email_change');
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
  rememberOtpType(normalizedEmail, 'signup', 'signup');
}

export async function sendLoginEmailOtp(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  assertAllowedEmail(normalizedEmail);
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
  rememberOtpType(normalizedEmail, 'login', 'email');
}

function isOtpTypeMismatch(error: { message?: string } | null): boolean {
  const lower = error?.message?.toLowerCase() ?? '';
  return lower.includes('token') || lower.includes('otp') || lower.includes('type');
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
  const remembered = getRememberedOtpType(normalizedEmail, flow);
  const otpTypes = remembered
    ? ([remembered, ...defaultOtpTypes(flow).filter((type) => type !== remembered)] as const)
    : defaultOtpTypes(flow);

  let data: Awaited<ReturnType<typeof supabase.auth.verifyOtp>>['data'] | null = null;
  let error: Awaited<ReturnType<typeof supabase.auth.verifyOtp>>['error'] | null = null;

  for (const type of otpTypes) {
    const attempt = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token,
      type,
    });
    if (!attempt.error) {
      data = attempt.data;
      error = null;
      authLog('verifyEmailOtp:type', { type, remembered: Boolean(remembered) });
      break;
    }
    error = attempt.error;
    if (!isOtpTypeMismatch(attempt.error)) {
      break;
    }
  }

  if (error) {
    authError('verifyEmailOtp:supabase_error', error, {
      email: maskEmail(normalizedEmail),
      status: error.status,
      code: error.code,
    });
    if (error.message.toLowerCase().includes('expired')) {
      throw new Error('Code expired. Tap Resend code and try again.');
    }
    throw new Error(error.message || 'Invalid verification code. Please try again.');
  }

  const session = data?.session;
  if (!session?.access_token) {
    authError('verifyEmailOtp:no_session', new Error('Missing session after verify'), {
      email: maskEmail(normalizedEmail),
    });
    throw new Error('Email verification failed. Please try again.');
  }

  setSupabaseSessionCache(session);
  clearRememberedOtpType(normalizedEmail, flow);

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
