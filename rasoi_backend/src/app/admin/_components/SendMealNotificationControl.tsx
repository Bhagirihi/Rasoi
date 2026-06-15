'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { sendMealNotificationAction } from '@/app/admin/user-actions';
import { MEAL_SLOTS } from '@/lib/meal-time';

const SLOT_LABELS: Record<(typeof MEAL_SLOTS)[number], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
  lateNight: 'Late night',
};

export default function SendMealNotificationControl({
  userId,
  userName,
  pushTokenCount,
  ineligibleReasons = [],
  layout = 'inline',
}: {
  userId: string;
  userName: string;
  pushTokenCount: number;
  ineligibleReasons?: string[];
  layout?: 'inline' | 'drawer';
}) {
  const router = useRouter();
  const toast = useToast();
  const [mealSlot, setMealSlot] = useState<(typeof MEAL_SLOTS)[number]>('dinner');
  const [loading, setLoading] = useState<'preview' | 'send' | null>(null);

  const canDeliver = pushTokenCount > 0;

  const handleAction = async (dryRun: boolean) => {
    if (!canDeliver) {
      toast.error('Cannot send — user has no active push token on any device.');
      return;
    }

    const slotLabel = SLOT_LABELS[mealSlot];

    if (!dryRun) {
      const confirmed = window.confirm(
        `Send ${slotLabel} meal pick to ${userName}?\n\nThey will receive a push notification on ${pushTokenCount} registered device${pushTokenCount === 1 ? '' : 's'}.`,
      );
      if (!confirmed) return;
    }

    setLoading(dryRun ? 'preview' : 'send');
    try {
      const result = await sendMealNotificationAction(userId, mealSlot, { dryRun });
      if (result.ok) {
        toast.success(result.message);
        if (!dryRun) router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Notification action failed');
    } finally {
      setLoading(null);
    }
  };

  const isDrawer = layout === 'drawer';

  return (
    <div
      className={
        isDrawer
          ? 'admin-card space-y-4 rounded-2xl p-4'
          : 'flex min-w-[220px] flex-wrap items-center gap-2'
      }
    >
      <label className={isDrawer ? 'block space-y-2' : undefined}>
        {isDrawer && (
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-admin-muted">
            Meal slot
          </span>
        )}
        <select
          value={mealSlot}
          onChange={(event) => setMealSlot(event.target.value as (typeof MEAL_SLOTS)[number])}
          disabled={loading !== null}
          className={
            isDrawer
              ? 'w-full rounded-xl border border-admin-border bg-white px-3 py-2.5 text-sm font-medium text-admin-ink'
              : 'rounded-lg border border-admin-border bg-white px-2 py-1.5 text-xs font-medium text-admin-ink'
          }
          aria-label={`Meal slot for ${userName}`}
        >
          {MEAL_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {SLOT_LABELS[slot]}
            </option>
          ))}
        </select>
      </label>

      <div className={isDrawer ? 'flex flex-wrap gap-2' : 'contents'}>
        <button
          type="button"
          disabled={loading !== null || !canDeliver}
          onClick={() => void handleAction(true)}
          title={!canDeliver ? 'Requires an active push token' : undefined}
          className={
            isDrawer
              ? 'flex-1 rounded-full border border-admin-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 disabled:opacity-50'
              : 'rounded-full border border-admin-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 disabled:opacity-50'
          }
        >
          {loading === 'preview' ? '…' : 'Preview'}
        </button>

        <button
          type="button"
          disabled={loading !== null || !canDeliver}
          onClick={() => void handleAction(false)}
          title={!canDeliver ? 'Requires an active push token' : undefined}
          className={
            isDrawer
              ? 'flex-1 rounded-full border border-admin-gold/40 bg-admin-gold/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-admin-ink transition hover:bg-admin-gold/20 disabled:opacity-50'
              : 'rounded-full border border-admin-gold/40 bg-admin-gold/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-admin-ink transition hover:bg-admin-gold/20 disabled:opacity-50'
          }
        >
          {loading === 'send' ? '…' : 'Send'}
        </button>
      </div>

      {!canDeliver && (
        <p className="text-xs leading-relaxed text-admin-muted">
          Push delivery needs at least one active device token.
          {ineligibleReasons.length > 0 ? ` ${ineligibleReasons.join(' · ')}.` : ''}
        </p>
      )}
    </div>
  );
}
