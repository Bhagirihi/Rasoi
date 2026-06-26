import { notFound } from 'next/navigation';

import HomeAnnouncementForm from '@/app/admin/(console)/announcements/HomeAnnouncementForm';
import { PageHeader } from '@/app/admin/_components/ui';
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
    <div className="space-y-8">
      <PageHeader title="Edit home announcement" description={announcement.campaignKey} />
      <HomeAnnouncementForm announcement={announcement} />
    </div>
  );
}
