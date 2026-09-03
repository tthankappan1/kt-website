import { listingAddress, listingPath, photoSrc, statLine } from '@/content/listings'
import type { Listing } from '@/content/listings'
import { SITE_URL } from '@/lib/site'

export type ListingJsonLdData = {
  '@context': 'https://schema.org'
  '@type': 'RealEstateListing'
  name: string
  url: string
  datePosted: string
  description: string
  image: string
  about: {
    '@type': 'SingleFamilyResidence'
    name: string
    address: {
      '@type': 'PostalAddress'
      streetAddress: string
      addressLocality: string
      addressRegion: string
      postalCode: string
      addressCountry: 'US'
    }
    floorSize: { '@type': 'QuantitativeValue'; value: number; unitCode: 'FTK' }
    numberOfBedrooms: number
    numberOfBathroomsTotal: number
    yearBuilt?: number
  }
  offers: {
    '@type': 'Offer'
    price: number
    priceCurrency: 'USD'
    availability: 'https://schema.org/InStock' | 'https://schema.org/SoldOut'
  }
}

export function buildListingJsonLd(l: Listing): ListingJsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listingAddress(l),
    url: SITE_URL + listingPath(l.slug),
    datePosted: l.listedDate,
    description: `${l.headline} ${statLine(l)}`,
    image: SITE_URL + photoSrc(l, l.hero),
    about: {
      '@type': 'SingleFamilyResidence',
      name: l.street,
      address: {
        '@type': 'PostalAddress',
        streetAddress: l.street,
        addressLocality: l.city,
        addressRegion: l.state,
        postalCode: l.zip,
        addressCountry: 'US',
      },
      floorSize: { '@type': 'QuantitativeValue', value: l.sqft, unitCode: 'FTK' },
      numberOfBedrooms: l.beds,
      numberOfBathroomsTotal: l.baths,
      ...(l.yearBuilt ? { yearBuilt: l.yearBuilt } : {}),
    },
    offers: {
      '@type': 'Offer',
      price: l.status === 'sold' && l.soldPrice ? l.soldPrice : l.price,
      priceCurrency: 'USD',
      availability: l.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
  }
}

// Rendered as plain text children (no dangerouslySetInnerHTML — the CSP note
// in next.config.ts relies on the app having no HTML-injection sinks). Every
// <, > and & is \u-escaped so the JSON stays valid regardless of escaping.
export function ListingJsonLd({ listing }: { listing: Listing }) {
  const json = JSON.stringify(buildListingJsonLd(listing)).replace(
    /[<>&]/g,
    (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'),
  )
  return <script type="application/ld+json">{json}</script>
}
