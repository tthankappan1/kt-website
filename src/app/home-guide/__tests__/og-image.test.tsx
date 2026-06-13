// @vitest-environment node
import { describe, expect, it, vi, beforeAll } from 'vitest'
import type { Post } from '@/content/posts/types'

const FAKE_POSTS: Post[] = [
  {
    slug: 'test-post-one',
    title: 'Buying a Home in *Pleasanton*',
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

// Stub fs/promises to avoid reading real TTF in unit tests
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue(Buffer.alloc(0)),
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

describe('per-post OG image — default export', () => {
  it('returns status 200 for a known post', async () => {
    const res = await OgImage({ params: Promise.resolve({ slug: 'test-post-one' }) })
    expect(res.status).toBe(200)
  })

  it('returns content-type image/png', async () => {
    const res = await OgImage({ params: Promise.resolve({ slug: 'test-post-one' }) })
    expect(res.headers.get('content-type')).toContain('image/png')
  })

  it('returns non-trivial byte length (> 10000)', async () => {
    const res = await OgImage({ params: Promise.resolve({ slug: 'test-post-one' }) })
    const buf = await res.arrayBuffer()
    expect(buf.byteLength).toBeGreaterThan(10000)
  })

  it('returns status 200 for fallback (unknown slug)', async () => {
    const res = await OgImage({ params: Promise.resolve({ slug: 'nonexistent-slug' }) })
    expect(res.status).toBe(200)
  })

  it('returns content-type image/png for fallback', async () => {
    const res = await OgImage({ params: Promise.resolve({ slug: 'nonexistent-slug' }) })
    expect(res.headers.get('content-type')).toContain('image/png')
  })
})

describe('per-post OG image — generateStaticParams', () => {
  it('returns all slugs', async () => {
    const { generateStaticParams } = await import('../[slug]/opengraph-image')
    const params = await generateStaticParams()
    expect(params).toContainEqual({ slug: 'test-post-one' })
    expect(params).toContainEqual({ slug: 'test-post-two' })
  })
})
