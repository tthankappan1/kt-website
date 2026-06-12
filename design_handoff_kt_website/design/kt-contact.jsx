// Kalyani Thilak — Contact page
// Friction-free: intent chips → tailored timeframe → short form.
// CRM: every submission builds a clean JSON lead and hands it to
// window.KT_CRM.submit() — a swappable adapter (see bottom of file).

const { useState: useCState } = React;

const INTENTS = ['Selling', 'Buying', 'Both', 'Just curious'];
const TIMEFRAMES = ['Ready now', 'In 3\u20136 months', 'This year', 'Just exploring'];
const NEWSLETTERS = ['Alameda County market updates', 'Contra Costa County market updates'];

function ContactForm() {
  const [intent, setIntent] = useCState(null);
  const [timeframe, setTimeframe] = useCState(null);
  const [news, setNews] = useCState([]);
  const [sent, setSent] = useCState(false);
  const [error, setError] = useCState(null);

  const toggleNews = (n) =>
    setNews(news.includes(n) ? news.filter((x) => x !== n) : [...news, n]);

  const onSubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    const lead = {
      intent: intent,
      timeframe: timeframe,
      firstName: f.firstName.value.trim(),
      lastName: f.lastName.value.trim(),
      email: f.email.value.trim(),
      phone: f.phone.value.trim(),
      newsletters: news,
      message: f.message.value.trim(),
      source: 'kalyanithilak.com/contact',
      submittedAt: new Date().toISOString(),
    };
    if (!lead.firstName || !lead.email) {
      setError('Please add your first name and email so I can reply.');
      return;
    }
    setError(null);
    window.KT_CRM.submit(lead);
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ padding: '48px 0' }}>
        <h2 className="kt-h1">Thank you.</h2>
        <hr className="kt-rule rule-light"></hr>
        <p className="kt-lead" style={{ maxWidth: '520px' }}>
          Your note is on its way &mdash; I personally read and answer every message,
          usually within a few hours. If it&rsquo;s time-sensitive, call or text me at{' '}
          <a href="tel:+14085977371" style={{ color: 'var(--gold-deep)' }}>(408)&nbsp;597-7371</a>.
        </p>
        <p className="kt-note">&mdash; Kalyani</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={true}>
      <div style={{ marginBottom: '36px' }}>
        <span className="kt-field-label">What brings you here?</span>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {INTENTS.map((i) => (
            <button key={i} type="button"
              className={'kt-chip' + (intent === i ? ' sel' : '')}
              onClick={() => setIntent(intent === i ? null : i)}>{i}</button>
          ))}
        </div>
      </div>

      {intent && intent !== 'Just curious' ? (
        <div style={{ marginBottom: '36px' }}>
          <span className="kt-field-label">What&rsquo;s your timeframe?</span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {TIMEFRAMES.map((t) => (
              <button key={t} type="button"
                className={'kt-chip' + (timeframe === t ? ' sel' : '')}
                onClick={() => setTimeframe(timeframe === t ? null : t)}>{t}</button>
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <div>
          <label className="kt-field-label" htmlFor="firstName">First name</label>
          <input className="kt-input-light" id="firstName" name="firstName" type="text" autoComplete="given-name"></input>
        </div>
        <div>
          <label className="kt-field-label" htmlFor="lastName">Last name <span className="opt">(optional)</span></label>
          <input className="kt-input-light" id="lastName" name="lastName" type="text" autoComplete="family-name"></input>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <div>
          <label className="kt-field-label" htmlFor="email">Email</label>
          <input className="kt-input-light" id="email" name="email" type="email" autoComplete="email"></input>
        </div>
        <div>
          <label className="kt-field-label" htmlFor="phone">Phone <span className="opt">(optional)</span></label>
          <input className="kt-input-light" id="phone" name="phone" type="tel" autoComplete="tel"></input>
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label className="kt-field-label" htmlFor="message">Anything you&rsquo;d like to share? <span className="opt">(optional)</span></label>
        <textarea className="kt-input-light" id="message" name="message" rows="4"
          placeholder="A question, a property, a neighborhood you have your eye on&hellip;"
          style={{ resize: 'vertical', minHeight: '110px' }}></textarea>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
        <span className="kt-field-label">Monthly market updates <span className="opt">(optional)</span></span>
        {NEWSLETTERS.map((n) => (
          <label key={n} className="kt-check">
            <input type="checkbox" checked={news.includes(n)} onChange={() => toggleNews(n)}></input>
            <span className="box">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                <path d="M1 4l2.8 2.8L9 1" stroke="#F3F0EB" strokeWidth="1.6" strokeLinecap="round"></path>
              </svg>
            </span>
            {n}
          </label>
        ))}
      </div>

      {error ? <p style={{ color: '#A4543C', fontFamily: 'var(--sans)', fontSize: '14px', marginBottom: '20px' }}>{error}</p> : null}

      <button className="kt-btn btn-solid-light" type="submit" style={{ padding: '16px 44px' }}>Send</button>
      <p className="kt-body-small" style={{ marginTop: '16px', color: 'rgba(38,37,35,0.45)' }}>
        No spam, no pressure &mdash; your details go only to Kalyani.
      </p>
    </form>
  );
}

function ContactPage() {
  return (
    <div>
      <KTNav serifUI={false} base="KT Home.html"></KTNav>
      <header id="top" className="bg-dark on-dark" style={{ padding: '160px 0 64px' }}>
        <div className="kt-container">
          <p className="kt-eyebrow on-dark">Contact</p>
          <h1 className="kt-display" style={{ fontSize: 'clamp(38px, 4.4vw, 60px)' }}>Let&rsquo;s talk about your move.</h1>
        </div>
      </header>
      <section className="bg-light" style={{ padding: 'calc(72px * var(--dm)) 0' }}>
        <div className="kt-container">
          <div className="grid-contact">
            <aside className="kt-contact-aside">
              <image-slot id="contact-portrait" placeholder="Drop your portrait here" shape="rounded" radius="20"
                src="images/contact-portrait.jpg"
                style={{ width: '100%', height: 'auto', aspectRatio: '4 / 5', display: 'block', marginBottom: '28px' }}></image-slot>
              <h2 className="kt-h3" style={{ fontSize: '24px' }}>Kalyani Thilak</h2>
              <p className="kt-body-small" style={{ color: 'var(--body-on-light)', lineHeight: 2.1, marginTop: '12px' }}>
                REALTOR&reg; &middot; DRE 02254890<br></br>
                Intero Real Estate Services<br></br>
                <a href="tel:+14085977371" style={{ color: 'var(--charcoal)', textDecoration: 'none' }}>(408) 597-7371</a>
              </p>
              <p className="kt-body-small" style={{ color: 'var(--body-on-light)', lineHeight: 2.1, marginTop: '16px' }}>
                187 S J Street<br></br>
                Livermore, CA 94550
              </p>
              <div style={{ marginTop: '24px' }}>
                <NavSocial></NavSocial>
              </div>
            </aside>
            <div>
              <p className="kt-lead" style={{ maxWidth: '560px', marginBottom: '44px' }}>
                Buying, selling, or just curious about the market? Tell me a little about
                where you are &mdash; two taps and a name is enough. I&rsquo;ll take it from there.
              </p>
              <ContactForm></ContactForm>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTFooter></KTFooter>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CRM adapter — single seam for the future CRM integration.
   Today: queues leads locally + logs them. At build time, replace
   the body of submit() with ONE of:
     • fetch('https://hooks.zapier.com/hooks/catch/…', {method:'POST', body: JSON.stringify(lead)})
     • fetch('https://api.followupboss.com/v1/events', …)   (FollowUpBoss)
     • fetch('/api/lead', …)                                 (own backend)
   The page never needs to change — only this adapter.
   ───────────────────────────────────────────────────────────── */
window.KT_CRM = {
  submit(lead) {
    try {
      const q = JSON.parse(localStorage.getItem('kt-leads') || '[]');
      q.push(lead);
      localStorage.setItem('kt-leads', JSON.stringify(q));
    } catch (e) {}
    console.log('[KT_CRM] lead captured', lead);
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(<ContactPage></ContactPage>);
