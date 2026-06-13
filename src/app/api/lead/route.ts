import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { LeadSchema } from '@/lib/validation'
import { guardWrite, readLimitedJson, WRITE_RATE_LIMIT } from '@/lib/api-guard'

export const runtime = 'nodejs'

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

  // Build final message: append lastName/phone in a delimited block when present
  // (these fields have no §7 columns — CLAUDE.md documented decision)
  let finalMessage = message
  const extras: string[] = []
  if (lastName) extras.push(`Last name: ${lastName}`)
  if (phone) extras.push(`Phone: ${phone}`)
  if (extras.length > 0) {
    finalMessage = (finalMessage ? finalMessage + '\n\n' : '') + '—\n' + extras.join('\n')
  }

  // Insert into leads via service-role client
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('leads').insert({
    intent,
    timeframe: timeframe || null,
    first_name: firstName,
    email,
    message: finalMessage || null,
    newsletter_alameda: newsletterAlameda,
    newsletter_contracosta: newsletterContracosta,
    source_page: sourcePage || null,
  })

  if (error) {
    // Log only code + message (never the full error / submitted row, which can
    // echo lead PII into platform logs); never leak details to the client.
    console.error('[lead] insert error:', error.code, error.message)
    return NextResponse.json({ error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
