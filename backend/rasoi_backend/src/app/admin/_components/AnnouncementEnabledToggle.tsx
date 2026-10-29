'use client';

import { useTransition } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { setHomeAnnouncementEnabledAction } from '@/app/admin/announcement-actions';

export default function AnnouncementEnabledToggle({
  announcementId,
  title,
  enabled,
}: {
  announcementId: string;
  title: string;
  enabled: boolean;
  }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await setHomeAnnouncementEnabledAction(announcementId, !enabled);
            toast.success(enabled ? `Paused "${title}".` : `Enabled "${title}".`);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not update announcement.');
          }
        });
      }}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        enabled
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
          : 'bg-[#ece5db] text-admin-muted hover:bg-[#e2d9cd]'
      }`}
    >
      {enabled ? 'Live' : 'Paused'}
    </button>
  );
}
