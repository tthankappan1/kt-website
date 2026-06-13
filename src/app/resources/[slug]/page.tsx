import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { KTNav } from '@/components/nav/kt-nav'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTFooter } from '@/components/close/kt-footer'
import { RESOURCE_PAGES, RESOURCE_SLUGS } from '@/content/resources'
import type { ResourceSection } from '@/content/resources'

export const dynamicParams = false

export async function generateStaticParams() {
  return RESOURCE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = RESOURCE_PAGES[slug]
  if (!page) return {}
  return {
    title: page.title,
    description: page.sub,
  }
}

function ResourceSectionBlock({ s, alt }: { s: ResourceSection; alt: boolean }) {
  return (
    <section className={'kt-city' + (alt ? ' alt' : '')}>
      <div className="kt-container">
        <div style={{ maxWidth: '880px' }}>
          {s.heading ? (
            <div>
              <h2 className="kt-h1">{s.heading}</h2>
              <hr className="kt-rule rule-light" />
            </div>
          ) : null}
          {(s.paras ?? []).map((p, i) => (
            <p key={i} className="kt-lead" style={{ maxWidth: '680px', marginBottom: '16px' }}>
              {p}
            </p>
          ))}
          {s.steps ? (
            <div className="kt-steps">
              {s.steps.map((st) => (
                <div key={st[0]} className="kt-step">
                  <span className="step-num">{st[0]}</span>
                  <div>
                    <h3 className="kt-h3">{st[1]}</h3>
                    <p style={{ maxWidth: '640px' }}>{st[2]}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {s.rows ? (
            <div className="kt-rows">
              {s.rows.map((r) => (
                <div key={r[0]} className="kt-row">
                  <span className="row-term">{r[0]}</span>
                  <p>{r[1]}</p>
                </div>
              ))}
            </div>
          ) : null}
          {s.note ? <p className="kt-note">{s.note}</p> : null}
        </div>
      </div>
    </section>
  )
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = RESOURCE_PAGES[slug]
  if (!page) notFound()

  return (
    <div>
      <KTNav base="/" />
      <header id="top" className="bg-dark on-dark" style={{ padding: '180px 0 88px' }}>
        <div className="kt-container">
          <p className="kt-eyebrow on-dark">Client Resources</p>
          <h1
            className="kt-display"
            style={{ fontSize: 'clamp(38px, 4.4vw, 60px)', maxWidth: '840px' }}
          >
            {page.title}
          </h1>
          <hr className="kt-rule" />
          <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)' }}>
            {page.sub}
          </p>
        </div>
      </header>
      <div className="bg-light">
        {page.sections.map((s, i) => (
          <ResourceSectionBlock key={i} s={s} alt={i % 2 === 1} />
        ))}
      </div>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter />
        <KTFooter />
      </div>
    </div>
  )
}
