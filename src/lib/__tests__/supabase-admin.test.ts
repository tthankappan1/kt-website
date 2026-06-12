import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSupabaseAdmin, resetSupabaseAdminForTests } from '@/lib/supabase-admin'

// Locks the lazy-env contract: no env read at import time, clear error when
// unconfigured, cached client on success.
describe('getSupabaseAdmin', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    resetSupabaseAdminForTests()
  })

  it('throws a clear configuration error when env is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')
    expect(() => getSupabaseAdmin()).toThrow(/Supabase is not configured/)
  })

  it('creates a client when env is present and caches it', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-test-key')
    const a = getSupabaseAdmin()
    const b = getSupabaseAdmin()
    expect(a).toBe(b)
    expect(a.from).toBeTypeOf('function')
  })
})
