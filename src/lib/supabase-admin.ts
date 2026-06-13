import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Secret-key client for the two write endpoints. RLS is ON with no policies
// (README §7) — these inserts are the only write path, and they only succeed
// because the secret key uses the `service_role` Postgres role and BYPASSES RLS.
//
// KEY SCHEME (see docs/HANDOFF.md): this project uses Supabase's NEW API keys
// (decided day-one; the legacy anon/service_role JWT keys deprecate end-2026).
//   - SUPABASE_SECRET_KEY        — sb_secret_…  (server-only, bypasses RLS) ← used here
//   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — sb_publishable_… (client-safe, respects RLS; reserved/unused in code)
// The client is format-agnostic (a legacy service_role JWT would still work),
// but the standard is the new secret key. The most common silent misconfig is
// pasting a key that RESPECTS RLS into the secret slot (publishable key, or a
// legacy anon JWT): with no policies, EVERY insert then fails the RLS check.
// assertSecretKey() catches that at startup with a precise message.
//
// The secret key must never reach the browser (Supabase 401s it on a browser
// User-Agent); `import 'server-only'` above enforces that at the bundler level.
let client: SupabaseClient | null = null

/**
 * Reject keys that are definitely NOT a secret/service_role key (they respect
 * RLS, so they would break every write). Lenient: only throws on unambiguous
 * signals, otherwise allows the key through (new sb_secret_…, a legacy
 * service_role JWT, or any opaque key the client may accept).
 */
export function assertSecretKey(key: string): void {
  // New-style publishable key in the secret slot — unambiguously wrong.
  if (key.startsWith('sb_publishable_')) {
    throw new Error(
      'SUPABASE_SECRET_KEY looks like a PUBLISHABLE key (sb_publishable_…), which respects RLS and cannot write. Use the Secret key (Dashboard → Settings → API Keys → Secret keys), e.g. sb_secret_….',
    )
  }
  // Legacy JWT pasted in: an `anon` JWT respects RLS and silently fails writes.
  const parts = key.split('.')
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
      if (payload?.role === 'anon') {
        throw new Error(
          'SUPABASE_SECRET_KEY is an ANON key (role: anon), which respects RLS and cannot write past the no-policy tables. Use the Secret key from Dashboard → Settings → API Keys → Secret keys (sb_secret_…).',
        )
      }
    } catch (err) {
      // Re-throw our own assertion; ignore JWT-decode failures (opaque/new keys).
      if (err instanceof Error && err.message.startsWith('SUPABASE_SECRET_KEY')) throw err
    }
  }
}

/**
 * Reduce a Supabase URL to its bare origin. supabase-js appends `/rest/v1`,
 * `/auth/v1`, etc. itself, so it must receive the Project URL with no path. The
 * dashboard also surfaces the REST-endpoint form (`…/rest/v1/`); pasting that
 * yields a doubled path and PostgREST rejects every request with PGRST125
 * ("Invalid path specified in request URL"). Normalizing here makes the bare
 * Project URL, a trailing slash, and the REST endpoint all resolve correctly.
 */
export function normalizeSupabaseUrl(raw: string): string {
  try {
    return new URL(raw.trim()).origin
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL is not a valid URL: "${raw}". Use the Project URL from Dashboard → Settings → API (e.g. https://xxxx.supabase.co).`,
    )
  }
}

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!url || !secretKey) {
    throw new Error(
      'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (see .env.local.example).',
    )
  }
  assertSecretKey(secretKey)
  client = createClient(normalizeSupabaseUrl(url), secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}

/** Test seam. */
export function resetSupabaseAdminForTests() {
  client = null
}
