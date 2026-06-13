import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getPublishedPosts } from '@/content/posts'
import { RESOURCE_SLUGS } from '@/content/resources'

// Fixed date literal — builds are deterministic regardless of deploy time.
const LAST_MODIFIED = new Date('2026-06-12')

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/contact`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/home-guide`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/privacy`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.6 },
    {
      url: `${SITE_URL}/neighborhoods/alameda-county`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/neighborhoods/contra-costa-county`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const resourceRoutes: MetadataRoute.Sitemap = RESOURCE_SLUGS.map(slug => ({
    url: `${SITE_URL}/resources/${slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${SITE_URL}/home-guide/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...resourceRoutes, ...postRoutes]
}
