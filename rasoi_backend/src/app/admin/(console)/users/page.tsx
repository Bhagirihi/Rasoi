import { Suspense } from 'react';

import SupabaseSyncPanel from '@/app/admin/_components/SupabaseSyncPanel';
import UserFilterPanel from '@/app/admin/_components/UserFilterPanel';
import UsersManagementClient from '@/app/admin/_components/UsersManagementClient';
import { buildAdminPageHref, TablePagination } from '@/app/admin/_components/TablePagination';
import { PageHeader } from '@/app/admin/_components/ui';
import { loadAdminMemberRows } from '@/lib/admin-members';
import { buildUserWhere } from '@/lib/recipe-filters';
import { db } from '@/lib/db';
import { parsePageParams } from '@/lib/pagination';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ADMIN_USER_PAGE_SIZE = 50;

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
  const pageParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const resolved = param(value);
    if (resolved) pageParams.set(key, resolved);
  }
  pageParams.set('limit', String(ADMIN_USER_PAGE_SIZE));
  const { page, pageSize, offset } = parsePageParams(pageParams, {
    defaultLimit: ADMIN_USER_PAGE_SIZE,
    maxLimit: ADMIN_USER_PAGE_SIZE,
  });

  const { rows, total: memberTotal } = await loadAdminMemberRows(where, {
    includeAuthOnly,
    take: pageSize,
    skip: offset,
  });
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
            ? `Showing ${rows.length === 0 ? 0 : offset + 1}–${offset + rows.length} of ${memberTotal} matching accounts (${totalCount} Rasoi profiles in database). ${pushReadyCount} on this page can receive push.`
            : `Showing ${rows.length === 0 ? 0 : offset + 1}–${offset + rows.length} of ${memberTotal} accounts (${totalCount} synced profiles${authOnlyCount > 0 ? `, ${authOnlyCount} auth-only on this page` : ''}). Open a synced member to send notifications or manage account status.`
        }
      />

      <Suspense fallback={null}>
        <UserFilterPanel />
      </Suspense>

      <div className="admin-card rounded-2xl p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
          Supabase sync
        </p>
        <div className="mt-3">
          <SupabaseSyncPanel compact />
        </div>
      </div>

      <UsersManagementClient users={rows} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={memberTotal}
        buildHref={(nextPage) => buildAdminPageHref('/admin/users', params, nextPage)}
      />
    </div>
  );
}
