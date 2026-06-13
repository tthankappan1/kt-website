import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Service-role client for the two write endpoints. RLS is ON with no anon
// policies (README §7) — these inserts are the only write path, and they only
// succeed because the service-role key BYPASSES RLS.
//
// KEY COMPATIBILITY (see docs/HANDOFF.md): this project uses Supabase's LEGACY
// JWT keys — the `anon` and `service_role` keys from the dashboard's
// "Legacy API Keys" tab. SUPABASE_SERVICE_ROLE_KEY MUST be the `service_role`
// key (role: service_role, BYPASSRLS). The code is format-agnostic — a new
// `sb_secret_...` key would also work — but the most common, silent
// misconfiguration is pasting the anon/publishable key into the service-role
// slot: it respects RLS, so with no policies EVERY insert fails the RLS check.
// assertServiceRoleKey() catches that at startup with a precise message.
let client: SupabaseClient | null = null

/**
 * Reject keys that are definitely NOT a service-role/secret key (they respect
 * RLS, so they would break every write). Lenient: only throws on unambiguous
 * signals, otherwise allows the key through (legacy service_role JWT, new
 * sb_secret_, or any opaque key the client may accept).
 */
export function assertServiceRoleKey(key: string): void {
  // New-style publishable key in the secret slot — unambiguously wrong.
  if (key.startsWith('sb_publishable_')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY looks like a PUBLISHABLE key (sb_publishable_…), which respects RLS and cannot write. Use the service_role key (Dashboard → Settings → API → Legacy API Keys) or a secret key (sb_secret_…).',
    )
  }
  // Legacy JWT: decode the role claim. An `anon` JWT in the secret slot is the
  // classic mistake — it respects RLS and silently fails every insert.
  const parts = key.split('.')
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
      if (payload?.role === 'anon') {
        throw new Error(
          'SUPABASE_SERVICE_ROLE_KEY is the ANON key (role: anon), which respects RLS and cannot write past the no-policy tables. Paste the service_role key from Dashboard → Settings → API → Legacy API Keys.',
        )
      }
    } catch (err) {
      // Re-throw our own assertion; ignore JWT-decode failures (opaque/new keys).
      if (err instanceof Error && err.message.startsWith('SUPABASE_SERVICE_ROLE_KEY')) throw err
    }
  }
}

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.local.example).',
    )
  }
  assertServiceRoleKey(serviceKey)
  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}

/** Test seam. */
export function resetSupabaseAdminForTests() {
  client = null
}
