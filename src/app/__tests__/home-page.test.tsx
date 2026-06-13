import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../page'

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

// KTNav is a client component with scroll handler — stub to avoid JSDOM issues
vi.mock('@/components/nav/kt-nav', () => ({
  KTNav: () => <nav data-testid="kt-nav">nav</nav>,
}))

vi.mock('@/components/nav/nav-social', () => ({
  NavSocial: () => <div />,
}))

vi.mock('@/components/nav/resources-drop', () => ({
  ResourcesDrop: () => <div />,
}))

vi.mock('@/components/close/kt-social-strip', () => ({
  KTSocialStrip: () => <div data-testid="kt-social-strip" />,
}))

vi.mock('@/components/close/kt-newsletter', () => ({
  KTNewsletter: () => <div data-testid="kt-newsletter" />,
}))

vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => <footer data-testid="kt-footer" />,
}))

describe('Home page assembly', () => {
  it('renders section id=top (hero)', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('#top')).toBeInTheDocument()
  })

  it('renders section id=about (intro)', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('#about')).toBeInTheDocument()
  })

  it('renders section id=services', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('#services')).toBeInTheDocument()
  })

  it('renders section id=testimonials', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('#testimonials')).toBeInTheDocument()
  })

  it('renders nav', () => {
    render(<Home />)
    expect(screen.getByTestId('kt-nav')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<Home />)
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })

  it('renders exactly one <main id="main"> landmark', () => {
    const { container } = render(<Home />)
    const mains = container.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0].id).toBe('main')
  })
})
