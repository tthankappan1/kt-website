import Link from 'next/link'
import { KTNav } from '@/components/nav/kt-nav'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTFooter } from '@/components/close/kt-footer'
import { ListingCard } from '@/components/listing/listing-card'
import { STATUS_LABEL, STATUS_ORDER, sortListings } from '@/content/listings'
import type { Listing } from '@/content/listings'

// /listings — dark hero, then one group per status that has entries, in
// lifecycle order (spec 2026-09-03 §Index page).
export function ListingsIndexView({ listings }: { listings: Listing[] }) {
  const sorted = sortListings(listings)
  const groups = STATUS_ORDER.map((status) => ({
    status,
    items: sorted.filter((l) => l.status === status),
  })).filter((g) => g.items.length > 0)

  return (
    <div>
      <KTNav base="/" />
      <main id="main">
        <header id="top" className="bg-dark on-dark" style={{ padding: '180px 0 88px' }}>
          <div className="kt-container">
            <p className="kt-eyebrow on-dark">Listings</p>
            <h1 className="kt-display" style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}>
              Homes I&rsquo;m <em className="kt-em">representing</em>.
            </h1>
            <hr className="kt-rule" />
            <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)', maxWidth: '560px' }}>
              Every home I list appears here first &mdash; the photos, the facts, and a direct
              line to me for a showing.
            </p>
          </div>
        </header>

        <section className="kt-section bg-light">
          <div className="kt-container">
            {groups.length === 0 ? (
              <div className="kt-listing-empty">
                <h2 className="kt-h1">Nothing on the market just now.</h2>
                <hr className="kt-rule rule-light" />
                <p className="kt-lead">
                  No active listings right now &mdash; the next one will appear here first. If
                  you&rsquo;re thinking about selling, or want to hear about homes before they
                  list, get in touch.
                </p>
                <Link className="kt-btn btn-solid-light" href="/contact" style={{ marginTop: '28px' }}>
                  Contact Kalyani
                </Link>
              </div>
            ) : (
              groups.map((g) => (
                <div key={g.status} className="kt-listing-group">
                  <h2 className="kt-h1">{STATUS_LABEL[g.status]}</h2>
                  <hr className="kt-rule rule-light" />
                  <div className="grid-listing-cards">
                    {g.items.map((l) => (
                      <ListingCard key={l.slug} listing={l} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter />
        <KTFooter />
      </div>
    </div>
  )
}
