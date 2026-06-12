// Kalyani Thilak — dark closing band: social strip, newsletter, footer
// (multi-section pages bookend in dark — brand hard rule 7)

/* ---------- Social strip (Dark mode — photography allowed) ---------- */
function KTSocial() {
  const tiles = [
    { id: 'social-1', ph: 'Drop a recent post — listing reel' },
    { id: 'social-2', ph: 'Drop a recent post — market update' },
    { id: 'social-3', ph: 'Drop a recent post — neighborhood' },
    { id: 'social-4', ph: 'Drop a recent post — behind the scenes' },
  ];
  return (
    <div className="kt-container" style={{ paddingTop: 'var(--sect-pad)' }}>
      <div className="kt-reveal" style={{ textAlign: 'center', marginBottom: 'var(--gap-section)' }}>
        <p className="kt-eyebrow on-dark">Follow along</p>
        <h2 className="kt-h1" style={{ color: 'var(--ivory)' }}>The Tri-Valley, <em className="kt-em">weekly</em>.</h2>
        <p className="kt-measure" style={{ margin: '20px auto 0', color: 'var(--body-on-dark)' }}>
          Market updates, neighborhood guides, and a look at what is actually selling &mdash;
          written for people who read past the headline.
        </p>
      </div>
      <div className="kt-social-grid kt-reveal">
        {tiles.map((t) => (
          <image-slot key={t.id} id={t.id} placeholder={t.ph} shape="rounded" radius="16"
            style={{ width: '100%', height: 'auto', aspectRatio: '1 / 1', display: 'block' }}></image-slot>
        ))}
      </div>
    </div>
  );
}

/* ---------- Newsletter signup ---------- */
function KTNewsletter({ serifUI, archiveLink = true }) {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState('idle'); // idle | error | done
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); return; }
    setState('done');
  };
  return (
    <div className="kt-container" style={{ paddingTop: 'var(--sect-pad)', paddingBottom: 'var(--sect-pad)' }}>
      <div className="grid-news kt-reveal">
        <div>
          <p className="kt-eyebrow on-dark">The Bay Area Home Guide</p>
          <h2 className="kt-h2" style={{ color: 'var(--ivory)', fontSize: 'clamp(24px, 2.4vw, 30px)' }}>
            One email a week. Where the <em className="kt-em">market</em> is, and what it means.
          </h2>
          {archiveLink ? (
            <a className="kt-read" href="Blog.html" style={{ color: 'var(--gold)', display: 'inline-block', marginTop: '18px' }}>Browse past issues &rarr;</a>
          ) : null}
        </div>
        <div>
          {state === 'done' ? (
            <p style={{ color: 'var(--gold)', fontFamily: 'var(--serif)', fontSize: '18px' }}>
              You are on the list. Welcome.
            </p>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', gap: '12px' }}>
              <input className="kt-input" type="email" placeholder="Email address" value={email}
                onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
                aria-label="Email address"></input>
              <button className={'kt-btn btn-solid-dark' + (serifUI ? ' serif-ui' : '')} type="submit"
                style={{ flex: 'none' }}>Sign up</button>
            </form>
          )}
          {state === 'error' ? (
            <p className="kt-body-small" style={{ marginTop: '10px', color: 'var(--gold)' }}>
              Please enter a valid email address.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ---------- Footer with compliance lockup ---------- */
function KTFooter() {
  return (
    <footer id="contact" style={{ position: 'relative' }}>
      <div className="kt-container">
        <hr className="kt-footer-rule"></hr>
        <div className="grid-foot" style={{ padding: 'calc(64px * var(--dm)) 0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <Monogram></Monogram>
              <span className="kt-wordmark" style={{ fontSize: '14px' }}>Kalyani Thilak</span>
            </div>
            <p className="kt-body-small" style={{ color: 'var(--body-on-dark)', lineHeight: 2 }}>
              REALTOR&reg; &middot; DRE 02254890<br></br>
              Intero Real Estate Services<br></br>
              A Berkshire Hathaway Affiliate<br></br>
              187 S J Street &middot; Livermore &middot; California
            </p>
          </div>
          <div>
            <p className="kt-eyebrow on-dark">Contact</p>
            <p className="kt-body-small" style={{ color: 'var(--body-on-dark)', lineHeight: 2.2 }}>
              <a href="mailto:kthilak@intero.com" style={{ color: 'var(--ivory)', textDecoration: 'none' }}>kthilak@intero.com</a><br></br>
              <a href="tel:+14085977371" style={{ color: 'var(--ivory)', textDecoration: 'none' }}>(408) 597-7371</a>
            </p>
            <div style={{ marginTop: '16px' }}>
              <NavSocial></NavSocial>
            </div>
          </div>
          <div>
            <p className="kt-eyebrow on-dark">Areas served</p>
            <p className="kt-body-small" style={{ color: 'var(--body-on-dark)', lineHeight: 2.2 }}>
              Pleasanton &middot; Dublin<br></br>
              San Ramon &middot; Livermore
            </p>
          </div>
        </div>
        <hr className="kt-footer-rule"></hr>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 48px', flexWrap: 'wrap', gap: '16px' }}>
          <p className="kt-caption" style={{ color: 'rgba(243,240,235,0.45)', maxWidth: '640px' }}>
            Kalyani Thilak is a real estate salesperson licensed by the state of California, affiliated
            with Intero Real Estate Services. All material is intended for informational purposes only.
            Information is compiled from sources deemed reliable but is subject to errors, omissions,
            and changes without notice.
          </p>
          <p className="kt-caption" style={{ color: 'rgba(243,240,235,0.45)' }}>&copy; 2026 Kalyani Thilak</p>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { KTSocial, KTNewsletter, KTFooter });
