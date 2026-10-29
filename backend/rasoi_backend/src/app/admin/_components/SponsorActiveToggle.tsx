'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { setSponsorActiveAction } from '@/app/admin/sponsor-actions';
import { useToast } from '@/app/admin/_components/Toast';

export default function SponsorActiveToggle({
  sponsorId,
  brandName,
  active: initialActive,
}: {
  sponsorId: string;
  brandName: string;
  active: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const previous = active;
    const next = !active;
    setActive(next);
    setLoading(true);

    try {
      await setSponsorActiveAction(sponsorId, next);
      toast.success(
        next
          ? `"${brandName}" is active — visible in the app.`
          : `"${brandName}" is paused — hidden from the app.`,
      );
      router.refresh();
    } catch (caught) {
      setActive(previous);
      toast.error(caught instanceof Error ? caught.message : 'Failed to update sponsor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={active ? `Pause ${brandName}` : `Activate ${brandName}`}
        disabled={loading}
        onClick={() => void handleToggle()}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition disabled:opacity-50 ${
          active ? 'border-admin-gold/50 bg-admin-gold' : 'border-admin-border bg-[#e8e2d8]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            active ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-xs font-semibold text-admin-muted">
        {loading ? 'Saving…' : active ? 'Active' : 'Paused'}
      </span>
    </div>
  );
}
