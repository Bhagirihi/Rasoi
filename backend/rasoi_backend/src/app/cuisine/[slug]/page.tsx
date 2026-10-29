import {
  renderTaxonomyPage,
  taxonomyMetadata,
  taxonomyStaticParams,
} from '@/lib/seo-taxonomy-route';

export const dynamicParams = false;

export function generateStaticParams() {
  return taxonomyStaticParams('cuisine');
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return taxonomyMetadata({ kind: 'cuisine', slug });
}

export default async function CuisineHubPage({ params }: PageProps) {
  const { slug } = await params;
  return renderTaxonomyPage({ kind: 'cuisine', slug });
}
