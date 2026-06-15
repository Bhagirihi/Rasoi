import type { Session } from '@supabase/supabase-js';

import { authError, authLog, maskEmail } from '@/utils/authLogger';
import { getSupabaseClient, requireSupabaseClient } from '@/utils/supabase';

export async function sendEmailOtp(name: string, phone: string, email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
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
    throw new Error(
      error.message ||
        'Could not send verification code. Check Supabase email settings (OTP template with {{ .Token }}).',
    );
  }

  authLog('sendEmailOtp:success', {
    email: maskEmail(normalizedEmail),
    hasSession: Boolean(data.session),
  });
}

export async function verifyEmailOtp(email: string, otp: string): Promise<Session> {
  const normalizedEmail = email.trim().toLowerCase();
  const token = otp.replace(/\D/g, '').trim();

  authLog('verifyEmailOtp:start', {
    email: maskEmail(normalizedEmail),
    otpLength: token.length,
  });

  if (token.length < 6) {
    throw new Error('Enter the verification code from your email.');
  }

  const supabase = requireSupabaseClient();
  let { data, error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token,
    type: 'email',
  });

  // New sign-ups sometimes return type signup on some Supabase projects.
  if (error?.message?.toLowerCase().includes('token') || error?.message?.toLowerCase().includes('otp')) {
    const retry = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token,
      type: 'signup',
    });
    if (!retry.error) {
      data = retry.data;
      error = null;
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

  if (!data.session?.access_token) {
    authError('verifyEmailOtp:no_session', new Error('Missing session after verify'), {
      email: maskEmail(normalizedEmail),
    });
    throw new Error('Email verification failed. Please try again.');
  }

  authLog('verifyEmailOtp:success', {
    email: maskEmail(normalizedEmail),
    userId: data.user?.id?.slice(0, 8),
    expiresAt: data.session.expires_at,
  });

  return data.session;
}

export async function getSupabaseSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    authError('getSupabaseSession:error', error);
    return null;
  }
  return data.session;
}

export async function signOutSupabase(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    authError('signOutSupabase:error', error);
  }
}
