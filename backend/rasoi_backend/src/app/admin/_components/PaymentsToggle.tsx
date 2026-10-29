'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { setPaymentsEnabledAction } from '@/app/admin/app-settings-actions';
import { useToast } from '@/app/admin/_components/Toast';

export default function PaymentsToggle({ paymentsEnabled: initialEnabled }: { paymentsEnabled: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [paymentsEnabled, setPaymentsEnabledState] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const previous = paymentsEnabled;
    const next = !paymentsEnabled;
    setPaymentsEnabledState(next);
    setLoading(true);

    try {
      await setPaymentsEnabledAction(next);
      toast.success(
        next
          ? 'Payments ON — paywall, trials, and plan locks are active in the app.'
          : 'Payments OFF — paywall hidden; partners unlocked; ads and sponsors still show.',
      );
      router.refresh();
    } catch (caught) {
      setPaymentsEnabledState(previous);
      toast.error(caught instanceof Error ? caught.message : 'Failed to update payment setting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-admin-ink">
          {paymentsEnabled ? 'Payments enabled' : 'Payments disabled (early access)'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-admin-muted">
          {paymentsEnabled
            ? 'Users see Rasoi Plus paywall, trials, subscribe flows, and partner locks on the free plan.'
            : 'Users get partner checkout without paying. AdMob banners and sponsor rails stay visible. Paywall UI is hidden.'}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={paymentsEnabled}
          aria-label={paymentsEnabled ? 'Disable payments' : 'Enable payments'}
          disabled={loading}
          onClick={() => void handleToggle()}
          className={`relative h-8 w-14 rounded-full border transition disabled:opacity-50 ${
            paymentsEnabled
              ? 'border-admin-gold/50 bg-admin-gold'
              : 'border-admin-border bg-[#e8e2d8]'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              paymentsEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
          {loading ? 'Saving…' : paymentsEnabled ? 'On' : 'Off'}
        </span>
      </div>
    </div>
  );
}
