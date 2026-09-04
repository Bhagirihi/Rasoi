import { notFound } from 'next/navigation';

import JsonLd from '@/app/_components/JsonLd';
import SeoArticlePage from '@/app/_components/SeoArticlePage';
import { getMarketConfig } from '@/lib/markets';
import {
  getAllGuideSlugs,
  getSeoGuidePage,
} from '@/lib/seo-content-pages';
import { articlePageJsonLd, buildContentPageMetadata } from '@/lib/seo';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoGuidePage(slug);
  if (!page) return {};

  return buildContentPageMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    keywords: [...page.keywords],
  });
}

export default async function SeoGuideRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoGuidePage(slug);
  if (!page) notFound();

  const market = getMarketConfig(page.marketId);

  return (
    <>
      <JsonLd
        data={articlePageJsonLd({
          title: page.title,
          description: page.description,
          path: `/${page.slug}`,
          faqs: page.faqs,
        })}
      />
      <SeoArticlePage
        h1={page.h1}
        intro={page.intro}
        sections={page.sections}
        faqs={page.faqs}
        relatedLinks={page.relatedLinks}
        marketHomeHref={market.path}
        marketHomeLabel={`Rasoi ${market.label}`}
        showIndiaAppLinks={page.marketId === 'IN'}
      />
    </>
  );
}
