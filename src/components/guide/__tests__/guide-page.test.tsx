import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Guide } from '@/content/guides'

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

const { GuidePageView } = await import('../guide-page')

const FIXTURE_GUIDE: Guide = {
  eyebrow: 'Test Eyebrow',
  title: 'Test Guide Title',
  sub: 'A short subtitle for the guide.',
  slotId: 'test-hero-slot',
  placeholder: 'A scenic view for testing',
  cities: [
    {
      id: 'alpha-city',
      name: 'Alpha City',
      price: '~$1.0M – $2.0M',
      drive: 'Drive to SF: 30–45 min',
      transit: 'BART: Alpha Station',
      schools: 'Schools: Alpha USD — highly rated.',
      bestFor: 'Families seeking top schools and good transit.',
      paras: [
        'Alpha City is a wonderful place with many amenities.',
        'The housing stock ranges from ranchers to newer builds.',
      ],
    },
    {
      id: 'beta-town',
      name: 'Beta Town',
      price: '~$800K – $1.5M',
      drive: 'Drive to SF: 45–60 min',
      transit: 'ACE train · I-580',
      schools: 'Schools: Beta USD — strong programs.',
      bestFor: 'Buyers who want more space for less money.',
      paras: [
        'Beta Town offers excellent value in the region.',
        'The downtown has seen recent investment and revitalization.',
      ],
    },
  ],
}

describe('GuidePageView', () => {
  it('renders the hero title', () => {
    const { container } = render(<GuidePageView guide={FIXTURE_GUIDE} />)
    const h1 = container.querySelector('h1.kt-display')
    expect(h1?.textContent).toContain('Test Guide Title')
  })

  it('renders the hero eyebrow', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(screen.getByText('Test Eyebrow')).toBeInTheDocument()
  })

  it('renders the hero sub text', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(screen.getByText('A short subtitle for the guide.')).toBeInTheDocument()
  })

  it('renders jump links with correct hrefs matching city ids', () => {
    const { container } = render(<GuidePageView guide={FIXTURE_GUIDE} />)
    const jumpLinks = container.querySelectorAll('a.kt-jump-link')
    expect(jumpLinks).toHaveLength(2)
    expect(jumpLinks[0].getAttribute('href')).toBe('#alpha-city')
    expect(jumpLinks[1].getAttribute('href')).toBe('#beta-town')
  })

  it('renders "The Neighborhoods" heading', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(screen.getByRole('heading', { name: /The Neighborhoods/i })).toBeInTheDocument()
  })

  it('renders both city sections with correct ids', () => {
    const { container } = render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(container.querySelector('#alpha-city')).toBeInTheDocument()
    expect(container.querySelector('#beta-town')).toBeInTheDocument()
  })

  it('renders city stats — price, drive, transit, schools', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(screen.getByText('~$1.0M – $2.0M')).toBeInTheDocument()
    expect(screen.getByText('Drive to SF: 30–45 min')).toBeInTheDocument()
    expect(screen.getByText('BART: Alpha Station')).toBeInTheDocument()
    expect(screen.getByText('Schools: Alpha USD — highly rated.')).toBeInTheDocument()
  })

  it('renders bestFor text for each city', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(
      screen.getByText('Families seeking top schools and good transit.')
    ).toBeInTheDocument()
    expect(screen.getByText('Buyers who want more space for less money.')).toBeInTheDocument()
  })

  it('renders citybody paragraphs for each city', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(
      screen.getByText('Alpha City is a wonderful place with many amenities.')
    ).toBeInTheDocument()
    expect(screen.getByText('The housing stock ranges from ranchers to newer builds.')).toBeInTheDocument()
    expect(screen.getByText('Beta Town offers excellent value in the region.')).toBeInTheDocument()
    expect(
      screen.getByText('The downtown has seen recent investment and revitalization.')
    ).toBeInTheDocument()
  })

  it('first city (i=0) has "alt" class — alt striping i%2===0', () => {
    const { container } = render(<GuidePageView guide={FIXTURE_GUIDE} />)
    const cities = container.querySelectorAll('section.kt-city')
    expect(cities).toHaveLength(2)
    expect(cities[0].classList.contains('alt')).toBe(true)
    expect(cities[1].classList.contains('alt')).toBe(false)
  })

  it('renders stat-schools class on the schools paragraph', () => {
    const { container } = render(<GuidePageView guide={FIXTURE_GUIDE} />)
    const statSchools = container.querySelectorAll('p.stat-schools')
    expect(statSchools.length).toBeGreaterThanOrEqual(1)
    expect(statSchools[0].textContent).toContain('Schools: Alpha USD')
  })

  it('renders KTNav with base="/"', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(screen.getByTestId('kt-nav').getAttribute('data-base')).toBe('/')
  })

  it('renders newsletter and footer', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    expect(screen.getByTestId('kt-newsletter')).toBeInTheDocument()
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })

  it('renders the hero photo slot with correct id and alt', () => {
    render(<GuidePageView guide={FIXTURE_GUIDE} />)
    const slot = screen.getByTestId('photo-slot-test-hero-slot')
    expect(slot).toBeInTheDocument()
    expect(slot.getAttribute('aria-label')).toBe('A scenic view for testing')
  })
})
