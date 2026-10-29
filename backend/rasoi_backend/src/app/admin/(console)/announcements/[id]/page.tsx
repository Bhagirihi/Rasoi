import { notFound } from 'next/navigation';

import HomeAnnouncementForm from '@/app/admin/(console)/announcements/HomeAnnouncementForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import { db } from '@/lib/db';

export default async function EditHomeAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await db.homeAnnouncement.findUnique({ where: { id } });
  if (!announcement) notFound();

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/announcements"
        title="Edit home announcement"
        description={announcement.campaignKey}
        backHref="/admin/announcements"
        backLabel="Back to announcements"
      />
      <HomeAnnouncementForm announcement={announcement} />
    </AdminPageLayout>
  );
}
