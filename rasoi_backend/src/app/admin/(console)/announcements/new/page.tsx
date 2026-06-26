import HomeAnnouncementForm from '@/app/admin/(console)/announcements/HomeAnnouncementForm';
import { PageHeader } from '@/app/admin/_components/ui';

export default function NewHomeAnnouncementPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="New home announcement"
        description="Modal and/or banner on Home. Users see it once per campaign key."
      />
      <HomeAnnouncementForm />
    </div>
  );
}
