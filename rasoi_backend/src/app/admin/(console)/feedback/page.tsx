import FeedbackOverviewPanel from '@/app/admin/_components/FeedbackOverviewPanel';
import FeedbackTable from '@/app/admin/_components/FeedbackTable';
import { AdminCard, PageHeader } from '@/app/admin/_components/ui';
import { getFeedbackList, getFeedbackStats, getRecentPendingFeedback } from '@/lib/feedback-stats';

export default async function FeedbackAdminPage() {
  const [stats, feedbackItems, recentPending] = await Promise.all([
    getFeedbackStats(),
    getFeedbackList(),
    getRecentPendingFeedback(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="User reports"
        description={`${stats.pendingCount} pending · ${stats.totalCount} total · Issues, suggestions, and feedback from the Rasoi mobile app.`}
      />

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          Inbox summary
        </p>
        <div className="mt-5">
          <FeedbackOverviewPanel stats={stats} recentPending={recentPending} />
        </div>
      </AdminCard>

      <AdminCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          From the mobile app
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-admin-muted">
          <li>Settings → Support → Send feedback</li>
          <li>Categories: report an issue, suggestion, or other</li>
          <li>Logged-in users are linked to their Rasoi account automatically</li>
          <li>Mark entries reviewed or resolved as you triage them</li>
        </ul>
      </AdminCard>

      <div>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          All submissions
        </p>
        <FeedbackTable items={feedbackItems} />
      </div>
    </div>
  );
}
