import { describe, expect, it } from 'vitest'
import { clientIp } from '@/lib/api-guard'

function reqWith(headers: Record<string, string>): Request {
  return new Request('http://test/api/x', { method: 'POST', headers })
}

describe('clientIp (trusted-position IP derivation)', () => {
  it('prefers x-real-ip (edge-set) over x-forwarded-for', () => {
    expect(clientIp(reqWith({ 'x-real-ip': '203.0.113.5', 'x-forwarded-for': '1.2.3.4' }))).toBe(
      '203.0.113.5',
    )
  })

  it('never trusts the client-controlled leftmost XFF token — uses the rightmost hop', () => {
    // Attacker prepends a spoofed value; the trusted proxy appends the real one.
    expect(clientIp(reqWith({ 'x-forwarded-for': 'evil-spoof, 9.9.9.9, 203.0.113.7' }))).toBe(
      '203.0.113.7',
    )
  })

  it('falls back to "unknown" when no proxy headers are present', () => {
    expect(clientIp(reqWith({}))).toBe('unknown')
  })
})
