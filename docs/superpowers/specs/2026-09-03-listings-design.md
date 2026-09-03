# Listings section — design spec

**Date:** 2026-09-03
**Status:** Approved by owner in chat 2026-09-03 (URL scheme, dropdown placement, redirect narrowing, page structure, lifecycle field, PR-then-owner-merge).
**Goal:** Host Kalyani's active listings on kalyanithilak.com instead of the photographer's Aryeo site, so listing traffic stays on our domain. First listing: 553 Covington Way, Livermore (goes to market 2026-09-03). Speed to live is the priority; the data model must survive future listings and the active → pending → sold lifecycle.

## Source facts (owner-supplied, from the MLS via Zillow screenshot)

- $890,000 · 3 bed · 2 bath · 1,130 sq ft · built 1969 · 6,000 sq ft lot · Summerset, Livermore · single-family · no HOA · offered as-is.
- Description: Kalyani's MLS copy, used verbatim except the square-footage placeholder "[1,250]" is reconciled to the MLS field (1,130). Owner confirms before merge.
- Photos: 27 photos + 2 floor plans from `media.joxinc.com/sites/553-covington-way-livermore-ca-94551-28362152/branded` (2048px renditions). Owner will replace with originals later.
- Not supplied (omitted, fields exist): open house dates, MLS number.

## Routes

| Route | Type | Notes |
|---|---|---|
| `/listings` | SSG | Index. Dark hero, cards grouped Active → Coming soon → Pending → Sold. Empty-state copy when none. |
| `/listings/<slug>` | SSG via `generateStaticParams` | Listing page. `dynamicParams = false`. |

**Redirect conflict.** `next.config.ts` currently 308s `/listings/:path*` → `/` (stale RealGeeks IDX URLs, all two segments deep: `/listings/city/<City>`, `/listings/subdivision/<Name>`). Narrow to `/listings/:section/:path+` → `/` so legacy links still land home and our one-segment listing pages resolve. Redirect test updated to assert the narrowed source.

## Navigation

- `CLIENT_RESOURCES` gains `{ label: 'Listings', href: '/listings' }` as the **first** item (10 items). Desktop dropdown and mobile menu read from the same array; tests updated from 9 → 10.
- No top-level nav link in v1 (desktop nav is width-tight; listing URLs are shared directly).
- Sitemap: `/listings` (weekly, 0.8) and each listing (`lastModified` = listedDate, 0.8).

## Content model — `src/content/listings/`

One typed TS file per listing (publish = add file + push, same as posts). `types.ts`:

```ts
export type ListingStatus = 'coming-soon' | 'active' | 'pending' | 'sold'
export type ListingPhoto = { file: string; alt: string; group: PhotoGroup }
export type PhotoGroup = 'exterior' | 'living' | 'kitchen' | 'bedrooms' | 'baths' | 'outdoor'
export type OpenHouse = { date: string; start: string; end: string }   // ISO date, 'h:mm a' strings
export type Listing = {
  slug: string
  status: ListingStatus
  street: string; city: string; state: 'CA'; zip: string
  neighborhood?: string
  price: number                 // list price in USD; adjustable in-file
  soldPrice?: number            // set when status = 'sold'
  beds: number; baths: number; sqft: number; lotSqft?: number; yearBuilt?: number
  garage?: string               // e.g. 'Attached 2-car'
  propertyType: string          // 'Single-family home'
  listedDate: string            // ISO date
  mls?: string
  headline: string              // one-line hook under the address
  description: string[]         // paragraphs
  highlights: string[]          // short feature chips
  facts: [string, string][]     // "At a glance" rows beyond the stat line
  openHouses?: OpenHouse[]
  hero: string                  // photo file used for hero, card, OG
  photos: ListingPhoto[]
  floorPlans?: { file: string; alt: string }[]
  mapsQuery?: string            // defaults to the full address
}
```

`index.ts` exports `LISTINGS`, `getListing(slug)`, `getListingsByStatus()` (sort: status rank, then newest listedDate), `listingPath(slug)`, `listingAddress(l)`, `formatPrice(n)`. Photo paths resolve to `/images/listings/<slug>/<file>`.

**Photos on disk:** `public/images/listings/<slug>/01.jpg … 27.jpg`, `floorplan-1.jpg`, `floorplan-2.jpg`, photographer order, recompressed to ≤2000px / q82 for the repo. Replacing with originals = overwrite files with the same names. A content test asserts every referenced file exists (a listing must never ship with a broken photo, unlike newsletter figures which degrade silently).

## Listing page (`ListingPageView`)

Dark bookends; brand tokens and existing `.kt-*` classes; new `.kt-listing-*` classes in `globals.css` only where nothing fits. Density `--dm: 1`, 96px sections (72px ≤700px precedent).

1. **Hero (dark, full-bleed, 88svh):** `PhotoSlot` with the `hero` photo, charcoal gradient scrim, gold hairline `.kt-frame`. Bottom-left content: eyebrow "Just listed · Summerset, Livermore" (status-driven: Coming soon / Just listed / Pending / Sold), H1 street in Fraunces display, city line, gold rule, price in Fraunces, stat line `3 bd · 2 ba · 1,130 sq ft · 6,000 sq ft lot`. Buttons: "Request a showing" (`#inquire`), "View photos" (`#photos`). Open-house pill appears only when `openHouses` has a future date.
2. **Overview (light):** two-column: left = headline + description paragraphs (`.kt-prose` measure); right = "At a glance" `.kt-rows` (price, beds, baths, sq ft, lot, year built, garage, type, neighborhood, MLS if set) + highlights chips.
3. **Photos (light alt tint, `#photos`):** editorial grid — first photo of each group spans 2 columns, rest 3-up; 1px hairline, 24px top-left radius, Fraunces-italic group captions ("The living room", "Kitchen & dining", "Bedrooms", "Baths", "Outdoor", "Exterior"). Click opens **Lightbox** (client component: native `<dialog>`, prev/next, Escape, arrow keys, counter, alt as caption, focus returned to the tile). Lazy-loaded `next/image` with sizes.
4. **Floor plan (light):** two drawings side by side (stack ≤720px), open in the same lightbox.
5. **Location (light alt):** address, "Open in Google Maps" external link (`https://www.google.com/maps/search/?api=1&query=<encoded address>`), one-line neighborhood note, link to `/neighborhoods/alameda-county#livermore`. No embed (CSP + brand).
6. **Inquire (hybrid, `#inquire`):** charcoal `.kt-hybrid-block` on ivory with gold accents: left = "Interested in this home?" + Kalyani portrait (`about-portrait` slot, 4:5, top-left radius) + phone/email; right = **ListingInquiryForm** (first name, last name, email, phone, message; `.kt-input` dark inputs; honeypot). Posts to existing `/api/lead` with `intent: 'buying'`, `timeframe: null`, message prefixed `Inquiry — 553 Covington Way, Livermore: `, `sourcePage` = listing path, both newsletter flags false (never auto-subscribe). Success and failure states mirror `ContactForm`.
7. **Listed by (light, small):** "Listed by Kalyani Thilak · REALTOR® · Intero Real Estate Services · DRE 02254890 · 187 S J Street, Livermore." + "Information deemed reliable but not guaranteed" caption.
8. **Bookend:** `KTNewsletter` + `KTFooter`.

**Metadata:** title `553 Covington Way, Livermore — $890,000`, description = headline + stat line, canonical, `openGraph.images` = hero photo, `twitter.card = summary_large_image`. JSON-LD `RealEstateListing` with `SingleFamilyResidence` (address, floorSize, numberOfRooms) and `Offer` (price, USD, availability by status). Sold listings switch availability to `SoldOut`.

## Index page (`/listings`)

Dark hero (eyebrow "Listings", H1 "Homes I'm *representing*", lead). Light body: sections per status with a heading only when that status has entries. **ListingCard**: hero photo 16:10 top-left radius, status badge, street, city, price (or "Sold" + sold price when set), stat line, "View listing →". Empty state: "No active listings right now — the next one will appear here first." plus a Contact link.

## Lifecycle

`status` alone drives: eyebrow/badge copy, index grouping and order, JSON-LD availability, hero CTA (sold/pending hide "Request a showing" and show "Ask about similar homes" → `/contact`). Sold listings stay published as social proof. Marking sold = edit `status` (+ optional `soldPrice`), push.

## Testing

TDD per repo discipline (Vitest + RTL). New tests: content index (unique slugs, status sort, path helpers, price format, every photo file exists), listing page `generateStaticParams`/`generateMetadata`, index page grouping + empty state, `ListingHero` (status copy, CTA switching, open-house pill), `Gallery` + `Lightbox` (open on click, prev/next, Escape closes, focus return), `ListingInquiryForm` (payload shape, intent, prefix, no newsletter flags, honeypot, validation, sent/fail states), `site.ts` (10 items, Listings first), redirects (narrowed source), sitemap (listing URLs present). `scripts/clickthrough.mjs` gets both routes. Gates: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, then `node scripts/mobile-verify.mjs` + `pnpm verify:routes` against the build.

## Docs

PHOTOS.md gains a Listings section (file naming, replacement procedure). CLAUDE.md architecture gets a Listings bullet. HANDOFF.md gets a dated entry.

## Deferred

Home-page "Just listed" teaser, top-level nav link, video/3D tour, open-house RSVP, price-history display, moving photos off git to blob storage, `/listings` filters.
