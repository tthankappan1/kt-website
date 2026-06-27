import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Post } from '@/content/posts/types'

const FAKE_POSTS: Post[] = [
  {
    slug: 'proximity-premium-san-jose',
    title: 'The Proximity Premium',
    category: 'Market Update',
    date: '2026-05-29',
    excerpt: 'Lead excerpt.',
    body: [],
  },
  {
    slug: 'two-markets-twenty-minutes',
    title: 'The 20-Minute Drive',
    category: 'Buying',
    date: '2026-04-15',
    excerpt: 'Second excerpt.',
    body: [],
  },
]

vi.mock('@/content/posts', () => ({
  getPublishedPosts: () => FAKE_POSTS,
}))

vi.mock('@/lib/images', () => ({
  slotImageSrc: () => null,
}))

vi.mock('@/components/nav/kt-nav', () => ({
  KTNav: ({ base }: { base?: string }) => <nav data-testid="kt-nav" data-base={base}>nav</nav>,
}))

vi.mock('@/components/close/kt-newsletter', () => ({
  KTNewsletter: ({ archiveLink }: { archiveLink?: boolean }) => (
    <div data-testid="kt-newsletter" data-archive-link={String(archiveLink)}>newsletter</div>
  ),
}))

vi.mock('@/components/close/kt-footer', () => ({
  KTFooter: () => <footer data-testid="kt-footer">footer</footer>,
}))

const { default: NewsletterPage } = await import('../page')

describe('Newsletter page assembly', () => {
  it('renders hero title "The Bay Area" + em "Newsletter"', () => {
    const { container } = render(<NewsletterPage />)
    // The hero h1 contains "The Bay Area" as text node and em.kt-em "Newsletter"
    const h1 = container.querySelector('h1.kt-display')
    expect(h1).toBeInTheDocument()
    expect(h1?.textContent).toContain('The Bay Area')
    expect(h1?.textContent).toContain('Newsletter')
    const em = h1?.querySelector('em.kt-em')
    expect(em?.textContent).toBe('Newsletter')
  })

  it('renders featured section', () => {
    const { container } = render(<NewsletterPage />)
    // Lead post h2 in featured section
    const featuredH2 = container.querySelector('h2.kt-bcard-title')
    expect(featuredH2).toBeInTheDocument()
    expect(featuredH2?.textContent).toContain('The Proximity Premium')
  })

  it('renders archive section with "Every issue" heading', () => {
    render(<NewsletterPage />)
    const heading = screen.getByRole('heading', { level: 2, name: /Every/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders newsletter without Browse past issues link', () => {
    render(<NewsletterPage />)
    const newsletter = screen.getByTestId('kt-newsletter')
    expect(newsletter.getAttribute('data-archive-link')).toBe('false')
    expect(screen.queryByText(/Browse past issues/)).not.toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<NewsletterPage />)
    expect(screen.getByTestId('kt-footer')).toBeInTheDocument()
  })

  it('renders KTNav with base="/"', () => {
    render(<NewsletterPage />)
    const nav = screen.getByTestId('kt-nav')
    expect(nav.getAttribute('data-base')).toBe('/')
  })
})
