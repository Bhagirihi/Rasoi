import PromoCodeForm from '@/app/admin/(console)/promo-codes/PromoCodeForm';
import { GhostButton, PageHeader } from '@/app/admin/_components/ui';

export default function NewPromoCodePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Add promo code"
        description="Create trial extension or yearly Play offer unlock codes. Users redeem them in the app paywall."
        action={<GhostButton href="/admin/promo-codes">Back to promo codes</GhostButton>}
      />
      <PromoCodeForm />
    </div>
  );
}
