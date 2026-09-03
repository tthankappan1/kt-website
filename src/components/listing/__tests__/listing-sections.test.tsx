import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { getListing } from '@/content/listings'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

const { ListingOverview } = await import('../listing-overview')
const { ListingLocation } = await import('../listing-location')
const { ListingJsonLd, buildListingJsonLd } = await import('../listing-json-ld')

const base = getListing('553-covington-way-livermore')!

describe('ListingOverview', () => {
  it('renders the headline, every description paragraph, and the highlight chips', () => {
    const { container } = render(<ListingOverview listing={base} />)
    expect(container.querySelector('h2.kt-h1')?.textContent).toBe(base.headline)
    for (const p of base.description) expect(screen.getByText(p)).toBeInTheDocument()
    for (const h of base.highlights) expect(screen.getByText(h)).toBeInTheDocument()
  })

  it('renders the At a glance rows: standard facts then listing facts, skipping empties', () => {
    const { container } = render(<ListingOverview listing={base} />)
    const terms = [...container.querySelectorAll('.kt-row .row-term')].map((el) => el.textContent)
    expect(terms).toEqual([
      'Price',
      'Bedrooms',
      'Bathrooms',
      'Interior',
      'Lot',
      'Year built',
      'Garage',
      'Type',
      'Neighborhood',
      'Offered',
      'HOA',
    ])
    expect(screen.getByText('1,130 sq ft')).toBeInTheDocument()
    expect(screen.getByText('6,000 sq ft')).toBeInTheDocument()
  })

  it('adds an MLS row when the number is set', () => {
    const { container } = render(<ListingOverview listing={{ ...base, mls: '41012345' }} />)
    const terms = [...container.querySelectorAll('.kt-row .row-term')].map((el) => el.textContent)
    expect(terms).toContain('MLS')
    expect(screen.getByText('41012345')).toBeInTheDocument()
  })
})

describe('ListingLocation', () => {
  it('links to Google Maps in a new tab and to the Livermore guide anchor', () => {
    render(<ListingLocation listing={base} />)
    const maps = screen.getByRole('link', { name: /open in google maps/i })
    expect(maps).toHaveAttribute('target', '_blank')
    expect(maps).toHaveAttribute('rel', 'noopener noreferrer')
    expect(maps.getAttribute('href')).toContain('google.com/maps/search/?api=1&query=553%20Covington%20Way')
    expect(screen.getByRole('link', { name: /livermore guide/i })).toHaveAttribute(
      'href',
      '/neighborhoods/alameda-county#livermore',
    )
    expect(screen.getByText('553 Covington Way')).toBeInTheDocument()
  })

  it('falls back to the county guide for other cities', () => {
    render(<ListingLocation listing={{ ...base, city: 'Pleasanton' }} />)
    expect(screen.getByRole('link', { name: /pleasanton guide/i })).toHaveAttribute(
      'href',
      '/neighborhoods/alameda-county#pleasanton',
    )
  })
})

describe('ListingJsonLd', () => {
  it('builds a RealEstateListing with residence facts and an InStock offer', () => {
    const data = buildListingJsonLd(base)
    expect(data['@type']).toBe('RealEstateListing')
    expect(data.url).toBe('https://www.kalyanithilak.com/listings/553-covington-way-livermore')
    expect(data.about.numberOfBedrooms).toBe(3)
    expect(data.about.floorSize.value).toBe(1130)
    expect(data.offers.price).toBe(890000)
    expect(data.offers.availability).toBe('https://schema.org/InStock')
    expect(data.image).toContain('/images/listings/553-covington-way-livermore/26.jpg')
  })

  it('marks sold listings SoldOut', () => {
    expect(buildListingJsonLd({ ...base, status: 'sold' }).offers.availability).toBe('https://schema.org/SoldOut')
  })

  it('renders as a parseable ld+json script with no raw angle brackets or ampersands', () => {
    const { container } = render(
      <ListingJsonLd listing={{ ...base, headline: 'Kitchen & dining <3' }} />,
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    const text = script!.textContent ?? ''
    expect(text).not.toMatch(/[<>&]/)
    expect(JSON.parse(text).description).toContain('Kitchen & dining <3')
  })
})
