import { notFound } from 'next/navigation';

import JsonLd from '@/app/_components/JsonLd';
import SeoArticlePage from '@/app/_components/SeoArticlePage';
import {
  getAllRecipeSlugs,
  getSeoRecipePage,
} from '@/lib/seo-content-pages';
import { SEO_RECIPE_BLOGS_GENERATED_AT } from '@/lib/seo-recipe-blogs-data';
import { buildRecipeBlogMetadata, recipeBlogJsonLd } from '@/lib/seo';
import { enrichRecipeRelatedLinks } from '@/lib/seo-taxonomy';

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

  return buildRecipeBlogMetadata({
    title: page.title,
    description: page.description,
    slug: page.slug,
    keywords: [...page.keywords],
    imageUrl: page.imageUrl,
    h1: page.h1,
    publishedTime: SEO_RECIPE_BLOGS_GENERATED_AT,
    modifiedTime: SEO_RECIPE_BLOGS_GENERATED_AT,
  });
}

export default async function SeoRecipeRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoRecipePage(slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={recipeBlogJsonLd({
          title: page.title,
          description: page.description,
          path: `/recipes/${page.slug}`,
          imageUrl: page.imageUrl,
          cuisine: page.cuisine,
          diet: page.diet,
          time: page.time,
          keywords: page.keywords,
          ingredients: page.ingredients,
          steps: page.steps,
          faqs: page.faqs,
          publishedTime: SEO_RECIPE_BLOGS_GENERATED_AT,
          modifiedTime: SEO_RECIPE_BLOGS_GENERATED_AT,
        })}
      />
      <SeoArticlePage
        h1={page.h1}
        intro={page.intro}
        sections={page.sections}
        faqs={page.faqs}
        relatedLinks={enrichRecipeRelatedLinks(page, page.relatedLinks)}
        showIndiaAppLinks
        meta={{ cuisine: page.cuisine, diet: page.diet, time: page.time }}
        imageUrl={page.imageUrl}
        imageAlt={`${page.h1} recipe — ingredients and method for Indian home cooking`}
        ingredients={page.ingredients}
        steps={page.steps}
        marketNotes={page.marketNotes}
        breadcrumbs={[
          { href: '/', label: 'Rasoi' },
          { href: '/recipes', label: 'Recipe guides' },
          { href: `/recipes/${page.slug}`, label: page.h1 },
        ]}
        playStoreCtaDishName={page.h1.replace(/\s+recipe$/i, '')}
      />
    </>
  );
}
