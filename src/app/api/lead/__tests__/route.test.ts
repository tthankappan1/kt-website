import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetRateLimitForTests } from '@/lib/rate-limit'

const ingestMock = vi.fn()

vi.mock('@/lib/kt-crm', () => ({
  ingestContact: (payload: unknown) => ingestMock(payload),
}))

// Import after the mock is set up
import { POST } from '../route'

function makeRequest(body: unknown, malformed = false, headers?: Record<string, string>): Request {
  return new Request('http://test/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
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
    ingestMock.mockReset()
    resetRateLimitForTests()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('maps a full submission to the CRM payload with market-updates opt-in', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'created' })
    const res = await POST(
      makeRequest({
        intent: 'selling',
        timeframe: 'Ready now',
        firstName: 'Asha',
        lastName: 'Rao',
        email: 'Asha@Example.com',
        phone: '925-555-0100',
        message: 'Thinking about listing in the fall.',
        newsletterAlameda: true,
        newsletterContracosta: true,
        sourcePage: '/contact',
      }),
    )
    expect(res.status).toBe(200)
    expect(ingestMock).toHaveBeenCalledOnce()
    expect(ingestMock).toHaveBeenCalledWith({
      email: 'asha@example.com',
      first_name: 'Asha',
      last_name: 'Rao',
      phone: '925-555-0100',
      contact_type: 'lead',
      source_detail: 'contact-page',
      lists: ['market-updates'],
      consent: { basis: 'web_form' },
      custom_fields: {
        intent: 'selling',
        timeframe: 'Ready now',
        message: 'Thinking about listing in the fall.',
        source_page: '/contact',
        market_update_counties: 'alameda, contra-costa',
      },
    })
  })

  it('requests market-updates with a single county checkbox (no stray separator)', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'created' })
    await POST(
      makeRequest({
        intent: 'buying',
        firstName: 'Ben',
        email: 'ben@example.com',
        newsletterAlameda: true,
      }),
    )
    const payload = ingestMock.mock.calls[0][0]
    expect(payload.lists).toEqual(['market-updates'])
    expect(payload.consent).toEqual({ basis: 'web_form' })
    expect(payload.custom_fields.market_update_counties).toBe('alameda')
  })

  it('requests NO lists and claims NO consent without an explicit opt-in', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'created' })
    await POST(makeRequest({ intent: 'curious', firstName: 'Ben', email: 'ben@example.com' }))
    const payload = ingestMock.mock.calls[0][0]
    expect(payload.lists).toEqual([])
    expect(payload.consent).toBeUndefined()
  })

  it('omits optional CRM fields that were not submitted', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'created' })
    await POST(makeRequest({ intent: 'buying', firstName: 'Ben', email: 'ben@example.com' }))
    expect(ingestMock).toHaveBeenCalledWith({
      email: 'ben@example.com',
      first_name: 'Ben',
      contact_type: 'lead',
      source_detail: 'contact-page',
      lists: [],
      custom_fields: { intent: 'buying' },
    })
  })

  it('returns 500 without leaking details when the CRM call fails', async () => {
    ingestMock.mockResolvedValue({ ok: false, status: null })
    const res = await POST(makeRequest({ intent: 'curious', firstName: 'A', email: 'a@b.com' }))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server' })
  })

  it('returns 400 validation error when intent is outside enum, no CRM call', async () => {
    const req = makeRequest({ ...minimalValid, intent: 'renting' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    // schema shape must NOT be leaked to the client
    expect(body.issues).toBeUndefined()
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('returns 400 validation error when firstName is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { firstName: _omit, ...withoutFirst } = minimalValid
    const req = makeRequest(withoutFirst)
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('returns 400 validation error when email is invalid', async () => {
    const req = makeRequest({ ...minimalValid, email: 'not-an-email' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body.error).toBe('validation')
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('silently drops honeypot (website non-empty) — returns 200, NO CRM call', async () => {
    const req = makeRequest({ ...minimalValid, website: 'x' })
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('returns 400 { error: "invalid_json" } for malformed JSON', async () => {
    const req = makeRequest(null, true)
    const res = await POST(req)
    const body = await res.json()
    expect(res.status).toBe(400)
    expect(body).toEqual({ error: 'invalid_json' })
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('returns 415 when content-type is not JSON, no CRM call', async () => {
    const req = makeRequest(minimalValid, false, { 'Content-Type': 'text/plain' })
    const res = await POST(req)
    expect(res.status).toBe(415)
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('returns 413 when the body exceeds the size cap, no CRM call', async () => {
    const req = makeRequest({ ...minimalValid, message: 'x'.repeat(17_000) })
    const res = await POST(req)
    expect(res.status).toBe(413)
    expect(ingestMock).not.toHaveBeenCalled()
  })

  it('rate-limits a flood from one client (429 with Retry-After after the limit)', async () => {
    ingestMock.mockResolvedValue({ ok: true, action: 'created' })
    const ip = { 'x-forwarded-for': '203.0.113.9' }
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(minimalValid, false, ip))
      expect(res.status).toBe(200)
    }
    const blocked = await POST(makeRequest(minimalValid, false, ip))
    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
  })
})
