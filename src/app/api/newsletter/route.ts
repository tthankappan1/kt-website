import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NewsletterSchema } from '@/lib/validation'

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
  const parsed = NewsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const { email, sourcePage } = parsed.data

  // Insert into newsletter_signups via service-role client
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from('newsletter_signups').insert({
    email: email.toLowerCase(),
    source_page: sourcePage || null,
  })

  if (error) {
    // Unique violation: idempotent re-signup — treat as success
    if (error.code === '23505') {
      return NextResponse.json({ ok: true }, { status: 200 })
    }
    // All other DB errors: log but never leak details to client
    console.error('[newsletter] insert error:', error)
    return NextResponse.json({ error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
