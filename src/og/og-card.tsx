import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Shared branded Open Graph card (1200×630) for the app-level and per-post
// OG images. Brand: charcoal canvas, gold hairline frame with the signature
// top-left-only radius, Fraunces display title, DRE compliance footer.
//
// IMPORTANT: satori (next/og) cannot consume a VARIABLE font — it throws
// "Cannot read properties of undefined (reading '256')". So we ship a STATIC
// Fraunces instance (opsz=144, wght=500, flattened with fonttools) committed
// at src/og/fonts/. Never point this at the variable Fraunces.ttf.

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const FONT_PATH = path.join(process.cwd(), 'src/og/fonts/Fraunces-display.ttf')
const COMPLIANCE = 'Kalyani Thilak · DRE 02254890 · Intero Real Estate Services'
const EYEBROW = 'THE BAY AREA HOME GUIDE'

// Read once per build process (OG routes are statically generated). No
// try/catch: a missing/invalid font is a real build error we want surfaced,
// not silently swallowed into an unbranded card.
async function loadFrauncesDisplay(): Promise<Buffer> {
  return readFile(FONT_PATH)
}

type OgCardOptions = {
  title: string
  titleFontSize?: number
  subtitle?: string
  dateStr?: string
}

export async function renderOgImage({
  title,
  titleFontSize = 58,
  subtitle,
  dateStr,
}: OgCardOptions): Promise<ImageResponse> {
  const fraunces = await loadFrauncesDisplay()

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: '#262623',
          position: 'relative',
        }}
      >
        {/* Hairline frame, inset 24px, top-left-only radius (brand signature) */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            bottom: '24px',
            border: '1px solid #C0A278',
            borderTopLeftRadius: '24px',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '72px 80px 64px 80px',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              color: '#C0A278',
              fontSize: '22px',
              letterSpacing: '4px',
              fontFamily: 'sans-serif',
            }}
          >
            {EYEBROW}
          </span>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '1040px',
              gap: subtitle ? '20px' : '0px',
            }}
          >
            <span
              style={{
                color: '#F3F0EB',
                fontSize: `${titleFontSize}px`,
                lineHeight: 1.12,
                fontFamily: 'Fraunces',
                fontWeight: 500,
              }}
            >
              {title}
            </span>
            {subtitle ? (
              <span
                style={{
                  color: 'rgba(243,240,235,0.78)',
                  fontSize: '28px',
                  lineHeight: 1.3,
                  fontFamily: 'sans-serif',
                }}
              >
                {subtitle}
              </span>
            ) : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
            <span style={{ color: 'rgba(243,240,235,0.78)', fontSize: '20px', fontFamily: 'sans-serif' }}>
              {COMPLIANCE}
            </span>
            {dateStr ? (
              <span style={{ color: '#C0A278', fontSize: '20px', fontFamily: 'sans-serif' }}>{dateStr}</span>
            ) : null}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: 'Fraunces', data: fraunces, style: 'normal', weight: 500 }],
    },
  )
}
