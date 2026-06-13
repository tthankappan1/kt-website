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

// Memory bounds: prune fully-expired buckets once the map grows past PRUNE_AT
// (on EVERY path, not just allows, so a blocked-request flood can't grow it
// unboundedly), and hard-evict oldest entries past MAX_KEYS as a backstop.
const PRUNE_AT = 5000
const MAX_KEYS = 20000

export type RateLimitResult = { ok: boolean; retryAfterSec: number }

function pruneExpired(windowStart: number): void {
  for (const [k, ts] of store) {
    const fresh = ts.filter((t) => t > windowStart)
    if (fresh.length === 0) store.delete(k)
    else store.set(k, fresh)
  }
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number; now?: number },
): RateLimitResult {
  const now = opts.now ?? Date.now()
  const windowStart = now - opts.windowMs

  // Bound memory on every code path (a distinct-key flood is mostly blocked
  // requests, which must not be allowed to grow the map without pruning).
  if (store.size > PRUNE_AT) pruneExpired(windowStart)

  const recent = (store.get(key) ?? []).filter((t) => t > windowStart)

  if (recent.length >= opts.limit) {
    store.set(key, recent)
    const oldest = recent[0]
    const retryAfterSec = Math.max(1, Math.ceil((oldest + opts.windowMs - now) / 1000))
    return { ok: false, retryAfterSec }
  }

  recent.push(now)
  store.set(key, recent)

  // Hard ceiling backstop: if still over cap after pruning, evict oldest-inserted
  // keys (Map preserves insertion order) until under the limit.
  if (store.size > MAX_KEYS) {
    const overflow = store.size - MAX_KEYS
    let removed = 0
    for (const k of store.keys()) {
      if (k === key || removed >= overflow) break
      store.delete(k)
      removed++
    }
  }

  return { ok: true, retryAfterSec: 0 }
}

/** Test seams. */
export function resetRateLimitForTests() {
  store.clear()
}
export function rateLimitStoreSizeForTests(): number {
  return store.size
}
