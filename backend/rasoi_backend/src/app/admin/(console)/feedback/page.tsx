import FeedbackOverviewPanel from '@/app/admin/_components/FeedbackOverviewPanel';
import FeedbackTable from '@/app/admin/_components/FeedbackTable';
import AdminCallout from '@/app/admin/_components/AdminCallout';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import AdminPanel from '@/app/admin/_components/AdminPanel';
import { getFeedbackList, getFeedbackStats, getRecentPendingFeedback } from '@/lib/feedback-stats';

export default async function FeedbackAdminPage() {
  const [stats, feedbackItems, recentPending] = await Promise.all([
    getFeedbackStats(),
    getFeedbackList(),
    getRecentPendingFeedback(),
  ]);

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/feedback"
        description={`${stats.pendingCount} pending · ${stats.totalCount} total · Issues, suggestions, and feedback from the Rasoi mobile app.`}
      />

      <AdminPanel title="Inbox summary">
        <FeedbackOverviewPanel stats={stats} recentPending={recentPending} />
      </AdminPanel>

      <AdminCallout tone="tip">
        <strong>From the mobile app:</strong> Settings → Support → Send feedback. Categories include report
        an issue, suggestion, or other. Logged-in users are linked automatically — mark entries reviewed or
        resolved as you triage.
      </AdminCallout>

      <AdminPanel
        title="All submissions"
        description={`${feedbackItems.length} item${feedbackItems.length === 1 ? '' : 's'} in the log`}
      >
        <FeedbackTable items={feedbackItems} />
      </AdminPanel>
    </AdminPageLayout>
  );
}
