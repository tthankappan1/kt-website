import Link from 'next/link'
import { PhotoSlot } from '@/components/ui/photo-slot'

export function KTIntro() {
  return (
    <section id="about" className="kt-section bg-light">
      <div className="kt-container">
        <div className="grid-intro">
          {/* Portrait column */}
          <div>
            <PhotoSlot
              id="about-portrait"
              alt="Portrait of Kalyani Thilak"
              radius={24}
              style={{ width: '100%', maxWidth: '360px', height: '440px', display: 'block' }}
            />
            <p
              className="kt-caption"
              style={{ marginTop: '12px', letterSpacing: '0.12em', color: 'var(--gold-deep)' }}
            >
              KALYANI THILAK &middot; REALTOR&reg;
            </p>
          </div>

          {/* Copy column */}
          <div>
            <p className="kt-eyebrow">Meet Kalyani</p>
            <h2 className="kt-h1" style={{ marginBottom: 'var(--gap-h1)' }}>
              A <em className="kt-em">home</em> is never just a transaction.
            </h2>
            <div className="kt-measure" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p className="kt-lead">
                Twenty years ago, the Bay Area looked nothing like it does today. I watched it crash,
                rebuild, empty out in a pandemic, and turn into a market that still keeps all of us
                guessing. I didn&rsquo;t just live through those years. I paid attention to them. And
                somewhere in all that change, I learned the thing that still drives me: a home is
                never just a transaction. It&rsquo;s the center of someone&rsquo;s whole life.
              </p>
              <p>
                I didn&rsquo;t start here. My first career was in IT, leading teams and discovering
                that the part I loved most wasn&rsquo;t the technology. It was the people. That pull
                is what carried me toward loans and real estate, where the numbers and someone&rsquo;s
                real life finally meet in the same room. I even spent a season teaching English and
                Math to young students, and I&rsquo;d be lying if I said I didn&rsquo;t love every
                minute of helping someone find their footing.
              </p>
              <p>
                That&rsquo;s the thread through all of it: I like helping people. It shows up in how I
                work, too. I&rsquo;d rather walk you slowly through the details than rush you toward a
                signature: explain what actually matters in an inspection, help you shape an offer
                that&rsquo;s strong and sensible, and never push you into a decision that isn&rsquo;t
                yours. My clients tend to use the same words for it: patient, honest, and steady when
                things get tense.
              </p>

              <blockquote
                style={{
                  borderLeft: '2px solid var(--gold-deep)',
                  paddingLeft: '22px',
                  margin: '12px 0',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontVariationSettings: '"opsz" 36',
                    fontSize: '19px',
                    lineHeight: 1.55,
                    color: 'var(--charcoal)',
                  }}
                >
                  &ldquo;Kalyani took the time to walk me through the inspection details, explain what
                  was actually important, and help me put together a strong, sensible offer without
                  any pressure.&rdquo;
                </p>
                <cite
                  style={{
                    display: 'block',
                    marginTop: '12px',
                    fontFamily: 'var(--sans)',
                    fontStyle: 'normal',
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-deep)',
                  }}
                >
                  Client review
                </cite>
              </blockquote>

              <p>
                When the workday ends, I&rsquo;m home with the two children who teach me something new
                every single day, and a husband who has been my backbone through all of it.
                You&rsquo;ll find me cooking, getting a workout in, and soaking up the people I love. I
                thank God for the family and friends who have stood with me through thick and thin.
              </p>
              <p>
                And I try to send some of that out into the world by supporting small business owners,
                standing behind nonprofits, and believing, deeply, in women lifting up other women. My
                goal for the future is simple: help people reach their real estate dreams, be a steady
                hand when someone needs one, and one day go where I can give back to women&rsquo;s
                rights and education. Because the world gets better every time a woman is free to build
                the life she imagines.
              </p>
            </div>
            <div style={{ marginTop: '40px' }}>
              <Link className="kt-btn btn-solid-light" href="/contact">
                Work with Kalyani
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
