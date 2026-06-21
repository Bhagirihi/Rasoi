import { Suspense } from 'react';

import ApplicationStatusButton from '@/app/admin/_components/ApplicationStatusButton';
import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import { DataTable } from '@/app/admin/_components/DataTable';
import SponsorApplicationFilterPanel from '@/app/admin/_components/SponsorApplicationFilterPanel';
import { Badge, PageHeader } from '@/app/admin/_components/ui';
import { deleteSponsorApplicationAction } from '@/app/admin/sponsor-application-actions';
import { db } from '@/lib/db';
import { getSponsorPlacementLabel } from '@/lib/sponsor-placements';

const statusTone = {
  pending: 'warning',
  reviewed: 'gold',
  approved: 'success',
  rejected: 'neutral',
} as const;

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function param(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function SponsorApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = param(params.status);
  const placement = param(params.placement);

  const where = {
    ...(status && status !== 'all' ? { status } : {}),
    ...(placement && placement !== 'all' ? { placementInterest: placement } : {}),
  };

  const applications = await db.sponsorApplication.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  const pendingCount = applications.filter((item) => item.status === 'pending').length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sponsor applications"
        description={`${pendingCount} pending in view · Review brand partnership requests from the public website.`}
      />

      <Suspense fallback={null}>
        <SponsorApplicationFilterPanel />
      </Suspense>

      <DataTable
        columns={['Brand', 'Company', 'Placement', 'Status', 'Submitted', 'Actions']}
        emptyMessage="No applications match these filters."
      >
        {applications.map((application) => (
          <tr key={application.id} className="align-top transition hover:bg-[#f7f2ea]">
            <td className="px-5 py-4">
              <p className="font-medium text-admin-ink">{application.brandName}</p>
              <p className="mt-1 text-xs text-admin-muted">{application.contactName}</p>
              <p className="mt-1 text-xs text-admin-muted">{application.email}</p>
            </td>
            <td className="px-5 py-4 text-sm text-admin-muted">{application.companyName}</td>
            <td className="px-5 py-4">
              <Badge tone="gold">{getSponsorPlacementLabel(application.placementInterest)}</Badge>
            </td>
            <td className="px-5 py-4">
              <Badge tone={statusTone[application.status as keyof typeof statusTone] ?? 'neutral'}>
                {application.status}
              </Badge>
            </td>
            <td className="px-5 py-4 text-sm text-admin-muted">
              {application.createdAt.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </td>
            <td className="px-5 py-4">
              <div className="flex flex-col gap-2">
                <details className="text-sm">
                  <summary className="cursor-pointer font-semibold text-admin-saffron">View pitch</summary>
                  <p className="mt-2 max-w-xs text-xs leading-relaxed text-admin-muted">
                    {application.productDescription}
                  </p>
                  {application.message && (
                    <p className="mt-2 max-w-xs text-xs leading-relaxed text-admin-muted">
                      {application.message}
                    </p>
                  )}
                </details>
                <div className="flex flex-wrap gap-2">
                  {(['reviewed', 'approved', 'rejected'] as const).map((statusValue) => (
                    <ApplicationStatusButton
                      key={statusValue}
                      applicationId={application.id}
                      brandName={application.brandName}
                      status={statusValue}
                    />
                  ))}
                </div>
                <ConfirmDeleteForm
                  action={deleteSponsorApplicationAction.bind(null, application.id)}
                  confirmMessage={`Delete application from ${application.brandName}?`}
                  successMessage={`Deleted application from ${application.brandName}.`}
                >
                  <button type="submit" className="text-xs font-medium text-red-700/80 hover:text-red-700">
                    Delete
                  </button>
                </ConfirmDeleteForm>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
