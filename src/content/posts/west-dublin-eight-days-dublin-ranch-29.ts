import type { Post } from './types'

export const post: Post = {
  slug: 'west-dublin-eight-days-dublin-ranch-29',
  title: `West Dublin Sold in *8 Days*. Dublin Ranch Took 29.`,
  category: 'Market Update',
  date: '2026-07-27',
  excerpt: `Same city, same three months, same headlines — and one Dublin neighborhood moved nearly four times faster than the other. The citywide number described neither of them.`,
  body: [
    { image: { src: '/images/posts/west-dublin-eight-days-dublin-ranch-29/hero-west-dublin-eight-days-dublin-ranch-29.jpg', alt: `A California valley seen from a golden ridge at mid-morning, one half in full bright sunlight over rooftops and oaks, the other half still covered by a low white blanket of fog`, caption: `One valley. Half of it is already in the sun.` } },
    `Two neighborhoods in Dublin. Same city, same three months, same set of headlines about where prices are going. In one, homes were going under contract in about eight days. In the other, they were taking twenty-nine.`,
    `If you read only Dublin's citywide number — a median of $1.32 million, up three-tenths of a percent — you would never know either of those things happened.`,
    `Everything below covers the three months ending May 2026 and includes all property types.`,
    { h: `One City, Two Markets` },
    `West Dublin's median rose 5.1% over the year, and homes there were selling in roughly eight days. Across town, Dublin Ranch's median slipped 2.1%, and its typical marketing time stretched to 29 days — up from 20 the year before.`,
    `Same city. Same window. Opposite directions.`,
    { chart: {
      "kind": "bar",
      "title": "Two Dublin Neighborhoods, One Citywide Number",
      "source": "Redfin, three months ending May 2026",
      "note": "The citywide figure sits between two neighborhoods that behaved nothing alike.",
      "unit": "days",
      "bars": [
        {
          "label": "West Dublin",
          "value": 8
        },
        {
          "label": "Dublin citywide",
          "value": 20
        },
        {
          "label": "Dublin Ranch",
          "value": 29
        }
      ]
    } },
    `Housing type is doing a lot of the work here. Dublin holds a substantial mix of newer condominiums and townhomes alongside established single-family neighborhoods, and those two things do not respond to the same pressure. HOA dues, builder inventory still arriving, square footage, and what the monthly payment actually costs a buyer all land harder on attached homes.`,
    { h: `Livermore Contains a 2.8× Spread` },
    `Livermore was the fastest-moving city in this comparison — about 11 days to contract, with the average home selling around 1% above list. It also carried the lowest citywide median of the five, at $1.15 million.`,
    `Both of those facts are true. Neither one describes a Livermore neighborhood.`,
    `South Livermore's median sat near $2.41 million, up 1.1%, with homes moving in about nine days. Springtown's was near $860,000 and down 4.5%. Northside Livermore came in around $970,000, down 3%.`,
    { chart: {
      "kind": "bar",
      "title": "One City, a 2.8× Price Spread",
      "source": "Redfin, three months ending May 2026",
      "note": "A citywide Livermore median lands in the middle of this and describes none of it.",
      "unit": "$",
      "bars": [
        {
          "label": "South Livermore",
          "value": 2410000
        },
        {
          "label": "Livermore citywide",
          "value": 1149312
        },
        {
          "label": "Northside Livermore",
          "value": 970000
        },
        {
          "label": "Springtown",
          "value": 860000
        }
      ]
    } },
    `That is a 2.8-to-1 spread inside one city's borders. And worth saying plainly: cheaper did not mean calmer. Livermore's more accessible neighborhoods were competing hard.`,
    { h: `What Actually Moved in Pleasanton` },
    `Pleasanton posted the largest citywide decline in the group — down 11.3% year over year. That number traveled fast, and it worried people it should not have.`,
    `Here is the same year measured a different way. Pleasanton's median price *per square foot* was down 5.2%, less than half the citywide drop. Homes were still drawing an average of three offers, and Redfin still classified the city as very competitive.`,
    { chart: {
      "kind": "bar",
      "title": "Two Ways to Measure the Same Pleasanton Year",
      "source": "Redfin, three months ending May 2026",
      "note": "Both figures are declines — but per-square-foot value fell less than half as far as the median.",
      "unit": "%",
      "bars": [
        {
          "label": "Citywide median price, decline",
          "value": 11.3
        },
        {
          "label": "Price per square foot, decline",
          "value": 5.2
        }
      ]
    } },
    `When a median falls twice as fast as per-square-foot value, that gap is telling you the *mix* of homes that sold changed — more modest homes, fewer large ones, a quiet season at the top end. It is not telling you that every Pleasanton home lost 11% of its value.`,
    `The neighborhoods confirm it. Pleasanton Valley was essentially flat at about $1.84 million. Valley Trails was off about 3.4%. Ponderosa and Del Prado were up.`,
    `The same pattern shows up next door. San Ramon's citywide median was down 2.5%, while ZIP code 94582 went the other way — roughly $1.92 million, up 2.4%, about 10 days on market. And Danville's 3.6% decline arrived in a year when its sales volume fell 17%, which is exactly the condition that makes a median fragile.`,
    { h: `What to Do With This` },
    `If you are selling, price against the homes a buyer will actually compare you to this month — your street, your property type, your condition — not last spring's best sale, and not your city's percentage.`,
    `If you are buying, a softer citywide median is not a negotiating position. In several of these neighborhoods, well-prepared homes were still gone in under two weeks.`,
    `And if you are a homeowner simply watching the headlines: do not multiply last year's value by your city's annual change. That arithmetic has never once produced a real number for a real house.`,
    `There is no Tri-Valley market. There are markets inside cities, inside ZIP codes, inside price bands, inside property types. The useful question was never whether the market is up or down — it is where your specific home sits inside it.`,
    { cta: `If you want to know what your neighborhood did rather than what your city did, call or text me. I will pull the comparable sales that actually apply to your home — same street, same type, same condition — and we can talk about what they mean for your timing.` },
    { disclaimer: `I am not a financial advisor. Please consult your CPA or trusted financial strategist before making any financial decisions.` },
    { disclaimer: `Market statistics cover the three months ending May 2026 and may include multiple property types. Smaller neighborhood samples can produce large percentage swings, and conditions for any specific property will vary.` },
    { sources: [
      { t: `Redfin Pleasanton Housing Market`, href: 'https://www.redfin.com/city/14986/CA/Pleasanton/housing-market' },
      { t: `Redfin West Dublin Housing Market`, href: 'https://www.redfin.com/neighborhood/57182/CA/Dublin/West-Dublin/housing-market' },
      { t: `Redfin Livermore Housing Market`, href: 'https://www.redfin.com/city/10683/CA/Livermore/housing-market' },
      { t: `Redfin San Ramon Housing Market`, href: 'https://www.redfin.com/city/17519/CA/San-Ramon/housing-market' },
      { t: `Redfin Danville Housing Market`, href: 'https://www.redfin.com/city/4658/CA/Danville/housing-market' },
    ] },
  ],
}
