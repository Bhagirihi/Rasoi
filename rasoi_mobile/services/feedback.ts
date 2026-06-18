import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { FeedbackCategory } from '@/constants/feedback';
import { optionalAuthApiFetch } from '@/utils/api';

export type SubmitFeedbackPayload = {
  category: FeedbackCategory;
  message: string;
  name?: string;
  email?: string;
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
  return optionalAuthApiFetch<SubmitFeedbackResponse>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      appVersion: getAppVersion(),
      platform: getPlatform(),
    }),
  });
}
