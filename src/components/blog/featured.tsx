// Server component — no 'use client' directive
import Link from 'next/link'
import { PhotoSlot } from '@/components/ui/photo-slot'
import { KtInline, ktPlain } from '@/lib/inline'
import { ktFormatDate } from '@/lib/dates'
import type { Post } from '@/content/posts/types'

export function BlogFeatured({ posts }: { posts: Post[] }) {
  const lead = posts[0]
  const two = posts.slice(1, 3)

  if (!lead) return null

  return (
    <section style={{ padding: 'calc(88px * var(--dm, 1)) 0 0' }}>
      <div className="kt-container">
        <div className={'kt-bfeat-lead kt-reveal' + (lead.cover ? '' : ' noimg')}>
          {lead.cover ? (
            <PhotoSlot
              id={'blog-' + lead.slug}
              alt={ktPlain(lead.title)}
              radius={18}
              style={{ aspectRatio: '16 / 10', width: '100%', height: 'auto', display: 'block' }}
            />
          ) : (
            <hr className="kt-rule" />
          )}
          <div>
            <p className="kt-eyebrow">Latest issue &middot; {ktFormatDate(lead.date)}</p>
            <Link className="kt-bcard-link" href={`/newsletter/${lead.slug}`}>
              <h2
                className="kt-bcard-title"
                style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.15 }}
              >
                <KtInline text={lead.title} emClass="kt-em" />
              </h2>
            </Link>
            <p className="kt-lead" style={{ maxWidth: '480px', marginBottom: '24px' }}>
              {lead.excerpt}
            </p>
            <Link className="kt-read" href={`/newsletter/${lead.slug}`}>
              Read the issue &rarr;
            </Link>
          </div>
        </div>

        {two.length > 0 && (
          <div
            className="kt-bfeat-two kt-reveal"
            style={{ marginTop: 'calc(72px * var(--dm, 1))' }}
          >
            {two.map((p) => (
              <div key={p.slug}>
                {p.cover ? (
                  <PhotoSlot
                    id={'blog-' + p.slug}
                    alt={ktPlain(p.title)}
                    radius={14}
                    style={{
                      aspectRatio: '16 / 9',
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      marginBottom: '20px',
                    }}
                  />
                ) : (
                  <hr className="kt-rule rule-light" style={{ margin: '0 0 20px' }} />
                )}
                <p className="kt-eyebrow">
                  {p.category} &middot; {ktFormatDate(p.date)}
                </p>
                <Link className="kt-bcard-link" href={`/newsletter/${p.slug}`}>
                  <h3 className="kt-bcard-title" style={{ fontSize: '24px', lineHeight: 1.25 }}>
                    <KtInline text={p.title} emClass="kt-em" />
                  </h3>
                </Link>
                <p className="kt-body-small" style={{ maxWidth: '440px' }}>
                  {p.excerpt}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
