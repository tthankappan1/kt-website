import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { getListing } from '@/content/listings'
import type { Listing } from '@/content/listings'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

const { ListingHero } = await import('../listing-hero')

const base = getListing('553-covington-way-livermore')!
const TODAY = new Date('2026-09-05T12:00:00Z')

describe('ListingHero', () => {
  it('renders the street as the display h1 with the city line', () => {
    const { container } = render(<ListingHero listing={base} today={TODAY} />)
    const h1 = container.querySelector('h1.kt-display')
    expect(h1?.textContent).toBe('553 Covington Way')
    expect(screen.getByText('Livermore, CA 94551')).toBeInTheDocument()
  })

  it('uses the hero photo as a priority full-bleed image', () => {
    render(<ListingHero listing={base} today={TODAY} />)
    const img = screen.getByRole('img', { name: /front elevation with lawn/i })
    expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain('/images/listings/553-covington-way-livermore/27.jpg')
  })

  it('shows Just listed, the neighborhood, the price and the stat line', () => {
    render(<ListingHero listing={base} today={TODAY} />)
    expect(screen.getByText(/Just listed/)).toHaveTextContent('Just listed · Summerset, Livermore')
    expect(screen.getByText('$890,000')).toBeInTheDocument()
    expect(screen.getByText('3 bd · 2 ba · 1,130 sq ft · 6,000 sq ft lot')).toBeInTheDocument()
  })

  it('active listing offers a showing and a photos jump link', () => {
    render(<ListingHero listing={base} today={TODAY} />)
    expect(screen.getByRole('link', { name: 'Request a showing' })).toHaveAttribute('href', '#inquire')
    expect(screen.getByRole('link', { name: 'View photos' })).toHaveAttribute('href', '#photos')
  })

  it('sold listing shows Sold with the sold price and points to /contact instead', () => {
    const sold: Listing = { ...base, status: 'sold', soldPrice: 905000 }
    render(<ListingHero listing={sold} today={TODAY} />)
    expect(screen.getByText(/^Sold/)).toBeInTheDocument()
    expect(screen.getByText('$905,000')).toBeInTheDocument()
    expect(screen.queryByText('$890,000')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Request a showing' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ask about similar homes' })).toHaveAttribute('href', '/contact')
  })

  it('pending listing keeps the list price but drops the showing CTA', () => {
    render(<ListingHero listing={{ ...base, status: 'pending' }} today={TODAY} />)
    expect(screen.getByText(/^Pending/)).toBeInTheDocument()
    expect(screen.getByText('$890,000')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Request a showing' })).not.toBeInTheDocument()
  })

  it('shows an open-house pill only for upcoming dates', () => {
    const withPast = { ...base, openHouses: [{ date: '2026-09-01', start: '1:00 PM', end: '4:00 PM' }] }
    const { rerender } = render(<ListingHero listing={withPast} today={TODAY} />)
    expect(screen.queryByText(/Open house/)).not.toBeInTheDocument()

    const withFuture = {
      ...base,
      openHouses: [
        { date: '2026-09-05', start: '1:00 PM', end: '4:00 PM' },
        { date: '2026-09-06', start: '1:00 PM', end: '4:00 PM' },
      ],
    }
    rerender(<ListingHero listing={withFuture} today={TODAY} />)
    expect(screen.getByText(/Open house/)).toHaveTextContent('Open house · Sat, Sep 5 · 1:00–4:00 PM · Sun, Sep 6 · 1:00–4:00 PM')
  })

  it('carries the listed-by lockup with the DRE number', () => {
    render(<ListingHero listing={base} today={TODAY} />)
    expect(screen.getByText(/DRE 02254890/)).toBeInTheDocument()
  })
})
