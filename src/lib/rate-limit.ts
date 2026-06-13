// In-memory sliding-window rate limiter for the public write endpoints.
//
// SCOPE & LIMITS: this is per-process memory. On Vercel serverless each
// instance has its own store and cold starts reset it, so this is a
// best-effort baseline that stops casual scripted spam from a single source —
// not a hard distributed guarantee. For strict cross-instance limits, swap the
// store for Upstash Ratelimit (set UPSTASH_REDIS_REST_URL/TOKEN and replace the
// body of rateLimit) — the call sites and signature stay the same. Combined
// with the honeypot, this is proportionate protection for a low-volume site.

type Timestamps = number[]
const store = new Map<string, Timestamps>()

export type RateLimitResult = { ok: boolean; retryAfterSec: number }

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number; now?: number },
): RateLimitResult {
  const now = opts.now ?? Date.now()
  const windowStart = now - opts.windowMs
  const recent = (store.get(key) ?? []).filter((t) => t > windowStart)

  if (recent.length >= opts.limit) {
    store.set(key, recent)
    const oldest = recent[0]
    const retryAfterSec = Math.max(1, Math.ceil((oldest + opts.windowMs - now) / 1000))
    return { ok: false, retryAfterSec }
  }

  recent.push(now)
  store.set(key, recent)

  // Bounded-memory safety valve: prune empty/expired buckets if the map grows large.
  if (store.size > 5000) {
    for (const [k, ts] of store) {
      const fresh = ts.filter((t) => t > windowStart)
      if (fresh.length === 0) store.delete(k)
      else store.set(k, fresh)
    }
  }

  return { ok: true, retryAfterSec: 0 }
}

/** Test seam. */
export function resetRateLimitForTests() {
  store.clear()
}
