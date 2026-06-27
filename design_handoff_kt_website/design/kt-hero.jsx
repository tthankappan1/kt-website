// Kalyani Thilak — Home page sections
// Brand: charcoal/ivory/gold, Fraunces + Inter, hairline frame w/ asymmetric corner

const { useState, useEffect, useRef } = React;

/* ---------- tiny helpers ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.kt-reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
  return null;
}

function Monogram() {
  return (
    <div className="kt-monogram" aria-hidden="true">
      <span>K</span><span className="mg-t">T</span>
    </div>
  );
}

/* ---------- Client Resources dropdown data ---------- */
const CLIENT_RESOURCES = [
  { label: 'Selling', href: 'Selling.html' },
  { label: 'Buying', href: 'Buying.html' },
  { label: 'Cost of Selling', href: 'Cost of Selling.html' },
  { label: 'Intero Concierge', href: 'Intero Concierge.html' },
  { label: 'Alameda County Neighborhoods', href: 'Alameda County Neighborhoods.html' },
  { label: 'Contra Costa County Neighborhoods', href: 'Contra Costa County Neighborhoods.html' },
  { label: 'Schools in Alameda & Contra Costa', href: 'Schools in Alameda and Contra Costa.html' },
  { label: 'Market Updates', href: 'Market Updates.html' },
  { label: "Buyer's Guide", href: 'Buyers Guide.html' },
];

function ResourcesDrop({ serifUI }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={'kt-navdrop' + (open ? ' open' : '')}
         onMouseEnter={() => setOpen(true)}
         onMouseLeave={() => setOpen(false)}>
      <a className={'kt-navlink' + (serifUI ? ' serif-ui' : '')} href="#resources"
         aria-haspopup="true" aria-expanded={open}
         onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
        Client Resources
        <svg className="drop-caret" width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true">
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.2"></path>
        </svg>
      </a>
      <div className="kt-drop-wrap">
        <div className="kt-drop-panel">
          {CLIENT_RESOURCES.map((item) => (
            <a key={item.label} className="kt-drop-item" href={item.href}
               onClick={(e) => { if (item.href === '#') e.preventDefault(); }}>{item.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Nav social icons ---------- */
const KT_SOCIALS = [
  { label: 'Facebook', slug: 'facebook', href: 'https://www.facebook.com/profile.php?id=100076622906268', d: 'M13.4 21.5v-7.6h2.55l.38-2.96H13.4V9.05c0-.86.24-1.44 1.47-1.44h1.57V4.96c-.27-.04-1.2-.12-2.29-.12-2.26 0-3.81 1.38-3.81 3.92v2.18H7.78v2.96h2.56v7.6h3.06Z' },
  { label: 'LinkedIn', slug: 'linkedin', href: 'https://www.linkedin.com/in/kalyanithilak', d: 'M6.94 8.5H3.56v12h3.38v-12ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM12.6 8.5H9.36v12h3.37v-6.3c0-1.71.33-3.37 2.45-3.37 2.09 0 2.12 1.96 2.12 3.48v6.19h3.38v-6.86c0-2.93-.63-5.44-4.06-5.44-1.65 0-2.75.9-3.2 1.76h-.05V8.5H12.6Z' },
  { label: 'Instagram', slug: 'instagram', href: 'https://www.instagram.com/kalyani_thilak_intero/', d: 'M12 4.32c2.5 0 2.8.01 3.79.06.91.04 1.41.19 1.74.32.44.17.75.37 1.08.7.33.33.53.64.7 1.08.13.33.28.83.32 1.74.05.99.06 1.29.06 3.79s-.01 2.8-.06 3.79c-.04.91-.19 1.41-.32 1.74-.17.44-.37.75-.7 1.08-.33.33-.64.53-1.08.7-.33.13-.83.28-1.74.32-.99.05-1.29.06-3.79.06s-2.8-.01-3.79-.06c-.91-.04-1.41-.19-1.74-.32a2.9 2.9 0 0 1-1.08-.7 2.9 2.9 0 0 1-.7-1.08c-.13-.33-.28-.83-.32-1.74-.05-.99-.06-1.29-.06-3.79s.01-2.8.06-3.79c.04-.91.19-1.41.32-1.74.17-.44.37-.75.7-1.08.33-.33.64-.53 1.08-.7.33-.13.83-.28 1.74-.32.99-.05 1.29-.06 3.79-.06ZM12 2.6c-2.55 0-2.87.01-3.87.06-1 .04-1.68.2-2.28.43-.62.24-1.14.56-1.66 1.09-.53.52-.85 1.04-1.09 1.66-.23.6-.39 1.28-.43 2.28-.05 1-.06 1.32-.06 3.88s.01 2.87.06 3.88c.04 1 .2 1.68.43 2.28.24.62.56 1.14 1.09 1.66.52.52 1.04.85 1.66 1.09.6.23 1.28.39 2.28.43 1 .05 1.32.06 3.87.06s2.87-.01 3.87-.06c1-.04 1.68-.2 2.28-.43a4.6 4.6 0 0 0 1.66-1.09c.53-.52.85-1.04 1.09-1.66.23-.6.39-1.28.43-2.28.05-1 .06-1.32.06-3.88s-.01-2.87-.06-3.88c-.04-1-.2-1.68-.43-2.28a4.6 4.6 0 0 0-1.09-1.66 4.6 4.6 0 0 0-1.66-1.09c-.6-.23-1.28-.39-2.28-.43-1-.05-1.32-.06-3.87-.06Zm0 6.57a4.83 4.83 0 1 0 0 9.66 4.83 4.83 0 0 0 0-9.66Zm0 7.97a3.14 3.14 0 1 1 0-6.28 3.14 3.14 0 0 1 0 6.28Zm5.02-9.3a1.13 1.13 0 1 0 0 2.26 1.13 1.13 0 0 0 0-2.26Z' },
];

function NavSocial() {
  return (
    <div className="kt-nav-social">
      {KT_SOCIALS.map((s) => (
        <a key={s.label} className={'kt-soc soc-' + s.slug} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={s.d}></path>
          </svg>
        </a>
      ))}
    </div>
  );
}

/* ---------- Nav ---------- */
function KTNav({ serifUI, base = '', blogLabel }) {
  let blogNav = blogLabel;
  if (!blogNav) {
    try { blogNav = localStorage.getItem('kt-blog-nav') || 'Newsletter'; } catch (e) { blogNav = 'Newsletter'; }
  }
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const linkCls = 'kt-navlink' + (serifUI ? ' serif-ui' : '');
  return (
    <nav className={'kt-nav' + (scrolled ? ' scrolled' : '')}>
      <div className="kt-nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href={base + '#top'} aria-label="Kalyani Thilak — home" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Monogram></Monogram>
          </a>
          <a className="kt-wordmark" href={base + '#top'}>
            Kalyani Thilak
            <span className="wm-sub">REALTOR&reg; &middot; TRI-VALLEY</span>
          </a>
          <span className="kt-nav-divider" aria-hidden="true"></span>
          <span className="kt-nav-intero">Intero</span>
        </div>
        <div className="kt-navlinks">
          <a className={linkCls} href={base + '#about'}>About</a>
          <a className={linkCls} href={base + '#services'}>Services</a>
          <a className={linkCls} href={base + '#testimonials'}>Testimonials</a>
          <a className={linkCls} href="Blog.html">{blogNav}</a>
          <ResourcesDrop serifUI={serifUI}></ResourcesDrop>
          <NavSocial></NavSocial>
          <a className={'kt-btn btn-ghost-dark' + (serifUI ? ' serif-ui' : '')}
             href="Contact.html" style={{ padding: '10px 22px' }}>Contact</a>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Hero variant A — brand-canonical 50/50 split ---------- */
function HeroSplit({ serifUI }) {
  return (
    <header id="top" className="bg-dark on-dark kt-hero-split" style={{ position: 'relative', minHeight: '92vh' }}>
      <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', padding: 'clamp(120px, 14vh, 160px) 6.5% 80px' }}>
        <div>
          <p className="kt-eyebrow on-dark">Pleasanton &middot; Dublin &middot; San Ramon &middot; Livermore</p>
          <h1 className="kt-display">Tri-Valley real estate, advised with <em className="kt-em">clarity</em>.</h1>
          <hr className="kt-rule"></hr>
          <p className="kt-lead kt-measure" style={{ color: 'var(--body-on-dark)', maxWidth: '480px' }}>
            Calm, data-grounded guidance for buyers and sellers in the $1.5M&ndash;$5M Tri-Valley
            market. No noise, no pressure &mdash; just the numbers, and what they mean for you.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '40px', flexWrap: 'wrap' }}>
            <a className={'kt-btn btn-solid-dark' + (serifUI ? ' serif-ui' : '')} href="Contact.html">Start a conversation</a>
            <a className={'kt-btn btn-ghost-dark' + (serifUI ? ' serif-ui' : '')} href="#about">Meet Kalyani</a>
          </div>
        </div>
      </div>
      <div style={{ flex: '1 1 50%', position: 'relative' }}>
        <image-slot id="hero-split-img" placeholder="Drop hero image — warm dusk, modern Tri-Valley home"
          shape="rect" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}></image-slot>
        <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(38,37,35,0.55) 0%, rgba(38,37,35,0) 40%)' }}></div>
      </div>
    </header>
  );
}

/* ---------- Hero variant B — full-bleed photographic ---------- */
function HeroFull({ serifUI }) {
  return (
    <header id="top" className="bg-dark on-dark" style={{ position: 'relative', minHeight: '94vh' }}>
      <image-slot id="hero-full-img" placeholder="Drop full-bleed hero image — Tri-Valley hills at dusk"
        shape="rect" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}></image-slot>
      <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(38,37,35,0.55) 0%, rgba(38,37,35,0.15) 40%, rgba(38,37,35,0.78) 100%)' }}></div>
      <div className="kt-container" style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', minHeight: '94vh', paddingBottom: '12vh', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', maxWidth: '640px' }}>
          <p className="kt-eyebrow on-dark">Pleasanton &middot; Dublin &middot; San Ramon &middot; Livermore</p>
          <h1 className="kt-display">Kalyani Thilak</h1>
          <hr className="kt-rule"></hr>
          <p className="kt-lead" style={{ color: 'var(--body-on-dark)', maxWidth: '480px' }}>
            Luxury Tri-Valley real estate, with <em className="kt-em" style={{ fontFamily: 'var(--serif)' }}>clarity</em> at
            every step &mdash; for buyers and sellers who read the numbers.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '36px', flexWrap: 'wrap' }}>
            <a className={'kt-btn btn-solid-dark' + (serifUI ? ' serif-ui' : '')} href="#about">Meet Kalyani</a>
            <a className={'kt-btn btn-ghost-dark' + (serifUI ? ' serif-ui' : '')} href="Contact.html">Contact</a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero variant C — typographic with inset image ---------- */
function HeroType({ serifUI }) {
  return (
    <header id="top" className="bg-dark on-dark" style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
      <div className="kt-container" style={{ width: '100%', paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="grid-herotype">
          <div>
            <p className="kt-eyebrow on-dark">Tri-Valley &middot; Est. relationships, not transactions</p>
            <h1 className="kt-display" style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}>
              Where the <em className="kt-em">market</em> is today &mdash; and what it means for you.
            </h1>
            <hr className="kt-rule"></hr>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
              <a className={'kt-btn btn-solid-dark' + (serifUI ? ' serif-ui' : '')} href="Contact.html">Start a conversation</a>
              <a className={'kt-btn btn-ghost-dark' + (serifUI ? ' serif-ui' : '')} href="#services">How I work</a>
            </div>
          </div>
          <div>
            <image-slot id="hero-type-img" placeholder="Drop portrait or architectural image"
              shape="rounded" radius="24"
              style={{ width: '100%', height: 'min(58vh, 520px)', display: 'block' }}></image-slot>
            <p className="kt-caption" style={{ marginTop: '12px', color: 'rgba(243,240,235,0.5)', letterSpacing: '0.1em' }}>
              PLEASANTON &middot; CALIFORNIA
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { useReveal, Monogram, KTNav, NavSocial, HeroSplit, HeroFull, HeroType });
