import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/nav/kt-nav', () => ({
  KTNav: () => null,
}))

vi.mock('@/components/close/kt-newsletter', () => ({
  KTNewsletter: () => null,
}))

vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => null,
}))

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

const { generateStaticParams, generateMetadata } = await import('../[slug]/page')

describe('generateStaticParams', () => {
  it('returns 7 slugs', async () => {
    const params = await generateStaticParams()
    expect(params).toHaveLength(7)
  })

  it('includes all expected slugs', async () => {
    const params = await generateStaticParams()
    const slugs = params.map((p) => p.slug)
    expect(slugs).toContain('selling')
    expect(slugs).toContain('buying')
    expect(slugs).toContain('cost-of-selling')
    expect(slugs).toContain('intero-concierge')
    expect(slugs).toContain('schools')
    expect(slugs).toContain('market-updates')
    expect(slugs).toContain('buyers-guide')
  })
})

describe('generateMetadata', () => {
  it('returns title "Buying" for slug "buying"', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'buying' }) })
    expect(meta.title).toBe('Buying')
  })

  it('returns description for slug "buying"', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'buying' }) })
    expect(meta.description).toBeTruthy()
    expect(typeof meta.description).toBe('string')
  })

  it('returns empty object for unknown slug', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'nonexistent' }) })
    expect(meta).toEqual({})
  })
})
