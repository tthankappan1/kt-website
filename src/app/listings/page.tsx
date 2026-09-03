import type { Metadata } from 'next'
import { ListingsIndexView } from '@/components/listing/listings-index'
import { getListings } from '@/content/listings'

export const metadata: Metadata = {
  title: 'Listings',
  description:
    'Homes represented by Kalyani Thilak, REALTOR® with Intero Real Estate Services — photos, facts, and a direct line for showings across the Tri-Valley.',
  alternates: { canonical: '/listings' },
}

export default function ListingsPage() {
  return <ListingsIndexView listings={getListings()} />
}
