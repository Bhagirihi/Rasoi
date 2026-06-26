import { formatAdminDateTimeMedium } from '@/app/admin/_components/admin-datetime';
import Link from 'next/link';

import AnnouncementEnabledToggle from '@/app/admin/_components/AnnouncementEnabledToggle';
import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import { DataTable } from '@/app/admin/_components/DataTable';
import { Badge, PageHeader, PrimaryButton } from '@/app/admin/_components/ui';
import { deleteHomeAnnouncementAction } from '@/app/admin/announcement-actions';
import { db } from '@/lib/db';

function formatSchedule(startsAt: Date | null, endsAt: Date | null): string {
  if (!startsAt && !endsAt) return 'Always on';
  const start = startsAt ? formatAdminDateTimeMedium(startsAt) : 'Any time';
  const end = endsAt ? formatAdminDateTimeMedium(endsAt) : 'No end';
  return `${start} → ${end}`;
}

export default async function AdminAnnouncementsPage() {
  const announcements = await db.homeAnnouncement.findMany({
    orderBy: [{ sortOrder: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Home announcements"
        description="Backend-controlled modal and banner on Home. Dismissed once per campaign on device. Lower priority than email verification and trial paywall."
        action={<PrimaryButton href="/admin/announcements/new">New campaign</PrimaryButton>}
      />

      <DataTable
        columns={['Campaign', 'Presentation', 'Audience', 'Schedule', 'Status', 'Actions']}
        emptyMessage="No announcements yet. Create a campaign to nudge users without an app release."
      >
        {announcements.map((row) => (
          <tr key={row.id} className="transition hover:bg-[#f7f2ea]">
            <td className="px-5 py-4">
              <p className="font-medium text-admin-ink">{row.title}</p>
              <p className="mt-1 text-xs text-admin-muted">{row.campaignKey}</p>
            </td>
            <td className="px-5 py-4">
              <Badge tone="gold">{row.presentation}</Badge>
            </td>
            <td className="px-5 py-4 text-admin-muted">{row.audience}</td>
            <td className="px-5 py-4 text-xs text-admin-muted">{formatSchedule(row.startsAt, row.endsAt)}</td>
            <td className="px-5 py-4">
              <AnnouncementEnabledToggle announcementId={row.id} title={row.title} enabled={row.enabled} />
            </td>
            <td className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/admin/announcements/${row.id}`}
                  className="text-sm font-semibold text-admin-saffron hover:text-admin-ink"
                >
                  Edit
                </Link>
                <ConfirmDeleteForm
                  action={deleteHomeAnnouncementAction.bind(null, row.id)}
                  confirmMessage={`Delete campaign "${row.title}"?`}
                  successMessage={`Deleted "${row.title}".`}
                >
                  <button type="submit" className="text-sm font-medium text-red-700/80 hover:text-red-700">
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
