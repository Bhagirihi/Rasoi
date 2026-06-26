import Link from 'next/link';

import ConfirmDeleteForm from '@/app/admin/_components/ConfirmDeleteForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import AdminPanel from '@/app/admin/_components/AdminPanel';
import { DataTable } from '@/app/admin/_components/DataTable';
import { Badge, PrimaryButton } from '@/app/admin/_components/ui';
import { deletePromoCodeAction } from '@/app/admin/promo-code-actions';
import { db } from '@/lib/db';
import { getBillingPlansCatalog } from '@/lib/plan-pricing';

export default async function AdminPromoCodesPage() {
  const [promoCodes, redemptionCounts] = await Promise.all([
    db.promoCode.findMany({ orderBy: { code: 'asc' } }),
    db.promoRedemption.findMany({
      select: { promoCodeId: true, consumedAt: true },
    }),
  ]);

  const consumedByPromo = redemptionCounts.reduce<Record<string, number>>((acc, row) => {
    if (row.consumedAt) {
      acc[row.promoCodeId] = (acc[row.promoCodeId] ?? 0) + 1;
    }
    return acc;
  }, {});

  const catalog = getBillingPlansCatalog();

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/promo-codes"
        action={<PrimaryButton href="/admin/promo-codes/new">Add promo code</PrimaryButton>}
      />

      <AdminPanel title="Google Play yearly offer (live)">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-admin-muted">Offer ID</dt>
            <dd className="font-mono text-admin-text">{catalog.yearlyPromo.playOfferId}</dd>
          </div>
          <div>
            <dt className="text-admin-muted">Offer tag (app purchase)</dt>
            <dd className="font-mono text-admin-text">{catalog.yearlyPromo.offerTag}</dd>
          </div>
          <div>
            <dt className="text-admin-muted">RevenueCat ignore tag</dt>
            <dd className="font-mono text-admin-text">{catalog.yearlyPromo.rcIgnoreOfferTag}</dd>
          </div>
          <div>
            <dt className="text-admin-muted">Checkout price (India)</dt>
            <dd className="text-admin-text">
              ₹{catalog.yearlyPromo.checkoutAmountInr} first year · then ₹
              {catalog.yearlyPromo.renewalAmountInr}/year
            </dd>
          </div>
        </dl>
      </AdminPanel>

      <DataTable
        columns={['Code', 'Kind', 'Effect', 'Redemptions', 'Consumed', 'Status', 'Actions']}
        emptyMessage="No promo codes yet. Add one or run npm run db:seed to load launch codes."
        footer={`${promoCodes.length} code${promoCodes.length === 1 ? '' : 's'}`}
      >
        {promoCodes.map((promo) => (
          <tr key={promo.id} className="transition hover:bg-[#f7f2ea]">
            <td className="px-5 py-4 font-mono font-semibold text-admin-ink">{promo.code}</td>
            <td className="px-5 py-4 text-admin-muted">{promo.kind}</td>
            <td className="px-5 py-4 text-admin-muted">
              {promo.kind === 'trial_extend'
                ? `+${promo.trialExtendDays} trial days`
                : `${catalog.yearlyPromo.discountPercent}% off yearly · tag ${promo.playOfferTag}`}
            </td>
            <td className="px-5 py-4 text-admin-muted">
              {promo.redemptionCount} / {promo.maxRedemptions}
            </td>
            <td className="px-5 py-4 text-admin-muted">{consumedByPromo[promo.id] ?? 0}</td>
            <td className="px-5 py-4">
              <Badge tone={promo.active ? 'success' : 'neutral'}>
                {promo.active ? 'Active' : 'Inactive'}
              </Badge>
            </td>
            <td className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/admin/promo-codes/${promo.id}`}
                  className="text-sm font-semibold text-admin-saffron hover:text-admin-ink"
                >
                  Edit
                </Link>
                <ConfirmDeleteForm
                  action={deletePromoCodeAction.bind(null, promo.id)}
                  confirmMessage={`Delete promo code "${promo.code}"? Existing redemptions will be removed.`}
                  successMessage={`Deleted promo code "${promo.code}".`}
                >
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-700/80 hover:text-red-700"
                  >
                    Delete
                  </button>
                </ConfirmDeleteForm>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <AdminPanel title="Rules">
        <ul className="space-y-2 text-sm leading-relaxed text-admin-muted">
          <li>Trial codes: active in-app trial only (not expired, not paid).</li>
          <li>Yearly code: sets user yearlyPromoOfferTag → Play offer at checkout.</li>
          <li>Deactivate or delete leaked codes here; run db:seed only to restore launch defaults.</li>
        </ul>
      </AdminPanel>
    </AdminPageLayout>
  );
}
