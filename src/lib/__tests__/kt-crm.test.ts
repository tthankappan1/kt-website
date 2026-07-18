import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ingestContact } from '@/lib/kt-crm'

const fetchMock = vi.fn()

function okResponse(body: unknown = { contact_id: 1, action: 'created', mailable: true }) {
  return new Response(JSON.stringify(body), { status: 200 })
}

describe('ingestContact', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('KT_CRM_INGEST_API_KEY', 'test-ingest-key')
    vi.stubEnv('KT_CRM_INGEST_URL', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('returns ok:false without calling fetch when the key is missing', async () => {
    vi.stubEnv('KT_CRM_INGEST_API_KEY', '')
    const result = await ingestContact({ email: 'a@b.com' })
    expect(result).toEqual({ ok: false, status: null })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('POSTs source web_signup + payload with bearer auth to the default URL', async () => {
    fetchMock.mockResolvedValue(okResponse())
    const result = await ingestContact({
      email: 'a@b.com',
      lists: ['newsletter'],
      consent: { basis: 'web_form' },
    })
    expect(result).toEqual({ ok: true, action: 'created' })
    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://kt-crm.onrender.com/api/v1/contacts/ingest')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer test-ingest-key')
    expect(init.headers['Content-Type']).toBe('application/json')
    const body = JSON.parse(init.body)
    expect(body.source).toBe('web_signup')
    expect(body.email).toBe('a@b.com')
    expect(body.lists).toEqual(['newsletter'])
    expect(body.consent).toEqual({ basis: 'web_form' })
    expect(typeof body.idempotency_key).toBe('string')
    expect(body.idempotency_key.length).toBeGreaterThan(0)
    expect(body.idempotency_key.length).toBeLessThanOrEqual(128)
  })

  it('honors the KT_CRM_INGEST_URL override', async () => {
    vi.stubEnv('KT_CRM_INGEST_URL', 'https://staging.example.com/ingest')
    fetchMock.mockResolvedValue(okResponse())
    await ingestContact({ email: 'a@b.com' })
    expect(fetchMock.mock.calls[0][0]).toBe('https://staging.example.com/ingest')
  })

  it('does not retry a 4xx and reports the status', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'invalid_ingest_key' }), { status: 401 }),
    )
    const result = await ingestContact({ email: 'a@b.com' })
    expect(result).toEqual({ ok: false, status: 401 })
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('retries once on 5xx with the SAME idempotency_key, then succeeds', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('oops', { status: 503 }))
      .mockResolvedValueOnce(okResponse({ contact_id: 2, action: 'updated', mailable: true }))
    const result = await ingestContact({ email: 'a@b.com' })
    expect(result).toEqual({ ok: true, action: 'updated' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    // identical serialized body => identical idempotency_key across the retry
    expect(fetchMock.mock.calls[0][1].body).toBe(fetchMock.mock.calls[1][1].body)
  })

  it('retries once on a network error, then gives up with ok:false', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    const result = await ingestContact({ email: 'a@b.com' })
    expect(result).toEqual({ ok: false, status: null })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
