import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactPage from '../page'

vi.mock('@/lib/images', () => ({
  slotImageSrc: (id: string) =>
    id === 'contact-portrait' ? '/images/contact-portrait.jpg' : null,
}))

vi.mock('@/components/nav/kt-nav', () => ({
  KTNav: () => <nav data-testid="kt-nav">nav</nav>,
}))

vi.mock('@/components/nav/nav-social', () => ({
  NavSocial: () => (
    <div data-testid="nav-social">
      <a href="https://www.facebook.com" aria-label="Facebook">Facebook</a>
      <a href="https://www.linkedin.com" aria-label="LinkedIn">LinkedIn</a>
      <a href="https://www.instagram.com" aria-label="Instagram">Instagram</a>
    </div>
  ),
}))

vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => <footer data-testid="kt-footer" />,
}))

vi.mock('@/components/contact/contact-form', () => ({
  ContactForm: () => <div data-testid="contact-form" />,
}))

describe('Contact page assembly', () => {
  it('renders h1 with correct copy', () => {
    render(<ContactPage />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain("Let’s talk about your move.")
  })

  it('renders DRE line in aside', () => {
    render(<ContactPage />)
    // Look for the DRE number in a text node
    expect(screen.getByText(/DRE 02254890/)).toBeInTheDocument()
  })

  it('renders contact-portrait img (via PhotoSlot)', () => {
    const { container } = render(<ContactPage />)
    const slot = container.querySelector('[data-slot="contact-portrait"]')
    expect(slot).toBeInTheDocument()
    const img = slot!.querySelector('img')
    expect(img).toBeInTheDocument()
    expect(img!.getAttribute('src')).toContain('contact-portrait')
  })

  it('renders NavSocial links in aside', () => {
    render(<ContactPage />)
    expect(screen.getByTestId('nav-social')).toBeInTheDocument()
  })

  it('renders ContactForm', () => {
    render(<ContactPage />)
    expect(screen.getByTestId('contact-form')).toBeInTheDocument()
  })

  it('does NOT render newsletter band (Browse past issues absent)', () => {
    render(<ContactPage />)
    expect(screen.queryByText(/Browse past issues/)).not.toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<ContactPage />)
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })

  it('renders exactly one <main id="main"> landmark', () => {
    const { container } = render(<ContactPage />)
    const mains = container.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0].id).toBe('main')
  })
})
