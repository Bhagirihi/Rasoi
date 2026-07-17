import { notFound } from 'next/navigation';

import JsonLd from '@/app/_components/JsonLd';
import SeoHubPage from '@/app/_components/SeoHubPage';
import {
  getAllTaxonomyParams,
  getRecipesForHub,
  getTaxonomyHub,
  getTaxonomyPath,
  type TaxonomyKind,
} from '@/lib/seo-taxonomy';
import { buildTaxonomyMetadata, taxonomyHubJsonLd } from '@/lib/seo';

const KIND_LABELS: Record<TaxonomyKind, string> = {
  cuisine: 'Cuisines',
  ingredient: 'Ingredients',
  meal: 'Meals',
  festival: 'Festivals',
};

type TaxonomyRouteProps = {
  kind: TaxonomyKind;
  slug: string;
};

export function taxonomyStaticParams(kind: TaxonomyKind) {
  return getAllTaxonomyParams()
    .filter((p) => p.kind === kind)
    .map((p) => ({ slug: p.slug }));
}

export async function renderTaxonomyPage({ kind, slug }: TaxonomyRouteProps) {
  const hub = getTaxonomyHub(kind, slug);
  if (!hub) notFound();

  const path = getTaxonomyPath(hub);
  const recipes = getRecipesForHub(hub);

  return (
    <>
      <JsonLd
        data={taxonomyHubJsonLd({
          title: hub.title,
          description: hub.description,
          path,
          faqs: hub.faqs,
          recipes: recipes.map((r) => ({ name: r.h1, slug: r.slug })),
        })}
      />
      <SeoHubPage
        eyebrow={KIND_LABELS[kind]}
        h1={hub.h1}
        intro={hub.intro}
        sections={hub.sections}
        faqs={hub.faqs}
        recipes={recipes}
        relatedHubs={hub.relatedHubs}
        breadcrumbs={[
          { href: '/', label: 'Rasoi' },
          { href: '/indian-recipe-app', label: 'Guides' },
          { href: path, label: hub.h1 },
        ]}
      />
    </>
  );
}

export function taxonomyMetadata({ kind, slug }: TaxonomyRouteProps) {
  const hub = getTaxonomyHub(kind, slug);
  if (!hub) return {};

  return buildTaxonomyMetadata({
    title: hub.title,
    description: hub.description,
    path: getTaxonomyPath(hub),
    keywords: hub.keywords,
  });
}
