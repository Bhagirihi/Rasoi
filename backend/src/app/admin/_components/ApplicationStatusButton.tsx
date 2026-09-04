'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { updateSponsorApplicationStatusAction } from '@/app/admin/sponsor-application-actions';

type ApplicationStatus = 'reviewed' | 'approved' | 'rejected';

export default function ApplicationStatusButton({
  applicationId,
  brandName,
  status,
}: {
  applicationId: string;
  brandName: string;
  status: ApplicationStatus;
}) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await updateSponsorApplicationStatusAction(applicationId, status);
      toast.success(`Marked ${brandName} as ${status}.`);
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void handleClick()}
      className="rounded-full border border-admin-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50 disabled:opacity-50"
    >
      {loading ? '…' : status}
    </button>
  );
}
