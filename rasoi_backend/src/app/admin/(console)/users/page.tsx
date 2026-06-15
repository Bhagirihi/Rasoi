import { Suspense } from 'react';

import UserFilterPanel from '@/app/admin/_components/UserFilterPanel';
import UsersManagementClient from '@/app/admin/_components/UsersManagementClient';
import type { AdminUserRow } from '@/app/admin/_components/admin-users-types';
import { PageHeader } from '@/app/admin/_components/ui';
import { buildUserWhere, DIET_CHOICE_LABELS, type DietChoice } from '@/lib/recipe-filters';
import { prisma } from '@/lib/prisma';
import { serializeUser } from '@/lib/serializers';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function toAdminUserRow(
  user: Awaited<ReturnType<typeof loadUsers>>[number],
): AdminUserRow {
  const serialized = serializeUser(user);
  const dietLabel =
    DIET_CHOICE_LABELS[serialized.dietChoice as DietChoice] ?? serialized.dietChoice;
  const pushTokenCount = user._count.pushTokens;
  const ineligibleReasons: string[] = [];

  if (serialized.isGuest) ineligibleReasons.push('Guest account');
  if (!serialized.isActive) ineligibleReasons.push('Account deactivated');
  if (!serialized.hasCompletedOnboarding) ineligibleReasons.push('Onboarding incomplete');
  if (!serialized.notificationsEnabled) ineligibleReasons.push('Notifications disabled');
  if (pushTokenCount === 0) ineligibleReasons.push('No active push token');

  return {
    id: serialized.id,
    name: serialized.name,
    email: serialized.email,
    phone: serialized.phone,
    dietLabel,
    regionalCuisine: serialized.regionalCuisine,
    favoriteCuisines: serialized.favoriteCuisines,
    isGuest: serialized.isGuest,
    isActive: serialized.isActive,
    planTier: serialized.plan.planTier,
    hasCompletedOnboarding: serialized.hasCompletedOnboarding,
    notificationsEnabled: serialized.notificationsEnabled,
    pushTokenCount,
    timezone: user.timezone || 'Asia/Kolkata',
    ineligibleReasons,
  };
}

async function loadUsers(where: ReturnType<typeof buildUserWhere>) {
  return prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      _count: {
        select: {
          pushTokens: { where: { active: true } },
        },
      },
    },
  });
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filterParams = {
    dietChoice: param(params.dietChoice),
    region: param(params.region),
    memberType: param(params.memberType),
    plan: param(params.plan),
    accountStatus: param(params.accountStatus),
  };

  const where = buildUserWhere(filterParams);
  const users = await loadUsers(where);
  const totalCount = await prisma.user.count();
  const rows = users.map(toAdminUserRow);
  const pushReadyCount = rows.filter((user) => user.pushTokenCount > 0).length;

  const hasFilters =
    filterParams.dietChoice ||
    (filterParams.region && filterParams.region !== 'all') ||
    (filterParams.memberType && filterParams.memberType !== 'all') ||
    (filterParams.plan && filterParams.plan !== 'all') ||
    (filterParams.accountStatus && filterParams.accountStatus !== 'all');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Members"
        description={
          hasFilters
            ? `Showing ${rows.length} of ${totalCount} accounts. Open a member to send notifications or manage account status. ${pushReadyCount} have active push tokens.`
            : `Registered accounts and guest sessions. Open a member drawer to send meal picks, custom messages, or activate/deactivate. ${pushReadyCount} of ${rows.length} shown users can receive push.`
        }
      />

      <Suspense fallback={null}>
        <UserFilterPanel />
      </Suspense>

      <UsersManagementClient users={rows} />
    </div>
  );
}
