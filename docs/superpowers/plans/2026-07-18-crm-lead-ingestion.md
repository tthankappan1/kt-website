# CRM Lead Ingestion Migration (Issue #6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewire the contact form and homepage email signup to POST server-side to the KT CRM ingestion API, then fully retire the website's Supabase usage (GitHub issue #6).

**Architecture:** The two client components (`contact-form.tsx`, `kt-newsletter.tsx`) keep their existing `/api/lead` and `/api/newsletter` contracts unchanged — only the route handlers' backend changes, swapping the Supabase insert for a server-side fetch to `POST https://kt-crm.onrender.com/api/v1/contacts/ingest` via a new `src/lib/kt-crm.ts` module. Work ships as two PRs matching the issue's ordered retirement: PR 1 = CRM wiring (after a one-time Supabase data export), then after production end-to-end verification, PR 2 = Supabase removal.

**Tech Stack:** Next.js 15 App Router route handlers (nodejs runtime), Zod (existing schemas unchanged), native `fetch` + `AbortSignal.timeout`, Vitest.

## Global Constraints

- No emoji. Anywhere. (CLAUDE.md brand rule 6)
- All four gates green before any commit is "done": `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build`
- Client-visible API contracts are FROZEN: `POST /api/lead` and `POST /api/newsletter` keep the same request bodies and the same responses (`{ok:true}` 200 / `{error:'validation'}` 400 / `{error:'server'}` 500 / 413 / 415 / 429). The two form components are NOT modified.
- The CRM bearer key is a server-only secret: read from `KT_CRM_INGEST_API_KEY` env, never committed, never sent to the browser (`import 'server-only'` in `kt-crm.ts`). The CRM has no CORS by design — calls are server-side only.
- CRM contract (issue #6): `source` must be `"web_signup"`; consent invariant — homepage signup requests `lists: ["newsletter"]` with `consent.basis: "web_form"`; the contact form requests `["market-updates"]` ONLY when a county checkbox is explicitly ticked, otherwise `lists: []` and NO consent claim. Never auto-subscribe.
- Never log submitted PII in route handlers or `kt-crm.ts` — log HTTP status codes only.
- Honeypot field `website` silently drops (200, no CRM call) on both routes — behavior preserved.
- Exported Supabase CSVs contain PII: they are written OUTSIDE the repo (`~/kt-supabase-export/`) and never committed.
- Retirement ordering is HARD (issue #6): export data → ship wiring → verify end-to-end in production → only then remove Supabase code/deps/env.

## Decisions locked in this plan

1. **Checkbox → list mapping:** the contact form's two explicit opt-in checkboxes ("Alameda County market updates", "Contra Costa County market updates") map to the CRM list `market-updates`; which counties were ticked is preserved in `custom_fields.market_update_counties` (e.g. `"alameda, contra-costa"`). Tag slugs are avoided because the CRM's tag vocabulary is not declared in the issue.
2. **`source_detail` values:** `"contact-page"` (lead route) and `"homepage-signup"` (newsletter route), exactly as the issue suggests. The newsletter close section renders on several pages, so the actual page path is preserved in `custom_fields.source_page`.
3. **lastName/phone hack retired:** the CRM has real `last_name`/`phone` fields, so the old "append to message" workaround (a Supabase §7 schema conflict) goes away with this change.
4. **Timeouts:** the CRM is on Render (cold starts can be slow): 10s per attempt, one retry with the SAME `idempotency_key` (UUID per submission, generated server-side), route `maxDuration = 25`.
5. **Retry policy:** retry once on network error / timeout / 5xx; never retry 4xx (deterministic validation/auth failures).
6. **Emails lowercased** before sending (CRM dedups by email; matches the newsletter route's existing behavior).
7. **Vercel env scope:** recommend adding `KT_CRM_INGEST_API_KEY` to Production only, so preview deploys cannot write test noise into the real CRM (preview form submits will return 500 — acceptable).

---

## Phase 1 — Supabase data export (BEFORE switching; owner-gated)

### Task 1: Export existing leads + newsletter signups to CSV

**Files:**
- Create: `<scratchpad>/export-supabase.mjs` (temp location, NOT committed — the repo must not gain new Supabase references; recreate from this plan if the scratchpad is gone)
- Output: `~/kt-supabase-export/leads.csv`, `~/kt-supabase-export/newsletter_signups.csv`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SECRET_KEY` from `.env.local` (does not exist locally yet — owner must run `vercel env pull .env.local` in the repo root, or paste the two values into a new `.env.local` first)
- Produces: two CSVs the owner imports into the CRM via its staff CSV import (declared consent basis chosen at import time)

- [ ] **Step 1: Owner provides env** — `.env.local` does not exist in the repo. Ask the owner to run `vercel env pull .env.local` (or create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY`). BLOCK until present.

- [ ] **Step 2: Write the export script**

```js
// export-supabase.mjs — one-shot export of the kt-website Supabase tables to
// CSV before CRM cutover (issue #6). Reads .env.local from the repo root.
// Usage: node export-supabase.mjs /Users/thilak/github.com/kt-website
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const repoRoot = process.argv[2]
if (!repoRoot) throw new Error('usage: node export-supabase.mjs <repo-root>')

const envPath = join(repoRoot, '.env.local')
if (!existsSync(envPath)) throw new Error(`.env.local not found at ${envPath} — run: vercel env pull .env.local`)
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=["']?(.*?)["']?$/)
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim()
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY
if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY missing from .env.local')
const origin = new URL(url.trim()).origin

async function fetchAll(table) {
  const rows = []
  const page = 1000
  for (let from = 0; ; from += page) {
    const res = await fetch(`${origin}/rest/v1/${table}?select=*&order=created_at.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + page - 1}` },
    })
    if (res.status === 416) break // past the end
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`)
    const batch = await res.json()
    rows.push(...batch)
    if (batch.length < page) break
  }
  return rows
}

function toCsv(rows) {
  if (rows.length === 0) return ''
  const cols = Object.keys(rows[0])
  const esc = (v) =>
    v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replaceAll('"', '""')}"` : String(v)
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n') + '\n'
}

const outDir = join(homedir(), 'kt-supabase-export')
mkdirSync(outDir, { recursive: true })
for (const table of ['leads', 'newsletter_signups']) {
  const rows = await fetchAll(table)
  writeFileSync(join(outDir, `${table}.csv`), toCsv(rows))
  console.log(`${table}: ${rows.length} rows -> ${join(outDir, `${table}.csv`)}`)
}
console.log('Done. CSVs are OUTSIDE the repo; never commit them.')
```

- [ ] **Step 3: Run it**

Run: `node <scratchpad>/export-supabase.mjs /Users/thilak/github.com/kt-website`
Expected: two lines like `leads: N rows -> /Users/thilak/kt-supabase-export/leads.csv`, then `Done.`

- [ ] **Step 4: Report row counts to the owner.** If both are 0, the owner confirms the old data is disposable (issue acceptance item) and no CRM import is needed. Otherwise the owner imports the CSVs via the CRM's staff CSV import (their step; note `newsletter_signups.csv` rows asked for the newsletter — the leads' `newsletter_alameda`/`newsletter_contracosta` columns record market-update opt-ins).

---

## Phase 2 — CRM wiring (branch `feat/crm-ingestion`, PR 1)

### Task 2: `src/lib/kt-crm.ts` — server-only CRM ingest client

**Files:**
- Create: `src/lib/kt-crm.ts`
- Test: `src/lib/__tests__/kt-crm.test.ts`

**Interfaces:**
- Consumes: env `KT_CRM_INGEST_API_KEY` (required at call time, not import time), `KT_CRM_INGEST_URL` (optional override)
- Produces (used by Tasks 3+4):

```ts
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
export function ingestContact(payload: CrmIngestPayload): Promise<CrmIngestResult>
```

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/__tests__/kt-crm.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/lib/__tests__/kt-crm.test.ts`
Expected: FAIL — cannot resolve `@/lib/kt-crm`

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/kt-crm.ts
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
  const body = JSON.stringify({
    source: 'web_signup',
    idempotency_key: crypto.randomUUID(),
    ...payload,
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
    } catch {
      console.error('[kt-crm] ingest attempt failed (timeout/network)', last ? '(giving up)' : '(retrying)')
    }
  }
  return { ok: false, status: null }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/lib/__tests__/kt-crm.test.ts`
Expected: 6 passing

- [ ] **Step 5: Commit**

```bash
git add src/lib/kt-crm.ts src/lib/__tests__/kt-crm.test.ts
git commit -m "feat(crm): server-only KT CRM ingest client with timeout + idempotent retry (#6)"
```

### Task 3: Rewire `POST /api/newsletter` to the CRM

**Files:**
- Modify: `src/app/api/newsletter/route.ts` (full rewrite of the backend half)
- Test: `src/app/api/newsletter/__tests__/route.test.ts` (replace the Supabase mock)

**Interfaces:**
- Consumes: `ingestContact(payload: CrmIngestPayload): Promise<CrmIngestResult>` from Task 2
- Produces: unchanged public contract — `{ok:true}` 200 / `{error:'validation'}` 400 / `{error:'server'}` 500 / 413 / 415 / 429

- [ ] **Step 1: Update the test file** — replace the `vi.mock('@/lib/supabase-admin', …)` block and the two DB-error tests:

```ts
// Top of src/app/api/newsletter/__tests__/route.test.ts — replaces insertMock + supabase mock
const ingestMock = vi.fn()

vi.mock('@/lib/kt-crm', () => ({
  ingestContact: (payload: unknown) => ingestMock(payload),
}))
```

Rewrite the assertions (same test names/structure as the existing file; `insertMock` → `ingestMock` throughout, including the honeypot/validation/malformed/415/rate-limit tests which now assert `ingestMock` was not called):

```ts
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
```

- [ ] **Step 2: Run to verify the new assertions fail**

Run: `pnpm vitest run src/app/api/newsletter`
Expected: FAIL — route still calls Supabase; `ingestMock` never invoked

- [ ] **Step 3: Rewrite the route backend** — in `src/app/api/newsletter/route.ts`: replace the `getSupabaseAdmin` import with `import { ingestContact } from '@/lib/kt-crm'`, set `export const maxDuration = 25 // two bounded CRM attempts (10s each) + overhead`, keep guard/honeypot/validation identical, and replace everything after `const { email, sourcePage } = parsed.data` with:

```ts
  // Homepage signup IS an explicit newsletter request (issue #6 consent rule):
  // request the newsletter list with web_form consent. The CRM upserts repeat
  // signups (action: "updated") — both actions are success for the visitor.
  const result = await ingestContact({
    email: email.toLowerCase(),
    lists: ['newsletter'],
    consent: { basis: 'web_form' },
    source_detail: 'homepage-signup',
    ...(sourcePage ? { custom_fields: { source_page: sourcePage } } : {}),
  })

  if (!result.ok) {
    return NextResponse.json({ error: 'server' }, { status: 500 })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/app/api/newsletter`
Expected: all passing

- [ ] **Step 5: Commit**

```bash
git add src/app/api/newsletter
git commit -m "feat(newsletter): ingest signups into KT CRM instead of Supabase (#6)"
```

### Task 4: Rewire `POST /api/lead` to the CRM

**Files:**
- Modify: `src/app/api/lead/route.ts`
- Test: `src/app/api/lead/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `ingestContact` from Task 2
- Produces: unchanged public contract (same as Task 3)

- [ ] **Step 1: Update the test file** — same mock swap as Task 3 (`ingestMock` + `vi.mock('@/lib/kt-crm', …)`), keep honeypot/validation/malformed/415/rate-limit tests (assert `ingestMock` not called), and replace the insert-shape tests with:

```ts
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
```

- [ ] **Step 2: Run to verify the new assertions fail**

Run: `pnpm vitest run src/app/api/lead`
Expected: FAIL

- [ ] **Step 3: Rewrite the route backend** — swap the import to `ingestContact`, set `maxDuration = 25`, keep guard/honeypot/validation identical, delete the "append lastName/phone to message" block (the CRM has real columns), and replace everything after destructuring `parsed.data` with:

```ts
  // Consent invariant (issue #6): an inquiry is NOT marketing consent. Request
  // the market-updates list ONLY when a county checkbox was explicitly ticked.
  const counties = [
    ...(newsletterAlameda ? ['alameda'] : []),
    ...(newsletterContracosta ? ['contra-costa'] : []),
  ]
  const lists = counties.length > 0 ? ['market-updates'] : []

  const customFields: Record<string, string> = { intent }
  if (timeframe) customFields.timeframe = timeframe
  if (message) customFields.message = message
  if (sourcePage) customFields.source_page = sourcePage
  if (counties.length > 0) customFields.market_update_counties = counties.join(', ')

  const result = await ingestContact({
    email: email.toLowerCase(),
    first_name: firstName,
    ...(lastName ? { last_name: lastName } : {}),
    ...(phone ? { phone } : {}),
    contact_type: 'lead',
    source_detail: 'contact-page',
    lists,
    ...(lists.length > 0 ? { consent: { basis: 'web_form' } } : {}),
    custom_fields: customFields,
  })

  if (!result.ok) {
    return NextResponse.json({ error: 'server' }, { status: 500 })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/app/api/lead`
Expected: all passing

- [ ] **Step 5: Commit**

```bash
git add src/app/api/lead
git commit -m "feat(lead): ingest contact-form submissions into KT CRM instead of Supabase (#6)"
```

### Task 5: Env documentation + gates + PR 1

**Files:**
- Modify: `.env.local.example` (add CRM block at top; Supabase block STAYS until Phase 4)

- [ ] **Step 1: Add the CRM env block** at the top of `.env.local.example`, directly under the first comment line:

```
# KT CRM ingestion (issue #6): both lead-capture forms forward server-side to
# the CRM. The bearer key is a server-only secret — never NEXT_PUBLIC_, never
# committed. The CRM has no CORS (deliberate); calls only work server-side.
KT_CRM_INGEST_API_KEY=
# Optional override; defaults to https://kt-crm.onrender.com/api/v1/contacts/ingest
KT_CRM_INGEST_URL=
```

- [ ] **Step 2: Run all four gates**

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
Expected: all green

- [ ] **Step 3: Commit + open PR 1**

```bash
git add .env.local.example
git commit -m "docs(env): document KT_CRM_INGEST_API_KEY / KT_CRM_INGEST_URL (#6)"
git push -u origin feat/crm-ingestion
gh pr create --title "Rewire contact + newsletter forms to KT CRM ingestion API" \
  --body "First half of #6: both write routes now forward to the CRM ingest endpoint server-side. Supabase code remains (unreferenced) until production verification, per the issue's ordered retirement. Client components and public API contracts unchanged.

Refs #6 (do not auto-close)

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Phase 3 — Deploy + end-to-end verification (owner-gated; do NOT proceed to Phase 4 without it)

- [ ] Owner adds `KT_CRM_INGEST_API_KEY` in Vercel (Production env; see locked decision 7) — value never touches the repo.
- [ ] Merge PR 1; wait for the production deploy.
- [ ] Submit the homepage newsletter form on https://www.kalyanithilak.com with a test email → owner confirms the contact appears in the CRM console with `source_detail: homepage-signup`, subscribed-request for `newsletter`, `mailable` as expected.
- [ ] Submit the contact form (https://www.kalyanithilak.com/contact) once WITHOUT checkboxes and once WITH a county checkbox → owner confirms `source_detail: contact-page`, no list request on the first, `market-updates` request on the second, and `custom_fields` populated (intent, message, counties).
- [ ] Re-submit the same email → CRM shows `action: updated` (no duplicate).
- [ ] Owner confirms the exported CSVs (Phase 1) were imported into the CRM or declared disposable.

## Phase 4 — Supabase removal (branch `chore/retire-supabase`, PR 2)

### Task 6: Remove all Supabase code, deps, env, and docs references

**Files:**
- Delete: `src/lib/supabase-admin.ts`, `src/lib/__tests__/supabase-admin.test.ts`, `supabase/` (entire directory, both migrations)
- Modify: `package.json` (drop `@supabase/ssr`, `@supabase/supabase-js` — verified unreferenced in `src/` beyond `supabase-admin.ts`), `.env.local.example`, `CLAUDE.md`, `docs/HANDOFF.md`

**Interfaces:**
- Consumes: nothing from other tasks (routes already stopped importing Supabase in Phase 2)
- Produces: a repo with zero Supabase references, so the owner can delete the Supabase project

- [ ] **Step 1: Delete code + deps**

```bash
git rm src/lib/supabase-admin.ts src/lib/__tests__/supabase-admin.test.ts
git rm -r supabase
pnpm remove @supabase/ssr @supabase/supabase-js
```

- [ ] **Step 2: Purge Supabase from `.env.local.example`** — delete the entire Supabase comment block and the three vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (the CRM block from Task 5 plus `RESEND_API_KEY`/`SHOW_DRAFTS` remain).

- [ ] **Step 3: Update `CLAUDE.md`** — in "Architecture (locked)", replace the two Supabase bullets (the "**Supabase schema is locked**…" bullet and the "**Supabase keys: use the NEW API keys**…" bullet including its "Known conflict, decided" sub-bullet) with:

```markdown
- **Lead capture → KT CRM** (issue #6, 2026-07): both forms POST to the site's
  own route handlers (`/api/lead`, `/api/newsletter`), which forward
  server-side to the KT CRM ingestion API
  (`POST https://kt-crm.onrender.com/api/v1/contacts/ingest`; bearer
  `KT_CRM_INGEST_API_KEY`, optional `KT_CRM_INGEST_URL` override — both
  server-only; the CRM has no CORS, deliberately). Zod-validate everything;
  honeypot field `website` on both forms. Consent invariant: the homepage
  signup requests `lists: ["newsletter"]`; the contact form requests
  `["market-updates"]` ONLY when a county checkbox is ticked — never
  auto-subscribe. lastName/phone now map to real CRM fields (the old
  append-to-message workaround is retired). Supabase is fully retired; the
  repo must not reference it.
```

- [ ] **Step 4: Update `docs/HANDOFF.md`** — read it, remove/replace the Supabase key-scheme sections with a short note pointing at the CLAUDE.md bullet above (same facts: CRM endpoint, two env vars, consent rules). Also delete the stale "Supabase keys" cross-reference in the CLAUDE.md bullet you replaced if HANDOFF.md is referenced there.

- [ ] **Step 5: Verify zero references + run gates**

Run: `grep -ri supabase src scripts supabase package.json .env.local.example CLAUDE.md docs/HANDOFF.md 2>/dev/null | grep -v Binary`
Expected: no output (historical mentions inside `design_handoff_kt_website/` and old plan docs in `docs/superpowers/` are archives and stay).

Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
Expected: all green

- [ ] **Step 6: Commit + PR 2**

```bash
git add -A
git commit -m "chore: retire Supabase — CRM is the only lead path (#6)"
git push -u origin chore/retire-supabase
gh pr create --title "Retire Supabase (lead capture now via KT CRM)" \
  --body "Second half of #6: removes the Supabase client, tests, migrations, deps, and env docs now that CRM ingestion is verified in production.

Closes #6

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

### Task 7: Post-merge owner steps + bookkeeping

- [ ] Owner deletes `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` from Vercel env (all environments) and from local `.env.local`.
- [ ] Owner deletes the Supabase project (their console; the repo no longer references it).
- [ ] Verify issue #6's acceptance checklist is fully satisfied and the issue auto-closed with PR 2 (comment with the verification evidence if not).
- [ ] Update assistant memory: `kt-website-build-state.md` (lead path is now CRM), `kt-website-spec-conflicts.md` (lastName/phone→message decision retired), and the `MEMORY.md` index lines.
