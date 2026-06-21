import { redirect } from 'next/navigation';

import SponsorForm from '@/app/admin/(console)/sponsors/SponsorForm';
import { GhostButton, PageHeader } from '@/app/admin/_components/ui';
import { db } from '@/lib/db';
import { serializeSponsor } from '@/lib/serializers';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditSponsorPage({ params }: PageProps) {
  const { id } = await params;
  const sponsor = await db.sponsor.findUnique({ where: { id } });
  if (!sponsor) redirect('/admin/sponsors');

  const serialized = serializeSponsor(sponsor);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit sponsor"
        description={serialized.brandName}
        action={<GhostButton href="/admin/sponsors">Back to sponsors</GhostButton>}
      />
      <SponsorForm sponsor={serialized} />
    </div>
  );
}
