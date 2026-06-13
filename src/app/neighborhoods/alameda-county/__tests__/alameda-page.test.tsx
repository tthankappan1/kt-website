import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

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

vi.mock('@/components/ui/monogram', () => ({
  Monogram: () => <div data-testid="monogram" />,
}))

vi.mock('@/components/ui/photo-slot', () => ({
  PhotoSlot: ({ id, alt }: { id: string; alt: string }) => (
    <div data-testid={`photo-slot-${id}`} aria-label={alt} />
  ),
}))

const { default: AlamedaPage } = await import('../page')

describe('Alameda County Neighborhoods page', () => {
  it('renders KTNav with base="/"', () => {
    render(<AlamedaPage />)
    expect(screen.getByTestId('kt-nav').getAttribute('data-base')).toBe('/')
  })

  it('renders guide title h1', () => {
    const { container } = render(<AlamedaPage />)
    const h1 = container.querySelector('h1.kt-display')
    expect(h1?.textContent).toContain('Alameda County Neighborhood Guide')
  })

  it('renders eyebrow with correct text', () => {
    render(<AlamedaPage />)
    expect(screen.getByText('Client Resources · Neighborhood Guide')).toBeInTheDocument()
  })

  it('renders sub text', () => {
    render(<AlamedaPage />)
    expect(screen.getByText('Pleasanton, Dublin, Livermore, Fremont, or Castro Valley? Start here.')).toBeInTheDocument()
  })

  it('renders jump bar with 5 city links', () => {
    const { container } = render(<AlamedaPage />)
    const jumpLinks = container.querySelectorAll('.kt-jump-link')
    expect(jumpLinks).toHaveLength(5)
  })

  it('renders all 5 city h2 headings', () => {
    render(<AlamedaPage />)
    expect(screen.getByRole('heading', { level: 2, name: 'Pleasanton' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Dublin' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Livermore' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Fremont' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Castro Valley' })).toBeInTheDocument()
  })

  it('renders alternating .alt sections — first city is alt', () => {
    const { container } = render(<AlamedaPage />)
    const cities = container.querySelectorAll('section.kt-city')
    expect(cities).toHaveLength(5)
    expect(cities[0].classList.contains('alt')).toBe(true)
    expect(cities[1].classList.contains('alt')).toBe(false)
  })

  it('renders a hero photo slot for the guide', () => {
    render(<AlamedaPage />)
    expect(screen.getByTestId('photo-slot-guide-alameda-hero')).toBeInTheDocument()
  })

  it('renders "The Neighborhoods" heading', () => {
    render(<AlamedaPage />)
    expect(screen.getByRole('heading', { name: /The Neighborhoods/i })).toBeInTheDocument()
  })

  it('renders newsletter and footer', () => {
    render(<AlamedaPage />)
    expect(screen.getByTestId('kt-newsletter')).toBeInTheDocument()
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })
})
