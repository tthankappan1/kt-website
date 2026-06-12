// Site-wide constants — locked decisions from PROJECT-STATUS.md.

export const SITE_URL = 'https://kalyanithilak.com'

export const CONTACT_EMAIL = 'kthilak@intero.com' // interim; may move to a kalyanithilak.com mailbox
export const CONTACT_PHONE_DISPLAY = '(408) 597-7371'
export const CONTACT_PHONE_TEL = '+14085977371'
export const DRE = '02254890'
export const OFFICE_ADDRESS_LINES = ['187 S J Street', 'Livermore, CA 94550'] as const

export type ClientResource = { label: string; href: string }

// Client Resources dropdown — 9 items, order locked (dropdown reads best last).
export const CLIENT_RESOURCES: ClientResource[] = [
  { label: 'Selling', href: '/resources/selling' },
  { label: 'Buying', href: '/resources/buying' },
  { label: 'Cost of Selling', href: '/resources/cost-of-selling' },
  { label: 'Intero Concierge', href: '/resources/intero-concierge' },
  { label: 'Alameda County Neighborhoods', href: '/neighborhoods/alameda-county' },
  { label: 'Contra Costa County Neighborhoods', href: '/neighborhoods/contra-costa-county' },
  { label: 'Schools in Alameda & Contra Costa', href: '/resources/schools' },
  { label: 'Market Updates', href: '/resources/market-updates' },
  { label: "Buyer's Guide", href: '/resources/buyers-guide' },
]

export type Social = { label: string; slug: 'facebook' | 'linkedin' | 'instagram'; href: string; d: string }

// Real profiles; icons are inline SVG path data from the prototype (kt-hero.jsx KT_SOCIALS).
export const KT_SOCIALS: Social[] = [
  {
    label: 'Facebook',
    slug: 'facebook',
    href: 'https://www.facebook.com/profile.php?id=100076622906268',
    d: 'M13.4 21.5v-7.6h2.55l.38-2.96H13.4V9.05c0-.86.24-1.44 1.47-1.44h1.57V4.96c-.27-.04-1.2-.12-2.29-.12-2.26 0-3.81 1.38-3.81 3.92v2.18H7.78v2.96h2.56v7.6h3.06Z',
  },
  {
    label: 'LinkedIn',
    slug: 'linkedin',
    href: 'https://www.linkedin.com/in/kalyanithilak',
    d: 'M6.94 8.5H3.56v12h3.38v-12ZM5.25 3.5a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM12.6 8.5H9.36v12h3.37v-6.3c0-1.71.33-3.37 2.45-3.37 2.09 0 2.12 1.96 2.12 3.48v6.19h3.38v-6.86c0-2.93-.63-5.44-4.06-5.44-1.65 0-2.75.9-3.2 1.76h-.05V8.5H12.6Z',
  },
  {
    label: 'Instagram',
    slug: 'instagram',
    href: 'https://www.instagram.com/kalyani_thilak_intero/',
    d: 'M12 4.32c2.5 0 2.8.01 3.79.06.91.04 1.41.19 1.74.32.44.17.75.37 1.08.7.33.33.53.64.7 1.08.13.33.28.83.32 1.74.05.99.06 1.29.06 3.79s-.01 2.8-.06 3.79c-.04.91-.19 1.41-.32 1.74-.17.44-.37.75-.7 1.08-.33.33-.64.53-1.08.7-.33.13-.83.28-1.74.32-.99.05-1.29.06-3.79.06s-2.8-.01-3.79-.06c-.91-.04-1.41-.19-1.74-.32a2.9 2.9 0 0 1-1.08-.7 2.9 2.9 0 0 1-.7-1.08c-.13-.33-.28-.83-.32-1.74-.05-.99-.06-1.29-.06-3.79s.01-2.8.06-3.79c.04-.91.19-1.41.32-1.74.17-.44.37-.75.7-1.08.33-.33.64-.53 1.08-.7.33-.13.83-.28 1.74-.32.99-.05 1.29-.06 3.79-.06ZM12 2.6c-2.55 0-2.87.01-3.87.06-1 .04-1.68.2-2.28.43-.62.24-1.14.56-1.66 1.09-.53.52-.85 1.04-1.09 1.66-.23.6-.39 1.28-.43 2.28-.05 1-.06 1.32-.06 3.88s.01 2.87.06 3.88c.04 1 .2 1.68.43 2.28.24.62.56 1.14 1.09 1.66.52.52 1.04.85 1.66 1.09.6.23 1.28.39 2.28.43 1 .05 1.32.06 3.87.06s2.87-.01 3.87-.06c1-.04 1.68-.2 2.28-.43a4.6 4.6 0 0 0 1.66-1.09c.53-.52.85-1.04 1.09-1.66.23-.6.39-1.28.43-2.28.05-1 .06-1.32.06-3.88s-.01-2.87-.06-3.88c-.04-1-.2-1.68-.43-2.28a4.6 4.6 0 0 0-1.09-1.66 4.6 4.6 0 0 0-1.66-1.09c-.6-.23-1.28-.39-2.28-.43-1-.05-1.32-.06-3.87-.06Zm0 6.57a4.83 4.83 0 1 0 0 9.66 4.83 4.83 0 0 0 0-9.66Zm0 7.97a3.14 3.14 0 1 1 0-6.28 3.14 3.14 0 0 1 0 6.28Zm5.02-9.3a1.13 1.13 0 1 0 0 2.26 1.13 1.13 0 0 0 0-2.26Z',
  },
]
