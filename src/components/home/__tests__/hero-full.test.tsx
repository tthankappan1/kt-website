import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroFull } from '../hero-full'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

describe('HeroFull', () => {
  it('renders the h1 with Kalyani Thilak', () => {
    render(<HeroFull />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kalyani Thilak')
  })

  it('renders the eyebrow city list', () => {
    render(<HeroFull />)
    const eyebrow = screen.getByText(/Pleasanton/)
    expect(eyebrow.textContent).toContain('Dublin')
    expect(eyebrow.textContent).toContain('San Ramon')
    expect(eyebrow.textContent).toContain('Livermore')
  })

  it('renders Meet Kalyani link pointing to #about', () => {
    render(<HeroFull />)
    const link = screen.getByRole('link', { name: 'Meet Kalyani' })
    expect(link.getAttribute('href')).toBe('#about')
  })

  it('renders Contact link pointing to /contact', () => {
    render(<HeroFull />)
    const link = screen.getByRole('link', { name: 'Contact' })
    expect(link.getAttribute('href')).toBe('/contact')
  })

  it('renders the hero-full-img photo slot', () => {
    const { container } = render(<HeroFull />)
    const slot = container.querySelector('[data-slot="hero-full-img"]')
    expect(slot).toBeInTheDocument()
  })
})

describe('HeroFull mobile viewport units', () => {
  it('header uses the kt-hero-full class (svh-safe min-height lives in CSS)', () => {
    const { container } = render(<HeroFull />)
    const header = container.querySelector('header#top')
    expect(header?.classList.contains('kt-hero-full')).toBe(true)
    expect(header?.getAttribute('style') ?? '').not.toContain('min-height')
  })

  it('inner container uses kt-hero-full-inner and drops inline min-height/padding-bottom', () => {
    const { container } = render(<HeroFull />)
    const inner = container.querySelector('.kt-hero-full-inner')
    expect(inner).toBeInTheDocument()
    expect(inner?.classList.contains('kt-container')).toBe(true)
    expect(inner?.getAttribute('style') ?? '').not.toContain('min-height')
    expect(inner?.getAttribute('style') ?? '').not.toContain('padding-bottom')
  })
})
