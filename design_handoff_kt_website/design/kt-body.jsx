// Kalyani Thilak — body sections: intro, services, testimonials, social, newsletter, footer

/* ---------- Intro / About blurb (Light mode — small inset imagery only) ---------- */
function KTIntro({ serifUI }) {
  return (
    <section id="about" className="kt-section bg-light">
      <div className="kt-container">
        <div className="grid-intro">
          <div className="kt-reveal">
            <image-slot id="about-portrait" placeholder="Drop portrait of Kalyani"
              shape="rounded" radius="24"
              style={{ width: '100%', maxWidth: '360px', height: '440px', display: 'block' }}></image-slot>
            <p className="kt-caption" style={{ marginTop: '12px', letterSpacing: '0.12em', color: 'var(--gold-deep)' }}>
              KALYANI THILAK &middot; REALTOR&reg;
            </p>
          </div>
          <div className="kt-reveal">
            <p className="kt-eyebrow">About</p>
            <h2 className="kt-h1" style={{ marginBottom: 'var(--gap-h1)' }}>
              A trusted advisor for the <em className="kt-em">Tri-Valley</em>.
            </h2>
            <div className="kt-measure" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p className="kt-lead">
                Kalyani works with buyers and sellers across Pleasanton, Dublin, San Ramon, and
                Livermore &mdash; a market she knows street by street, school boundary by school boundary.
              </p>
              <p>
                Her clients are sophisticated readers. They review comparable sales cover to cover and
                ask pointed questions. That suits her well: her practice is built on data-grounded
                analysis, honest market assessments, and recommendations she can defend with numbers.
              </p>
              <p>
                Whether you are buying your first Pleasanton home for the schools or selling a house
                you have held for twenty years, the approach is the same &mdash; calm, informed,
                and never selling.
              </p>
            </div>
            <div style={{ marginTop: '40px' }}>
              <a className={'kt-btn btn-solid-light' + (serifUI ? ' serif-ui' : '')} href="Contact.html">Work with Kalyani</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Services (Light mode — typographic cards) ---------- */
const KT_SERVICES = [
  { num: '01', title: 'Buying', href: 'Buying.html', body: 'Strategy before search. Understand what recent comparable sales suggest, where the leverage is, and how to win the right home without overpaying.' },
  { num: '02', title: 'Selling', href: 'Selling.html', body: 'An honest market assessment, preparation that earns its cost back, and pricing built on six closed sales \u2014 not wishful thinking.' },
  { num: '03', title: 'Market guidance', href: 'Market Updates.html', body: 'Not ready to move? Quarterly check-ins on where the Tri-Valley market is today, and what waiting actually costs.' },
];

function KTServices({ serifUI }) {
  return (
    <section id="services" className="kt-section bg-light" style={{ paddingTop: 0 }}>
      <div className="kt-container">
        <div className="kt-reveal" style={{ textAlign: 'center', marginBottom: 'var(--gap-section)' }}>
          <p className="kt-eyebrow">Services</p>
          <h2 className="kt-h1">How I can <em className="kt-em">help</em>.</h2>
        </div>
        <div className="grid-services">
          {KT_SERVICES.map((s) => (
            <div className="kt-card" key={s.num}>
              <span className="card-num">{s.num}</span>
              <h3 className="kt-h3" style={{ fontSize: '24px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px' }}>{s.body}</p>
              <a className="card-link" href={s.href}>Learn more <span aria-hidden="true">&rarr;</span></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials (Hybrid mode — charcoal block on ivory) ---------- */
const KT_QUOTES = [
  { quote: 'Kalyani walked us through every comparable sale before we wrote a single offer. We always knew exactly where we stood \u2014 and we closed under asking in a competitive market.', name: 'Buyer', where: 'Pleasanton' },
  { quote: 'She told us what our home was actually worth, not what we wanted to hear. The preparation plan paid for itself several times over.', name: 'Seller', where: 'San Ramon' },
  { quote: 'Calm, precise, and two steps ahead the entire time. The first agent we have worked with who reads the numbers the way we do.', name: 'Buyer', where: 'Dublin' },
];

function KTTestimonials() {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % KT_QUOTES.length), 7000);
    return () => clearInterval(t);
  }, []);
  const q = KT_QUOTES[idx];
  return (
    <section id="testimonials" className="kt-section bg-light" style={{ paddingTop: 0 }}>
      <div className="kt-container">
        <div className="kt-hybrid-block on-dark kt-reveal">
          <p className="kt-eyebrow on-dark" style={{ color: 'var(--gold)' }}>What clients say</p>
          <blockquote style={{ minHeight: '150px' }}>
            <p style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontVariationSettings: '"opsz" 96',
              fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.45, color: 'var(--ivory)', maxWidth: '820px' }}>
              &ldquo;{q.quote}&rdquo;
            </p>
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <p className="kt-body-small" style={{ color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
              {q.name} &middot; {q.where}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {KT_QUOTES.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={'Quote ' + (i + 1)}
                  style={{ width: '32px', height: '2px', border: 'none', cursor: 'pointer',
                    background: i === idx ? 'var(--gold)' : 'rgba(192,162,120,0.3)', transition: 'background 0.3s' }}></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { KTIntro, KTServices, KTTestimonials, KT_QUOTES });
