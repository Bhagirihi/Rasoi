import KitchenStyleForm from '@/app/admin/(console)/kitchen-styles/KitchenStyleForm';
import { PageHeader } from '@/app/admin/_components/ui';

export default function NewKitchenStylePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Add kitchen style"
        description="Create a new cuisine vibe for onboarding and settings."
      />
      <KitchenStyleForm />
    </div>
  );
}
