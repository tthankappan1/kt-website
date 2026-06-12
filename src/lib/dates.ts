// Date helpers ported from the prototype (kt-blog-data.jsx).
// Pure string parsing of ISO dates — no Date object, so output never
// shifts with the build machine's timezone.

const KT_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

/** '2026-05-29' → 'May 29, 2026' */
export function ktFormatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${KT_MONTHS[m - 1]} ${d}, ${y}`
}

/** '2026-05-29' → 'May 29' */
export function ktShortDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${KT_MONTHS[m - 1].slice(0, 3)} ${d}`
}

/** '2026-05-29' → 'May 2026' */
export function ktMonthLabel(iso: string): string {
  const [y, m] = iso.split('-').map(Number)
  return `${KT_MONTHS[m - 1]} ${y}`
}

/** '2026-05' → 'May' */
export function ktMonthName(key: string): string {
  const [, m] = key.split('-').map(Number)
  return KT_MONTHS[m - 1]
}
