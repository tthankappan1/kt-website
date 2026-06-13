export type ResourceSection = {
  heading?: string
  paras?: string[]
  steps?: [string, string, string][]
  rows?: [string, string][]
  note?: string
}

export type ResourcePage = {
  title: string
  sub: string
  sections: ResourceSection[]
}

export const RESOURCE_PAGES: Record<string, ResourcePage> = {

  'selling': {
    title: 'Selling',
    sub: 'A calm, numbers-first approach to selling your East Bay home.',
    sections: [
      {
        heading: 'How I think about selling',
        paras: [
          'A good sale is built before the sign goes up. Pricing, preparation, and timing each compound — get all three right and the market does the heavy lifting; miss one and you are negotiating from behind. My role is to sequence them correctly and keep every decision grounded in current data, not in hope.',
        ],
      },
      {
        heading: 'The process',
        steps: [
          ['01', 'Strategy & pricing', 'We start with the numbers: recent comparable sales, the active competition, and how your home actually stacks up. You will see the data behind the recommended price — not just the conclusion.'],
          ['02', 'Preparation', 'Targeted improvements only — the ones that return more than they cost. Staging, paint, landscaping, and repairs, coordinated for you (and where it makes sense, financed through Intero Concierge).'],
          ['03', 'Launch', 'Professional photography, a property site, full MLS syndication, and a launch calendar designed to concentrate attention in the first two weeks, when buyer interest peaks.'],
          ['04', 'Offers & negotiation', 'Every offer summarized side by side: price, terms, contingencies, and the buyer’s actual ability to close. We negotiate from facts, calmly.'],
          ['05', 'Escrow to close', 'Inspections, disclosures, appraisal, and timelines managed proactively, with a weekly summary so you always know exactly where things stand.'],
        ],
      },
    ],
  },

  'buying': {
    title: 'Buying',
    sub: 'Finding the right home — and paying the right price for it.',
    sections: [
      {
        heading: 'How I think about buying',
        paras: [
          'The right purchase is the one that still looks smart five years later. That means knowing the micro-market, reading the disclosure package carefully, and being willing to walk away. Speed matters in this market — but only after the homework is done.',
        ],
      },
      {
        heading: 'The process',
        steps: [
          ['01', 'Consultation & pre-approval', 'We define the brief — towns, schools, commute, budget — and get your financing fully underwritten up front, so your offers carry real weight.'],
          ['02', 'The search', 'Curated showings and honest assessments, including the homes I would pass on. Off-market and coming-soon opportunities surfaced where possible.'],
          ['03', 'Offer strategy', 'Comparable data, seller motivation, and competition level shape every offer. You will know what it takes to win — and when winning would mean overpaying.'],
          ['04', 'Contingencies & escrow', 'Inspections, appraisal, and loan milestones tracked closely. Issues surfaced early, and renegotiated when the facts support it.'],
          ['05', 'Keys & beyond', 'Closing is the start, not the end — vendor referrals, tax calendar reminders, and an annual equity check-in for as long as you own the home.'],
        ],
      },
    ],
  },

  'cost-of-selling': {
    title: 'The Cost of Selling',
    sub: 'Every line item, in plain view, before you commit to anything.',
    sections: [
      {
        paras: [
          'Most sellers are surprised less by any single cost than by how the costs add up. Here is the honest picture of what it takes to sell in Alameda and Contra Costa counties — every line item on the table before you sign anything.',
        ],
      },
      {
        heading: 'Typical line items',
        rows: [
          ['Agent compensation', 'The largest single item, and fully discussed up front — structure, amount, and what it covers, in writing before we list.'],
          ['Preparation & staging', 'Paint, landscaping, repairs, and staging. Typically the highest-return dollars in the entire sale when targeted well.'],
          ['County & city transfer taxes', 'Set by the county (and some cities) and allocated by local custom — varies by city, confirmed on your net sheet.'],
          ['Inspections & reports', 'Pre-sale property, pest, and roof inspections, plus required local reports and retrofit certificates.'],
          ['Title, escrow & fees', 'Title insurance, escrow services, recording fees, and HOA document fees where applicable.'],
          ['Concessions & credits', 'Negotiated repair credits or rate buydowns, depending on the market and the buyer pool at your price point.'],
        ],
        note: 'Placeholder copy — exact figures vary by city and price point. Before listing, you receive a personalized net sheet with every number filled in.',
      },
    ],
  },

  'intero-concierge': {
    title: 'Intero Concierge',
    sub: 'Get the home market-ready now. Settle the cost at close.',
    sections: [
      {
        paras: [
          'Homes that are prepared sell for more — but preparation costs money at exactly the moment most sellers prefer not to spend it. Intero Concierge bridges that gap: the cost of getting your home market-ready is fronted, then settled when the home closes.',
        ],
      },
      {
        heading: 'How it works',
        steps: [
          ['01', 'Plan', 'We walk the home together and agree on the short list of improvements that will actually move the sale price.'],
          ['02', 'Prepare', 'Vetted contractors and stagers do the work — coordinated and supervised, with no upfront cost to you.'],
          ['03', 'Settle at close', 'The costs are repaid from proceeds at closing. No surprises, no out-of-pocket spend along the way.'],
        ],
      },
      {
        heading: 'What it can cover',
        rows: [
          ['Staging & styling', 'Full or partial staging, furniture rental, and art.'],
          ['Paint & flooring', 'Interior repainting, refinishing, carpet and flooring replacement.'],
          ['Landscaping', 'Front-yard refresh, cleanup, and curb-appeal work.'],
          ['Repairs & cosmetic updates', 'Punch-list repairs, lighting, fixtures, and selective cosmetic renovation.'],
        ],
        note: 'Generic program description — availability, limits, and terms are set by Intero and confirmed in writing before any work begins.',
      },
    ],
  },

  'schools': {
    title: 'Schools in Alameda & Contra Costa',
    sub: 'The district map behind every East Bay buying decision.',
    sections: [
      {
        paras: [
          'Schools drive East Bay real estate decisions more than any other single factor. This is the high-level map of the districts serving the towns in my neighborhood guides — the starting point, not the final word.',
        ],
      },
      {
        heading: 'Alameda County',
        rows: [
          ['Pleasanton USD', 'Serves Pleasanton — Amador Valley and Foothill High.'],
          ['Dublin USD', 'Serves Dublin — newer campuses, growing with the city.'],
          ['Livermore Valley Joint USD', 'Serves Livermore — Granada and Livermore High.'],
          ['Fremont USD', 'Serves Fremont — the Mission San Jose and Irvington attendance areas are the most sought-after.'],
          ['Castro Valley USD', 'Serves Castro Valley — the standout district of the inner East Bay.'],
        ],
      },
      {
        heading: 'Contra Costa County',
        rows: [
          ['San Ramon Valley USD', 'Serves San Ramon, Danville, and Alamo — consistently among the top districts in California.'],
          ['Walnut Creek districts', 'Walnut Creek splits among Walnut Creek SD, Mt. Diablo USD, and Acalanes UHSD — always check per address.'],
          ['Lamorinda districts', 'Lafayette, Orinda, and Moraga each run their own K–8 district, feeding the Acalanes UHSD high schools — Acalanes, Miramonte, and Campolindo.'],
        ],
        note: 'Verify any specific address directly with the district before writing an offer — boundaries and enrollment policies change.',
      },
    ],
  },

  'market-updates': {
    title: 'Market Updates',
    sub: 'A monthly, plain-English read of the East Bay market.',
    sections: [
      {
        paras: [
          'Once a month: what sold, what sat, where pricing is actually heading, and what it means depending on whether you are buying or selling. No cheerleading — just the numbers and an honest interpretation.',
        ],
      },
      {
        heading: 'What each update covers',
        rows: [
          ['The numbers', 'Closed sales, inventory, days on market, and list-to-sale ratios, city by city.'],
          ['The read', 'What the numbers actually mean this month — beyond the headline.'],
          ['Buyer & seller notes', 'How to position depending on which side of the table you are on.'],
        ],
        note: 'The first update publishes when the site goes live. Sign up below to receive them by email.',
      },
    ],
  },

  'buyers-guide': {
    title: 'The Buyer’s Guide',
    sub: 'Everything worth knowing before your first offer.',
    sections: [
      {
        paras: [
          'Everything I wish every buyer knew before their first offer, in one place — written for the East Bay specifically: the customs, the costs, and the competitive dynamics of this market.',
        ],
      },
      {
        heading: 'Inside the guide',
        rows: [
          ['Financing first', 'Pre-approval versus underwritten approval — and why the difference wins offers.'],
          ['Reading a disclosure package', 'What the reports actually say, and the red flags worth slowing down for.'],
          ['Anatomy of an offer', 'Price, contingencies, timelines, and the levers that matter beyond price.'],
          ['Contingencies explained', 'Inspection, appraisal, and loan contingencies — what each protects, and what waiving really risks.'],
          ['Closing costs & escrow', 'Who customarily pays for what in Alameda and Contra Costa counties, and the timeline from acceptance to keys.'],
          ['After you close', 'Property taxes, exemptions, and the first-year homeowner calendar.'],
        ],
        note: 'Draft outline — the full guide will be available as a download once finalized.',
      },
    ],
  },

}

export const RESOURCE_SLUGS = Object.keys(RESOURCE_PAGES)
