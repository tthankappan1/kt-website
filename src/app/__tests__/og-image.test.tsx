// @vitest-environment node
import { describe, expect, it, vi, beforeAll } from 'vitest'

// Stub fs/promises to avoid reading real TTF in unit tests
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue(Buffer.alloc(0)),
}))

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

describe('app-level OG image — default export', () => {
  it('returns status 200', async () => {
    const res = await OgImage()
    expect(res.status).toBe(200)
  })

  it('returns content-type image/png', async () => {
    const res = await OgImage()
    expect(res.headers.get('content-type')).toContain('image/png')
  })

  it('returns non-trivial byte length (> 10000)', async () => {
    const res = await OgImage()
    const buf = await res.arrayBuffer()
    expect(buf.byteLength).toBeGreaterThan(10000)
  })
})
