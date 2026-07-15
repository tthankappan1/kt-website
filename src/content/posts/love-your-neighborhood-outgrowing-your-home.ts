import type { Post } from './types'

export const post: Post = {
  slug: 'love-your-neighborhood-outgrowing-your-home',
  title: `Love Your Neighborhood—but Outgrowing Your Home?`,
  category: 'Selling',
  date: '2026-07-15',
  excerpt: `Remodel, add an ADU, or sell and move up? For East Bay homeowners with a 3% mortgage and a Prop 13 tax base, the answer comes down to math most people never run.`,
  body: [
    { image: { src: '/images/posts/love-your-neighborhood-outgrowing-your-home/hero-love-your-neighborhood-outgrowing-your-home.jpg', alt: `Elegant two-story Tri-Valley craftsman home in soft early-morning light, golden East Bay hills behind`, caption: `Stay and build, or sell and move? The answer starts with your tax base.` } },
    `I keep hearing the same question from homeowners around Pleasanton, Dublin, and San Ramon: "We need more space—but does it make sense to give up the home we already have?"`,
    `It's a hard call if you bought years ago—you may have a mortgage near 3%, real equity, a property-tax bill based on a much lower purchase price, and a home you like that no longer quite fits. Moving solves the space problem. But in California, it can also reset **both your mortgage and your property taxes**. Before deciding, compare three realistic choices.`,
    { h: `Remodel the Space You Already Have` },
    `A remodel works best when you love your neighborhood but dislike how the house functions. Maybe the kitchen feels closed off, or two people work from home with one office.`,
    `A significant interior remodel runs roughly **$100,000–$250,000**; financing a $200,000 project adds about **$1,600 per month**. The advantage: you generally keep your current mortgage and property-tax base. The risk: spending heavily without solving the real problem—a beautiful kitchen won't help if the family needs two more bedrooms.`,
    { h: `Add On—or Build an ADU` },
    `When the property allows it, a 400-square-foot addition—an extra bedroom and bath, a real office—can turn a house that's almost right into a long-term home. A realistic early planning range is **$200,000–$260,000**.`,
    `A detached ADU usually costs more—roughly **$280,000–$455,000 or higher**—but it provides something an addition cannot: separate living space for aging parents, adult children, a caregiver, or possible rental income.`,
    { chart: {
      "kind": "bar",
      "title": "What Staying Put Costs Up Front",
      "source": "Illustrative planning ranges",
      "note": "Bars show the top of each planning range — projects can land lower, and detached ADUs can run higher.",
      "unit": "$",
      "bars": [
        {
          "label": "Interior remodel ($100K–$250K)",
          "value": 250000
        },
        {
          "label": "400 sq ft addition ($200K–$260K)",
          "value": 260000
        },
        {
          "label": "Detached ADU ($280K–$455K+)",
          "value": 455000
        }
      ]
    } },
    `One important California detail: new construction is generally reassessed only on the value it adds—the existing home keeps its established assessed value. Adding a room does not ordinarily trigger a full reassessment at today's market value.`,
    { h: `The California Property-Tax Surprise` },
    `Under Proposition 13, a home's taxable value is generally set at purchase, with annual increases capped near 2%. A homeowner who bought in Pleasanton ten or fifteen years ago may be paying taxes on an assessed value far below today's market value. Sell and buy again, and the replacement home is reassessed near its current price.`,
    `A simplified example: a home purchased at $750,000 might carry a taxable value around **$900,000** today—about **$10,800 a year** at a 1.20% planning rate. Buy a **$2,000,000** replacement, and that same rate produces **$24,000 a year**. That's roughly **$1,100 more every month—in property tax alone**.`,
    { chart: {
      "kind": "bar",
      "title": "The Property-Tax Reset: $10,800 to $24,000 a Year",
      "source": "Worked example — 1.20% planning rate under Prop 13",
      "note": "Same 1.20% planning rate — but the replacement home is assessed near its $2M price, while Prop 13 keeps the current home assessed at $900K.",
      "unit": "$",
      "bars": [
        {
          "label": "Current home, assessed at $900K",
          "value": 10800
        },
        {
          "label": "Replacement home, assessed at $2M",
          "value": 24000
        }
      ]
    } },
    `Exact rates vary by location and may include bonds and special assessments, but the lesson holds: moving in California can mean giving up both a low mortgage rate and a low property-tax base.`,
    { h: `What Moving Could Really Add Each Month` },
    `Consider a homeowner with a $1.5 million home, a $650,000 mortgage at 3%, and that $900,000 taxable value, moving up to a $2 million home. After selling costs, the new mortgage might be about $1.25 million—and at a rate near 6.5%, the payment could rise by roughly **$4,800 per month**. Add the **$1,100** tax increase and moving costs about **$5,900 more per month**, before insurance, HOA dues, utilities, or maintenance.`,
    { chart: {
      "kind": "donut",
      "title": "Where the Extra $5,900 a Month Goes",
      "source": "Worked example — 3% to 6.5% move-up scenario",
      "note": "The bigger mortgage is the part everyone expects — nearly a fifth of the increase is property tax alone.",
      "unit": "$",
      "slices": [
        {
          "label": "Property-tax increase",
          "value": 1100
        },
        {
          "label": "Mortgage increase",
          "value": 4800
        }
      ]
    } },
    `That doesn't make moving wrong—it means the new home should solve enough problems to justify its complete long-term cost.`,
    { h: `A Possible Exception: Proposition 19` },
    `Homeowners who are 55 or older, severely disabled, or victims of qualifying disasters may be able to transfer their existing property-tax base to a replacement primary residence anywhere in California, generally up to three times. If the replacement home costs more, part of the difference is added to the transferred value. Confirm eligibility and the exact calculation with the county assessor or a qualified tax professional.`,
    { h: `How to Decide` },
    { list: [
      `**Remodel** when you love the location, the home has good bones, and a focused project solves the problem.`,
      `**Add space** when you'll stay for years and the property supports a well-designed expansion.`,
      `**Build an ADU** when you need private, flexible living space, not just a larger main house.`,
      `**Move** when the real problem is the location, lot, commute, or floor plan—things no remodel can fix.`,
    ] },
    `Before choosing, ask five questions: What problem are we actually solving? Would the remodeled house still work in ten years? Can the property support the improvement? What is the complete budget—design, permits, temporary housing, contingency? And what will each choice cost every month?`,
    `One reminder: a $200,000 remodel does not automatically add $200,000 to the home's value. The strongest projects correct an obvious weakness, add space buyers genuinely value, or bring the home closer to the expectations of its neighborhood.`,
    { chart: {
      "kind": "bar",
      "title": "The Monthly Question: $1,600 or $5,900",
      "source": "Worked example — same homeowner, both paths",
      "note": "Financing a $200K remodel versus moving up to the $2M home, for the homeowner in this example.",
      "unit": "$",
      "bars": [
        {
          "label": "Finance a $200K remodel",
          "value": 1600
        },
        {
          "label": "Sell and buy at $2M",
          "value": 5900
        }
      ]
    } },
    `For an East Bay homeowner with a low mortgage rate and a low Proposition 13 tax base, remodeling deserves a serious look—but staying is only a bargain when the finished home truly meets your long-term needs. The smartest decision isn't the lowest estimate; it's the right home, in the right location, at a monthly cost you can comfortably live with.`,
    { cta: `Weighing a remodel, an ADU, or a move? Call or text me — I'll walk through your assessed value, what your home could realistically sell for, and what each path would actually cost per month here in the Tri-Valley.` },
    { disclaimer: `I am not a financial advisor. Please consult your CPA or trusted financial strategist before making any financial decisions.` },
    { sources: [
      { t: `California State Board of Equalization — Proposition 19`, href: 'https://www.boe.ca.gov/prop19/' },
      { t: `Freddie Mac Primary Mortgage Market Survey`, href: 'https://www.freddiemac.com/pmms' },
    ] },
  ],
}
