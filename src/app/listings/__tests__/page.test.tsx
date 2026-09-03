import { describe, expect, it, vi } from 'vitest'
import { LISTINGS } from '@/content/listings'

vi.mock('@/components/nav/kt-nav', () => ({ KTNav: () => null }))
vi.mock('@/components/close/kt-newsletter', () => ({ KTNewsletter: () => null }))
vi.mock('@/components/close/kt-footer', () => ({ KTFooter: () => null }))
vi.mock('@/lib/images', () => ({ slotImageSrc: () => null }))

const slugPage = await import('../[slug]/page')
const indexPage = await import('../page')

const SLUG = '553-covington-way-livermore'

describe('/listings/[slug] route', () => {
  it('is fully static: dynamicParams false and one param per listing', async () => {
    expect(slugPage.dynamicParams).toBe(false)
    const params = await slugPage.generateStaticParams()
    expect(params).toEqual(LISTINGS.map((l) => ({ slug: l.slug })))
    expect(params.map((p) => p.slug)).toContain(SLUG)
  })

  it('builds share-ready metadata from the listing', async () => {
    const meta = await slugPage.generateMetadata({ params: Promise.resolve({ slug: SLUG }) })
    expect(meta.title).toBe('553 Covington Way, Livermore — $890,000')
    expect(meta.description).toContain('Single-story living in Summerset')
    expect(meta.description).toContain('3 bd · 2 ba · 1,130 sq ft')
    expect(meta.alternates?.canonical).toBe('/listings/' + SLUG)
    const og = meta.openGraph as { images: { url: string; alt: string }[]; url: string; type: string }
    expect(og.images[0].url).toBe('/images/listings/' + SLUG + '/27.jpg')
    expect(og.images[0].alt).toBeTruthy()
    expect(og.url).toBe('https://www.kalyanithilak.com/listings/' + SLUG)
    expect((meta.twitter as { card: string }).card).toBe('summary_large_image')
  })

  it('returns empty metadata for an unknown slug', async () => {
    expect(await slugPage.generateMetadata({ params: Promise.resolve({ slug: 'nope' }) })).toEqual({})
  })
})

describe('/listings route', () => {
  it('has a title and canonical', () => {
    expect(indexPage.metadata.title).toBe('Listings')
    expect(indexPage.metadata.alternates?.canonical).toBe('/listings')
  })
})
