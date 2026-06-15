'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import type { AdminUserRow } from '@/app/admin/_components/admin-users-types';
import { sendBulkMealNotificationAction } from '@/app/admin/user-actions';
import { MEAL_SLOTS } from '@/lib/meal-time';

const SLOT_LABELS: Record<(typeof MEAL_SLOTS)[number], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
  lateNight: 'Late night',
};

export default function BulkMealNotificationBar({ users }: { users: AdminUserRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [mealSlot, setMealSlot] = useState<(typeof MEAL_SLOTS)[number]>('dinner');
  const [loading, setLoading] = useState<'preview' | 'send' | null>(null);

  const eligibleIds = users.filter((user) => user.pushTokenCount > 0).map((user) => user.id);
  const eligibleCount = eligibleIds.length;

  const handleAction = async (dryRun: boolean) => {
    if (eligibleCount === 0) {
      toast.error('No users in this list have an active push token.');
      return;
    }

    const slotLabel = SLOT_LABELS[mealSlot];
    if (!dryRun) {
      const confirmed = window.confirm(
        `Send ${slotLabel} meal pick to ${eligibleCount} user${eligibleCount === 1 ? '' : 's'} with active push tokens?`,
      );
      if (!confirmed) return;
    }

    setLoading(dryRun ? 'preview' : 'send');
    try {
      const result = await sendBulkMealNotificationAction(eligibleIds, mealSlot, { dryRun });
      if (result.ok) {
        toast.success(result.message);
        if (!dryRun) router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Bulk send failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="admin-card flex flex-wrap items-center gap-3 rounded-[1.25rem] px-5 py-4">
      <div className="min-w-[220px] flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-admin-muted">
          Bulk meal push
        </p>
        <p className="mt-1 text-sm text-admin-ink">
          Send to all filtered users with push tokens ({eligibleCount} of {users.length}).
        </p>
      </div>

      <select
        value={mealSlot}
        onChange={(event) => setMealSlot(event.target.value as (typeof MEAL_SLOTS)[number])}
        disabled={loading !== null}
        className="rounded-lg border border-admin-border bg-white px-3 py-2 text-sm font-medium text-admin-ink"
        aria-label="Bulk meal slot"
      >
        {MEAL_SLOTS.map((slot) => (
          <option key={slot} value={slot}>
            {SLOT_LABELS[slot]}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={loading !== null || eligibleCount === 0}
        onClick={() => void handleAction(true)}
        className="rounded-full border border-admin-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 disabled:opacity-50"
      >
        {loading === 'preview' ? '…' : 'Preview all'}
      </button>

      <button
        type="button"
        disabled={loading !== null || eligibleCount === 0}
        onClick={() => void handleAction(false)}
        className="rounded-full border border-admin-gold/40 bg-admin-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-admin-ink transition hover:bg-admin-gold/20 disabled:opacity-50"
      >
        {loading === 'send' ? '…' : 'Send to all'}
      </button>
    </div>
  );
}
