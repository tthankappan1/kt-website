import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// insertMock is the function we spy on per test
const insertMock = vi.fn()

vi.mock('@/lib/supabase-admin', () => ({
  getSupabaseAdmin: () => ({
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  }),
}))

// Import after the mock is set up
import { POST } from '../route'

function makeRequest(body: unknown, malformed = false): Request {
  return new Request('http://test/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: malformed ? 'not-json{{{' : JSON.stringify(body),
  })
}

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    insertMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and calls insert with lowercased email on valid input', async () => {
    insertMock.mockResolvedValue({ error: null })
    const req = makeRequest({ email: 'Reader@Example.COM', sourcePage: '/home-guide' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(insertMock).toHaveBeenCalledOnce()
    expect(insertMock).toHaveBeenCalledWith({
      email: 'reader@example.com',
      source_page: '/home-guide',
    })
  })

  it('uses null for source_page when sourcePage is not provided', async () => {
    insertMock.mockResolvedValue({ error: null })
    const req = makeRequest({ email: 'user@test.com' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(insertMock).toHaveBeenCalledWith({
      email: 'user@test.com',
      source_page: null,
    })
  })

  it('returns 400 with validation error for invalid email', async () => {
    const req = makeRequest({ email: 'not-an-email' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    expect(body.issues).toBeDefined()
    expect(Array.isArray(body.issues)).toBe(true)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('returns 400 with validation error when email is missing', async () => {
    const req = makeRequest({ sourcePage: '/contact' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('silently drops honeypot submissions (returns 200, does NOT insert)', async () => {
    const req = makeRequest({ email: 'bot@example.com', website: 'http://spam.com' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('returns 200 on duplicate signup (Postgres unique violation 23505)', async () => {
    insertMock.mockResolvedValue({ error: { code: '23505' } })
    const req = makeRequest({ email: 'existing@example.com' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
  })

  it('returns 500 on other database error', async () => {
    insertMock.mockResolvedValue({ error: { code: 'XX000', message: 'Internal error' } })
    const req = makeRequest({ email: 'user@example.com' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body).toEqual({ error: 'server' })
    // Should not leak error details
    expect(JSON.stringify(body)).not.toContain('Internal error')
  })

  it('returns 400 for malformed JSON body', async () => {
    const req = makeRequest(null, true)
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body).toEqual({ error: 'invalid_json' })
    expect(insertMock).not.toHaveBeenCalled()
  })
})
