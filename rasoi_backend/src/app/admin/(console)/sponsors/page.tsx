import Link from 'next/link';

import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import { DataTable } from '@/app/admin/_components/DataTable';
import SponsorActiveToggle from '@/app/admin/_components/SponsorActiveToggle';
import { Badge, GhostButton, PrimaryButton } from '@/app/admin/_components/ui';
import { deleteSponsorAction } from '@/app/admin/sponsor-actions';
import { db } from '@/lib/db';
import { getSponsorPlacementLabel } from '@/lib/sponsor-placements';
import { serializeSponsor } from '@/lib/serializers';

export default async function AdminSponsorsPage() {
  const sponsors = await db.sponsor.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/sponsors"
        description="Curate sponsored placements for Home, Recipes, Pantry, Saved, and Recipe detail. Toggle active to show or hide in the app."
        action={
          <div className="flex flex-wrap gap-3">
            <GhostButton href="/admin/sponsor-analytics">View analytics</GhostButton>
            <PrimaryButton href="/admin/sponsors/new">Add sponsor</PrimaryButton>
          </div>
        }
      />

      <DataTable
        columns={['Brand', 'Placement', 'Priority', 'Status', 'Actions']}
        emptyMessage="No sponsors configured. Add a brand placement to monetize the app."
        footer={`${sponsors.length} placement${sponsors.length === 1 ? '' : 's'}`}
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
                <Badge tone="gold">{getSponsorPlacementLabel(serialized.placement)}</Badge>
              </td>
              <td className="px-5 py-4 text-admin-muted">{serialized.priority}</td>
              <td className="px-5 py-4">
                <SponsorActiveToggle
                  sponsorId={sponsor.id}
                  brandName={serialized.brandName}
                  active={serialized.active}
                />
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={`/admin/sponsor-analytics?brand=${encodeURIComponent(serialized.brandName)}&placement=${encodeURIComponent(serialized.placement)}`}
                    className="text-sm font-semibold text-admin-ink hover:text-admin-saffron"
                  >
                    Analytics
                  </Link>
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
    </AdminPageLayout>
  );
}
