import type { AuthResponse } from '@/types/api';
import { apiFetch, getApiBaseUrl } from '@/utils/api';
import { authError, authLog } from '@/utils/authLogger';
import { clearAuthToken, saveAuthToken } from '@/utils/authToken';
import { signOutSupabase } from '@/services/supabaseAuth';

export async function syncSupabaseAccount(
  supabaseAccessToken: string,
  name: string,
  phone: string,
): Promise<AuthResponse> {
  authLog('syncSupabaseAccount:start', {
    apiUrl: getApiBaseUrl(),
    nameLength: name.trim().length,
    phoneLength: phone.length,
    tokenLength: supabaseAccessToken.length,
  });

  try {
    const response = await apiFetch<AuthResponse>('/api/auth/supabase-sync', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
      body: JSON.stringify({ name, phone }),
    });
    await saveAuthToken(response.token);
    authLog('syncSupabaseAccount:success', {
      userId: response.user.id.slice(0, 8),
      onboardingDone: response.user.hasCompletedOnboarding,
    });
    return response;
  } catch (error) {
    authError('syncSupabaseAccount:failed', error, { apiUrl: getApiBaseUrl() });
    throw error;
  }
}

export async function loginAsGuestUser(): Promise<AuthResponse> {
  authLog('loginAsGuest:start', { apiUrl: getApiBaseUrl() });
  const response = await apiFetch<AuthResponse>('/api/auth/guest', {
    method: 'POST',
  });
  await saveAuthToken(response.token);
  authLog('loginAsGuest:success', { userId: response.user.id.slice(0, 8) });
  return response;
}

export async function logoutSession(): Promise<void> {
  authLog('logout:start');
  await signOutSupabase();
  await clearAuthToken();
}
