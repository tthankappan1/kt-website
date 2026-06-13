import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Same static Fraunces TTF used by og-card. NEVER use the variable font —
// satori throws on variable fonts. Top-left-only radius matches the brand
// monogram spec: 13px on a 50px mark → 0.26 ratio → 47px on 180px canvas.
const FONT_PATH = path.join(process.cwd(), 'src/og/fonts/Fraunces-display.ttf')

export default async function AppleIcon() {
  const fraunces = await readFile(FONT_PATH)

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#262623',
          border: '1px solid #C0A278',
          borderTopLeftRadius: 47,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Fraunces',
            fontWeight: 500,
            fontSize: 96,
            letterSpacing: '-3px',
            display: 'flex',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#F3F0EB' }}>K</span>
          <span style={{ color: '#C0A278' }}>T</span>
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Fraunces', data: fraunces, style: 'normal', weight: 500 }],
    },
  )
}
