export const KT_BLOG_CATS = ['Market Update', 'Neighborhoods', 'Buying', 'Selling', 'Lifestyle'] as const
export type PostCategory = (typeof KT_BLOG_CATS)[number]
// Charts are data-only; all styling lives in the site components (content repo never ships presentation).
// unit is a display hint: '$' prefixes, '%' suffixes, anything else renders as a suffixed word.
export type ChartSeries = { label: string; unit?: string; points: { x: string; y: number }[] }
export type ChartSpec =
  | { kind: 'line'; title: string; source?: string; note?: string; series: ChartSeries[] }
  | { kind: 'bar'; title: string; source?: string; note?: string; unit?: string; bars: { label: string; value: number }[] }
// image.src is a public URL path (ingest emits /images/posts/<slug>/<file>); a missing file renders nothing (never blocks publish).
export type PostImage = { src: string; alt: string; caption?: string }
export type PostBlock =
  | string
  | { h: string }
  | { list: string[] }
  | { cta: string }
  | { disclaimer: string }
  | { sources: { t: string; href: string }[] }
  | { chart: ChartSpec }
  | { image: PostImage }
export type Post = { slug: string; title: string; category: PostCategory; date: string; excerpt: string; cover?: boolean; draft?: boolean; body: PostBlock[] }
