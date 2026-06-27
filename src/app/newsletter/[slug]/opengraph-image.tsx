import { getPublishedPosts, getPost } from '@/content/posts'
import { ktPlain } from '@/lib/inline'
import { ktFormatDate } from '@/lib/dates'
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/og/og-card'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    // Unknown slug (only reachable outside the prebuilt params) — branded shell.
    return renderOgImage({ title: 'The Bay Area Newsletter', titleFontSize: 64 })
  }

  return renderOgImage({
    title: ktPlain(post.title),
    titleFontSize: 58,
    dateStr: ktFormatDate(post.date),
  })
}
