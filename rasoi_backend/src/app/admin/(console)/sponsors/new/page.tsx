import SponsorForm from '@/app/admin/(console)/sponsors/SponsorForm';
import { GhostButton, PageHeader } from '@/app/admin/_components/ui';

export default function NewSponsorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Add sponsor"
        description="Choose a screen placement (Home, Recipes, Pantry, Saved, or Recipe detail), then add brand copy and affiliate search terms."
        action={<GhostButton href="/admin/sponsors">Back to sponsors</GhostButton>}
      />
      <SponsorForm />
    </div>
  );
}
