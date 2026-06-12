// Kalyani Thilak — app assembly + Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "Full-bleed",
  "density": "Regular",
  "palette": ["#262623", "#F3F0EB", "#C0A278", "#7E6A4F"],
  "serifUI": false
}/*EDITMODE-END*/;

const DENSITY_MAP = { 'Compact': 0.72, 'Regular': 1, 'Airy': 1.32 };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--dm', DENSITY_MAP[t.density] || 1);
    const p = t.palette || [];
    if (p.length === 4) {
      r.setProperty('--charcoal', p[0]);
      r.setProperty('--ivory', p[1]);
      r.setProperty('--gold', p[2]);
      r.setProperty('--gold-deep', p[3]);
    }
  }, [t.density, t.palette]);

  const Hero = { 'Split': HeroSplit, 'Full-bleed': HeroFull, 'Typographic': HeroType }[t.heroVariant] || HeroFull;

  return (
    <div>
      <KTNav serifUI={t.serifUI}></KTNav>
      <Hero serifUI={t.serifUI}></Hero>
      <KTIntro serifUI={t.serifUI}></KTIntro>
      <KTServices serifUI={t.serifUI}></KTServices>
      <KTTestimonials></KTTestimonials>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTSocial></KTSocial>
        <KTNewsletter serifUI={t.serifUI}></KTNewsletter>
        <KTFooter></KTFooter>
      </div>

      <TweaksPanel>
        <TweakSection label="Layout"></TweakSection>
        <TweakRadio label="Hero" value={t.heroVariant}
          options={['Split', 'Full-bleed', 'Typographic']}
          onChange={(v) => setTweak('heroVariant', v)}></TweakRadio>
        <TweakRadio label="Density" value={t.density}
          options={['Compact', 'Regular', 'Airy']}
          onChange={(v) => setTweak('density', v)}></TweakRadio>
        <TweakSection label="Brand"></TweakSection>
        <TweakColor label="Palette" value={t.palette}
          options={[
            ['#262623', '#F3F0EB', '#C0A278', '#7E6A4F'],
            ['#23262A', '#F1F2EE', '#B9A99A', '#6E6256'],
            ['#252921', '#F2F1E9', '#A8A878', '#666A45']
          ]}
          onChange={(v) => setTweak('palette', v)}></TweakColor>
        <TweakToggle label="Serif nav & buttons" value={t.serifUI}
          onChange={(v) => setTweak('serifUI', v)}></TweakToggle>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App></App>);
