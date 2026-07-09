import type { MetadataRoute } from 'next';

import { PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import { getAllMarkets } from '@/lib/markets';
import { getAllSeoContentPaths, SEO_RECIPE_PAGES } from '@/lib/seo-content-pages';
import { SITE_URL } from '@/lib/seo';

function recipeSitemapPriority(path: string): number {
  if (path === '/indian-recipe-app') return 0.94;
  if (path === '/recipes') return 0.95;
  if (!path.startsWith('/recipes/')) return 0.88;
  const slug = path.replace('/recipes/', '');
  const page = SEO_RECIPE_PAGES.find((recipe) => recipe.slug === slug);
  const rank = page?.searchVolumeRank ?? 999;
  if (rank <= 10) return 0.9;
  if (rank <= 30) return 0.86;
  return 0.82;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const marketEntries: MetadataRoute.Sitemap = getAllMarkets().map((market) => ({
    url: `${SITE_URL}${market.path === '/' ? '' : market.path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: market.id === 'IN' ? 1 : 0.92,
  }));

  return [
    ...marketEntries,
    ...getAllSeoContentPaths().map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: recipeSitemapPriority(path),
    })),
    {
      url: `${SITE_URL}${PLAY_STORE_SEO_PATH}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.98,
    },
    {
      url: `${SITE_URL}/download`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/delete-account`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
