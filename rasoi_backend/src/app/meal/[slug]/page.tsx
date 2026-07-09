import {
  renderTaxonomyPage,
  taxonomyMetadata,
  taxonomyStaticParams,
} from '@/lib/seo-taxonomy-route';

export const dynamicParams = false;

export function generateStaticParams() {
  return taxonomyStaticParams('meal');
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return taxonomyMetadata({ kind: 'meal', slug });
}

export default async function MealHubPage({ params }: PageProps) {
  const { slug } = await params;
  return renderTaxonomyPage({ kind: 'meal', slug });
}
