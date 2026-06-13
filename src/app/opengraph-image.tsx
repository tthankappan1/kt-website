import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/og/og-card'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Kalyani Thilak — Tri-Valley Real Estate'

export default async function Image() {
  return renderOgImage({
    title: 'Kalyani Thilak',
    titleFontSize: 72,
    subtitle: 'Tri-Valley Real Estate · Pleasanton · Dublin · San Ramon · Livermore',
  })
}
