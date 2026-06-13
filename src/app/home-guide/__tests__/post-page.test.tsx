import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Post } from '@/content/posts/types'
import { SITE_URL } from '@/lib/site'

// 3 fake posts: newest first (sorted by date desc)
const FAKE_POSTS: Post[] = [
  {
    slug: 'newest-post',
    title: 'Newest Post Title',
    category: 'Market Update',
    date: '2026-05-29',
    excerpt: 'Newest excerpt.',
    body: [],
  },
  {
    slug: 'middle-post',
    title: 'Middle *Post* Title',
    category: 'Buying',
    date: '2026-04-15',
    excerpt: 'Middle excerpt.',
    body: [],
  },
  {
    slug: 'oldest-post',
    title: 'Oldest Post Title',
    category: 'Selling',
    date: '2026-03-10',
    excerpt: 'Oldest excerpt.',
    body: [],
  },
]

vi.mock('@/content/posts', () => ({
  getPublishedPosts: () => FAKE_POSTS,
  getPost: (slug: string) => FAKE_POSTS.find((p) => p.slug === slug),
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

vi.mock('@/components/blog/share-row', () => ({
  ShareRow: ({ slug, title }: { slug: string; title: string }) => (
    <div data-testid="share-row" data-slug={slug} data-title={title}>share</div>
  ),
}))

const { default: PostPage, generateStaticParams, generateMetadata } = await import('../[slug]/page')

describe('PostPage — middle post', () => {
  it('renders h1 with the post title', async () => {
    const { container } = render(
      await PostPage({ params: Promise.resolve({ slug: 'middle-post' }) })
    )
    const h1 = container.querySelector('h1.kt-display')
    expect(h1).toBeInTheDocument()
    expect(h1?.textContent).toContain('Middle Post Title')
  })

  it('renders the post excerpt', async () => {
    render(await PostPage({ params: Promise.resolve({ slug: 'middle-post' }) }))
    expect(screen.getByText('Middle excerpt.')).toBeInTheDocument()
  })

  it('renders "Previous issue" link pointing to oldest post', async () => {
    render(await PostPage({ params: Promise.resolve({ slug: 'middle-post' }) }))
    // older = FAKE_POSTS[2] = oldest-post
    const link = screen.getByRole('link', { name: /Previous issue/i })
    expect(link.getAttribute('href')).toBe('/home-guide/oldest-post')
    expect(link.textContent).toContain('Oldest Post Title')
  })

  it('renders "Next issue" link pointing to newest post', async () => {
    render(await PostPage({ params: Promise.resolve({ slug: 'middle-post' }) }))
    // newer = FAKE_POSTS[0] = newest-post
    const link = screen.getByRole('link', { name: /Next issue/i })
    expect(link.getAttribute('href')).toBe('/home-guide/newest-post')
    expect(link.textContent).toContain('Newest Post Title')
  })
})

describe('generateStaticParams', () => {
  it('returns all 3 slugs', async () => {
    const params = await generateStaticParams()
    expect(params).toHaveLength(3)
    expect(params).toContainEqual({ slug: 'newest-post' })
    expect(params).toContainEqual({ slug: 'middle-post' })
    expect(params).toContainEqual({ slug: 'oldest-post' })
  })
})

describe('generateMetadata', () => {
  it('returns plain title and description from post', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'middle-post' }) })
    expect(meta.title).toBe('Middle Post Title')
    expect(meta.description).toBe('Middle excerpt.')
  })

  it('includes openGraph with correct url', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'middle-post' }) })
    const og = meta.openGraph as Record<string, unknown>
    expect(og?.url).toBe(SITE_URL + '/home-guide/middle-post')
    expect(og?.type).toBe('article')
  })

  it('sets alternates.canonical to the slug path', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'middle-post' }) })
    expect(meta.alternates?.canonical).toBe('/home-guide/middle-post')
  })

  it('returns empty object for unknown slug', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'nonexistent' }) })
    expect(meta).toEqual({})
  })
})
