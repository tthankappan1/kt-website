import { NextResponse } from 'next/server'
import { rateLimit } from './rate-limit'

// Shared guards for the public write endpoints (lead, newsletter).
// guardWrite() enforces JSON content-type + per-IP rate limiting from headers
// (no body consumption). readLimitedJson() bounds the actual body size and
// parses — checking real bytes rather than trusting the Content-Length header
// a client can omit or spoof.

const MAX_BODY_BYTES = 16 * 1024 // 16KB — these payloads are tiny; larger is abuse

export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export function guardWrite(
  req: Request,
  name: string,
  opts: { limit: number; windowMs: number },
): NextResponse | null {
  const contentType = (req.headers.get('content-type') ?? '').toLowerCase()
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'unsupported_media_type' }, { status: 415 })
  }

  const result = rateLimit(`${name}:${clientIp(req)}`, opts)
  if (!result.ok) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(result.retryAfterSec) } },
    )
  }

  return null
}

type ReadResult = { ok: true; body: unknown } | { ok: false; response: NextResponse }

export async function readLimitedJson(req: Request, maxBytes = MAX_BODY_BYTES): Promise<ReadResult> {
  // Fast-path: reject on a declared length over the cap before buffering.
  const declared = Number(req.headers.get('content-length') ?? '0')
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, response: NextResponse.json({ error: 'payload_too_large' }, { status: 413 }) }
  }
  // Authoritative check on the actual bytes (header may be absent or wrong).
  const text = await req.text()
  if (Buffer.byteLength(text) > maxBytes) {
    return { ok: false, response: NextResponse.json({ error: 'payload_too_large' }, { status: 413 }) }
  }
  try {
    return { ok: true, body: JSON.parse(text) }
  } catch {
    return { ok: false, response: NextResponse.json({ error: 'invalid_json' }, { status: 400 }) }
  }
}

// Window shared by both write endpoints: a genuine visitor submits once;
// 5 per 10 minutes per IP leaves ample headroom while stopping scripted floods.
export const WRITE_RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }
