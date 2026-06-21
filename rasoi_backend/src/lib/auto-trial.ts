import { getAppConfig } from '@/lib/app-settings';
import type { User } from '@/lib/db/types';

export type AutoTrialWrite = {
  planTier: 'trial';
  trialStartedAt: Date;
  hasUsedTrial: true;
};

export async function getAutoTrialWriteForNewUser(): Promise<Partial<AutoTrialWrite>> {
  const { paymentsEnabled } = await getAppConfig();
  if (!paymentsEnabled) return {};
  return buildAutoTrialWrite();
}

export async function getAutoTrialWriteIfEligible(
  user: Pick<User, 'planTier' | 'hasUsedTrial'>,
): Promise<Partial<AutoTrialWrite>> {
  const { paymentsEnabled } = await getAppConfig();
  if (!paymentsEnabled) return {};
  if (!isEligibleForAutoTrial(user)) return {};
  return buildAutoTrialWrite();
}

function isEligibleForAutoTrial(user: Pick<User, 'planTier' | 'hasUsedTrial'>): boolean {
  if (user.hasUsedTrial) return false;
  if (user.planTier === 'paid' || user.planTier === 'trial') return false;
  return true;
}

function buildAutoTrialWrite(): AutoTrialWrite {
  return {
    planTier: 'trial',
    trialStartedAt: new Date(),
    hasUsedTrial: true,
  };
}
