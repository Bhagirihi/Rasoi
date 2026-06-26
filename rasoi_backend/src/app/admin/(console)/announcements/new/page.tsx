import HomeAnnouncementForm from '@/app/admin/(console)/announcements/HomeAnnouncementForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';

export default function NewHomeAnnouncementPage() {
  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/announcements"
        title="New home announcement"
        description="Modal and/or banner on Home. Users see it once per campaign key."
        backHref="/admin/announcements"
        backLabel="Back to announcements"
      />
      <HomeAnnouncementForm />
    </AdminPageLayout>
  );
}
