import { KTNav } from '@/components/nav/kt-nav'
import { HeroFull } from '@/components/home/hero-full'
import { KTIntro } from '@/components/home/intro'
import { KTServices } from '@/components/home/services'
import { KTTestimonials } from '@/components/home/testimonials'
import { KTSocialStrip } from '@/components/close/kt-social-strip'
import { KTNewsletter } from '@/components/close/kt-newsletter'
import { KTFooter } from '@/components/close/kt-footer'

export const metadata = { alternates: { canonical: '/' } }

export default function Home() {
  return (
    <div>
      <KTNav />
      <main id="main">
        <HeroFull />
        <KTIntro />
        <KTServices />
        <KTTestimonials />
      </main>
      <div className="bg-dark on-dark" style={{ position: 'relative' }}>
        <KTSocialStrip />
        <KTNewsletter />
        <KTFooter />
      </div>
    </div>
  )
}
