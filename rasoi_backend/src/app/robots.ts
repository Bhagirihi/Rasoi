import type { MetadataRoute } from 'next';

import { SITEMAP_PARTITIONS } from '@/lib/seo-sitemaps';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: SITEMAP_PARTITIONS.map((id) => `${SITE_URL}/sitemap/${id}.xml`),
    host: SITE_URL,
  };
}
