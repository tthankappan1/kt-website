import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { getListing } from '@/content/listings'
import type { Listing } from '@/content/listings'

vi.mock('@/lib/images', () => ({ slotImageSrc: () => null }))
vi.mock('@/components/nav/kt-nav', () => ({
  KTNav: ({ base }: { base?: string }) => <nav data-testid="kt-nav" data-base={base}>nav</nav>,
}))
vi.mock('@/components/close/kt-newsletter', () => ({
  KTNewsletter: () => <div data-testid="kt-newsletter">newsletter</div>,
}))
vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => <footer data-testid="kt-footer">footer</footer>,
}))

const { ListingPageView } = await import('../listing-page')
const { ListingCard } = await import('../listing-card')
const { ListingsIndexView } = await import('../listings-index')

const base = getListing('553-covington-way-livermore')!
const sold: Listing = { ...base, slug: 'sold-home', street: '12 Sold Ct', status: 'sold', soldPrice: 905000 }

describe('ListingPageView', () => {
  it('composes nav, hero, overview, photos, floor plan, location, inquire, JSON-LD and the dark bookend', () => {
    const { container } = render(<ListingPageView listing={base} />)
    expect(screen.getByTestId('kt-nav').getAttribute('data-base')).toBe('/')
    expect(container.querySelector('h1.kt-display')?.textContent).toBe('553 Covington Way')
    expect(container.querySelector('#photos')).toBeInTheDocument()
    expect(container.querySelector('#floor-plan')).toBeInTheDocument()
    expect(container.querySelector('#inquire')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open in google maps/i })).toBeInTheDocument()
    expect(container.querySelector('script[type="application/ld+json"]')).toBeInTheDocument()
    expect(screen.getByText(/Listed by Kalyani Thilak/)).toHaveTextContent('DRE 02254890')
    expect(screen.getByTestId('kt-newsletter')).toBeInTheDocument()
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })

  it('wraps the page in main#main after the nav', () => {
    const { container } = render(<ListingPageView listing={base} />)
    expect(container.querySelector('main#main')).toBeInTheDocument()
  })
})

describe('ListingCard', () => {
  it('links to the listing with badge, address, price and stat line', () => {
    render(<ListingCard listing={base} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/listings/553-covington-way-livermore')
    expect(screen.getByText('For sale')).toBeInTheDocument()
    expect(screen.getByText('553 Covington Way')).toBeInTheDocument()
    expect(screen.getByText('Livermore, CA 94551')).toBeInTheDocument()
    expect(screen.getByText('$890,000')).toBeInTheDocument()
    expect(screen.getByText('3 bd · 2 ba · 1,130 sq ft · 6,000 sq ft lot')).toBeInTheDocument()
    expect(screen.getByText(/View listing/)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: base.photos.find((p) => p.file === base.hero)!.alt })).toBeInTheDocument()
  })

  it('shows the sold price for sold homes', () => {
    render(<ListingCard listing={sold} />)
    expect(screen.getByText('Sold')).toBeInTheDocument()
    expect(screen.getByText('Sold for $905,000')).toBeInTheDocument()
    expect(screen.queryByText('$890,000')).not.toBeInTheDocument()
  })
})

describe('ListingsIndexView', () => {
  it('groups cards by status with a heading only for non-empty groups', () => {
    render(<ListingsIndexView listings={[base, sold]} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Homes/)
    expect(screen.getByRole('heading', { level: 2, name: 'For sale' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Sold' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Pending' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /View listing/ })).toHaveLength(2)
  })

  it('renders an empty state with a contact link when there are no listings', () => {
    render(<ListingsIndexView listings={[]} />)
    expect(screen.getByText(/No active listings right now/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact')
    expect(screen.queryByRole('heading', { level: 2, name: /For sale|Coming soon|Pending|Sold/ })).not.toBeInTheDocument()
  })
})
