// NOTE: Fraunces.ttf in src/assets/fonts/ is a variable font (contains fvar/gvar tables).
// Satori (used by next/og ImageResponse) does NOT support variable fonts — it throws
// "Cannot read properties of undefined (reading '256')" when a variable TTF is passed.
// We attempted to load it (readFile path below), but catch the error and fall back to
// the satori default font for all text rendering. This is documented as DONE_WITH_CONCERNS.

import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPublishedPosts, getPost } from '@/content/posts'
import { ktPlain } from '@/lib/inline'
import { ktFormatDate } from '@/lib/dates'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }))
}

// Attempt to load Fraunces variable font — satori rejects variable fonts;
// this returns null and we omit the fonts option so satori uses its built-in default.
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

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  const frauncesData = await tryLoadFraunces()
  const options = buildOptions(frauncesData)

  if (!post) {
    // Minimal branded fallback card
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '1200px',
            height: '630px',
            background: '#262623',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
          <span
            style={{
              color: '#C0A278',
              fontSize: '28px',
              letterSpacing: '4px',
              fontFamily: 'sans-serif',
            }}
          >
            THE BAY AREA HOME GUIDE
          </span>
        </div>
      ),
      options,
    )
  }

  const title = ktPlain(post.title)
  const dateStr = ktFormatDate(post.date)

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

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '1000px',
              overflow: 'hidden',
              maxHeight: '280px',
            }}
          >
            <span
              style={{
                color: '#F3F0EB',
                fontSize: '58px',
                lineHeight: '1.15',
                fontFamily: frauncesData ? 'Fraunces' : 'serif',
                fontWeight: 700,
                wordBreak: 'break-word',
              }}
            >
              {title}
            </span>
          </div>

          {/* Footer row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '24px',
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
            <span
              style={{
                color: '#C0A278',
                fontSize: '20px',
                fontFamily: 'sans-serif',
              }}
            >
              {dateStr}
            </span>
          </div>
        </div>
      </div>
    ),
    options,
  )
}
