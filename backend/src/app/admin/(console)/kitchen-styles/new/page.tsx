import KitchenStyleForm from '@/app/admin/(console)/kitchen-styles/KitchenStyleForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';

export default function NewKitchenStylePage() {
  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/kitchen-styles"
        title="Add kitchen style"
        description="Create a new cuisine vibe for onboarding and settings."
        backHref="/admin/kitchen-styles"
        backLabel="Back to kitchen styles"
      />
      <KitchenStyleForm />
    </AdminPageLayout>
  );
}
