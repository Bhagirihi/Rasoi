'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { formatAdminDateTime } from '@/app/admin/_components/admin-datetime';
import { useToast } from '@/app/admin/_components/Toast';
import { Badge } from '@/app/admin/_components/ui';
import {
  adminExtendUserTrialAction,
  adminSetUserPlanAction,
} from '@/app/admin/user-actions';
import { TRIAL_DURATION_DAYS } from '@/lib/plan-pricing';

const EXTEND_PRESETS = [3, 5, 10] as const;

function formatTrialEndsAt(trialStartedAt: string | null, trialTotalDays: number): string | null {
  if (!trialStartedAt || trialTotalDays <= 0) return null;
  const endsAt = new Date(trialStartedAt).getTime() + trialTotalDays * 86_400_000;
  return formatAdminDateTime(endsAt);
}

export default function UserPlanControl({
  userId,
  userName,
  planTier,
  planLabel,
  trialStartedAt,
  trialBonusDays,
  trialTotalDays,
  trialActive,
}: {
  userId: string;
  userName: string;
  planTier: string;
  planLabel: string;
  trialStartedAt: string | null;
  trialBonusDays: number;
  trialTotalDays: number;
  trialActive: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<'free' | 'trial' | 'extend' | null>(null);
  const [customDays, setCustomDays] = useState('5');

  const trialEndsAt = formatTrialEndsAt(trialStartedAt, trialTotalDays);

  const runPlanAction = async (
    action: 'free' | 'trial' | 'extend',
    extraDays?: number,
  ) => {
    if (action === 'free') {
      const confirmed = window.confirm(
        `Downgrade ${userName} to Free?\n\nThis removes Rasoi Plus and ends trial partner access. Google Play subscriptions are not cancelled automatically.`,
      );
      if (!confirmed) return;
    }

    if (action === 'trial') {
      const confirmed = window.confirm(
        `Reset ${userName} to a fresh ${TRIAL_DURATION_DAYS}-day trial?\n\nThis replaces their current plan tier and clears trial bonus days.`,
      );
      if (!confirmed) return;
    }

    if (action === 'extend') {
      const days = extraDays ?? Number(customDays);
      if (!Number.isInteger(days) || days < 1 || days > 90) {
        toast.error('Enter extra days between 1 and 90.');
        return;
      }
      const confirmed = window.confirm(
        trialActive
          ? `Add ${days} day${days === 1 ? '' : 's'} to ${userName}'s active trial?`
          : `Start a trial for ${userName} with ${TRIAL_DURATION_DAYS + days} total days (${TRIAL_DURATION_DAYS} base + ${days} bonus)?\n\nThis replaces Rasoi Plus or Free until the trial ends.`,
      );
      if (!confirmed) return;
    }

    setLoading(action === 'extend' ? 'extend' : action);
    try {
      const result =
        action === 'extend'
          ? await adminExtendUserTrialAction(userId, extraDays ?? Number(customDays))
          : await adminSetUserPlanAction(userId, action);

      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Could not update plan');
    } finally {
      setLoading(null);
    }
  };

  const planBadgeTone =
    planTier === 'trial' ? 'gold' : planTier === 'paid' ? 'success' : ('neutral' as const);

  return (
    <div className="admin-card space-y-4 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-admin-ink">Current plan</p>
          <p className="mt-1 text-xs text-admin-muted">
            {planTier === 'paid'
              ? 'Rasoi Plus — ad-free with partner checkout.'
              : planTier === 'trial'
                ? trialActive
                  ? 'Trial active — partners unlocked, ads still show.'
                  : 'Trial expired — user is on Free in the app.'
                : 'Free — ads and locked partners until trial or subscribe.'}
          </p>
        </div>
        <Badge tone={planBadgeTone}>{planLabel}</Badge>
      </div>

      {planTier === 'trial' && (
        <div className="rounded-xl border border-admin-border/70 bg-[#faf7f2] px-3 py-2 text-xs text-admin-muted">
          <p>
            Started:{' '}
            {trialStartedAt
              ? formatAdminDateTime(trialStartedAt)
              : 'Not set'}
          </p>
          <p className="mt-1">
            Length: {trialTotalDays} day{trialTotalDays === 1 ? '' : 's'}
            {trialBonusDays > 0 ? ` (${trialBonusDays} bonus)` : ''}
          </p>
          {trialEndsAt && (
            <p className="mt-1">
              {trialActive ? 'Ends' : 'Ended'}: {trialEndsAt}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-admin-muted">
          Downgrade
        </p>
        <div className="flex flex-wrap gap-2">
          {planTier !== 'free' && (
            <button
              type="button"
              disabled={loading !== null}
              onClick={() => void runPlanAction('free')}
              className="rounded-full border border-admin-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 hover:text-admin-ink disabled:opacity-50"
            >
              {loading === 'free' ? 'Updating…' : 'Downgrade to Free'}
            </button>
          )}
          {planTier !== 'trial' || !trialActive ? (
            <button
              type="button"
              disabled={loading !== null}
              onClick={() => void runPlanAction('trial')}
              className="rounded-full border border-[#d4a574]/60 bg-[#f8e8dc] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#9a4d28] transition hover:bg-[#f3ddd0] disabled:opacity-50"
            >
              {loading === 'trial' ? 'Updating…' : 'Reset to 3-day trial'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-2 border-t border-admin-border/70 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-admin-muted">
          Extend trial
        </p>
        <p className="text-xs text-admin-muted">
          Adds bonus days to an active trial, or starts a new trial if expired, free, or paid.
        </p>
        <div className="flex flex-wrap gap-2">
          {EXTEND_PRESETS.map((days) => (
            <button
              key={days}
              type="button"
              disabled={loading !== null}
              onClick={() => void runPlanAction('extend', days)}
              className="rounded-full border border-[#7eb89a]/60 bg-[#e2f0e8] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#2f6b4f] transition hover:bg-[#d4e8dc] disabled:opacity-50"
            >
              +{days} days
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            min={1}
            max={90}
            value={customDays}
            onChange={(event) => setCustomDays(event.target.value)}
            className="w-20 rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-ink"
            aria-label="Custom trial extension days"
          />
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => void runPlanAction('extend')}
            className="rounded-full border border-[#7eb89a]/60 bg-[#e2f0e8] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#2f6b4f] transition hover:bg-[#d4e8dc] disabled:opacity-50"
          >
            {loading === 'extend' ? 'Applying…' : 'Apply custom days'}
          </button>
        </div>
      </div>
    </div>
  );
}
