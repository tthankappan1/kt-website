import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Service-role client for the two write endpoints. RLS is ON with no anon
// policies (README §7) — these inserts are the only write path.
// Lazy: env is read at request time, never at build time, so `next build`
// works without secrets.
let client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.local.example).',
    )
  }
  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}

/** Test seam. */
export function resetSupabaseAdminForTests() {
  client = null
}
