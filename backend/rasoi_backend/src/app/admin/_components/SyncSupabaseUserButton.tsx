'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/admin/_components/Toast';
import { syncSupabaseMemberAction } from '@/app/admin/supabase-sync-actions';

export default function SyncSupabaseUserButton({
  supabaseUserId,
  email,
}: {
  supabaseUserId: string;
  email: string | null;
}) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const result = await syncSupabaseMemberAction(supabaseUserId);
      if (result.status === 'created' || result.status === 'updated' || result.status === 'linked') {
        toast.success(
          result.status === 'created'
            ? `Created Rasoi profile for ${email ?? 'user'}`
            : result.status === 'linked'
              ? `Linked auth account to ${email ?? 'existing profile'}`
              : `Updated Rasoi profile for ${email ?? 'user'}`,
        );
        router.refresh();
        return;
      }
      if (result.status === 'skipped') {
        toast.error(result.reason);
        return;
      }
      toast.error(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => void handleSync()}
      className="rounded-full border border-admin-gold/50 bg-admin-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-admin-ink transition hover:border-admin-gold disabled:opacity-50"
    >
      {loading ? 'Syncing…' : 'Sync to Rasoi profile'}
    </button>
  );
}
