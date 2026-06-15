'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { Badge } from '@/app/admin/_components/ui';
import { setUserActiveAction } from '@/app/admin/user-actions';

export default function UserAccountStatusControl({
  userId,
  userName,
  isActive,
}: {
  userId: string;
  userName: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleToggle = async (nextActive: boolean) => {
    const action = nextActive ? 'reactivate' : 'deactivate';
    const confirmed = window.confirm(
      nextActive
        ? `Reactivate ${userName}?\n\nThey will be able to sign in and use the app again.`
        : `Deactivate ${userName}?\n\nThey will be signed out and blocked from using the app until you reactivate them.`,
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const result = await setUserActiveAction(userId, nextActive);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : `Could not ${action} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card space-y-4 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-admin-ink">Current status</p>
          <p className="mt-1 text-xs text-admin-muted">
            {isActive
              ? 'Member can sign in and use Rasoi normally.'
              : 'Member is blocked from signing in and using the app.'}
          </p>
        </div>
        <Badge tone={isActive ? 'success' : 'warning'}>
          {isActive ? 'Active' : 'Deactivated'}
        </Badge>
      </div>

      {isActive ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleToggle(false)}
          className="w-full rounded-full border border-[#d4a574]/60 bg-[#f8e8dc] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#9a4d28] transition hover:bg-[#f3ddd0] disabled:opacity-50"
        >
          {loading ? 'Updating…' : 'Deactivate account'}
        </button>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => void handleToggle(true)}
          className="w-full rounded-full border border-[#7eb89a]/60 bg-[#e2f0e8] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#2f6b4f] transition hover:bg-[#d4e8dc] disabled:opacity-50"
        >
          {loading ? 'Updating…' : 'Reactivate account'}
        </button>
      )}
    </div>
  );
}
