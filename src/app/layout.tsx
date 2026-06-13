import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { SITE_URL } from '@/lib/site'
import './globals.css'

// Brand-locked typography (CLAUDE.md hard rule): Fraunces display + Inter body.
// Fraunces keeps its optical-size axis — the type roles in globals.css set
// font-variation-settings "opsz" per role.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Kalyani Thilak — Tri-Valley Real Estate',
    template: '%s — Kalyani Thilak',
  },
  description:
    'Luxury Tri-Valley real estate, with clarity at every step — calm, data-grounded guidance for buyers and sellers in Pleasanton, Dublin, San Ramon, and Livermore.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="kt-skip">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
