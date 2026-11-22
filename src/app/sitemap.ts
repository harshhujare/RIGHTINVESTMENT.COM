import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rightinvestment.in';
  const routes = ['', '/services', '/about', '/consultation', '/disclosures', '/privacy'];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/consultation' ? 0.9 : 0.8,
      });
    }
  }
  return entries;
}
