import {
  renderTaxonomyPage,
  taxonomyMetadata,
  taxonomyStaticParams,
} from '@/lib/seo-taxonomy-route';

export const dynamicParams = false;

export function generateStaticParams() {
  return taxonomyStaticParams('ingredient');
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return taxonomyMetadata({ kind: 'ingredient', slug });
}

export default async function IngredientHubPage({ params }: PageProps) {
  const { slug } = await params;
  return renderTaxonomyPage({ kind: 'ingredient', slug });
}
