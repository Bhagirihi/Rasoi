import type { AuthResponse, UserProfileResponse } from '@/types/api';
import { CURRENT_TERMS_VERSION } from '@/constants/legalHighlights';
import { apiFetch, formatUserFacingApiError, getApiBaseUrl } from '@/utils/api';
import { authError, authLog } from '@/utils/authLogger';
import { clearAuthToken, clearRasoiUserId, saveRasoiUserId } from '@/utils/authToken';
import { isSupabaseDirectMode } from '@/utils/rasoiDb';
import { trySignInAnonymously, signOutSupabase } from '@/services/supabaseAuth';
import { signOutFirebasePhoneAuth } from '@/services/firebasePhoneAuth';
import { requireSupabaseClient } from '@/utils/supabase';
import type { OnboardingPayload } from '@/utils/storage';

type AuthEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

async function readFunctionInvokeError(
  error: unknown,
  data: unknown,
  functionName: string,
): Promise<string> {
  if (data && typeof data === 'object' && 'error' in data) {
    const message = (data as { error?: unknown }).error;
    if (typeof message === 'string' && message.trim()) return message;
  }

  if (error && typeof error === 'object' && 'context' in error) {
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === 'function') {
      try {
        const body = (await context.json()) as { error?: unknown };
        if (typeof body.error === 'string' && body.error.trim()) {
          return body.error;
        }
      } catch {
        // Fall through to generic message.
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return `Auth function ${functionName} failed`;
}

async function invokeAuthFunction<T>(
  functionName: 'rasoi-auth-sync' | 'rasoi-auth-guest',
  body: Record<string, unknown>,
  accessToken?: string,
): Promise<T> {
  const supabase = requireSupabaseClient();
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });

  if (error) {
    throw new Error(await readFunctionInvokeError(error, data, functionName));
  }

  const payload = data as AuthEnvelope<T> | T;
  if (payload && typeof payload === 'object' && 'ok' in payload) {
    const envelope = payload as AuthEnvelope<T>;
    if (!envelope.ok || envelope.data === undefined) {
      throw new Error(envelope.error ?? `Auth function ${functionName} failed`);
    }
    return envelope.data;
  }

  return payload as T;
}

function finishSupabaseAuth(user: UserProfileResponse): AuthResponse {
  void clearAuthToken();
  saveRasoiUserId(user.id);
  return { user };
}

export async function syncSupabaseAccount(
  supabaseAccessToken: string,
  name: string,
  phone: string,
  options?: {
    acceptedTerms?: boolean;
    linkGuestUserId?: string;
    onboarding?: OnboardingPayload;
    phoneVerified?: boolean;
  },
): Promise<AuthResponse> {
  authLog('syncSupabaseAccount:start', {
    apiUrl: getApiBaseUrl(),
    nameLength: name.trim().length,
    phoneLength: phone.length,
    tokenLength: supabaseAccessToken.length,
    linkGuestUserId: options?.linkGuestUserId?.slice(0, 8),
    directMode: isSupabaseDirectMode(),
  });

  if (isSupabaseDirectMode()) {
    try {
      const result = await invokeAuthFunction<{ user: UserProfileResponse }>('rasoi-auth-sync', {
        name,
        phone,
        ...(options?.acceptedTerms ? { acceptedTerms: true as const } : {}),
        ...(options?.linkGuestUserId ? { linkGuestUserId: options.linkGuestUserId } : {}),
        ...(options?.onboarding ? { onboarding: options.onboarding } : {}),
        ...(options?.phoneVerified ? { phoneVerified: true as const } : {}),
      }, supabaseAccessToken);

      authLog('syncSupabaseAccount:edge_success', {
        userId: result.user.id.slice(0, 8),
        onboardingDone: result.user.hasCompletedOnboarding,
      });
      return finishSupabaseAuth(result.user);
    } catch (error) {
      authError('syncSupabaseAccount:edge_failed', error);
      console.warn('[auth] Edge sync failed, falling back to API', error);
    }
  }

  try {
    const response = await apiFetch<AuthResponse>(
      '/api/auth/supabase-sync',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
        body: JSON.stringify({
          name,
          phone,
          ...(options?.acceptedTerms ? { acceptedTerms: true as const } : {}),
          ...(options?.linkGuestUserId ? { linkGuestUserId: options.linkGuestUserId } : {}),
          ...(options?.onboarding ? { onboarding: options.onboarding } : {}),
          ...(options?.phoneVerified ? { phoneVerified: true } : {}),
        }),
      },
      { timeoutMs: 20_000 },
    );

    if (response.token) {
      const { persistAuthToken } = await import('@/utils/authToken');
      persistAuthToken(response.token);
    } else {
      finishSupabaseAuth(response.user);
    }

    authLog('syncSupabaseAccount:api_success', {
      userId: response.user.id.slice(0, 8),
      onboardingDone: response.user.hasCompletedOnboarding,
    });
    return response;
  } catch (error) {
    authError('syncSupabaseAccount:failed', error, { apiUrl: getApiBaseUrl() });
    throw new Error(formatUserFacingApiError(error, 'Could not sign in. Please try again.'));
  }
}

export async function loginAsGuestUser(options?: { name?: string }): Promise<AuthResponse> {
  authLog('loginAsGuest:start', {
    apiUrl: getApiBaseUrl(),
    directMode: isSupabaseDirectMode(),
  });

  const trimmedName = options?.name?.trim();
  const guestName = trimmedName && trimmedName.length >= 2 ? trimmedName : undefined;

  let supabaseAccessToken: string | undefined;
  try {
    const session = await trySignInAnonymously();
    supabaseAccessToken = session?.access_token;
    if (!supabaseAccessToken) {
      authLog('loginAsGuest:no_anonymous_session');
    }
  } catch (error) {
    authError('loginAsGuest:supabase_anonymous_failed', error);
    authLog('loginAsGuest:fallback_without_supabase');
  }

  if (isSupabaseDirectMode()) {
    try {
      const result = await invokeAuthFunction<{ user: UserProfileResponse }>(
        'rasoi-auth-guest',
        {
          acceptedTerms: true,
          termsVersion: CURRENT_TERMS_VERSION,
          ...(guestName ? { name: guestName } : {}),
        },
        supabaseAccessToken,
      );

      authLog('loginAsGuest:edge_success', {
        userId: result.user.id.slice(0, 8),
        linkedSupabase: Boolean(supabaseAccessToken),
      });
      return finishSupabaseAuth(result.user);
    } catch (error) {
      authError('loginAsGuest:edge_failed', error);
      console.warn('[auth] Edge guest login failed, falling back to API', error);
    }
  }

  const response = await apiFetch<AuthResponse>(
    '/api/auth/guest',
    {
      method: 'POST',
      headers: supabaseAccessToken
        ? {
            Authorization: `Bearer ${supabaseAccessToken}`,
          }
        : undefined,
      body: JSON.stringify({
        acceptedTerms: true,
        termsVersion: CURRENT_TERMS_VERSION,
        ...(guestName ? { name: guestName } : {}),
      }),
    },
    { timeoutMs: 20_000 },
  ).catch((error) => {
    throw new Error(formatUserFacingApiError(error, 'Could not continue as guest. Please try again.'));
  });

  if (response.token) {
    const { saveAuthToken } = await import('@/utils/authToken');
    await saveAuthToken(response.token);
  } else {
    finishSupabaseAuth(response.user);
  }

  authLog('loginAsGuest:api_success', {
    userId: response.user.id.slice(0, 8),
    linkedSupabase: Boolean(supabaseAccessToken),
  });
  return response;
}

export async function logoutSession(): Promise<void> {
  authLog('logout:start');
  await signOutSupabase();
  await signOutFirebasePhoneAuth();
  await clearAuthToken();
  await clearRasoiUserId();
}
