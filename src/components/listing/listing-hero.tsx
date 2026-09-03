import Link from 'next/link'
import { PhotoSlot } from '@/components/ui/photo-slot'
import {
  formatPrice,
  heroLabel,
  openHouseLabel,
  photoSrc,
  statLine,
  upcomingOpenHouses,
} from '@/content/listings'
import type { Listing } from '@/content/listings'
import { DRE } from '@/lib/site'

// Full-bleed dark hero on the listing's hero photo. Status drives the eyebrow,
// the price slot and the CTAs (spec 2026-09-03 §Listing page / Lifecycle).
// `today` is injectable for tests; at build time it is the build date.
export function ListingHero({ listing, today }: { listing: Listing; today?: Date }) {
  const hero = listing.photos.find((p) => p.file === listing.hero) ?? listing.photos[0]
  const place = [listing.neighborhood, listing.city].filter(Boolean).join(', ')
  const showing = listing.status === 'active' || listing.status === 'coming-soon'
  const price =
    listing.status === 'sold'
      ? listing.soldPrice
        ? formatPrice(listing.soldPrice)
        : null
      : formatPrice(listing.price)
  const openHouses = upcomingOpenHouses(listing, today)

  return (
    <header id="top" className="bg-dark on-dark kt-listing-hero">
      <PhotoSlot
        id={'listing-hero-' + listing.slug}
        src={photoSrc(listing, hero.file)}
        alt={hero.alt}
        priority
        sizes="100vw"
        style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
      />
      <div className="kt-listing-scrim" aria-hidden="true" />
      <div className="kt-container kt-listing-hero-inner">
        <div className="kt-listing-hero-main">
          <p className="kt-eyebrow on-dark">{`${heroLabel(listing, today)} · ${place}`}</p>
          <h1 className="kt-display">{listing.street}</h1>
          <p className="kt-listing-city">{`${listing.city}, ${listing.state} ${listing.zip}`}</p>
          <hr className="kt-rule" />
          <div className="kt-listing-priceline">
            {price ? <span className="kt-listing-price">{price}</span> : null}
            <span className="kt-listing-stats">{statLine(listing)}</span>
          </div>
          {openHouses.length > 0 ? (
            <p className="kt-listing-pill">
              {['Open house', ...openHouses.map(openHouseLabel)].join(' · ')}
            </p>
          ) : null}
          <div className="kt-listing-ctas">
            {showing ? (
              <a className="kt-btn btn-solid-dark" href="#inquire">
                Request a showing
              </a>
            ) : (
              <Link className="kt-btn btn-solid-dark" href="/contact">
                Ask about similar homes
              </Link>
            )}
            <a className="kt-btn btn-ghost-dark" href="#photos">
              View photos
            </a>
          </div>
        </div>
        <div className="kt-listing-hero-by">
          <p className="kt-eyebrow on-dark" style={{ marginBottom: '4px' }}>
            Represented by
          </p>
          <p className="kt-listing-by-name">Kalyani Thilak</p>
          <p className="kt-body-small" style={{ color: 'var(--body-on-dark)', lineHeight: 1.9 }}>
            REALTOR&reg; &middot; DRE {DRE}
            <br />
            <span className="kt-listing-intero">Intero</span> Real Estate Services
          </p>
        </div>
      </div>
    </header>
  )
}
