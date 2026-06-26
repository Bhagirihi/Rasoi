import { redirect } from 'next/navigation';

import PromoCodeForm, {
  type PromoCodeFormValues,
} from '@/app/admin/(console)/promo-codes/PromoCodeForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
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
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/promo-codes"
        title="Edit promo code"
        description={promo.code}
        backHref="/admin/promo-codes"
        backLabel="Back to promo codes"
      />
      <PromoCodeForm promo={values} />
    </AdminPageLayout>
  );
}
