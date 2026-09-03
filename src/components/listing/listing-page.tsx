import { KTNav } from '@/components/nav/kt-nav'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTFooter } from '@/components/close/kt-footer'
import { ListingHero } from '@/components/listing/listing-hero'
import { ListingOverview } from '@/components/listing/listing-overview'
import { ListingGallery } from '@/components/listing/listing-gallery'
import { ListingLocation } from '@/components/listing/listing-location'
import { ListingInquire } from '@/components/listing/listing-inquire'
import { ListingJsonLd } from '@/components/listing/listing-json-ld'
import type { Listing } from '@/content/listings'

// /listings/<slug> — dark hero → light body → charcoal inquire block → dark
// bookend (spec 2026-09-03 §Listing page).
export function ListingPageView({ listing }: { listing: Listing }) {
  return (
    <div>
      <KTNav base="/" />
      <main id="main">
        <ListingHero listing={listing} />
        <ListingOverview listing={listing} />
        <ListingGallery listing={listing} />
        <ListingLocation listing={listing} />
        <ListingInquire listing={listing} />
        <ListingJsonLd listing={listing} />
      </main>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter />
        <KTFooter />
      </div>
    </div>
  )
}
