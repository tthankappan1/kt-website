import type { ReactNode } from 'react'

// Inline *italic* / **bold** renderer ported from the prototype's ktInline.
// Titles pass emClass="kt-em" for the brand's gold-italic emphasis.

const EMPHASIS_RE = /(\*\*[^*]+\*\*|\*[^*]+\*)/g

export function KtInline({ text, emClass }: { text: string; emClass?: string }) {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  for (const m of text.matchAll(EMPHASIS_RE)) {
    const index = m.index ?? 0
    if (index > last) out.push(text.slice(last, index))
    const s = m[0]
    if (s.startsWith('**')) {
      out.push(<strong key={`b${key++}`}>{s.slice(2, -2)}</strong>)
    } else {
      out.push(
        <em key={`i${key++}`} className={emClass}>
          {s.slice(1, -1)}
        </em>,
      )
    }
    last = index + s.length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

/** Strip emphasis markers for plain-text contexts (titles in meta, aria, prev/next cards). */
export function ktPlain(text: string): string {
  return String(text).split('*').join('')
}
