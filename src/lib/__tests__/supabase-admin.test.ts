import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  assertSecretKey,
  getSupabaseAdmin,
  normalizeSupabaseUrl,
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
    vi.stubEnv('SUPABASE_SECRET_KEY', '')
    expect(() => getSupabaseAdmin()).toThrow(/Supabase is not configured/)
  })

  it('creates a client with a new secret key and caches it', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('SUPABASE_SECRET_KEY', 'sb_secret_test123')
    const a = getSupabaseAdmin()
    const b = getSupabaseAdmin()
    expect(a).toBe(b)
    expect(a.from).toBeTypeOf('function')
  })

  it('rejects a publishable key pasted into the secret slot', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('SUPABASE_SECRET_KEY', 'sb_publishable_oops')
    expect(() => getSupabaseAdmin()).toThrow(/PUBLISHABLE key/)
  })

  it('tolerates the REST-endpoint URL (…/rest/v1/) by normalizing to the origin', () => {
    // The dashboard surfaces this form; supabase-js appends /rest/v1 itself, so
    // an un-normalized value yields a doubled path → PostgREST PGRST125.
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co/rest/v1/')
    vi.stubEnv('SUPABASE_SECRET_KEY', 'sb_secret_test123')
    expect(() => getSupabaseAdmin()).not.toThrow()
  })
})

describe('normalizeSupabaseUrl (URL-misconfiguration guard)', () => {
  it('leaves a bare Project URL unchanged', () => {
    expect(normalizeSupabaseUrl('https://example.supabase.co')).toBe(
      'https://example.supabase.co',
    )
  })

  it('strips a trailing slash', () => {
    expect(normalizeSupabaseUrl('https://example.supabase.co/')).toBe(
      'https://example.supabase.co',
    )
  })

  it('strips the /rest/v1/ REST-endpoint path to the origin', () => {
    expect(normalizeSupabaseUrl('https://example.supabase.co/rest/v1/')).toBe(
      'https://example.supabase.co',
    )
  })

  it('trims surrounding whitespace (copy-paste artifact)', () => {
    expect(normalizeSupabaseUrl('  https://example.supabase.co  ')).toBe(
      'https://example.supabase.co',
    )
  })

  it('throws a clear error on a non-URL value', () => {
    expect(() => normalizeSupabaseUrl('not a url')).toThrow(/not a valid URL/)
  })
})

describe('assertSecretKey (key-misconfiguration guard)', () => {
  it('accepts a new-style secret key (sb_secret_…)', () => {
    expect(() => assertSecretKey('sb_secret_abc123')).not.toThrow()
  })

  it('accepts a legacy service_role JWT (still bypasses RLS — works)', () => {
    expect(() => assertSecretKey(jwtWithRole('service_role'))).not.toThrow()
  })

  it('rejects a publishable key (sb_publishable_… respects RLS — would fail writes)', () => {
    expect(() => assertSecretKey('sb_publishable_abc123')).toThrow(/PUBLISHABLE key/)
  })

  it('rejects a legacy anon JWT (role: anon respects RLS)', () => {
    expect(() => assertSecretKey(jwtWithRole('anon'))).toThrow(/ANON key/)
  })

  it('allows opaque non-JWT strings (cannot determine role — stays lenient)', () => {
    expect(() => assertSecretKey('some-opaque-key')).not.toThrow()
  })
})
