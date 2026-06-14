import { notFound } from 'next/navigation';

import KitchenStyleForm from '@/app/admin/(console)/kitchen-styles/KitchenStyleForm';
import { PageHeader } from '@/app/admin/_components/ui';
import { ensureKitchenStyles } from '@/lib/kitchen-styles';
import { prisma } from '@/lib/prisma';

export default async function EditKitchenStylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureKitchenStyles();

  const style = await prisma.kitchenStyle.findUnique({ where: { id } });
  if (!style) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Edit ${style.label}`}
        description="Update label, imagery, region mapping, or disable this style in the app."
      />
      <KitchenStyleForm style={style} />
    </div>
  );
}
