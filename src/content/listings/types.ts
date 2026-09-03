// Listings content model (docs/superpowers/specs/2026-09-03-listings-design.md).
// One typed TS file per listing in this directory; publishing = add file + push.
// `status` alone drives the lifecycle (hero copy, card badge, index order,
// JSON-LD availability). Marking a home sold = edit status (+ soldPrice), push.

export type ListingStatus = 'coming-soon' | 'active' | 'pending' | 'sold'

export type PhotoGroup = 'exterior' | 'living' | 'kitchen' | 'bedrooms' | 'baths' | 'outdoor'

// file is relative to public/images/listings/<slug>/ — replacing a photo with
// the photographer's original = overwrite the file with the same name.
export type ListingPhoto = { file: string; alt: string; group: PhotoGroup }

// date ISO (YYYY-MM-DD); start/end display strings ('1:00 PM').
export type OpenHouse = { date: string; start: string; end: string }

export type Listing = {
  slug: string
  status: ListingStatus
  street: string
  city: string
  state: 'CA'
  zip: string
  neighborhood?: string
  /** List price in USD. Adjust in-file; the page, card, metadata and JSON-LD all read it. */
  price: number
  /** Set once status is 'sold' (optional — omit to show just "Sold"). */
  soldPrice?: number
  beds: number
  baths: number
  sqft: number
  lotSqft?: number
  yearBuilt?: number
  garage?: string
  propertyType: string
  /** ISO date the home went to market — sitemap lastModified + "Just listed" window. */
  listedDate: string
  mls?: string
  /** One-line hook under the address. */
  headline: string
  /** Paragraphs. Use template literals for any string with an apostrophe. */
  description: string[]
  /** Short feature chips. */
  highlights: string[]
  /** Extra "At a glance" rows after the standard facts. */
  facts: [string, string][]
  openHouses?: OpenHouse[]
  /** Photo file used for the hero, the index card and the OG image. Must be in `photos`. */
  hero: string
  photos: ListingPhoto[]
  floorPlans?: { file: string; alt: string }[]
  /** Overrides the Google Maps query (defaults to the full address). */
  mapsQuery?: string
}
