import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getPublishedPosts } from '@/content/posts'
import { RESOURCE_SLUGS } from '@/content/resources'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/home-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    {
      url: `${SITE_URL}/neighborhoods/alameda-county`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/neighborhoods/contra-costa-county`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const resourceRoutes: MetadataRoute.Sitemap = RESOURCE_SLUGS.map(slug => ({
    url: `${SITE_URL}/resources/${slug}`,
    lastModified: new Date(),
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
