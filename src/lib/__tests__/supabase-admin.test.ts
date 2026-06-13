import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  assertServiceRoleKey,
  getSupabaseAdmin,
  resetSupabaseAdminForTests,
} from '@/lib/supabase-admin'

// Build a JWT-shaped key with a given role claim (legacy Supabase key format).
function jwtWithRole(role: string): string {
  const payload = Buffer.from(JSON.stringify({ role }), 'utf8').toString('base64url')
  return `header.${payload}.signature`
}

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
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', jwtWithRole('service_role'))
    const a = getSupabaseAdmin()
    const b = getSupabaseAdmin()
    expect(a).toBe(b)
    expect(a.from).toBeTypeOf('function')
  })

  it('rejects the anon key pasted into the service-role slot', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', jwtWithRole('anon'))
    expect(() => getSupabaseAdmin()).toThrow(/ANON key/)
  })
})

describe('assertServiceRoleKey (legacy + new key compatibility guard)', () => {
  it('accepts a legacy service_role JWT', () => {
    expect(() => assertServiceRoleKey(jwtWithRole('service_role'))).not.toThrow()
  })

  it('accepts a new-style secret key (sb_secret_…)', () => {
    expect(() => assertServiceRoleKey('sb_secret_abc123')).not.toThrow()
  })

  it('rejects a legacy anon JWT (respects RLS — would fail every write)', () => {
    expect(() => assertServiceRoleKey(jwtWithRole('anon'))).toThrow(/ANON key/)
  })

  it('rejects a new publishable key in the secret slot', () => {
    expect(() => assertServiceRoleKey('sb_publishable_abc123')).toThrow(/PUBLISHABLE key/)
  })

  it('allows opaque non-JWT strings (cannot determine role — stays lenient)', () => {
    expect(() => assertServiceRoleKey('some-opaque-key')).not.toThrow()
  })
})
