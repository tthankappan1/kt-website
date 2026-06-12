// Date helpers ported from the prototype (kt-blog-data.jsx).
// Pure string parsing of ISO dates — no Date object, so output never
// shifts with the build machine's timezone.

const KT_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

/** Content is in-repo TS — fail fast at build on a malformed date. */
function month(m: number, input: string): string {
  const name = KT_MONTHS[m - 1]
  if (!name) throw new Error(`Invalid date in content: "${input}" (expected YYYY-MM[-DD])`)
  return name
}

/** '2026-05-29' → 'May 29, 2026' */
export function ktFormatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${month(m, iso)} ${d}, ${y}`
}

/** '2026-05-29' → 'May 29' */
export function ktShortDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${month(m, iso).slice(0, 3)} ${d}`
}

/** '2026-05-29' → 'May 2026' */
export function ktMonthLabel(iso: string): string {
  const [y, m] = iso.split('-').map(Number)
  return `${month(m, iso)} ${y}`
}

/** '2026-05' → 'May' */
export function ktMonthName(key: string): string {
  const [, m] = key.split('-').map(Number)
  return month(m, key)
}
