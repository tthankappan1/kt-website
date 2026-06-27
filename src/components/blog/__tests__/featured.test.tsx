import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Post } from '@/content/posts/types'

// Mock server-only lib/images so PhotoSlot doesn't crash in jsdom
vi.mock('@/lib/images', () => ({
  slotImageSrc: (id: string) => (id === 'blog-cover-post' ? '/images/blog-cover-post.jpg' : null),
}))

// Import after mock is set up
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
})
