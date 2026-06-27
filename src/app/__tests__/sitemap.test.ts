import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { SITE_URL } from '@/lib/site'
import { RESOURCE_SLUGS } from '@/content/resources'

// ---- helpers ---------------------------------------------------------------

async function loadSitemap() {
  // Re-import each time so env stubs take effect on getPublishedPosts().
  const mod = await import('../sitemap')
  return mod.default()
}

async function loadRobots() {
  const mod = await import('../robots')
  return mod.default()
}

// ---- sitemap ---------------------------------------------------------------

describe('sitemap()', () => {
  beforeEach(() => {
    vi.resetModules()
    // Simulate production: drafts must not appear.
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('SHOW_DRAFTS', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('every url starts with SITE_URL', async () => {
    const entries = await loadSitemap()
    for (const entry of entries) {
      expect(entry.url).toMatch(new RegExp(`^${SITE_URL}`))
    }
  })

  it('includes the home route "/"', async () => {
    const entries = await loadSitemap()
    const urls = entries.map(e => e.url)
    expect(urls).toContain(SITE_URL)
  })

  it('includes /contact', async () => {
    const entries = await loadSitemap()
    expect(entries.map(e => e.url)).toContain(`${SITE_URL}/contact`)
  })

  it('includes /privacy', async () => {
    const entries = await loadSitemap()
    expect(entries.map(e => e.url)).toContain(`${SITE_URL}/privacy`)
  })

  it('includes /neighborhoods/alameda-county', async () => {
    const entries = await loadSitemap()
    expect(entries.map(e => e.url)).toContain(`${SITE_URL}/neighborhoods/alameda-county`)
  })

  it('includes /neighborhoods/contra-costa-county', async () => {
    const entries = await loadSitemap()
    expect(entries.map(e => e.url)).toContain(`${SITE_URL}/neighborhoods/contra-costa-county`)
  })

  it('includes all 7 resource routes', async () => {
    const entries = await loadSitemap()
    const urls = entries.map(e => e.url)
    expect(RESOURCE_SLUGS).toHaveLength(7)
    for (const slug of RESOURCE_SLUGS) {
      expect(urls).toContain(`${SITE_URL}/resources/${slug}`)
    }
  })

  it('includes both published post routes', async () => {
    const entries = await loadSitemap()
    const urls = entries.map(e => e.url)
    expect(urls).toContain(`${SITE_URL}/newsletter/proximity-premium-san-jose`)
    expect(urls).toContain(`${SITE_URL}/newsletter/two-markets-twenty-minutes`)
  })

  it('does not include any draft post slugs in production', async () => {
    const draftSlugs = [
      'rate-buydowns-explained',
      'saturday-downtown-livermore',
      'spotlight-ruby-hill',
      'spring-inventory-early-signals',
      'what-staging-returns',
      'winter-listings-read-twice',
    ]
    const entries = await loadSitemap()
    const urls = entries.map(e => e.url)
    for (const slug of draftSlugs) {
      expect(urls).not.toContain(`${SITE_URL}/newsletter/${slug}`)
    }
  })

  it('home route has priority 1', async () => {
    const entries = await loadSitemap()
    const home = entries.find(e => e.url === SITE_URL)
    expect(home?.priority).toBe(1)
  })

  it('/newsletter has priority 0.8', async () => {
    const entries = await loadSitemap()
    const guide = entries.find(e => e.url === `${SITE_URL}/newsletter`)
    expect(guide?.priority).toBe(0.8)
  })

  it('published post routes have priority 0.7', async () => {
    const entries = await loadSitemap()
    const posts = entries.filter(e => e.url.includes('/newsletter/'))
    expect(posts.length).toBeGreaterThan(0)
    for (const post of posts) {
      expect(post.priority).toBe(0.7)
    }
  })

  it('resource routes have priority 0.6', async () => {
    const entries = await loadSitemap()
    const resources = entries.filter(e => e.url.includes('/resources/'))
    expect(resources.length).toBeGreaterThan(0)
    for (const resource of resources) {
      expect(resource.priority).toBe(0.6)
    }
  })
})

// ---- robots ----------------------------------------------------------------

describe('robots()', () => {
  it('allows all user agents at "/"', async () => {
    const result = await loadRobots()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules
    expect(rules?.userAgent).toBe('*')
    expect(rules?.allow).toBe('/')
  })

  it('returns the correct sitemap URL', async () => {
    const result = await loadRobots()
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
  })

  it('returns the host', async () => {
    const result = await loadRobots()
    expect(result.host).toBe(SITE_URL)
  })
})
