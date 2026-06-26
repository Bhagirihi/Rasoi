'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  getEasOtaAdminStatusAction,
  listEasOtaUpdatesAction,
  rollbackLastEasOtaAction,
} from '@/app/admin/eas-update-actions';
import { useToast } from '@/app/admin/_components/Toast';
import type { EasUpdateSummary } from '@/lib/eas-updates';

export default function EasUpdatePanel() {
  const router = useRouter();
  const toast = useToast();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [branch, setBranch] = useState('production');
  const [updates, setUpdates] = useState<EasUpdateSummary[]>([]);
  const [loading, setLoading] = useState<'list' | 'rollback' | null>(null);

  const refresh = async () => {
    setLoading('list');
    try {
      const [status, rows] = await Promise.all([
        getEasOtaAdminStatusAction(),
        listEasOtaUpdatesAction(),
      ]);
      setConfigured(status.configured);
      setBranch(status.branch);
      setUpdates(rows);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not load EAS updates');
      setConfigured(false);
      setUpdates([]);
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleRollback = async () => {
    if (
      !window.confirm(
        `Revert the last OTA on branch "${branch}"?\n\nThis republishes the previous update group so users receive it on next app restart.`,
      )
    ) {
      return;
    }

    setLoading('rollback');
    try {
      const result = await rollbackLastEasOtaAction();
      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      router.refresh();
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'OTA rollback failed');
    } finally {
      setLoading(null);
    }
  };

  const buttonClass =
    'rounded-full border border-admin-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-admin-ink transition hover:border-admin-gold/50 disabled:opacity-50';

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-admin-muted">
        Mobile JS bundles ship via <strong className="font-medium text-admin-ink">EAS Update</strong> (
        <code className="rounded bg-admin-surface px-1">npm run ota:production</code>). Native APK changes
        still require a new build. Set <code className="rounded bg-admin-surface px-1">EXPO_TOKEN</code> on
        Vercel to enable rollback from here.
      </p>

      {configured === false ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          EXPO_TOKEN is not set on this backend — rollback is disabled until you add an Expo access token to
          Vercel env.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={buttonClass}
          disabled={loading !== null}
          onClick={() => void refresh()}
        >
          {loading === 'list' ? 'Refreshing…' : 'Refresh update list'}
        </button>
        <button
          type="button"
          className={`${buttonClass} border-amber-500/50 bg-amber-500/10`}
          disabled={loading !== null || configured === false || updates.length < 2}
          title={
            updates.length >= 2 && updates[0].runtimeVersion !== updates[1]?.runtimeVersion
              ? 'Previous update uses a different runtime version — rollback may not reach 1.0.6 APKs'
              : undefined
          }
          onClick={() => void handleRollback()}
        >
          {loading === 'rollback' ? 'Rolling back…' : 'Revert last OTA'}
        </button>
        <a
          className={`${buttonClass} inline-flex items-center`}
          href="https://expo.dev/accounts/takeyshi/projects/rasoi/deployments"
          target="_blank"
          rel="noreferrer"
        >
          Open Expo deployments
        </a>
      </div>

      {updates.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-admin-border/80">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-admin-border text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
                <th className="px-3 py-3">#</th>
                <th className="px-3 py-3">Runtime</th>
                <th className="px-3 py-3">Group</th>
                <th className="px-3 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((row, index) => (
                <tr key={row.group} className="border-b border-admin-border/60 align-top">
                  <td className="px-3 py-3 text-admin-muted">{index === 0 ? 'Head' : index + 1}</td>
                  <td className="px-3 py-3 font-mono text-xs text-admin-ink">{row.runtimeVersion}</td>
                  <td className="px-3 py-3 font-mono text-[11px] text-admin-muted">{row.group}</td>
                  <td className="px-3 py-3 text-admin-ink">{row.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-admin-muted">
          {loading === 'list' ? 'Loading updates…' : 'No updates loaded yet.'}
        </p>
      )}
    </div>
  );
}
