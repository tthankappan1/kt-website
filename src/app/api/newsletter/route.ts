import { NextResponse } from 'next/server'
import { ingestContact } from '@/lib/kt-crm'
import { NewsletterSchema } from '@/lib/validation'
import { guardWrite, readLimitedJson, WRITE_RATE_LIMIT } from '@/lib/api-guard'

export const runtime = 'nodejs'
export const maxDuration = 25 // two bounded CRM attempts (10s each) + overhead

export async function POST(request: Request): Promise<NextResponse> {
  // Content-type + per-IP rate limit before any work.
  const blocked = guardWrite(request, 'newsletter', WRITE_RATE_LIMIT)
  if (blocked) return blocked

  // Read body with a hard size cap, then parse (rejects 413 / 400 invalid_json).
  const read = await readLimitedJson(request)
  if (!read.ok) return read.response
  const body = read.body

  // Honeypot check: silent drop before schema validation
  if (
    body !== null &&
    typeof body === 'object' &&
    'website' in body &&
    typeof (body as Record<string, unknown>).website === 'string' &&
    ((body as Record<string, unknown>).website as string).length > 0
  ) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  // Validate with Zod schema. Generic error only — do not echo the schema shape.
  const parsed = NewsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 400 })
  }

  const { email, sourcePage } = parsed.data

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
}
