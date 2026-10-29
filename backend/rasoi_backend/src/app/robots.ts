import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

/** Cloudflare may prepend managed robots rules at the CDN; disable that in CF dashboard for a clean file. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
