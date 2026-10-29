'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import {
  syncAllSupabaseDataAction,
  syncSupabaseKitchenStylesAction,
  syncSupabaseMembersAction,
} from '@/app/admin/supabase-sync-actions';
import { formatSyncMembersSummary } from '@/lib/sync-supabase-summary';

type SyncKind = 'members' | 'kitchenStyles' | 'all';

export default function SupabaseSyncPanel({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<SyncKind | null>(null);

  const runSync = async (kind: SyncKind) => {
    setLoading(kind);
    try {
      if (kind === 'members') {
        const summary = await syncSupabaseMembersAction();
        toast.success(`Members synced — ${formatSyncMembersSummary(summary)}`);
      } else if (kind === 'kitchenStyles') {
        const summary = await syncSupabaseKitchenStylesAction();
        toast.success(`Kitchen styles synced — ${summary.synced} to public.cuisines`);
      } else {
        const summary = await syncAllSupabaseDataAction();
        toast.success(
          `Supabase sync complete — members: ${formatSyncMembersSummary(summary.members)}; kitchen styles: ${summary.kitchenStyles.synced}`,
        );
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Supabase sync failed');
    } finally {
      setLoading(null);
    }
  };

  const buttonClass =
    'rounded-full border border-admin-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-admin-ink transition hover:border-admin-gold/50 disabled:opacity-50';

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {!compact && (
        <p className="text-sm leading-relaxed text-admin-muted">
          Pull Supabase Auth users into <code className="rounded bg-admin-surface px-1">rasoi.User</code>,
          and mirror kitchen styles into legacy <code className="rounded bg-admin-surface px-1">public.cuisines</code>.
          Recipes live in <code className="rounded bg-admin-surface px-1">rasoi.Recipe</code> only.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={buttonClass}
          disabled={loading !== null}
          onClick={() => void runSync('members')}
        >
          {loading === 'members' ? 'Syncing members…' : 'Sync members'}
        </button>
        <button
          type="button"
          className={buttonClass}
          disabled={loading !== null}
          onClick={() => void runSync('kitchenStyles')}
        >
          {loading === 'kitchenStyles' ? 'Syncing styles…' : 'Sync kitchen styles'}
        </button>
        <button
          type="button"
          className={`${buttonClass} border-admin-gold/60 bg-admin-gold/10`}
          disabled={loading !== null}
          onClick={() => void runSync('all')}
        >
          {loading === 'all' ? 'Syncing all…' : 'Sync all'}
        </button>
      </div>
    </div>
  );
}
