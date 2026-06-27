// Kalyani Thilak — blog index page (newsletter archive)
// Timeline rail archive + featured latest issues. Data in kt-blog-data.jsx.

/* ---------- section-name exploration (Tweaks) ---------- */
const KT_BLOG_NAMES = {
  'Newsletter':   { nav: 'Newsletter',   plain: 'The Bay Area Newsletter', pre: 'The Bay Area ', em: 'Newsletter' },
  'Journal':      { nav: 'Journal',      plain: 'The Journal',             pre: 'The ',          em: 'Journal' },
  'Insights':     { nav: 'Insights',     plain: 'Insights',                pre: '',              em: 'Insights' },
  'Market Notes': { nav: 'Market Notes', plain: 'Market Notes',            pre: 'Market ',       em: 'Notes' },
};

const BLOG_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "blogName": "Newsletter"
}/*EDITMODE-END*/;

/* ---------- hero ---------- */
function BlogHero({ nm }) {
  return (
    <header id="top" className="bg-dark on-dark" style={{ padding: '180px 0 88px' }} data-screen-label="Blog hero">
      <div className="kt-container">
        <p className="kt-eyebrow on-dark">The weekly newsletter &middot; archived here</p>
        <h1 className="kt-display" style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}>
          {nm.pre}<em className="kt-em">{nm.em}</em>
        </h1>
        <hr className="kt-rule"></hr>
        <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)', maxWidth: '560px' }}>
          Every issue lives here &mdash; the market read, neighborhood spotlights, and what
          the numbers actually mean for Tri-Valley buyers and sellers. New issues most weeks.
        </p>
      </div>
    </header>
  );
}

/* ---------- featured: latest issue large + two recent ---------- */
function BlogFeatured() {
  const lead = KT_POSTS_SORTED[0];
  const two = KT_POSTS_SORTED.slice(1, 3);
  return (
    <section style={{ padding: 'calc(88px * var(--dm, 1)) 0 0' }} data-screen-label="Blog featured">
      <div className="kt-container">
        <div className={'kt-bfeat-lead kt-reveal' + (lead.cover ? '' : ' noimg')}>
          {lead.cover ? (
            <image-slot id={'blog-' + lead.slug} placeholder={'Drop cover image — ' + ktPlain(lead.title)}
              shape="rounded" radius="18"
              style={{ width: '100%', height: 'auto', aspectRatio: '16 / 10', display: 'block' }}></image-slot>
          ) : null}
          <div>
            <p className="kt-eyebrow">Latest issue &middot; {ktFormatDate(lead.date)}</p>
            <a className="kt-bcard-link" href={'Blog Post.html?post=' + lead.slug}>
              <h2 className="kt-bcard-title" style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.15 }}>{ktInline(lead.title, 'kt-em')}</h2>
            </a>
            <p className="kt-lead" style={{ maxWidth: '480px', marginBottom: '24px' }}>{lead.excerpt}</p>
            <a className="kt-read" href={'Blog Post.html?post=' + lead.slug}>Read the issue &rarr;</a>
          </div>
        </div>
        <div className="kt-bfeat-two kt-reveal" style={{ marginTop: 'calc(72px * var(--dm, 1))' }}>
          {two.map((p) => (
            <div key={p.slug}>
              {p.cover ? (
                <image-slot id={'blog-' + p.slug} placeholder={'Drop cover image — ' + ktPlain(p.title)}
                  shape="rounded" radius="14"
                  style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', display: 'block', marginBottom: '20px' }}></image-slot>
              ) : (
                <hr className="kt-rule rule-light" style={{ margin: '0 0 20px' }}></hr>
              )}
              <p className="kt-eyebrow">{p.category} &middot; {ktFormatDate(p.date)}</p>
              <a className="kt-bcard-link" href={'Blog Post.html?post=' + p.slug}>
                <h3 className="kt-bcard-title" style={{ fontSize: '24px', lineHeight: 1.25 }}>{ktInline(p.title, 'kt-em')}</h3>
              </a>
              <p className="kt-body-small" style={{ maxWidth: '440px' }}>{p.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- archive: topic chips + timeline rail + dated list ---------- */
function BlogArchive() {
  const { useState, useEffect } = React;
  const [cat, setCat] = useState('All');
  const [activeM, setActiveM] = useState(null);

  const posts = KT_POSTS_SORTED.filter((p) => cat === 'All' || p.category === cat);

  /* group by month, then by year for the rail */
  const groups = [];
  posts.forEach((p) => {
    const key = p.date.slice(0, 7);
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, label: ktMonthLabel(p.date), year: p.date.slice(0, 4), posts: [] }; groups.push(g); }
    g.posts.push(p);
  });
  const years = [];
  groups.forEach((g) => {
    let y = years.find((x) => x.year === g.year);
    if (!y) { y = { year: g.year, months: [] }; years.push(y); }
    y.months.push(g);
  });

  useEffect(() => {
    const onScroll = () => {
      const secs = document.querySelectorAll('[data-mkey]');
      let cur = null;
      secs.forEach((s) => { if (s.getBoundingClientRect().top < 240) cur = s.getAttribute('data-mkey'); });
      setActiveM(cur || (secs[0] && secs[0].getAttribute('data-mkey')));
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [cat]);

  const jump = (key) => {
    const el = document.querySelector('[data-mkey="' + key + '"]');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: 'smooth' });
  };

  return (
    <section style={{ padding: 'calc(96px * var(--dm, 1)) 0 calc(110px * var(--dm, 1))' }} data-screen-label="Blog archive">
      <div className="kt-container">
        <h2 className="kt-h1">Every <em className="kt-em">issue</em></h2>
        <hr className="kt-rule rule-light"></hr>
        <div className="kt-chiprow" style={{ marginBottom: 'calc(56px * var(--dm, 1))' }}>
          {['All'].concat(KT_BLOG_CATS).map((c) => (
            <button key={c} className={'kt-fchip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="grid-blogarch">
          <aside className="kt-blog-rail">
            {years.map((y) => (
              <div key={y.year}>
                <p className="kt-rail-year">{y.year}</p>
                {y.months.map((m) => (
                  <button key={m.key} className={'kt-rail-month' + (activeM === m.key ? ' on' : '')}
                    onClick={() => jump(m.key)}>{ktMonthName(m.key)}</button>
                ))}
              </div>
            ))}
          </aside>
          <div>
            {groups.length === 0 ? (
              <p className="kt-lead">Nothing in this topic yet &mdash; new issues are on the way.</p>
            ) : groups.map((g, gi) => (
              <div key={g.key} data-mkey={g.key} style={{ marginTop: gi === 0 ? '0' : 'calc(48px * var(--dm, 1))' }}>
                <p className="kt-eyebrow" style={{ marginBottom: '6px' }}>{g.label}</p>
                {g.posts.map((p) => (
                  <a key={p.slug} className="kt-arch-row" href={'Blog Post.html?post=' + p.slug}>
                    <span className="ar-date">{ktShortDate(p.date)}</span>
                    <span className="ar-title">{ktInline(p.title, 'kt-em')}</span>
                    <span className="ar-cat">{p.category}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- page assembly + Tweaks ---------- */
function BlogApp() {
  const [t, setTweak] = useTweaks(BLOG_TWEAK_DEFAULTS);
  useReveal();
  const nm = KT_BLOG_NAMES[t.blogName] || KT_BLOG_NAMES['Newsletter'];

  React.useEffect(() => {
    try { localStorage.setItem('kt-blog-nav', nm.nav); } catch (e) {}
    document.title = nm.plain + ' — Kalyani Thilak';
  }, [t.blogName]);

  return (
    <div>
      <KTNav serifUI={false} base="KT Home.html" blogLabel={nm.nav}></KTNav>
      <BlogHero nm={nm}></BlogHero>
      <div className="bg-light">
        <BlogFeatured></BlogFeatured>
        <BlogArchive></BlogArchive>
      </div>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTNewsletter serifUI={false} archiveLink={false}></KTNewsletter>
        <KTFooter></KTFooter>
      </div>
      <TweaksPanel>
        <TweakSection label="Naming"></TweakSection>
        <TweakRadio label="Section name" value={t.blogName}
          options={Object.keys(KT_BLOG_NAMES)}
          onChange={(v) => setTweak('blogName', v)}></TweakRadio>
      </TweaksPanel>
    </div>
  );
}

Object.assign(window, { KT_BLOG_NAMES, BlogHero, BlogFeatured, BlogArchive, BlogApp });
