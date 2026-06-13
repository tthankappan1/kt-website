// @vitest-environment node
import { describe, expect, it, vi, beforeAll } from 'vitest'
import type { Post } from '@/content/posts/types'

// Real font path is exercised on purpose: satori must render the committed
// STATIC Fraunces. (The earlier version mocked node:fs/promises to an empty
// buffer, which silently took the no-font path and hid a build-breaking
// variable-font bug. Do NOT mock fs here.)
const FAKE_POSTS: Post[] = [
  {
    slug: 'test-post-one',
    title: 'Buying a Home in *Pleasanton* — and What It Costs',
    category: 'Buying',
    date: '2026-05-15',
    excerpt: 'A guide for buyers.',
    body: [],
  },
  {
    slug: 'test-post-two',
    title: 'Spring Market Update',
    category: 'Market Update',
    date: '2026-04-10',
    excerpt: 'The spring market is here.',
    body: [],
  },
]

vi.mock('@/content/posts', () => ({
  getPublishedPosts: () => FAKE_POSTS,
  getPost: (slug: string) => FAKE_POSTS.find((p) => p.slug === slug),
}))

let OgImage: (props: { params: Promise<{ slug: string }> }) => Promise<Response>
let contentType: string
let size: { width: number; height: number }

beforeAll(async () => {
  const mod = await import('../[slug]/opengraph-image')
  OgImage = mod.default
  contentType = mod.contentType
  size = mod.size
})

describe('per-post OG image — exports', () => {
  it('exports contentType image/png', () => {
    expect(contentType).toBe('image/png')
  })
  it('exports size 1200x630', () => {
    expect(size).toEqual({ width: 1200, height: 630 })
  })
})

describe('per-post OG image — renders with the real static Fraunces font', () => {
  it('returns a 200 PNG for a known post (title with em-dash + emphasis markers)', async () => {
    const res = await OgImage({ params: Promise.resolve({ slug: 'test-post-one' }) })
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('image/png')
    const buf = await res.arrayBuffer()
    expect(buf.byteLength).toBeGreaterThan(10000)
  })

  it('returns a branded 200 PNG for an unknown slug', async () => {
    const res = await OgImage({ params: Promise.resolve({ slug: 'nonexistent-slug' }) })
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('image/png')
  })
})

describe('per-post OG image — generateStaticParams', () => {
  it('returns all published slugs', async () => {
    const { generateStaticParams } = await import('../[slug]/opengraph-image')
    const params = await generateStaticParams()
    expect(params).toContainEqual({ slug: 'test-post-one' })
    expect(params).toContainEqual({ slug: 'test-post-two' })
  })
})
