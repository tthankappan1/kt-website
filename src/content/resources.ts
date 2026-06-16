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
          `A good sale depends on three elements done right: pricing, preparation, and timing. Most of that work happens before the sign ever goes up — by the time a home hits the market, the outcome is largely already set. When all three come together, the market works in our favor: it lifts the weight, draws the right buyers, and lets us negotiate from a position of strength rather than playing catch-up. When even one is off, every later decision gets harder.`,
          `I take pride in sequencing these decisions correctly and keeping every one of them a well-informed strategy — grounded in current comparable sales, real buyer activity, and how your home actually stacks up against today's competition. Backed by market data, not guesswork.`,
        ],
      },
      {
        heading: 'The process',
        steps: [
          ['01', 'Strategy & pricing', `We start with the numbers. Pulling best-quality data from multiple platforms, we build a comparative market analysis (CMA): recent sold and pending sales, the homes actively competing for your buyer right now, and exactly how yours stacks up against them. You'll see the data behind the recommended price — not just the conclusion. This is how the market ends up working for us instead of us working against the market.`],
          ['02', 'Preparation', `This is where a home starts to show its real potential. The right preparation helps a buyer see not just what your home is today, but what their life in it could be — and that's what moves them. Still, more is not better. We invest only in the work that returns more than it costs: staging, paint, landscaping, and repairs, each chosen for impact rather than for the sake of doing everything. It's all coordinated for you — and where it makes sense, financed through Intero Concierge, so the cost comes out at close instead of out of pocket.`],
          ['03', 'Launch', `Launch day matters more than most people expect. The moment your home hits the market, it gets its biggest wave of attention — and that wave fades faster than it builds. So we make the first impression count: professional photography that shows your home at its best, a dedicated property site of its own, and full MLS syndication so every serious buyer sees it. All of it timed around a launch calendar built to concentrate interest in the first two weeks, when buyer attention is at its peak. We don't drift onto the market. We arrive.`],
          ['04', 'Offers & negotiation', `When offers come in, emotions run high — this is the moment you've been working toward, and it's easy to get pulled toward the biggest number on the page. So we slow down and lay every offer side by side: price, terms, contingencies, and the buyer's real ability to actually close. The highest offer isn't always the strongest one, and you'll see exactly why. From there, we negotiate from facts — clear-headed, on your side, and never rushed into a decision that isn't yours.`],
          ['05', 'Escrow to close', `Once you're in contract, the work shifts from selling to shepherding — and this is where deals quietly go sideways if no one's watching them. We stay ahead of all of it: inspections, disclosures, the appraisal, and every deadline in between, managed before they become problems rather than after. And you're never left wondering — a short summary lands in your inbox each week, in plain language, so you always know exactly where things stand and what's next. The goal is simple: you get to the closing table without surprises.`],
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
          `The right purchase is the one that still looks smart five years later. Buying a home is the most emotional transaction most people ever make — it's easy to fall for the wrong house, or to talk yourself into the right house at the wrong price. My job is to keep that from happening: to know the micro-market block by block, to read the disclosure package closely enough to catch what others skim past, and to be willing to walk away when the numbers or the facts don't hold up.`,
          `Speed matters in this market — homes move fast, and hesitation costs real opportunities. But speed is only an advantage after the homework is done. When you already know the neighborhood, the comparable sales, and exactly what you're looking for, you can move with confidence the moment the right home appears — quickly, but never blindly.`,
        ],
      },
      {
        heading: 'The process',
        steps: [
          ['01', 'Consultation & pre-approval', `We start by getting clear on what you're actually looking for — towns, schools, commute, budget, the trade-offs you're willing to make and the ones you're not. Then we get your financing fully underwritten up front, not just pre-qualified. The difference matters: when a seller is choosing between offers, a buyer whose loan is already underwritten reads as a sure thing — and in a competitive market, that certainty can win you the home over someone offering more. We do the hard part early so your offer carries real weight when it counts.`],
          ['02', 'The search', `Once the brief is set, the search gets focused — fewer, better showings, not a weekend of touring everything on the market. And you'll get my honest read on each one, including the homes I'd tell you to pass on. Anyone can open doors; my job is to help you see what's really there — the slope of the lot, the deferred maintenance, the thing the listing photos politely avoided. Where they exist, I'll surface off-market and coming-soon opportunities too, so you're seeing homes before the crowd does.`],
          ['03', 'Offer strategy', `When it's time to write an offer, we write it from evidence — not from nerves, and not from whatever number feels safe. Comparable sales tell us what the home is actually worth; the seller's motivation tells us what they truly care about, which is often timing or certainty as much as price; and the competition tells us how hard we need to lean in. You'll know exactly what it takes to win — and, just as important, when winning would mean overpaying. The goal was never to win at any cost. It's to win the right home, at a number that still looks smart five years from now.`],
          ['04', 'Contingencies & escrow', `Once your offer is accepted, the pressure doesn't stop — it just changes shape. We stay on top of every milestone: inspections, the appraisal, and each loan deadline your lender sets, tracked closely so nothing slips. If something turns up — a roof near the end of its life, a number that doesn't appraise — you'll hear it from me early, not in a panic at the eleventh hour. And when the facts genuinely support it, we go back and renegotiate: a price adjustment, a credit, a repair. Not to manufacture leverage, but to make sure you close on the home you actually agreed to buy.`],
          ['05', 'Keys & beyond', `For most agents, closing is the finish line. I see it as the start of the relationship. Once you have the keys, you don't lose me — you get vendor referrals when something breaks or needs updating, reminders before the property-tax deadlines that catch new owners off guard, and an annual equity check-in for as long as you own the home, so you always know where you stand and what your largest asset is actually doing. The best compliment in this business is a client who calls me years later — for their next move, or to send a friend my way.`],
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
          `Most sellers aren't caught off guard by any single cost — they're caught off guard by how the costs stack up. Commission, prep, transfer tax, the fees that only appear at closing: each one manageable on its own, but worth seeing as a whole, and early. Here's the honest picture of what it takes to sell across Alameda and Contra Costa counties — every line item on the table before you sign anything, not a surprise on the closing statement.`,
        ],
      },
      {
        heading: 'Typical line items',
        rows: [
          ['Preparation & staging', `Paint, landscaping, repairs, and staging — the same targeted-only discipline from the process above. Done right, these are often the highest-return dollars in the whole sale, which is precisely why we spend them deliberately, not broadly.`],
          ['Inspections & reports', `Pre-sale property, pest, and roof inspections, plus the local reports and retrofit certificates California requires at sale. Done early, they put you ahead of buyer surprises instead of behind them — you control the story before a buyer's inspector does.`],
          ['Title, escrow & fees', `Title insurance, escrow services, recording fees, and HOA document fees where applicable. Smaller individually, but real — itemized for you, never buried in the closing statement.`],
          ['County & city transfer taxes', `Set by the county, with some cities adding their own, and allocated by local custom. Both the rate and who customarily pays vary by city — yours is confirmed exactly on your net sheet, never estimated loosely.`],
          ['Concessions & credits', `Negotiated repair credits, rate buydowns, and sometimes a contribution toward the buyer's agent. What's customary depends on the market and the buyer pool at your price point — and none of it is decided without you.`],
          ['Agent compensation', `The largest single item, and fully discussed up front — structure, amount, and what it covers, in writing before we list.`],
        ],
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
    sub: 'A monthly, plain-English read of the Bay Area market.',
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
    title: "The Buyer’s Guide",
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
