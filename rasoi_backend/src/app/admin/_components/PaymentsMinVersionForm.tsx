'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { setPaymentsMinAppVersionAction } from '@/app/admin/app-settings-actions';
import { useToast } from '@/app/admin/_components/Toast';
import { FieldLabel, GhostButton, PrimaryButton, TextInput } from '@/app/admin/_components/ui';

export default function PaymentsMinVersionForm({
  paymentsMinAppVersion: initialVersion,
}: {
  paymentsMinAppVersion: string | null;
}) {
  const router = useRouter();
  const toast = useToast();
  const [version, setVersion] = useState(initialVersion ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const trimmed = version.trim();
      await setPaymentsMinAppVersionAction(trimmed.length > 0 ? trimmed : null);
      toast.success(
        trimmed
          ? `Paywall active only for app version ${trimmed} and newer.`
          : 'Paywall version floor cleared — all app versions follow the payments toggle.',
      );
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'Failed to update min app version');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-admin-ink">Minimum app version for paywall</p>
        <p className="mt-2 text-sm leading-relaxed text-admin-muted">
          When payments are ON, only installs at or above this Expo marketing version (e.g.{' '}
          <code className="text-xs">1.0.14</code>) see the paywall. Older builds stay in early access.
          Leave blank to apply paywall to every version.
        </p>
      </div>
      <label className="block max-w-sm">
        <FieldLabel>Min version (semver)</FieldLabel>
        <TextInput
          value={version}
          onChange={setVersion}
          placeholder="e.g. 1.0.14"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <PrimaryButton type="button" disabled={loading} onClick={() => void handleSave()}>
          {loading ? 'Saving…' : 'Save min version'}
        </PrimaryButton>
        {version.trim() ? (
          <GhostButton
            type="button"
            disabled={loading}
            onClick={() => {
              setVersion('');
              void (async () => {
                setLoading(true);
                try {
                  await setPaymentsMinAppVersionAction(null);
                  toast.success('Paywall version floor cleared.');
                  router.refresh();
                } catch (caught) {
                  toast.error(
                    caught instanceof Error ? caught.message : 'Failed to clear min app version',
                  );
                } finally {
                  setLoading(false);
                }
              })();
            }}
          >
            Clear
          </GhostButton>
        ) : null}
      </div>
    </div>
  );
}
