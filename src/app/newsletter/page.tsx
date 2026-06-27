import type { Metadata } from 'next'
import { KTNav } from '@/components/nav/kt-nav'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTFooter } from '@/components/close/kt-footer'
import { BlogHero } from '@/components/blog/blog-hero'
import { BlogFeatured } from '@/components/blog/featured'
import { BlogArchive } from '@/components/blog/archive'
import { getPublishedPosts } from '@/content/posts'

export const metadata: Metadata = {
  title: 'The Bay Area Newsletter',
  description:
    'Every issue of the weekly newsletter — the market read, neighborhood spotlights, and what the numbers actually mean for Bay Area buyers and sellers.',
  alternates: { canonical: '/newsletter' },
}

export default function NewsletterPage() {
  const posts = getPublishedPosts()

  return (
    <div>
      <KTNav base="/" />
      <main id="main">
        <BlogHero />
        <div className="bg-light">
          <BlogFeatured posts={posts} />
          <BlogArchive posts={posts} />
        </div>
      </main>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter archiveLink={false} />
        <KTFooter />
      </div>
    </div>
  )
}
