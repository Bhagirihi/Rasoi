import { notFound } from 'next/navigation';

import KitchenStyleForm from '@/app/admin/(console)/kitchen-styles/KitchenStyleForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import { ensureKitchenStyles } from '@/lib/kitchen-styles';
import { db } from '@/lib/db';

export default async function EditKitchenStylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureKitchenStyles();

  const style = await db.kitchenStyle.findUnique({ where: { id } });
  if (!style) notFound();

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/kitchen-styles"
        title={`Edit ${style.label}`}
        description="Update label, imagery, region mapping, or disable this style in the app."
        backHref="/admin/kitchen-styles"
        backLabel="Back to kitchen styles"
      />
      <KitchenStyleForm style={style} />
    </AdminPageLayout>
  );
}
