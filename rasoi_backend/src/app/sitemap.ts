import type { MetadataRoute } from 'next';

import { buildFullSitemap } from '@/lib/seo-sitemaps';

export default function sitemap(): MetadataRoute.Sitemap {
  return buildFullSitemap();
}
