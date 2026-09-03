import { describe, expect, it } from 'vitest'
import nextConfig from '../../../next.config'

// The domain previously hosted a RealGeeks IDX site whose /listings/* and
// /home-values/* pages are still indexed by search engines. Those legacy URLs
// must land somewhere useful, not the 404 page.

async function loadRedirects() {
  return nextConfig.redirects!()
}

describe('redirects()', () => {
  it('keeps the /blog and /home-guide legacy redirects', async () => {
    const redirects = await loadRedirects()
    const sources = redirects.map((r) => r.source)
    expect(sources).toContain('/blog')
    expect(sources).toContain('/blog/:slug')
    expect(sources).toContain('/home-guide')
    expect(sources).toContain('/home-guide/:slug')
  })

  it('redirects legacy RealGeeks /listings/<section>/<name> URLs to the home page', async () => {
    const redirects = await loadRedirects()
    const listings = redirects.find((r) => r.source === '/listings/:section/:path+')
    expect(listings).toBeDefined()
    expect(listings!.destination).toBe('/')
    expect(listings!.permanent).toBe(true)
  })

  it('leaves our own /listings and /listings/<slug> routes alone (spec 2026-09-03)', async () => {
    const redirects = await loadRedirects()
    const sources = redirects.map((r) => r.source)
    expect(sources).not.toContain('/listings/:path*')
    expect(sources).not.toContain('/listings')
    expect(sources).not.toContain('/listings/:slug')
  })

  it('redirects legacy RealGeeks /home-values/* URLs to /contact', async () => {
    const redirects = await loadRedirects()
    const homeValues = redirects.find((r) => r.source === '/home-values/:path*')
    expect(homeValues).toBeDefined()
    expect(homeValues!.destination).toBe('/contact')
    expect(homeValues!.permanent).toBe(true)
  })

  it('every redirect is permanent (308)', async () => {
    const redirects = await loadRedirects()
    for (const redirect of redirects) {
      expect(redirect.permanent).toBe(true)
    }
  })
})
