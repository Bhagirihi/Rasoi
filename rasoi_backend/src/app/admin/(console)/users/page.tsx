import { Suspense } from 'react';

import UserFilterPanel from '@/app/admin/_components/UserFilterPanel';
import UsersManagementClient from '@/app/admin/_components/UsersManagementClient';
import { PageHeader } from '@/app/admin/_components/ui';
import { loadAdminMemberRows } from '@/lib/admin-members';
import { buildUserWhere } from '@/lib/recipe-filters';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function hasRestrictiveFilters(filterParams: {
  dietChoice?: string;
  region?: string;
  memberType?: string;
  plan?: string;
  accountStatus?: string;
}): boolean {
  return Boolean(
    (filterParams.dietChoice && filterParams.dietChoice !== 'all') ||
      (filterParams.region && filterParams.region !== 'all') ||
      (filterParams.memberType && filterParams.memberType !== 'all') ||
      (filterParams.plan && filterParams.plan !== 'all') ||
      (filterParams.accountStatus && filterParams.accountStatus !== 'all'),
  );
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
  const includeAuthOnly = !hasRestrictiveFilters(filterParams);
  const rows = await loadAdminMemberRows(where, { includeAuthOnly });
  const totalCount = await db.user.count();
  const authOnlyCount = rows.filter((row) => row.syncStatus === 'auth_only').length;
  const pushReadyCount = rows.filter((user) => user.pushTokenCount > 0).length;

  const hasFilters = hasRestrictiveFilters(filterParams);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Members"
        description={
          hasFilters
            ? `Showing ${rows.length} matching accounts (${totalCount} Rasoi profiles in database). ${pushReadyCount} can receive push.`
            : `Rasoi app profiles plus Supabase Auth users (${totalCount} synced profiles${authOnlyCount > 0 ? `, ${authOnlyCount} auth-only` : ''}). Open a synced member to send notifications or manage account status.`
        }
      />

      <Suspense fallback={null}>
        <UserFilterPanel />
      </Suspense>

      <UsersManagementClient users={rows} />
    </div>
  );
}
