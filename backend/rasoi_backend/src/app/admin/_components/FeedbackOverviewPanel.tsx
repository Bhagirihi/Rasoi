import { formatAdminDateShort } from '@/app/admin/_components/admin-datetime';
import Link from 'next/link';

import { GhostButton } from '@/app/admin/_components/ui';
import type { getFeedbackStats, getRecentPendingFeedback } from '@/lib/feedback-stats';

type FeedbackOverviewPanelProps = {
  stats: Awaited<ReturnType<typeof getFeedbackStats>>;
  recentPending: Awaited<ReturnType<typeof getRecentPendingFeedback>>;
  compact?: boolean;
};

const categoryLabel = {
  issue: 'Issue',
  suggestion: 'Suggestion',
  other: 'Other',
} as const;

export default function FeedbackOverviewPanel({
  stats,
  recentPending,
  compact = false,
}: FeedbackOverviewPanelProps) {
  const hasPending = stats.pendingCount > 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-admin-ink">
          {hasPending ? `${stats.pendingCount} pending report${stats.pendingCount === 1 ? '' : 's'}` : 'No pending reports'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-admin-muted">
          Users submit bugs, suggestions, and feedback from Settings → Send feedback in the mobile app.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">Issues</dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">{stats.issueCount}</dd>
        </div>
        <div className="rounded-xl border border-admin-border bg-[#faf7f2] px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-admin-muted">Suggestions</dt>
          <dd className="font-display mt-1 text-2xl font-semibold text-admin-ink">{stats.suggestionCount}</dd>
        </div>
      </dl>

      {!compact && recentPending.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
            Latest pending
          </p>
          <ul className="mt-3 space-y-2">
            {recentPending.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-admin-border bg-white px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-admin-ink">
                    {categoryLabel[item.category as keyof typeof categoryLabel] ?? item.category}
                  </span>
                  <span className="text-xs text-admin-muted">
                    {formatAdminDateShort(item.createdAt)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-admin-muted">{item.message}</p>
                <p className="mt-1 text-xs text-admin-muted">
                  {item.name ?? item.user?.name ?? 'Anonymous'}
                  {(item.email ?? item.user?.email) ? ` · ${item.email ?? item.user?.email}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <GhostButton href="/admin/feedback">View all reports</GhostButton>
        {hasPending && (
          <Link
            href="/admin/feedback"
            className="inline-flex items-center text-sm font-semibold text-admin-saffron transition hover:text-admin-gold"
          >
            Review pending →
          </Link>
        )}
      </div>
    </div>
  );
}
