import 'server-only'

// Server-side client for the KT CRM contact-ingestion endpoint (issue #6).
// The bearer key is a server-only secret and the CRM has no CORS on purpose —
// this module must only ever run inside route handlers. Never log payloads
// (lead PII); log HTTP status codes only.

const DEFAULT_INGEST_URL = 'https://kt-crm.onrender.com/api/v1/contacts/ingest'
const ATTEMPT_TIMEOUT_MS = 10_000 // CRM is on Render; cold starts are slow

export type CrmIngestPayload = {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  contact_type?: 'lead' | 'client' | 'past_client'
  source_detail?: string
  lists?: string[]
  consent?: { basis: 'web_form' }
  custom_fields?: Record<string, string>
}

export type CrmIngestResult =
  | { ok: true; action: 'created' | 'updated' }
  | { ok: false; status: number | null }

export async function ingestContact(payload: CrmIngestPayload): Promise<CrmIngestResult> {
  const key = process.env.KT_CRM_INGEST_API_KEY
  if (!key) {
    console.error('[kt-crm] KT_CRM_INGEST_API_KEY is not set')
    return { ok: false, status: null }
  }
  const url = process.env.KT_CRM_INGEST_URL || DEFAULT_INGEST_URL

  // One retry with the SAME idempotency_key is safe per the CRM contract.
  // Pinned fields go last so a payload key can never override them.
  const body = JSON.stringify({
    ...payload,
    source: 'web_signup',
    idempotency_key: crypto.randomUUID(),
  })

  for (let attempt = 0; attempt < 2; attempt++) {
    const last = attempt === 1
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
        cache: 'no-store',
        // A cross-origin redirect would strip the Authorization header and
        // could convert POST to GET — fail loudly instead of silently.
        redirect: 'error',
      })
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { action?: string } | null
        return { ok: true, action: data?.action === 'updated' ? 'updated' : 'created' }
      }
      if (res.status < 500) {
        // Deterministic rejection (validation / bad key) — retrying cannot help.
        console.error('[kt-crm] ingest rejected:', res.status)
        return { ok: false, status: res.status }
      }
      console.error('[kt-crm] ingest 5xx:', res.status, last ? '(giving up)' : '(retrying)')
    } catch (err) {
      console.error(
        '[kt-crm] ingest attempt failed:',
        err instanceof Error ? err.name : 'unknown',
        last ? '(giving up)' : '(retrying)',
      )
    }
  }
  return { ok: false, status: null }
}
