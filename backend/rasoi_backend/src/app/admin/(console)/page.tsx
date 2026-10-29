import AdminQuickLinks from '@/app/admin/_components/AdminQuickLinks';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPanel from '@/app/admin/_components/AdminPanel';
import PaymentsToggle from '@/app/admin/_components/PaymentsToggle';
import FeedbackOverviewPanel from '@/app/admin/_components/FeedbackOverviewPanel';
import StatCard from '@/app/admin/_components/StatCard';
import SupabaseSyncPanel from '@/app/admin/_components/SupabaseSyncPanel';
import { GhostButton, PrimaryButton } from '@/app/admin/_components/ui';
import { getAppConfig } from '@/lib/app-settings';
import { getFeedbackStats, getRecentPendingFeedback } from '@/lib/feedback-stats';
import { db } from '@/lib/db';

export default async function AdminDashboardPage() {
  const [recipeCount, sponsorCount, userCount, guestCount, appConfig, feedbackStats, recentPendingFeedback] =
    await Promise.all([
      db.recipe.count(),
      db.sponsor.count({ where: { active: true } }),
      db.user.count(),
      db.user.count({ where: { isGuest: true } }),
      getAppConfig(),
      getFeedbackStats(),
      getRecentPendingFeedback(3),
    ]);

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin"
        description="Stats, quick links, and day-to-day operations for the Rasoi mobile app."
        action={
          <div className="flex flex-wrap gap-3">
            <PrimaryButton href="/admin/recipes/new">Add recipe</PrimaryButton>
            <GhostButton href="/admin/users">Members</GhostButton>
            <GhostButton href="/admin/integrations">Integrations</GhostButton>
          </div>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Recipes" value={recipeCount} href="/admin/recipes" hint="View recipe library" />
        <StatCard label="Active sponsors" value={sponsorCount} href="/admin/sponsors" hint="Manage placements" />
        <StatCard label="Members" value={userCount} href="/admin/users" hint="Registered accounts" />
        <StatCard label="Guest sessions" value={guestCount} href="/admin/users" hint="Anonymous visitors" />
        <StatCard
          label="Pending reports"
          value={feedbackStats.pendingCount}
          href="/admin/feedback"
          hint="User issues & feedback"
        />
      </div>

      <AdminPanel
        title="Quick links"
        description="Jump to any admin module. Everything is grouped in the sidebar for faster navigation."
      >
        <AdminQuickLinks />
      </AdminPanel>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminPanel
          title="Content at a glance"
          description="Keep the mobile app feeling curated. Publish recipes with care, rotate sponsor placements seasonally, and monitor member onboarding from this console."
          className="lg:col-span-2"
        >
          <ul className="space-y-3 text-sm text-admin-ink">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-admin-gold" />
              Recipe cards sync directly to the Expo app feed.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-admin-gold" />
              Sponsor rails power home, pantry, and in-recipe placements.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-admin-gold" />
              Member profiles carry pantry, saved dishes, and plan state.
            </li>
          </ul>
        </AdminPanel>

        <AdminPanel title="Supabase sync">
          <SupabaseSyncPanel />
        </AdminPanel>

        <AdminPanel title="Payment">
          <PaymentsToggle paymentsEnabled={appConfig.paymentsEnabled} />
        </AdminPanel>

        <AdminPanel title="User reports">
          <FeedbackOverviewPanel
            stats={feedbackStats}
            recentPending={recentPendingFeedback}
            compact
          />
        </AdminPanel>
      </div>
    </AdminPageLayout>
  );
}
