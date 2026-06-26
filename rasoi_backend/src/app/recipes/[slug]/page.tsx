import { notFound } from 'next/navigation';

import JsonLd from '@/app/_components/JsonLd';
import SeoArticlePage from '@/app/_components/SeoArticlePage';
import {
  getAllRecipeSlugs,
  getSeoRecipePage,
} from '@/lib/seo-content-pages';
import { articlePageJsonLd, buildContentPageMetadata } from '@/lib/seo';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRecipeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoRecipePage(slug);
  if (!page) return {};

  return buildContentPageMetadata({
    title: page.title,
    description: page.description,
    path: `/recipes/${page.slug}`,
    keywords: [...page.keywords],
  });
}

export default async function SeoRecipeRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoRecipePage(slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={articlePageJsonLd({
          title: page.title,
          description: page.description,
          path: `/recipes/${page.slug}`,
          faqs: page.faqs,
        })}
      />
      <SeoArticlePage
        h1={page.h1}
        intro={page.intro}
        sections={page.sections}
        faqs={page.faqs}
        relatedLinks={page.relatedLinks}
        showIndiaAppLinks
        meta={{ cuisine: page.cuisine, diet: page.diet, time: page.time }}
      />
    </>
  );
}
