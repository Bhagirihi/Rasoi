import { Suspense } from 'react';

import { DataTable } from '@/app/admin/_components/DataTable';
import UserFilterPanel from '@/app/admin/_components/UserFilterPanel';
import { Badge, PageHeader } from '@/app/admin/_components/ui';
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

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filterParams = {
    dietChoice: param(params.dietChoice),
    region: param(params.region),
    memberType: param(params.memberType),
    plan: param(params.plan),
  };

  const where = buildUserWhere(filterParams);
  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  const totalCount = await prisma.user.count();

  const hasFilters =
    filterParams.dietChoice ||
    (filterParams.region && filterParams.region !== 'all') ||
    (filterParams.memberType && filterParams.memberType !== 'all') ||
    (filterParams.plan && filterParams.plan !== 'all');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Members"
        description={
          hasFilters
            ? `Showing ${users.length} of ${totalCount} accounts with current filters.`
            : 'Registered accounts and guest sessions from the Rasoi mobile app.'
        }
      />

      <Suspense fallback={null}>
        <UserFilterPanel />
      </Suspense>

      <DataTable
        columns={['Name', 'Email', 'Phone', 'Diet', 'Region', 'Type', 'Plan', 'Onboarding']}
        emptyMessage="No members match these filters."
      >
        {users.map((user) => {
          const serialized = serializeUser(user);
          const dietLabel =
            DIET_CHOICE_LABELS[serialized.dietChoice as DietChoice] ?? serialized.dietChoice;

          return (
            <tr key={user.id} className="transition hover:bg-[#f7f2ea]">
              <td className="px-5 py-4 font-medium text-admin-ink">{serialized.name}</td>
              <td className="px-5 py-4 text-sm text-admin-muted">
                {serialized.email ?? '—'}
              </td>
              <td className="px-5 py-4 text-admin-muted">{serialized.phone ?? '—'}</td>
              <td className="px-5 py-4">
                <Badge tone="gold">{dietLabel}</Badge>
              </td>
              <td className="px-5 py-4 text-sm text-admin-muted">{serialized.regionalCuisine}</td>
              <td className="px-5 py-4">
                <Badge tone={serialized.isGuest ? 'neutral' : 'gold'}>
                  {serialized.isGuest ? 'Guest' : 'Member'}
                </Badge>
              </td>
              <td className="px-5 py-4">
                <Badge tone="neutral">{serialized.plan.planTier}</Badge>
              </td>
              <td className="px-5 py-4">
                <Badge tone={serialized.hasCompletedOnboarding ? 'success' : 'warning'}>
                  {serialized.hasCompletedOnboarding ? 'Complete' : 'Pending'}
                </Badge>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}
