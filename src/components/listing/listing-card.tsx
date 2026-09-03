import Image from 'next/image'
import Link from 'next/link'
import { STATUS_LABEL, formatPrice, listingPath, photoSrc, statLine } from '@/content/listings'
import type { Listing } from '@/content/listings'

export function cardPrice(l: Listing): string {
  if (l.status === 'sold') return l.soldPrice ? `Sold for ${formatPrice(l.soldPrice)}` : 'Sold'
  return formatPrice(l.price)
}

// Index card (spec 2026-09-03 §Index page).
export function ListingCard({ listing }: { listing: Listing }) {
  const hero = listing.photos.find((p) => p.file === listing.hero) ?? listing.photos[0]
  return (
    <Link className="kt-listing-card" href={listingPath(listing.slug)}>
      <div className="kt-listing-card-photo">
        <Image
          src={photoSrc(listing, hero.file)}
          alt={hero.alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="kt-listing-card-body">
        <span className="kt-listing-badge">{STATUS_LABEL[listing.status]}</span>
        <span className="kt-listing-card-title">{listing.street}</span>
        <span className="kt-listing-card-city">{`${listing.city}, ${listing.state} ${listing.zip}`}</span>
        <span className="kt-listing-card-price">{cardPrice(listing)}</span>
        <span className="kt-listing-card-stats">{statLine(listing)}</span>
        <span className="card-link">
          View listing <span aria-hidden="true">&rarr;</span>
        </span>
      </div>
    </Link>
  )
}
