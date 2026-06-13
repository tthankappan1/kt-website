import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NewsletterSchema } from '@/lib/validation'
import { guardWrite, readLimitedJson, WRITE_RATE_LIMIT } from '@/lib/api-guard'

export const runtime = 'nodejs'
export const maxDuration = 10 // bound a hung Supabase call (one tiny insert; normally <1s)

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

  // Insert into newsletter_signups via the secret-key admin client (service_role, bypasses RLS)
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
    // All other DB errors: log only code + message; never leak to client.
    console.error('[newsletter] insert error:', error.code, error.message)
    return NextResponse.json({ error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
