import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Post } from '@/content/posts/types'

// Mock server-only lib/images so PhotoSlot doesn't crash in jsdom
vi.mock('@/lib/images', () => ({
  slotImageSrc: (id: string) => (id === 'blog-cover-post' ? '/images/blog-cover-post.jpg' : null),
}))

// Mock the fs check inside lib/post-hero: every referenced hero asset "exists".
// The split logic itself is covered by src/lib/__tests__/post-hero.test.ts.
vi.mock('node:fs', () => ({ default: { existsSync: () => true } }))

// Import after mocks are set up
const { BlogFeatured } = await import('../featured')

const COVER_POST: Post = {
  slug: 'cover-post',
  title: 'The *Great* Cover Story',
  category: 'Market Update',
  date: '2026-05-29',
  excerpt: 'Lead excerpt here.',
  cover: true,
  body: [],
}

const POST_NO_COVER: Post = {
  slug: 'no-cover-post',
  title: 'A Post Without Cover',
  category: 'Buying',
  date: '2026-04-15',
  excerpt: 'Second post excerpt.',
  body: [],
}

const POST_THREE: Post = {
  slug: 'third-post',
  title: 'Third Issue',
  category: 'Selling',
  date: '2026-03-10',
  excerpt: 'Third excerpt.',
  body: [],
}

// Ingested issues ship their hero as the leading body image block (no `cover`).
const HERO_LEAD: Post = {
  slug: 'hero-lead-post',
  title: 'Hero Lead Issue',
  category: 'Market Update',
  date: '2026-07-27',
  excerpt: 'Hero lead excerpt.',
  body: [
    { image: { src: '/images/posts/hero-lead-post/hero-hero-lead-post.jpg', alt: 'Lead hero alt' } },
    'First paragraph.',
  ],
}

const HERO_TWO_UP: Post = {
  slug: 'hero-two-up-post',
  title: 'Hero Two-Up Issue',
  category: 'Selling',
  date: '2026-07-15',
  excerpt: 'Hero two-up excerpt.',
  body: [
    { image: { src: '/images/posts/hero-two-up-post/hero-hero-two-up-post.jpg', alt: 'Two-up hero alt' } },
    'First paragraph.',
  ],
}

describe('BlogFeatured', () => {
  describe('with 3 posts (first has cover)', () => {
    it('lead title link href points to /newsletter/<slug>', () => {
      render(<BlogFeatured posts={[COVER_POST, POST_NO_COVER, POST_THREE]} />)
      // There are two links with the title; both should go to /newsletter/cover-post
      const links = screen.getAllByRole('link', { name: /Great Cover Story/ })
      expect(links.length).toBeGreaterThanOrEqual(1)
      links.forEach((link) => {
        expect(link.getAttribute('href')).toBe('/newsletter/cover-post')
      })
    })

    it('renders "Latest issue" eyebrow with formatted date', () => {
      render(<BlogFeatured posts={[COVER_POST, POST_NO_COVER, POST_THREE]} />)
      expect(screen.getByText(/Latest issue/)).toBeInTheDocument()
      expect(screen.getByText(/May 29, 2026/)).toBeInTheDocument()
    })

    it('two-up renders 2 cards', () => {
      render(<BlogFeatured posts={[COVER_POST, POST_NO_COVER, POST_THREE]} />)
      expect(screen.getByText('A Post Without Cover')).toBeInTheDocument()
      expect(screen.getByText('Third Issue')).toBeInTheDocument()
    })

    it('cover post renders PhotoSlot (kt-slot wrapper)', () => {
      const { container } = render(<BlogFeatured posts={[COVER_POST, POST_NO_COVER, POST_THREE]} />)
      // PhotoSlot renders a div.kt-slot with data-slot attribute
      const slot = container.querySelector('[data-slot="blog-cover-post"]')
      expect(slot).toBeInTheDocument()
    })
  })

  describe('with 2 posts (no covers)', () => {
    it('renders without crash', () => {
      expect(() => render(<BlogFeatured posts={[COVER_POST, POST_NO_COVER]} />)).not.toThrow()
    })

    it('two-up has 1 card', () => {
      render(<BlogFeatured posts={[COVER_POST, POST_NO_COVER]} />)
      expect(screen.getByText('A Post Without Cover')).toBeInTheDocument()
      // Third post absent
      expect(screen.queryByText('Third Issue')).not.toBeInTheDocument()
    })
  })

  describe('coverless lead renders hr rule', () => {
    it('no-cover lead renders hr.kt-rule rather than PhotoSlot', () => {
      const { container } = render(<BlogFeatured posts={[POST_NO_COVER, POST_THREE]} />)
      // PhotoSlot absent for lead
      expect(container.querySelector('[data-slot="blog-no-cover-post"]')).not.toBeInTheDocument()
      // hr rule present
      const hr = container.querySelector('hr.kt-rule')
      expect(hr).toBeInTheDocument()
    })
  })

  describe('two-up coverless post renders hr rule', () => {
    it('two-up no-cover post renders hr.kt-rule.rule-light', () => {
      const { container } = render(<BlogFeatured posts={[COVER_POST, POST_NO_COVER, POST_THREE]} />)
      const ruleLight = container.querySelector('hr.kt-rule.rule-light')
      expect(ruleLight).toBeInTheDocument()
    })
  })

  describe('ingested posts (leading body image, no cover flag)', () => {
    it('lead with body hero renders the photo slot, not the noimg rule', () => {
      const { container } = render(<BlogFeatured posts={[HERO_LEAD, POST_THREE]} />)
      expect(container.querySelector('[data-slot="post-hero-hero-lead-post"]')).toBeInTheDocument()
      expect(container.querySelector('.kt-bfeat-lead.noimg')).not.toBeInTheDocument()
      expect(container.querySelector('.kt-bfeat-lead > hr.kt-rule')).not.toBeInTheDocument()
    })

    it('lead body hero uses the image alt from the post content', () => {
      render(<BlogFeatured posts={[HERO_LEAD, POST_THREE]} />)
      expect(screen.getByAltText('Lead hero alt')).toBeInTheDocument()
    })

    it('two-up post with body hero renders the photo slot, not the rule', () => {
      const { container } = render(<BlogFeatured posts={[COVER_POST, HERO_TWO_UP, POST_THREE]} />)
      expect(container.querySelector('[data-slot="post-hero-hero-two-up-post"]')).toBeInTheDocument()
      expect(container.querySelector('hr.kt-rule.rule-light')).toBeInTheDocument() // POST_THREE still coverless
    })
  })
})
