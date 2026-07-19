import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetRateLimitForTests } from '@/lib/rate-limit'

const ingestMock = vi.fn()

vi.mock('@/lib/kt-crm', () => ({
  ingestContact: (payload: unknown) => ingestMock(payload),
}))

// Import after the mock is set up
import { POST } from '../route'

function makeRequest(body: unknown, malformed = false, headers?: Record<string, string>): Request {
  return new Request('http://test/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: malformed ? 'not-json{{{' : JSON.stringify(body),
  })
}

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    ingestMock.mockReset()
    resetRateLimitForTests()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and ingests lowercased email with newsletter list consent', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'created' })
    const req = makeRequest({ email: 'Reader@Example.COM', sourcePage: '/newsletter' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(ingestMock).toHaveBeenCalledOnce()
    expect(ingestMock).toHaveBeenCalledWith({
      email: 'reader@example.com',
      lists: ['newsletter'],
      consent: { basis: 'web_form' },
      source_detail: 'homepage-signup',
      custom_fields: { source_page: '/newsletter' },
    })
  })

  it('omits custom_fields when sourcePage is not provided', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'created' })
    const res = await POST(makeRequest({ email: 'user@test.com' }))
    expect(res.status).toBe(200)
    expect(ingestMock).toHaveBeenCalledWith({
      email: 'user@test.com',
      lists: ['newsletter'],
      consent: { basis: 'web_form' },
      source_detail: 'homepage-signup',
    })
  })

  it('returns 400 with validation error for invalid email', async () => {
    const req = makeRequest({ email: 'not-an-email' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    // schema shape must NOT be leaked to the client
    expect(body.issues).toBeUndefined()
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('returns 400 with validation error when email is missing', async () => {
    const req = makeRequest({ sourcePage: '/contact' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('silently drops honeypot submissions (returns 200, no CRM call)', async () => {
    const req = makeRequest({ email: 'bot@example.com', website: 'http://spam.com' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('returns 200 on repeat signup (CRM upserts as updated)', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'updated' })
    const res = await POST(makeRequest({ email: 'existing@example.com' }))
    expect((await res.json())).toEqual({ ok: true })
    expect(res.status).toBe(200)
  })

  it('returns 500 without leaking details when the CRM call fails', async () => {
    ingestMock.mockResolvedValue({ ok: false, status: 503 })
    const res = await POST(makeRequest({ email: 'user@example.com' }))
    const body = await res.json()
    expect(res.status).toBe(500)
    expect(body).toEqual({ error: 'server' })
  })

  it('returns 400 for malformed JSON body', async () => {
    const req = makeRequest(null, true)
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body).toEqual({ error: 'invalid_json' })
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('returns 415 when content-type is not JSON, no CRM call', async () => {
    const req = makeRequest({ email: 'a@b.com' }, false, { 'Content-Type': 'text/plain' })
    const res = await POST(req)
    expect(res.status).toBe(415)
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('rate-limits a flood from one client (429 after the limit)', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'created' })
    const ip = { 'x-forwarded-for': '198.51.100.7' }
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest({ email: `u${i}@example.com` }, false, ip))
      expect(res.status).toBe(200)
    }
    const blocked = await POST(makeRequest({ email: 'u6@example.com' }, false, ip))
    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
  })
})
