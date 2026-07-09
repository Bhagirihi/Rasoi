import type { MetadataRoute } from 'next';

import { PLAY_STORE_SEO_PATH } from '@/lib/app-download';
import { getAllMarkets } from '@/lib/markets';
import {
  getAllSeoContentPaths,
  SEO_GUIDE_PAGES,
  SEO_RECIPE_PAGES,
} from '@/lib/seo-content-pages';
import { getAllTaxonomyPaths } from '@/lib/seo-taxonomy';
import { SITE_URL } from '@/lib/seo';

export type SitemapPartitionId = 'markets' | 'guides' | 'recipes' | 'taxonomy' | 'utility';

export const SITEMAP_PARTITIONS: SitemapPartitionId[] = [
  'markets',
  'guides',
  'recipes',
  'taxonomy',
  'utility',
];

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

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly',
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export function buildSitemapPartition(id: SitemapPartitionId): MetadataRoute.Sitemap {
  switch (id) {
    case 'markets':
      return getAllMarkets().map((market) =>
        entry(market.path, market.id === 'IN' ? 1 : 0.92),
      );
    case 'guides':
      return [
        entry('/indian-recipe-app', 0.94),
        ...SEO_GUIDE_PAGES.map((page) => entry(`/${page.slug}`, 0.88)),
      ];
    case 'recipes': {
      const paths = getAllSeoContentPaths().filter(
        (p) => p === '/recipes' || p.startsWith('/recipes/'),
      );
      return paths.map((path) => entry(path, recipeSitemapPriority(path)));
    }
    case 'taxonomy':
      return getAllTaxonomyPaths().map((path) => entry(path, 0.84));
    case 'utility':
      return [
        entry(PLAY_STORE_SEO_PATH, 0.98),
        entry('/download', 0.9),
        entry('/privacy', 0.5, 'monthly'),
        entry('/terms', 0.5, 'monthly'),
        entry('/delete-account', 0.4, 'monthly'),
      ];
    default:
      return [];
  }
}
