import type { Metadata } from 'next'
import { CONTRA_COSTA_GUIDE } from '@/content/guides'
import { GuidePageView } from '@/components/guide/guide-page'

export const metadata: Metadata = {
  title: CONTRA_COSTA_GUIDE.title,
  description: CONTRA_COSTA_GUIDE.sub,
  alternates: { canonical: '/neighborhoods/contra-costa-county' },
}

export default function ContraCostaCountyPage() {
  return <GuidePageView guide={CONTRA_COSTA_GUIDE} />
}
