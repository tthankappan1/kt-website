import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound, { metadata } from '../not-found'

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

vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => <footer data-testid="kt-footer" />,
}))

describe('NotFound page', () => {
  it('renders h1 with correct text', () => {
    render(<NotFound />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'This page could not be found.' }),
    ).toBeInTheDocument()
  })

  it('renders 404 eyebrow text', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders Back home link pointing to /', () => {
    render(<NotFound />)
    const link = screen.getByRole('link', { name: 'Back home' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders The Home Guide link pointing to /home-guide', () => {
    render(<NotFound />)
    const link = screen.getByRole('link', { name: 'The Home Guide' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/home-guide')
  })

  it('exports metadata with robots noindex so 404 is excluded from search indexes', () => {
    expect(metadata.title).toBe('Page not found')
    const robots = metadata.robots as { index: boolean }
    expect(robots.index).toBe(false)
  })
})
