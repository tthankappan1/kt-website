import { KTNav } from '@/components/nav/kt-nav'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTFooter } from '@/components/close/kt-footer'
import { RESOURCE_PAGES } from '@/content/resources'
import type { ResourceSection as ResourceSectionType } from '@/content/resources'

function ResourceHero({ title, sub }: { title: string; sub: string }) {
  return (
    <header id="top" className="bg-dark on-dark" style={{ padding: '180px 0 88px' }}>
      <div className="kt-container">
        <p className="kt-eyebrow on-dark">Client Resources</p>
        <h1 className="kt-display" style={{ fontSize: 'clamp(38px, 4.4vw, 60px)', maxWidth: '840px' }}>
          {title}
        </h1>
        <hr className="kt-rule" />
        <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)' }}>
          {sub}
        </p>
      </div>
    </header>
  )
}

function ResourceSection({ s, alt }: { s: ResourceSectionType; alt: boolean }) {
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
          {(s.paras || []).map((para, i) => (
            <p key={i} className="kt-lead" style={{ maxWidth: '680px', marginBottom: '16px' }}>
              {para}
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

export function ResourcePageView({ page }: { page: string }) {
  const d = RESOURCE_PAGES[page]
  return (
    <div>
      <KTNav base="/" />
      <main id="main">
      <ResourceHero title={d.title} sub={d.sub} />
      <div className="bg-light">
        {d.sections.map((s, i) => (
          <ResourceSection key={i} s={s} alt={i % 2 === 1} />
        ))}
      </div>
      </main>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter />
        <KTFooter />
      </div>
    </div>
  )
}
