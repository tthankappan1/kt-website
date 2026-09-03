import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ListingPageView } from '@/components/listing/listing-page'
import { LISTINGS, formatPrice, getListing, listingPath, photoSrc, statLine } from '@/content/listings'
import { SITE_URL } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const l = getListing(slug)
  if (!l) return {}
  const hero = l.photos.find((p) => p.file === l.hero) ?? l.photos[0]
  const title = `${l.street}, ${l.city} — ${formatPrice(l.status === 'sold' && l.soldPrice ? l.soldPrice : l.price)}`
  const description = `${l.headline} ${statLine(l)}.`
  const url = SITE_URL + listingPath(slug)
  return {
    title,
    description,
    alternates: { canonical: listingPath(slug) },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [{ url: photoSrc(l, hero.file), width: 2000, height: 1333, alt: hero.alt }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const listing = getListing(slug)
  if (!listing) notFound()
  return <ListingPageView listing={listing} />
}
