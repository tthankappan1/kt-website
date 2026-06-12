import type { NextConfig } from 'next'

// Static-first: every page is SSG; the only server code is the two
// POST route handlers (/api/lead, /api/newsletter).
const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default nextConfig
