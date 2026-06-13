// NOTE: Fraunces.ttf in src/assets/fonts/ is a variable font (contains fvar/gvar tables).
// Satori (used by next/og ImageResponse) does NOT support variable fonts.
// We fall back to the satori built-in default font if Fraunces cannot be embedded.

import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function tryLoadFraunces(): Promise<ArrayBuffer | null> {
  try {
    const buf = await readFile(path.join(process.cwd(), 'src/assets/fonts/Fraunces.ttf'))
    if (buf.byteLength === 0) return null
    return buf.buffer as ArrayBuffer
  } catch {
    return null
  }
}

function buildOptions(frauncesData: ArrayBuffer | null) {
  if (!frauncesData) return size
  return {
    ...size,
    fonts: [{ name: 'Fraunces', data: frauncesData, style: 'normal' as const, weight: 700 as const }],
  }
}

export default async function Image() {
  const frauncesData = await tryLoadFraunces()
  const options = buildOptions(frauncesData)

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
          padding: '0px',
        }}
      >
        {/* Hairline border inset 24px, top-left-only radius 24 */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            inset: '24px',
            border: '1px solid #C0A278',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '72px 80px 64px 80px',
            justifyContent: 'space-between',
          }}
        >
          {/* Eyebrow */}
          <span
            style={{
              color: '#C0A278',
              fontSize: '22px',
              letterSpacing: '4px',
              fontFamily: 'sans-serif',
              textTransform: 'uppercase',
            }}
          >
            THE BAY AREA HOME GUIDE
          </span>

          {/* Main title block */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '1000px',
              gap: '20px',
            }}
          >
            <span
              style={{
                color: '#F3F0EB',
                fontSize: '72px',
                lineHeight: '1.1',
                fontFamily: frauncesData ? 'Fraunces' : 'serif',
                fontWeight: 700,
              }}
            >
              Kalyani Thilak
            </span>
            <span
              style={{
                color: 'rgba(243,240,235,0.78)',
                fontSize: '28px',
                fontFamily: 'sans-serif',
                lineHeight: '1.3',
              }}
            >
              Tri-Valley Real Estate · Pleasanton · Dublin · San Ramon · Livermore
            </span>
          </div>

          {/* Footer row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: 'rgba(243,240,235,0.78)',
                fontSize: '20px',
                fontFamily: 'sans-serif',
              }}
            >
              Kalyani Thilak · DRE 02254890 · Intero Real Estate Services
            </span>
          </div>
        </div>
      </div>
    ),
    options,
  )
}
