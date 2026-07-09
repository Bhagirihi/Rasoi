import type { MetadataRoute } from 'next';

import { buildSitemapPartition, SITEMAP_PARTITIONS } from '@/lib/seo-sitemaps';

export async function generateSitemaps() {
  return SITEMAP_PARTITIONS.map((id) => ({ id }));
}

export default function sitemap({
  id,
}: {
  id: string;
}): MetadataRoute.Sitemap {
  return buildSitemapPartition(id as (typeof SITEMAP_PARTITIONS)[number]);
}
