import { redirect } from 'next/navigation';

import SponsorForm from '@/app/admin/(console)/sponsors/SponsorForm';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import { db } from '@/lib/db';
import { serializeSponsor } from '@/lib/serializers';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditSponsorPage({ params }: PageProps) {
  const { id } = await params;
  const sponsor = await db.sponsor.findUnique({ where: { id } });
  if (!sponsor) redirect('/admin/sponsors');

  const serialized = serializeSponsor(sponsor);

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/sponsors"
        title="Edit sponsor"
        description={serialized.brandName}
        backHref="/admin/sponsors"
        backLabel="Back to sponsors"
      />
      <SponsorForm sponsor={serialized} />
    </AdminPageLayout>
  );
}
