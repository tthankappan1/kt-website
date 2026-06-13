import type { Metadata } from 'next'
import { CONTRA_COSTA_GUIDE } from '@/content/guides'
import { NeighborhoodGuidePage } from '@/components/neighborhoods/neighborhood-guide-page'

export const metadata: Metadata = {
  title: CONTRA_COSTA_GUIDE.title,
  description: CONTRA_COSTA_GUIDE.sub,
}

export default function ContraCostaCountyPage() {
  return <NeighborhoodGuidePage guide={CONTRA_COSTA_GUIDE} />
}
