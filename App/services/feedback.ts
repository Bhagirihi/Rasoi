import type { FeedbackCategory } from '@/constants/feedback';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { getRasoiDb, isSupabaseDirectMode } from '@/utils/rasoiDb';
import { optionalAuthApiFetch } from '@/utils/api';
import { getOwnRasoiUserId } from '@/services/user';

export type SubmitFeedbackPayload = {
  category: FeedbackCategory;
  message: string;
  name?: string;
  email?: string;
  appVersion?: string;
  platform?: 'ios' | 'android' | 'web';
};

type SubmitFeedbackResponse = {
  id: string;
  message: string;
};

function getAppVersion(): string | undefined {
  return Constants.expoConfig?.version ?? undefined;
}

function getPlatform(): 'ios' | 'android' | 'web' | undefined {
  if (Platform.OS === 'ios' || Platform.OS === 'android' || Platform.OS === 'web') {
    return Platform.OS;
  }
  return undefined;
}

export async function submitFeedback(payload: SubmitFeedbackPayload): Promise<SubmitFeedbackResponse> {
  const enriched = {
    ...payload,
    appVersion: payload.appVersion ?? getAppVersion(),
    platform: payload.platform ?? getPlatform(),
  };

  if (isSupabaseDirectMode()) {
    try {
      const userId = await getOwnRasoiUserId();
      const { data, error } = await getRasoiDb()
        .from('UserFeedback')
        .insert({
          userId,
          category: enriched.category,
          message: enriched.message,
          name: enriched.name ?? null,
          email: enriched.email ?? null,
          appVersion: enriched.appVersion ?? null,
          platform: enriched.platform ?? null,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        message: 'Thanks for your feedback. Our team will review it soon.',
      };
    } catch (error) {
      console.warn('[feedback] Supabase insert failed, falling back to API', error);
    }
  }

  return optionalAuthApiFetch<SubmitFeedbackResponse>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(enriched),
  });
}
