import PaymentsToggle from '@/app/admin/_components/PaymentsToggle';
import FeedbackOverviewPanel from '@/app/admin/_components/FeedbackOverviewPanel';
import StatCard from '@/app/admin/_components/StatCard';
import { AdminCard, GhostButton, PageHeader, PrimaryButton } from '@/app/admin/_components/ui';
import { getAppConfig } from '@/lib/app-settings';
import { getFeedbackStats, getRecentPendingFeedback } from '@/lib/feedback-stats';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [recipeCount, sponsorCount, userCount, guestCount, appConfig, feedbackStats, recentPendingFeedback] =
    await Promise.all([
      prisma.recipe.count(),
      prisma.sponsor.count({ where: { active: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { isGuest: true } }),
      getAppConfig(),
      getFeedbackStats(),
      getRecentPendingFeedback(3),
    ]);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Overview"
        description="A refined control room for recipes, sponsors, partner links, and member activity across the Rasoi mobile experience."
        action={
          <div className="flex flex-wrap gap-3">
            <PrimaryButton href="/admin/recipes/new">Add recipe</PrimaryButton>
            <GhostButton href="/admin/partners">Partner URLs</GhostButton>
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

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard className="p-6 lg:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
            Operations
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-admin-ink">
            Content at a glance
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-admin-muted">
            Keep the mobile app feeling curated. Publish recipes with care, rotate sponsor
            placements seasonally, and monitor member onboarding from this console.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-admin-ink">
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
        </AdminCard>

        <AdminCard className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
            Payment
          </p>
          <div className="mt-4">
            <PaymentsToggle paymentsEnabled={appConfig.paymentsEnabled} />
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
            User reports
          </p>
          <div className="mt-4">
            <FeedbackOverviewPanel
              stats={feedbackStats}
              recentPending={recentPendingFeedback}
              compact
            />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
