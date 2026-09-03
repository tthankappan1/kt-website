import Link from 'next/link'
import { mapsUrl } from '@/content/listings'
import type { Listing } from '@/content/listings'

// Cities covered by the Contra Costa guide; everything else falls to Alameda.
const CONTRA_COSTA = new Set(['san ramon', 'danville', 'alamo', 'walnut creek', 'lafayette', 'orinda', 'moraga'])

export function guideHref(city: string): string {
  const id = city.trim().toLowerCase().replace(/\s+/g, '-')
  const county = CONTRA_COSTA.has(city.trim().toLowerCase()) ? 'contra-costa-county' : 'alameda-county'
  return `/neighborhoods/${county}#${id}`
}

// Slim location band: address, Maps link (plain link — no embed: CSP + brand),
// and the neighborhood guide (spec 2026-09-03 §Listing page 5).
export function ListingLocation({ listing }: { listing: Listing }) {
  return (
    <section className="kt-listing-location">
      <div className="kt-container">
        <div className="kt-listing-location-inner">
          <div>
            <p className="kt-eyebrow">Location</p>
            <p className="kt-listing-address">
              <span>{listing.street}</span>
              <span>{`${listing.city}, ${listing.state} ${listing.zip}`}</span>
            </p>
          </div>
          <div className="kt-listing-location-links">
            <a
              className="kt-btn btn-ghost-light"
              href={mapsUrl(listing)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
            <Link className="kt-read" href={guideHref(listing.city)}>
              Read the {listing.city} guide <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
