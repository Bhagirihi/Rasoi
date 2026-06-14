import Link from 'next/link';

import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import { DataTable } from '@/app/admin/_components/DataTable';
import { Badge, PageHeader, PrimaryButton } from '@/app/admin/_components/ui';
import { deleteSponsorAction } from '@/app/admin/sponsor-actions';
import { prisma } from '@/lib/prisma';
import { serializeSponsor } from '@/lib/serializers';

export default async function AdminSponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sponsors"
        description="Curate premium brand placements across home, pantry, and recipe surfaces."
        action={<PrimaryButton href="/admin/sponsors/new">Add sponsor</PrimaryButton>}
      />

      <DataTable
        columns={['Brand', 'Placement', 'Priority', 'Status', 'Actions']}
        emptyMessage="No sponsors configured. Add a brand placement to monetize the app."
      >
        {sponsors.map((sponsor) => {
          const serialized = serializeSponsor(sponsor);
          return (
            <tr key={sponsor.id} className="transition hover:bg-[#f7f2ea]">
              <td className="px-5 py-4">
                <p className="font-medium text-admin-ink">{serialized.brandName}</p>
                <p className="mt-1 text-xs text-admin-muted">{serialized.productLabel}</p>
              </td>
              <td className="px-5 py-4">
                <Badge tone="gold">{serialized.placement}</Badge>
              </td>
              <td className="px-5 py-4 text-admin-muted">{serialized.priority}</td>
              <td className="px-5 py-4">
                <Badge tone={serialized.active ? 'success' : 'warning'}>
                  {serialized.active ? 'Active' : 'Paused'}
                </Badge>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/sponsors/${sponsor.id}`}
                    className="text-sm font-semibold text-admin-saffron hover:text-admin-ink"
                  >
                    Edit
                  </Link>
                  <ConfirmDeleteForm
                    action={deleteSponsorAction.bind(null, sponsor.id)}
                    confirmMessage={`Delete sponsor "${serialized.brandName}"?`}
                    successMessage={`Deleted sponsor "${serialized.brandName}".`}
                  >
                    <button
                      type="submit"
                      className="text-sm font-medium text-red-700/80 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </ConfirmDeleteForm>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}
