// @vitest-environment node
import { describe, expect, it, beforeAll } from 'vitest'

// Exercises the real committed static Fraunces font (no fs mock — see the
// per-post OG test for why mocking it hides build-breaking font bugs).
let OgImage: () => Promise<Response>
let contentType: string
let size: { width: number; height: number }

beforeAll(async () => {
  const mod = await import('../opengraph-image')
  OgImage = mod.default
  contentType = mod.contentType
  size = mod.size
})

describe('app-level OG image — exports', () => {
  it('exports contentType image/png', () => {
    expect(contentType).toBe('image/png')
  })
  it('exports size 1200x630', () => {
    expect(size).toEqual({ width: 1200, height: 630 })
  })
})

describe('app-level OG image — renders with the real static Fraunces font', () => {
  it('returns a 200 PNG of non-trivial size', async () => {
    const res = await OgImage()
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('image/png')
    const buf = await res.arrayBuffer()
    expect(buf.byteLength).toBeGreaterThan(10000)
  })
})
