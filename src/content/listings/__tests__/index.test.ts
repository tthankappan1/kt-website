import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import {
  LISTINGS,
  STATUS_LABEL,
  GROUP_LABEL,
  getListing,
  getListings,
  sortListings,
  listingPath,
  listingAddress,
  photoSrc,
  formatPrice,
  statLine,
  heroLabel,
  mapsUrl,
} from '@/content/listings'
import type { Listing } from '@/content/listings/types'

const SLUG = '553-covington-way-livermore'

function fixture(over: Partial<Listing>): Listing {
  return {
    slug: 'x',
    status: 'active',
    street: '1 Test St',
    city: 'Livermore',
    state: 'CA',
    zip: '94551',
    price: 1000000,
    beds: 3,
    baths: 2,
    sqft: 1500,
    propertyType: 'Single-family home',
    listedDate: '2026-09-03',
    headline: 'h',
    description: ['d'],
    highlights: [],
    facts: [],
    hero: '01.jpg',
    photos: [{ file: '01.jpg', alt: 'a', group: 'exterior' }],
    ...over,
  }
}

describe('listings content index', () => {
  it('slugs are unique and url-safe', () => {
    const slugs = LISTINGS.map((l) => l.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/)
  })

  it('getListing resolves the first listing and rejects unknown slugs', () => {
    expect(getListing(SLUG)?.street).toBe('553 Covington Way')
    expect(getListing('nope')).toBeUndefined()
  })

  it('sortListings ranks active, coming-soon, pending, sold, then newest first', () => {
    const list = [
      fixture({ slug: 'sold', status: 'sold', listedDate: '2026-01-01' }),
      fixture({ slug: 'pending', status: 'pending', listedDate: '2026-05-01' }),
      fixture({ slug: 'old-active', status: 'active', listedDate: '2026-02-01' }),
      fixture({ slug: 'soon', status: 'coming-soon', listedDate: '2026-06-01' }),
      fixture({ slug: 'new-active', status: 'active', listedDate: '2026-08-01' }),
    ]
    expect(sortListings(list).map((l) => l.slug)).toEqual([
      'new-active',
      'old-active',
      'soon',
      'pending',
      'sold',
    ])
  })

  it('getListings returns every listing sorted', () => {
    expect(getListings()).toHaveLength(LISTINGS.length)
  })

  it('path, address, and photo helpers', () => {
    const l = getListing(SLUG)!
    expect(listingPath(SLUG)).toBe('/listings/' + SLUG)
    expect(listingAddress(l)).toBe('553 Covington Way, Livermore, CA 94551')
    expect(photoSrc(l, '26.jpg')).toBe('/images/listings/' + SLUG + '/26.jpg')
  })

  it('formats price and stat line', () => {
    expect(formatPrice(890000)).toBe('$890,000')
    const l = getListing(SLUG)!
    expect(statLine(l)).toBe('3 bd · 2 ba · 1,130 sq ft · 6,000 sq ft lot')
    expect(statLine(fixture({ lotSqft: undefined }))).toBe('3 bd · 2 ba · 1,500 sq ft')
  })

  it('heroLabel says Just listed for three weeks, then falls back to the status label', () => {
    const l = fixture({ listedDate: '2026-09-03' })
    expect(heroLabel(l, new Date('2026-09-13'))).toBe('Just listed')
    expect(heroLabel(l, new Date('2026-10-03'))).toBe(STATUS_LABEL.active)
    expect(heroLabel(fixture({ status: 'sold' }), new Date('2026-09-04'))).toBe('Sold')
    expect(heroLabel(fixture({ status: 'pending' }), new Date('2026-09-04'))).toBe('Pending')
    expect(heroLabel(fixture({ status: 'coming-soon' }), new Date('2026-09-04'))).toBe('Coming soon')
  })

  it('mapsUrl is a Google Maps search for the address', () => {
    const l = getListing(SLUG)!
    expect(mapsUrl(l)).toBe(
      'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent('553 Covington Way, Livermore, CA 94551'),
    )
    expect(mapsUrl(fixture({ mapsQuery: 'custom' }))).toContain('query=custom')
  })

  it('every group has a caption', () => {
    for (const g of ['exterior', 'living', 'kitchen', 'bedrooms', 'baths', 'outdoor'] as const) {
      expect(GROUP_LABEL[g]).toBeTruthy()
    }
  })
})

describe('listing photo files (a listing never ships with a missing photo)', () => {
  for (const l of LISTINGS) {
    const dir = path.join(process.cwd(), 'public', 'images', 'listings', l.slug)
    it(`${l.slug}: hero is one of the photos`, () => {
      expect(l.photos.map((p) => p.file)).toContain(l.hero)
    })
    it(`${l.slug}: every photo and floor plan exists on disk with alt text`, () => {
      for (const p of l.photos) {
        expect(fs.existsSync(path.join(dir, p.file)), p.file).toBe(true)
        expect(p.alt.length, p.file).toBeGreaterThan(8)
      }
      for (const f of l.floorPlans ?? []) {
        expect(fs.existsSync(path.join(dir, f.file)), f.file).toBe(true)
      }
    })
    it(`${l.slug}: photo files are unique`, () => {
      const files = l.photos.map((p) => p.file)
      expect(new Set(files).size).toBe(files.length)
    })
  }
})

describe('553 Covington Way facts (owner-supplied 2026-09-03)', () => {
  const l = getListing(SLUG)!
  it('matches the MLS facts', () => {
    expect(l.status).toBe('active')
    expect(l.price).toBe(890000)
    expect(l.beds).toBe(3)
    expect(l.baths).toBe(2)
    expect(l.sqft).toBe(1130)
    expect(l.lotSqft).toBe(6000)
    expect(l.yearBuilt).toBe(1969)
    expect(l.neighborhood).toBe('Summerset')
    expect(l.photos).toHaveLength(27)
    expect(l.floorPlans).toHaveLength(2)
  })
  it('description carries the reconciled square footage, not the MLS placeholder', () => {
    const text = l.description.join(' ')
    expect(text).not.toContain('[')
    expect(text).toContain('1,130')
  })
})
