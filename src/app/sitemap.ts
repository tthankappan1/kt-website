import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getPublishedPosts } from '@/content/posts'
import { RESOURCE_SLUGS } from '@/content/resources'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts()

  // Derive a stable build-time anchor from the latest published post date so
  // static/resource routes don't get a fresh `lastModified` on every deploy.
  // When there are no posts yet, fall back to the site's initial launch date.
  const latestPostDate =
    posts.length > 0 ? new Date(posts[0].date) : new Date('2025-01-01')

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/home-guide`, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 0.8 },
    {
      url: `${SITE_URL}/neighborhoods/alameda-county`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/neighborhoods/contra-costa-county`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const resourceRoutes: MetadataRoute.Sitemap = RESOURCE_SLUGS.map(slug => ({
    url: `${SITE_URL}/resources/${slug}`,
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
