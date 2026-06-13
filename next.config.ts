import type { NextConfig } from 'next'

// Static-first: every page is SSG; the only server code is the two POST route
// handlers (/api/lead, /api/newsletter).

// Content-Security-Policy. The high-value directives are locked down
// (frame-ancestors, object-src, base-uri, form-action, default-src). script/
// style allow 'unsafe-inline' because Next.js SSG injects inline hydration
// scripts and Tailwind/Next inject inline styles, and a static site cannot use
// per-request nonces. This is an accepted, documented trade-off — there are no
// HTML-injection sinks in the app (no dangerouslySetInnerHTML; the inline
// renderer builds React elements). connect-src stays 'self' because Supabase
// is only ever called server-side.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // do not advertise X-Powered-By: Next.js
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
