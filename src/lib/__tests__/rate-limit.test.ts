import { afterEach, describe, expect, it } from 'vitest'
import { rateLimit, resetRateLimitForTests } from '@/lib/rate-limit'

describe('rateLimit (sliding window)', () => {
  afterEach(() => resetRateLimitForTests())

  it('allows up to the limit, then blocks', () => {
    const opts = { limit: 3, windowMs: 1000, now: 0 }
    expect(rateLimit('a', opts).ok).toBe(true)
    expect(rateLimit('a', opts).ok).toBe(true)
    expect(rateLimit('a', opts).ok).toBe(true)
    const blocked = rateLimit('a', opts)
    expect(blocked.ok).toBe(false)
    expect(blocked.retryAfterSec).toBeGreaterThan(0)
  })

  it('isolates keys', () => {
    const opts = { limit: 1, windowMs: 1000, now: 100 }
    expect(rateLimit('ip-1', opts).ok).toBe(true)
    expect(rateLimit('ip-2', opts).ok).toBe(true)
    expect(rateLimit('ip-1', opts).ok).toBe(false)
  })

  it('frees the window after it elapses', () => {
    expect(rateLimit('b', { limit: 1, windowMs: 1000, now: 0 }).ok).toBe(true)
    expect(rateLimit('b', { limit: 1, windowMs: 1000, now: 500 }).ok).toBe(false)
    expect(rateLimit('b', { limit: 1, windowMs: 1000, now: 1500 }).ok).toBe(true)
  })

  it('reports a sane Retry-After (ceil seconds to oldest expiry)', () => {
    expect(rateLimit('c', { limit: 1, windowMs: 10_000, now: 0 }).ok).toBe(true)
    const r = rateLimit('c', { limit: 1, windowMs: 10_000, now: 2000 })
    expect(r.ok).toBe(false)
    expect(r.retryAfterSec).toBe(8) // (0 + 10000 - 2000)/1000
  })
})
