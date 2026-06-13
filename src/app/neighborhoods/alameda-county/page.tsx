import type { Metadata } from 'next'
import { ALAMEDA_GUIDE } from '@/content/guides'
import { GuidePageView } from '@/components/guide/guide-page'

export const metadata: Metadata = {
  title: ALAMEDA_GUIDE.title,
  description: ALAMEDA_GUIDE.sub,
}

export default function AlamedaCountyPage() {
  return <GuidePageView guide={ALAMEDA_GUIDE} />
}
