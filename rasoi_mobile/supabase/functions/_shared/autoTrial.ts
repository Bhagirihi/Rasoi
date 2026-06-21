export type AutoTrialWrite = {
  planTier: 'trial';
  trialStartedAt: string;
  hasUsedTrial: true;
};

type AppSettingsReader = {
  from(table: string): {
    select(cols: string): {
      eq(col: string, val: string): {
        maybeSingle(): Promise<{ data: { paymentsEnabled?: boolean } | null }>;
      };
    };
  };
};

export async function readPaymentsEnabled(db: AppSettingsReader): Promise<boolean> {
  const { data } = await db.from('AppSettings').select('paymentsEnabled').eq('id', 'default').maybeSingle();
  return Boolean(data?.paymentsEnabled);
}

export function buildAutoTrialWrite(now: string): AutoTrialWrite {
  return {
    planTier: 'trial',
    trialStartedAt: now,
    hasUsedTrial: true,
  };
}

export function trialWriteIfEligible(
  row: Record<string, unknown>,
  paymentsEnabled: boolean,
  now: string,
): Partial<AutoTrialWrite> {
  if (!paymentsEnabled) return {};
  if (row.hasUsedTrial === true) return {};
  if (row.planTier === 'paid' || row.planTier === 'trial') return {};
  return buildAutoTrialWrite(now);
}

export async function autoTrialWriteForNewUser(
  db: AppSettingsReader,
  now: string,
): Promise<Partial<AutoTrialWrite>> {
  const paymentsEnabled = await readPaymentsEnabled(db);
  if (!paymentsEnabled) return {};
  return buildAutoTrialWrite(now);
}
