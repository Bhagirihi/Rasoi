import {
  renderTaxonomyPage,
  taxonomyMetadata,
  taxonomyStaticParams,
} from '@/lib/seo-taxonomy-route';

export const dynamicParams = false;

export function generateStaticParams() {
  return taxonomyStaticParams('festival');
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return taxonomyMetadata({ kind: 'festival', slug });
}

export default async function FestivalHubPage({ params }: PageProps) {
  const { slug } = await params;
  return renderTaxonomyPage({ kind: 'festival', slug });
}
