import { formatPrice, formatSqft } from '@/content/listings'
import type { Listing } from '@/content/listings'

function glanceRows(l: Listing): [string, string][] {
  const rows: [string, string | undefined][] = [
    ['Price', l.status === 'sold' && l.soldPrice ? `Sold · ${formatPrice(l.soldPrice)}` : formatPrice(l.price)],
    ['Bedrooms', String(l.beds)],
    ['Bathrooms', String(l.baths)],
    ['Interior', formatSqft(l.sqft)],
    ['Lot', l.lotSqft ? formatSqft(l.lotSqft) : undefined],
    ['Year built', l.yearBuilt ? String(l.yearBuilt) : undefined],
    ['Garage', l.garage],
    ['Type', l.propertyType],
    ['Neighborhood', l.neighborhood],
    ['MLS', l.mls],
  ]
  return [
    ...rows.filter((r): r is [string, string] => Boolean(r[1])),
    ...l.facts,
  ]
}

// Light "overview" band: Kalyani's description on the left, the At-a-glance
// card on the right (spec 2026-09-03 §Listing page 2).
export function ListingOverview({ listing }: { listing: Listing }) {
  return (
    <section className="kt-section bg-light">
      <div className="kt-container">
        <div className="grid-listing-overview">
          <div>
            <p className="kt-eyebrow">The home</p>
            <h2 className="kt-h1">{listing.headline}</h2>
            <hr className="kt-rule rule-light" />
            <div className="kt-listing-desc">
              {listing.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {listing.highlights.length > 0 ? (
              <ul className="kt-listing-chips" aria-label="Highlights">
                {listing.highlights.map((h) => (
                  <li key={h} className="kt-listing-chip">
                    {h}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <aside className="kt-listing-facts" aria-label="At a glance">
            <p className="kt-eyebrow">At a glance</p>
            <div className="kt-rows">
              {glanceRows(listing).map(([term, value]) => (
                <div key={term} className={'kt-row' + (term === 'Price' ? ' row-price' : '')}>
                  <span className="row-term">{term}</span>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
