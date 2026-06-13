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
  return new Request('http://test/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: malformed ? 'not-json{{{' : JSON.stringify(body),
  })
}

const minimalValid = {
  intent: 'buying',
  firstName: 'Jane',
  email: 'jane@example.com',
}

describe('POST /api/lead', () => {
  beforeEach(() => {
    insertMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and calls insert once with correct §7 column names on valid minimal lead', async () => {
    insertMock.mockResolvedValue({ error: null })
    const req = makeRequest(minimalValid)
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(insertMock).toHaveBeenCalledOnce()
    const inserted = insertMock.mock.calls[0][0] as Record<string, unknown>
    expect(inserted.first_name).toBe('Jane')
    expect(inserted.intent).toBe('buying')
    expect(inserted.email).toBe('jane@example.com')
    expect(inserted.timeframe).toBeNull()
    expect(inserted.newsletter_alameda).toBe(false)
    expect(inserted.newsletter_contracosta).toBe(false)
    expect(inserted.source_page).toBeNull()
    // no unknown columns
    expect('last_name' in inserted).toBe(false)
    expect('phone' in inserted).toBe(false)
  })

  it('returns 400 validation error when intent is outside enum, no insert', async () => {
    const req = makeRequest({ ...minimalValid, intent: 'renting' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    expect(Array.isArray(body.issues)).toBe(true)
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('returns 400 validation error when firstName is missing', async () => {
    const { firstName: _omit, ...withoutFirst } = minimalValid
    const req = makeRequest(withoutFirst)
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('returns 400 validation error when email is invalid', async () => {
    const req = makeRequest({ ...minimalValid, email: 'not-an-email' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('silently drops honeypot (website non-empty) — returns 200, NO insert', async () => {
    const req = makeRequest({ ...minimalValid, website: 'x' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('appends lastName and phone to message when both are present', async () => {
    insertMock.mockResolvedValue({ error: null })
    const req = makeRequest({
      ...minimalValid,
      message: 'Hello there',
      lastName: 'Smith',
      phone: '(408) 555-1212',
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const inserted = insertMock.mock.calls[0][0] as Record<string, unknown>
    expect(typeof inserted.message).toBe('string')
    expect(inserted.message as string).toContain('Hello there')
    expect(inserted.message as string).toContain('Last name: Smith')
    expect(inserted.message as string).toContain('Phone: (408) 555-1212')
  })

  it('persists newsletterAlameda and newsletterContracosta as true', async () => {
    insertMock.mockResolvedValue({ error: null })
    const req = makeRequest({
      ...minimalValid,
      newsletterAlameda: true,
      newsletterContracosta: true,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const inserted = insertMock.mock.calls[0][0] as Record<string, unknown>
    expect(inserted.newsletter_alameda).toBe(true)
    expect(inserted.newsletter_contracosta).toBe(true)
  })

  it('returns 500 { error: "server" } on database error', async () => {
    insertMock.mockResolvedValue({ error: { code: 'XX000', message: 'DB down' } })
    const req = makeRequest(minimalValid)
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body).toEqual({ error: 'server' })
    expect(JSON.stringify(body)).not.toContain('DB down')
  })

  it('returns 400 { error: "invalid_json" } for malformed JSON', async () => {
    const req = makeRequest(null, true)
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body).toEqual({ error: 'invalid_json' })
    expect(insertMock).not.toHaveBeenCalled()
  })
})
