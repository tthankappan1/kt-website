import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivacyPage from '../privacy/page'
import { CONTACT_EMAIL } from '@/lib/site'

// KTNav is a client component with scroll handler — stub to avoid JSDOM issues
vi.mock('@/components/nav/kt-nav', () => ({
  KTNav: () => <nav data-testid="kt-nav">nav</nav>,
}))

vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => <footer data-testid="kt-footer" />,
}))

describe('Privacy Policy page', () => {
  it('renders h1 "Privacy Policy"', () => {
    render(<PrivacyPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Privacy Policy' }),
    ).toBeInTheDocument()
  })

  it('renders the CCPA section heading', () => {
    render(<PrivacyPage />)
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /california privacy rights/i,
      }),
    ).toBeInTheDocument()
  })

  it('contains CONTACT_EMAIL as a mailto link', () => {
    render(<PrivacyPage />)
    const links = screen.getAllByRole('link', { name: CONTACT_EMAIL })
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`)
    })
  })

  it('contains "do not sell" text', () => {
    const { container } = render(<PrivacyPage />)
    expect(container.textContent).toMatch(/do not sell/i)
  })

  it('displays the effective date June 12, 2026', () => {
    render(<PrivacyPage />)
    expect(screen.getByText(/june 12, 2026/i)).toBeInTheDocument()
  })

  it('renders exactly one <main id="main"> landmark', () => {
    const { container } = render(<PrivacyPage />)
    const mains = container.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0].id).toBe('main')
  })
})
