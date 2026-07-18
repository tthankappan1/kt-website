import { NextResponse } from 'next/server'
import { ingestContact } from '@/lib/kt-crm'
import { LeadSchema } from '@/lib/validation'
import { guardWrite, readLimitedJson, WRITE_RATE_LIMIT } from '@/lib/api-guard'

export const runtime = 'nodejs'
export const maxDuration = 25 // two bounded CRM attempts (10s each) + overhead

export async function POST(request: Request): Promise<NextResponse> {
  // Content-type + per-IP rate limit before any work.
  const blocked = guardWrite(request, 'lead', WRITE_RATE_LIMIT)
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

  // Validate with Zod schema. Return only a generic error to the client —
  // do not echo the schema shape (field names, enum members, limits).
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 400 })
  }

  const {
    intent,
    timeframe,
    firstName,
    lastName,
    email,
    phone,
    message,
    newsletterAlameda,
    newsletterContracosta,
    sourcePage,
  } = parsed.data

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
}
