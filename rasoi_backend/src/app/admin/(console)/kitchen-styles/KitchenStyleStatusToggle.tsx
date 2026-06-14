'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { toggleKitchenStyleActiveAction } from '@/app/admin/kitchen-style-actions';

export default function KitchenStyleStatusToggle({
  id,
  label,
  active: initialActive,
}: {
  id: string;
  label: string;
  active: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const previousActive = active;
    const nextActive = !active;
    setActive(nextActive);
    setLoading(true);

    try {
      await toggleKitchenStyleActiveAction(id, nextActive);
      toast.success(
        nextActive ? `"${label}" is now active in the app.` : `"${label}" is now hidden from the app.`,
      );
      router.refresh();
    } catch (caught) {
      setActive(previousActive);
      toast.error(caught instanceof Error ? caught.message : 'Failed to update status');
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
        aria-label={`${active ? 'Disable' : 'Enable'} ${label}`}
        disabled={loading}
        onClick={() => void handleToggle()}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition disabled:opacity-50 ${
          active
            ? 'border-admin-gold/50 bg-admin-gold'
            : 'border-admin-border bg-[#e8e2d8]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            active ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-sm font-medium text-admin-ink">{active ? 'Active' : 'Disabled'}</span>
    </div>
  );
}
