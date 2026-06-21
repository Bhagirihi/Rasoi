import { redirect } from 'next/navigation';

import PromoCodeForm, {
  type PromoCodeFormValues,
} from '@/app/admin/(console)/promo-codes/PromoCodeForm';
import { GhostButton, PageHeader } from '@/app/admin/_components/ui';
import { db } from '@/lib/db';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPromoCodePage({ params }: PageProps) {
  const { id } = await params;
  const promo = await db.promoCode.findUnique({ where: { id } });
  if (!promo) redirect('/admin/promo-codes');

  const values: PromoCodeFormValues = {
    id: promo.id,
    code: promo.code,
    kind: promo.kind,
    trialExtendDays: promo.trialExtendDays,
    playOfferTag: promo.playOfferTag,
    maxRedemptions: promo.maxRedemptions,
    redemptionCount: promo.redemptionCount,
    expiresAt: promo.expiresAt?.toISOString() ?? null,
    active: promo.active,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit promo code"
        description={promo.code}
        action={<GhostButton href="/admin/promo-codes">Back to promo codes</GhostButton>}
      />
      <PromoCodeForm promo={values} />
    </div>
  );
}
