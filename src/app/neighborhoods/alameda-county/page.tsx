import type { Metadata } from 'next'
import { ALAMEDA_GUIDE } from '@/content/guides'
import { NeighborhoodGuidePage } from '@/components/neighborhoods/neighborhood-guide-page'

export const metadata: Metadata = {
  title: ALAMEDA_GUIDE.title,
  description: ALAMEDA_GUIDE.sub,
}

export default function AlamedaCountyPage() {
  return <NeighborhoodGuidePage guide={ALAMEDA_GUIDE} />
}
