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
