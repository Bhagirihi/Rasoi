import type { MetadataRoute } from 'next';

import { buildSitemapPartition, SITEMAP_PARTITIONS } from '@/lib/seo-sitemaps';

export async function generateSitemaps() {
  return SITEMAP_PARTITIONS.map((id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const resolvedId = await id;
  return buildSitemapPartition(resolvedId as (typeof SITEMAP_PARTITIONS)[number]);
}
