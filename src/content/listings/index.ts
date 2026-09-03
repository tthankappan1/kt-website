import type { Listing, ListingStatus, OpenHouse, PhotoGroup } from './types'
import { covington553 } from './553-covington-way-livermore'

export type { Listing, ListingStatus, ListingPhoto, PhotoGroup, OpenHouse } from './types'

// Add new listings here. Order does not matter — getListings() sorts.
export const LISTINGS: Listing[] = [covington553]

export const STATUS_LABEL: Record<ListingStatus, string> = {
  active: 'For sale',
  'coming-soon': 'Coming soon',
  pending: 'Pending',
  sold: 'Sold',
}

const STATUS_RANK: Record<ListingStatus, number> = {
  active: 0,
  'coming-soon': 1,
  pending: 2,
  sold: 3,
}

export const STATUS_ORDER: ListingStatus[] = ['active', 'coming-soon', 'pending', 'sold']

export const GROUP_ORDER: PhotoGroup[] = ['exterior', 'living', 'kitchen', 'bedrooms', 'baths', 'outdoor']

export const GROUP_LABEL: Record<PhotoGroup, string> = {
  exterior: 'The exterior',
  living: 'Living room',
  kitchen: 'Kitchen & dining',
  bedrooms: 'Bedrooms',
  baths: 'Baths',
  outdoor: 'Outdoor',
}

// Active first, then coming soon, pending, sold; newest listedDate first within a group.
export function sortListings(list: Listing[]): Listing[] {
  return [...list].sort(
    (a, b) =>
      STATUS_RANK[a.status] - STATUS_RANK[b.status] || b.listedDate.localeCompare(a.listedDate),
  )
}

export function getListings(): Listing[] {
  return sortListings(LISTINGS)
}

export function getListing(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug)
}

export function listingPath(slug: string): string {
  return '/listings/' + slug
}

export function listingAddress(l: Listing): string {
  return `${l.street}, ${l.city}, ${l.state} ${l.zip}`
}

export function photoSrc(l: Listing, file: string): string {
  return `/images/listings/${l.slug}/${file}`
}

export function formatPrice(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

export function formatSqft(n: number): string {
  return n.toLocaleString('en-US') + ' sq ft'
}

export function statLine(l: Listing): string {
  const parts = [`${l.beds} bd`, `${l.baths} ba`, formatSqft(l.sqft)]
  if (l.lotSqft) parts.push(formatSqft(l.lotSqft) + ' lot')
  return parts.join(' · ')
}

const JUST_LISTED_DAYS = 21

// Hero eyebrow: "Just listed" for the first three weeks of an active listing,
// then the plain status label. `today` is injectable for tests; at build time
// it is the build date (pages are SSG, so copy refreshes on the next deploy).
export function heroLabel(l: Listing, today: Date = new Date()): string {
  if (l.status !== 'active') return STATUS_LABEL[l.status]
  const listed = new Date(l.listedDate + 'T00:00:00Z').getTime()
  const days = (today.getTime() - listed) / 86_400_000
  return days <= JUST_LISTED_DAYS ? 'Just listed' : STATUS_LABEL.active
}

export function mapsUrl(l: Listing): string {
  const q = l.mapsQuery ?? listingAddress(l)
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q)
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

/** { date: '2026-09-06', start: '1:00 PM', end: '4:00 PM' } → 'Sat, Sep 6 · 1:00–4:00 PM' */
export function openHouseLabel(oh: OpenHouse): string {
  const [y, m, d] = oh.date.split('-').map(Number)
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  const month = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  const suffix = oh.end.match(/\s?[AP]M$/i)?.[0]
  const start = suffix && oh.start.toUpperCase().endsWith(suffix.trim().toUpperCase())
    ? oh.start.slice(0, oh.start.length - suffix.length)
    : oh.start
  return `${weekday}, ${month} ${d} · ${start}–${oh.end}`
}

// Open houses on or after today's date (UTC calendar day — pages are SSG, so
// this resolves at build time; an open house drops off on the next deploy).
export function upcomingOpenHouses(l: Listing, today: Date = new Date()): OpenHouse[] {
  const iso = today.toISOString().slice(0, 10)
  return (l.openHouses ?? []).filter((oh) => oh.date >= iso)
}
