import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { LeadSchema } from '@/lib/validation'

export const runtime = 'nodejs'

export async function POST(request: Request): Promise<NextResponse> {
  // Parse JSON body — catch malformed JSON
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

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

  // Validate with Zod schema
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', issues: parsed.error.issues },
      { status: 400 },
    )
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
    // Log but never leak details to client
    console.error('[lead] insert error:', error)
    return NextResponse.json({ error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
