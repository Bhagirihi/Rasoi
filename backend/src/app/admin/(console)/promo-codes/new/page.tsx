import PromoCodeForm from '@/app/admin/(console)/promo-codes/PromoCodeForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';

export default function NewPromoCodePage() {
  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/promo-codes"
        title="Add promo code"
        description="Create trial extension or yearly Play offer unlock codes. Users redeem them in the app paywall."
        backHref="/admin/promo-codes"
        backLabel="Back to promo codes"
      />
      <PromoCodeForm />
    </AdminPageLayout>
  );
}
