import SponsorForm from '@/app/admin/(console)/sponsors/SponsorForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';

export default function NewSponsorPage() {
  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/sponsors"
        title="Add sponsor"
        description="Choose a screen placement (Home, Recipes, Pantry, Saved, or Recipe detail), then add brand copy and affiliate search terms."
        backHref="/admin/sponsors"
        backLabel="Back to sponsors"
      />
      <SponsorForm />
    </AdminPageLayout>
  );
}
