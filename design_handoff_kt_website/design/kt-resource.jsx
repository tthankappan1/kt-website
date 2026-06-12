// Kalyani Thilak — generic client-resource page shell
// Used by: Selling, Buying, Cost of Selling, Intero Concierge,
// Schools, Market Updates, Buyer's Guide. Data in kt-resources-data.jsx.

function ResourceHero({ title, sub }) {
  return (
    <header id="top" className="bg-dark on-dark" style={{ padding: '180px 0 88px' }}>
      <div className="kt-container">
        <p className="kt-eyebrow on-dark">Client Resources</p>
        <h1 className="kt-display" style={{ fontSize: 'clamp(38px, 4.4vw, 60px)', maxWidth: '840px' }}>{title}</h1>
        <hr className="kt-rule"></hr>
        <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)' }}>{sub}</p>
      </div>
    </header>
  );
}

function ResourceSection({ s, alt }) {
  return (
    <section className={'kt-city' + (alt ? ' alt' : '')}>
      <div className="kt-container">
        <div style={{ maxWidth: '880px' }}>
          {s.heading ? (
            <div>
              <h2 className="kt-h1">{s.heading}</h2>
              <hr className="kt-rule rule-light"></hr>
            </div>
          ) : null}
          {(s.paras || []).map((p, i) => (
            <p key={i} className="kt-lead" style={{ maxWidth: '680px', marginBottom: '16px' }}>{p}</p>
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
  );
}

function ResourcePage({ page }) {
  const d = RESOURCE_PAGES[page];
  return (
    <div>
      <KTNav serifUI={false} base="KT Home.html"></KTNav>
      <ResourceHero title={d.title} sub={d.sub}></ResourceHero>
      <div className="bg-light">
        {d.sections.map((s, i) => (
          <ResourceSection key={i} s={s} alt={i % 2 === 1}></ResourceSection>
        ))}
      </div>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter serifUI={false}></KTNewsletter>
        <KTFooter></KTFooter>
      </div>
    </div>
  );
}

Object.assign(window, { ResourceHero, ResourceSection, ResourcePage });
