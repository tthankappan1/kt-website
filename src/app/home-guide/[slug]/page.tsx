import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { KTNav } from '@/components/nav/kt-nav'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTFooter } from '@/components/close/kt-footer'
import { PhotoSlot } from '@/components/ui/photo-slot'
import { PostBody } from '@/components/blog/post-body'
import { ShareRow } from '@/components/blog/share-row'
import { getPost, getPublishedPosts } from '@/content/posts'
import { ktFormatDate } from '@/lib/dates'
import { KtInline, ktPlain } from '@/lib/inline'
import { SITE_URL } from '@/lib/site'

export const dynamicParams = false

export async function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const title = ktPlain(post.title)
  const description = post.excerpt
  const url = SITE_URL + '/home-guide/' + slug
  return {
    title,
    description,
    alternates: { canonical: '/home-guide/' + slug },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const published = getPublishedPosts()
  const i = published.findIndex((p) => p.slug === slug)
  const newer = published[i - 1]
  const older = published[i + 1]

  return (
    <div>
      <KTNav base="/" />

      <main id="main">
      <header className="bg-dark on-dark" style={{ padding: '170px 0 72px' }}>
        <div className="kt-container">
          <Link className="kt-read" href="/home-guide" style={{ color: 'var(--gold)' }}>
            &larr; All issues
          </Link>
          <p className="kt-eyebrow on-dark" style={{ marginTop: '32px' }}>
            {post.category} &middot; {ktFormatDate(post.date)}
          </p>
          <h1
            className="kt-display"
            style={{ fontSize: 'clamp(36px, 4.2vw, 58px)', maxWidth: '900px' }}
          >
            <KtInline text={post.title} emClass="kt-em" />
          </h1>
          <hr className="kt-rule" />
          <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)' }}>
            {post.excerpt}
          </p>
        </div>
      </header>

      <div className="bg-light">
        {post.cover ? (
          <div className="kt-container" style={{ paddingTop: '56px' }}>
            <PhotoSlot
              id={'blog-' + slug}
              alt={ktPlain(post.title)}
              radius={18}
              style={{ aspectRatio: '21 / 9', width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        ) : null}

        <article
          className="kt-container kt-prose kt-reveal"
          style={{ paddingTop: '64px', paddingBottom: '24px' }}
        >
          <PostBody body={post.body} />
          <p className="kt-body-small" style={{ marginTop: '48px', letterSpacing: '0.06em' }}>
            &mdash; Kalyani Thilak &middot; REALTOR&reg; &middot; Intero Real Estate Services
          </p>
          <Link
            className="kt-btn btn-solid-light"
            href="/contact"
            style={{ marginTop: '28px' }}
          >
            Contact Kalyani
          </Link>
        </article>

        <div className="kt-container" style={{ paddingTop: '32px', paddingBottom: '56px' }}>
          <ShareRow slug={post.slug} title={ktPlain(post.title)} />
        </div>

        <div className="kt-container" style={{ paddingBottom: '96px' }}>
          <div className="kt-pn-grid">
            {older ? (
              <Link className="kt-pn" href={`/home-guide/${older.slug}`}>
                <span className="pn-dir">&larr; Previous issue</span>
                <span className="pn-title">{ktPlain(older.title)}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link
                className="kt-pn"
                href={`/home-guide/${newer.slug}`}
                style={{ textAlign: 'right' }}
              >
                <span className="pn-dir">Next issue &rarr;</span>
                <span className="pn-title">{ktPlain(newer.title)}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
      </main>

      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter />
        <KTFooter />
      </div>
    </div>
  )
}
