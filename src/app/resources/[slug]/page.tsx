import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RESOURCE_PAGES, RESOURCE_SLUGS } from '@/content/resources'
import { ResourcePageView } from '@/components/resource/resource-page'

export const dynamicParams = false

export function generateStaticParams() {
  return RESOURCE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = RESOURCE_PAGES[slug]
  if (!p) return {}
  return { title: p.title, description: p.sub, alternates: { canonical: '/resources/' + slug } }
}

export default async function ResourceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!RESOURCE_PAGES[slug]) notFound()
  return <ResourcePageView page={slug} />
}
