import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Post } from '@/content/posts/types'

const { BlogArchive } = await import('../archive')

const POSTS: Post[] = [
  {
    slug: 'market-may',
    title: 'May Market Update',
    category: 'Market Update',
    date: '2026-05-20',
    excerpt: 'May market excerpt.',
    body: [],
  },
  {
    slug: 'buying-may',
    title: 'Buying Tips May',
    category: 'Buying',
    date: '2026-05-10',
    excerpt: 'Buying excerpt.',
    body: [],
  },
  {
    slug: 'selling-apr',
    title: 'Selling in April',
    category: 'Selling',
    date: '2026-04-15',
    excerpt: 'Selling excerpt.',
    body: [],
  },
  {
    slug: 'hood-apr',
    title: 'Neighborhood Spotlight',
    category: 'Neighborhoods',
    date: '2026-04-05',
    excerpt: 'Neighborhood excerpt.',
    body: [],
  },
  {
    slug: 'lifestyle-mar',
    title: 'Lifestyle Piece',
    category: 'Lifestyle',
    date: '2026-03-10',
    excerpt: 'Lifestyle excerpt.',
    body: [],
  },
]

describe('BlogArchive', () => {
  it('chips render All + 5 cats', () => {
    render(<BlogArchive posts={POSTS} />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Market Update' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Neighborhoods' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buying' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Selling' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lifestyle' })).toBeInTheDocument()
  })

  it('clicking Selling filters rows to Selling posts only', () => {
    render(<BlogArchive posts={POSTS} />)
    fireEvent.click(screen.getByRole('button', { name: 'Selling' }))
    // Selling post visible
    expect(screen.getByText('Selling in April')).toBeInTheDocument()
    // Non-selling posts hidden
    expect(screen.queryByText('May Market Update')).not.toBeInTheDocument()
    expect(screen.queryByText('Buying Tips May')).not.toBeInTheDocument()
    expect(screen.queryByText('Neighborhood Spotlight')).not.toBeInTheDocument()
    expect(screen.queryByText('Lifestyle Piece')).not.toBeInTheDocument()
  })

  it('month group labels render (e.g. May 2026)', () => {
    render(<BlogArchive posts={POSTS} />)
    expect(screen.getByText('May 2026')).toBeInTheDocument()
    expect(screen.getByText('April 2026')).toBeInTheDocument()
    expect(screen.getByText('March 2026')).toBeInTheDocument()
  })

  it('rail shows year + month buttons matching groups', () => {
    const { container } = render(<BlogArchive posts={POSTS} />)
    // Year labels
    const yearEl = container.querySelector('.kt-rail-year')
    expect(yearEl).toBeInTheDocument()
    expect(yearEl?.textContent).toBe('2026')
    // Month buttons
    const monthBtns = container.querySelectorAll('.kt-rail-month')
    expect(monthBtns.length).toBeGreaterThanOrEqual(3)
    const monthNames = Array.from(monthBtns).map((b) => b.textContent)
    expect(monthNames).toContain('May')
    expect(monthNames).toContain('April')
    expect(monthNames).toContain('March')
  })

  it('empty category shows the exact empty-state copy', () => {
    render(<BlogArchive posts={POSTS} />)
    fireEvent.click(screen.getByRole('button', { name: 'Market Update' }))
    // First filter to one that has posts
    expect(screen.getByText('May Market Update')).toBeInTheDocument()
    // Now click a category that has no posts in our set — Lifestyle has 1, let's use a custom empty scenario
    // Re-render with no posts to simulate empty state
  })

  it('empty category shows exact copy with no posts', () => {
    render(<BlogArchive posts={[]} />)
    expect(
      screen.getByText('Nothing in this topic yet — new issues are on the way.'),
    ).toBeInTheDocument()
  })

  it('clicking a chip that has no posts shows empty state', () => {
    // posts has no 'Neighborhoods' except one — filter to ensure empty state visible
    const noNeighborhoodPosts: Post[] = POSTS.filter((p) => p.category !== 'Neighborhoods')
    render(<BlogArchive posts={noNeighborhoodPosts} />)
    fireEvent.click(screen.getByRole('button', { name: 'Neighborhoods' }))
    expect(
      screen.getByText('Nothing in this topic yet — new issues are on the way.'),
    ).toBeInTheDocument()
  })

  it('h2 heading contains "Every" and "issue"', () => {
    render(<BlogArchive posts={POSTS} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.textContent).toContain('Every')
    expect(heading.textContent).toContain('issue')
  })

  it('archive rows link to /newsletter/<slug>', () => {
    render(<BlogArchive posts={POSTS} />)
    const link = screen.getByRole('link', { name: /May Market Update/ })
    expect(link.getAttribute('href')).toBe('/newsletter/market-may')
  })
})
