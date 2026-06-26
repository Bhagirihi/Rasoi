import type { MetadataRoute } from 'next';

import { PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import { getAllMarkets } from '@/lib/markets';
import { getAllSeoContentPaths } from '@/lib/seo-content-pages';
import { SITE_URL } from '@/lib/seo';

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
      priority: path === '/indian-recipe-app' ? 0.94 : path.startsWith('/recipes/') ? 0.82 : 0.88,
    })),
    {
      url: `${SITE_URL}${PLAY_STORE_SEO_PATH}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.95,
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
