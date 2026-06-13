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

const { default: ContraCostaPage } = await import('../page')

describe('Contra Costa County Neighborhoods page', () => {
  it('renders KTNav with base="/"', () => {
    render(<ContraCostaPage />)
    expect(screen.getByTestId('kt-nav').getAttribute('data-base')).toBe('/')
  })

  it('renders guide title h1', () => {
    const { container } = render(<ContraCostaPage />)
    const h1 = container.querySelector('h1.kt-display')
    expect(h1?.textContent).toContain('Contra Costa County Neighborhood Guide')
  })

  it('renders eyebrow with correct text', () => {
    render(<ContraCostaPage />)
    expect(screen.getByText('Client Resources · Neighborhood Guide')).toBeInTheDocument()
  })

  it('renders sub text', () => {
    render(<ContraCostaPage />)
    expect(
      screen.getByText('From San Ramon to Lamorinda — the 680 corridor, town by town.')
    ).toBeInTheDocument()
  })

  it('renders jump bar with 7 city links', () => {
    const { container } = render(<ContraCostaPage />)
    const jumpLinks = container.querySelectorAll('.kt-jump-link')
    expect(jumpLinks).toHaveLength(7)
  })

  it('renders all 7 city h2 headings', () => {
    render(<ContraCostaPage />)
    expect(screen.getByRole('heading', { level: 2, name: 'San Ramon' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Danville' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Alamo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Walnut Creek' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Lafayette' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Orinda' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Moraga' })).toBeInTheDocument()
  })

  it('renders alternating .alt sections — first city is alt', () => {
    const { container } = render(<ContraCostaPage />)
    const cities = container.querySelectorAll('section.kt-city')
    expect(cities).toHaveLength(7)
    expect(cities[0].classList.contains('alt')).toBe(true)
    expect(cities[1].classList.contains('alt')).toBe(false)
  })

  it('renders a hero photo slot for the guide', () => {
    render(<ContraCostaPage />)
    expect(screen.getByTestId('photo-slot-guide-contracosta-hero')).toBeInTheDocument()
  })

  it('renders "The Neighborhoods" heading', () => {
    render(<ContraCostaPage />)
    expect(screen.getByRole('heading', { name: /The Neighborhoods/i })).toBeInTheDocument()
  })

  it('renders newsletter and footer', () => {
    render(<ContraCostaPage />)
    expect(screen.getByTestId('kt-newsletter')).toBeInTheDocument()
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })
})
