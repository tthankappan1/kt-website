// Kalyani Thilak — blog / newsletter archive data
// ============================================================
// Posts marked [REAL] are actual newsletter issues supplied by
// the user. Posts marked [DRAFT] are generic placeholders to be
// replaced. To add a post: paste a new object into KT_POSTS
// (anywhere — sorting is automatic).
//
// body block types:
//   "string"            paragraph (*italic* and **bold** supported)
//   { h: '...' }        section heading (*word* renders gold italic)
//   { cta: '...' }      gold-tint call-to-action callout
//   { disclaimer: '..'} small italic compliance line
//   { sources: [{ t, href }] }  sources list
//
// Titles support *word* for the brand's gold-italic emphasis.
// Cover image is OPTIONAL: add `cover: true` to a post to get a
// drop-zone (index card + reader hero, same image). Posts without
// it render as clean typographic cards — no empty placeholder.
// ============================================================

const KT_BLOG_CATS = ['Market Update', 'Neighborhoods', 'Buying', 'Selling', 'Lifestyle'];

const KT_POSTS = [
  /* ---------- [REAL] May · Week 4 ---------- */
  {
    slug: 'proximity-premium-san-jose',
    title: 'The Proximity Premium: How the AI Boom Is *Quietly* Redrawing San Jose’s Map',
    category: 'Market Update',
    date: '2026-05-29',
    excerpt: 'When people talk about the AI boom and Bay Area real estate, they point to Cupertino, Palo Alto, Los Altos. But the most revealing story isn’t in those five zip codes — it’s in the city next door, the biggest one in the Bay Area. San Jose is where you can actually watch AI money move. Not in headlines, but block by block.',
    body: [
      { h: 'The Headline Number Is Hiding the City' },
      'Look at the top line and the market reads like it’s cooling. The median sale price in San Jose was about $1.49M last month — up only a few percent from a year ago, and barely budging month to month (Redfin, Houzeo). Borrowing costs aren’t helping: Freddie Mac’s 30-year fixed climbed to 6.53% as of May 28, its third straight weekly uptick.',
      'The cooling signals are real, too. Inventory is up sharply — more than 60% year over year — homes with price reductions jumped from about 18% to 25%, and the share selling over asking fell from roughly 74% to 64% (Houzeo).',
      'But San Jose is a city of over a million people and dozens of distinct neighborhoods. A single median can’t describe it any more than one temperature describes a whole season. Underneath that number, the city is splitting into very different stories — and the dividing line, increasingly, is distance to a chip campus.',
      { h: 'The Proximity Premium Is Real' },
      'Nvidia’s headquarters sits in Santa Clara, right against San Jose’s northern edge, and the AI infrastructure build-out is now landing inside the city itself. A Nvidia-leased building at 300 Holger Way in North San Jose is slated to convert into a major AI data center, with work starting late this year (GovTech).',
      'That gravity shows up in demand. North San Jose, Berryessa, and the neighborhoods with a short, predictable commute to that corridor draw buyers who work in AI but won’t — or can’t — write a Cupertino number. They want the proximity without the peninsula premium, and San Jose is the obvious trade. In these pockets, well-priced homes still see real competition even as the citywide average drifts sideways.',
      'This is the AI boom’s second ripple. The first hit the elite zips. The second is landing here.',
      { h: 'San Jose as the Landing Zone' },
      'There’s a second kind of buyer reshaping the city: the upgrader priced out of the peninsula entirely.',
      'The family that wanted Los Altos or Cupertino, ran the math at 6.5%, and decided their dollar goes further in Willow Glen, the Rose Garden, Almaden, or Evergreen. The numbers show how wide that ladder is — West San Jose single-family homes run a median near $3.4M and Willow Glen around $2.2M, while townhomes citywide sit closer to $1.3M (Redfin). These established, school-anchored neighborhoods are absorbing demand that used to flow north and west — and that puts a floor under San Jose’s strongest pockets the citywide median completely hides.',
      'If you’re selling in one of these areas, your buyer pool is wider than the headlines suggest. If you’re buying, you’re competing with people who already lost a bidding war somewhere more expensive — and they’re motivated.',
      { h: 'The Downtown Exception' },
      'Now the contrarian part. Not every corner of San Jose is riding this wave.',
      'Downtown condos remain the city’s soft spot, with one-bedroom units around $545K and two-bedrooms near $715K (Redfin). The big office and campus plans meant to anchor the core have moved slower than promised, hybrid work thinned the weekday crowd, and HOA dues plus today’s rates make the monthly math hard. Many of these units sit longer and negotiate more.',
      'For the right buyer — someone who wants walkability, isn’t betting on a quick flip, and can look past the headlines — this is one of the few places in San Jose where you still have genuine leverage. The same AI era lifting North San Jose is leaving parts of downtown on sale.',
      { h: 'Knowing Which San Jose You’re Standing In' },
      'The useful question in 2026 isn’t “how’s the San Jose market?” It’s “which San Jose?”',
      'The proximity corridor, the family-neighborhood landing zone, and the downtown core are three different markets wearing one city’s name — and each demands a different playbook on price, contingencies, and how aggressive your offer needs to be. Bring the wrong read to the wrong neighborhood and you either overpay or walk away from a deal you should have won.',
      'That read — which San Jose, which strategy — is the whole game right now. And it’s exactly what a citywide median will never tell you.',
      { cta: 'If you want to know which San Jose your target neighborhood actually belongs to — and what your offer needs to look like to win there — call or text me, and I’ll walk you through the real numbers for your specific search.' },
      { disclaimer: 'I am not a financial advisor. Please consult your CPA or trusted financial strategist before making any financial decisions.' },
      { sources: [
        { t: 'Redfin — San Jose housing market', href: 'https://www.redfin.com/city/17420/CA/San-Jose/housing-market' },
        { t: 'Houzeo — San Jose 2026 market trends', href: 'https://www.houzeo.com/housing-market/california/san-jose' },
        { t: 'Freddie Mac PMMS', href: 'https://www.freddiemac.com/pmms' },
        { t: 'GovTech — Nvidia-leased San Jose building to become AI data center', href: 'https://insider.govtech.com/california/news/nvidia-leased-san-jose-building-poised-to-become-major-ai-data-center' },
      ] },
    ],
  },
  /* ---------- [REAL] May · Week 4 ---------- */
  {
    slug: 'two-markets-twenty-minutes',
    title: 'The 20-Minute Drive That Crosses *Two* Housing Markets',
    category: 'Market Update',
    date: '2026-05-27',
    excerpt: 'Two homes hit the market the same Thursday, twenty minutes apart. One has eleven offers by Sunday and closes well over asking. The other sits, drops its price, and waits. Welcome to the Bay Area in 2026 — one region, two completely different housing markets, and the gap between them is widening.',
    body: [
      { h: 'The Data Says Two Things at Once' },
      'Look at the headline number and you’d think things are cooling. The median sale price in Santa Clara County was about $1.5M last month, down roughly 3.5% from a year ago (Redfin). Rates aren’t helping the math either — Freddie Mac’s 30-year fixed sat at 6.51% as of May 21, up from the week before.',
      'Now look underneath it. In that same spring window, more listings went into contract, homes sold faster, and overbidding actually *increased* (Compass / Bay Area Market Reports).',
      'Both things are true at once. The average is drifting down while the top end heats up. That’s not a contradiction — it’s a bifurcated market, and the average is hiding it.',
      { h: 'Why the Top Track Is on Fire' },
      'The AI infrastructure boom isn’t a forecast anymore. It’s showing up on real W-2s. Nvidia, Broadcom, AMD, Palantir, and their long tail of suppliers have minted a wave of equity-rich buyers concentrated in a handful of corridors — Cupertino, Palo Alto, Los Altos, Saratoga, and the strongest parts of Fremont.',
      'These buyers don’t behave like the rest of the market. They’re often putting 30–40% down from vested stock, waiving contingencies, and treating a 6.5% rate as a rounding error. In those zip codes, a correctly priced home is gone in 7 to 12 days — and the second-place offer is frequently all cash.',
      'This is the track setting the comps you read about. It’s also a narrow slice of the map.',
      { h: 'Where the Other Track Lives — and Wins' },
      'Drive east, or a little farther out, and the market changes character entirely. Livermore, Mountain House, newer Tri-Valley construction, and well-priced condos and townhomes in Dublin and Pleasanton are still moving on financing-contingent offers — with sellers who value a clean, certain close over a marginally bigger number.',
      'This is the market most Bay Area buyers actually live in. And here, preparation beats firepower. The buyers winning aren’t out-spending the tech money; they’re out-executing the field — a locked-in pre-approval, a flexible close date, and an agent who knows which listing agents reward certainty.',
      'If you’re in this track, the worst thing you can do is read the Cupertino headlines and assume you’ve already lost. You haven’t. You’re simply shopping in a different market.',
      { h: 'Knowing Which Market You’re Standing In' },
      'The most useful question in 2026 isn’t “is it a good time to buy?” It’s “which of the two markets am I in?”',
      'The answer changes everything — your offer strategy, your contingencies, how aggressive your pricing has to be, and how much room you actually have to negotiate. Two homes twenty minutes apart can demand two opposite playbooks. Bring the wrong one and you either overpay or lose.',
      'That read — which track, which playbook — is the whole game right now. And it’s exactly the thing the headline numbers will never tell you.',
      { cta: 'If you want to know which of these two markets your target neighborhood is actually in — and what your offer needs to look like to win there — call or text me, and I’ll walk you through the real numbers for your specific search.' },
      { disclaimer: 'I am not a financial advisor. Please consult your CPA or trusted financial strategist before making any financial decisions.' },
      { sources: [
        { t: 'Redfin — Santa Clara County housing market', href: 'https://www.redfin.com/county/345/CA/Santa-Clara-County/housing-market' },
        { t: 'Freddie Mac PMMS', href: 'https://www.freddiemac.com/pmms' },
        { t: 'Compass / Bay Area Market Reports', href: 'https://www.bayareamarketreports.com/trend/santa-clara-home-prices-market-trends-news' },
      ] },
    ],
  },
  /* ---------- [DRAFT] placeholders below — replace with real issues ---------- */
  {
    slug: 'spotlight-ruby-hill',
    title: 'Neighborhood Spotlight: Ruby Hill, Pleasanton',
    category: 'Neighborhoods',
    date: '2026-05-26',
    cover: true,
    excerpt: 'Behind the gates of Pleasanton’s best-known golf community: what actually drives value here, and what buyers consistently misjudge.',
    body: [
      'Ruby Hill is the address people name when they talk about luxury in the Tri-Valley — a gated community wrapped around a Jack Nicklaus course, with custom homes on lots you simply cannot find elsewhere in Pleasanton.',
      'But the market inside the gates behaves differently than the headline numbers suggest. Lot position matters enormously: course frontage, vineyard views, and cul-de-sac placement can separate two similar floor plans by seven figures.',
      { h: 'What buyers misjudge' },
      'The most common mistake is comparing Ruby Hill price-per-square-foot to greater Pleasanton. The land, the gate, and the scarcity are the product — the house is only part of it.',
      'If you are weighing Ruby Hill against Castlewood or the Preserve, I keep a running comparison of recent closings in all three. Happy to walk you through it.',
    ],
  },
  {
    slug: 'what-staging-returns',
    title: 'What Staging Actually Returns',
    category: 'Selling',
    date: '2026-05-12',
    excerpt: 'Sellers ask me whether staging is worth it more than almost any other question. The honest answer: it depends on the price point — and the math is knowable.',
    body: [
      'Staging is not decoration. It is a pricing instrument: it changes what buyers believe the home is worth before they ever talk numbers.',
      'In the Tri-Valley’s core move-up market, a well-staged home photographs better, opens stronger, and — in my experience — meaningfully shortens days on market. Shorter time on market protects your negotiating position, and that is where the return really lives.',
      { h: 'When it matters most' },
      'Vacant homes, homes with unusual floor plans, and homes where the furniture fights the architecture. In those cases staging is not optional — it is the difference between buyers seeing potential and seeing problems.',
      'When we prepare your home, staging is part of one conversation that also covers pricing, timing, and presentation. None of those levers works alone.',
    ],
  },
  {
    slug: 'rate-buydowns-explained',
    title: 'Rate Buydowns, Explained Simply',
    category: 'Buying',
    date: '2026-04-21',
    excerpt: 'Sellers are offering credits. Lenders are advertising 2-1 buydowns. Here is what these actually cost, what they save, and when to ask for one instead of a price cut.',
    body: [
      'A rate buydown is money — usually the seller’s — used to lower your mortgage rate, either for the first years of the loan or permanently. It is the most misunderstood tool in today’s negotiations.',
      { h: 'The core math' },
      'A dollar of seller credit applied to a buydown often reduces your monthly payment more than the same dollar taken off the purchase price. On a typical Tri-Valley purchase, the difference is not subtle.',
      'That does not make buydowns always right. If you plan to refinance soon, a temporary buydown can be ideal; if you plan to hold the loan for a decade, the comparison changes.',
      'Before you write an offer with a credit request, run both versions of the math. It takes ten minutes and can be worth tens of thousands. I am glad to run it with you.',
    ],
  },
  {
    slug: 'saturday-downtown-livermore',
    title: 'A Saturday in Downtown Livermore',
    category: 'Lifestyle',
    date: '2026-03-17',
    cover: true,
    excerpt: 'The farmers’ market, First Street, and why downtown walkability has quietly become one of the strongest value stories in the Tri-Valley.',
    body: [
      'Ask anyone who has moved to Livermore in the last five years what surprised them, and downtown comes up first. First Street has grown into one of the East Bay’s most genuinely pleasant main streets — tasting rooms, independent restaurants, the renovated Bankhead Theater, and a Sunday farmers’ market that draws from three cities.',
      'For homeowners, this is not just lifestyle — it is a value story. Homes within a comfortable walk of downtown have outperformed the wider Livermore market, and buyers increasingly name walkability as a top-three criterion.',
      { h: 'Where to look' },
      'The neighborhoods immediately north and south of downtown mix vintage cottages with newer infill. They are competitive, but the entry point is still well below comparable walkable pockets in Pleasanton or Danville.',
      'If a walk-to-downtown lifestyle is on your list, tell me early — these homes move fast and many trade quietly.',
    ],
  },
  {
    slug: 'spring-inventory-early-signals',
    title: 'Spring Inventory: The Early Signals',
    category: 'Market Update',
    date: '2026-02-10',
    excerpt: 'February is when the spring market shows its hand. Three early indicators I watch every year — and what they are saying right now.',
    body: [
      'The spring market does not start in spring. It starts now — in the pre-listing conversations, the painter bookings, and the quiet uptick in agent previews that February always brings.',
      { h: 'Three signals worth watching' },
      'First: new listing volume in the first two weeks of February, which historically predicts April supply. Second: the share of listings taking price reductions within 21 days. Third: open house traffic per listing, the cleanest demand read we get this early.',
      'This year, all three point to a busier, more balanced spring than last year — more sellers entering, demand steady rather than frenzied.',
      'If you are deciding between a March or May listing date, this is the year the answer is not obvious. The right timing depends on your segment — let’s look at yours specifically.',
    ],
  },
  {
    slug: 'winter-listings-read-twice',
    title: 'Why Winter Listings Get Read Twice',
    category: 'Selling',
    date: '2025-12-09',
    excerpt: 'Conventional wisdom says never list in December. The data says something more interesting: fewer buyers, but far more serious ones.',
    body: [
      'Every December, sellers ask me whether to wait for spring. Most of the time, waiting is right. But the case for a winter listing is stronger than its reputation — because the buyers who tour homes in December are not browsing.',
      'Showings per listing drop in winter, but the ratio of showings to offers improves. A buyer who arranges a tour between holiday obligations has a deadline, a pre-approval, and a reason.',
      { h: 'When winter works' },
      'Unique homes with little direct competition, homes that show beautifully in low light, and sellers who value certainty over squeezing the last percent. For commodity floor plans in large subdivisions, spring is still your friend.',
      'The honest answer is always specific to your home. If you are weighing December against April, the comparison is worth an hour of analysis — not a rule of thumb.',
    ],
  },
];

/* ---------- helpers ---------- */
const KT_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function ktFormatDate(iso) {
  const p = iso.split('-').map(Number);
  return KT_MONTHS[p[1] - 1] + ' ' + p[2] + ', ' + p[0];
}
function ktShortDate(iso) {
  const p = iso.split('-').map(Number);
  return KT_MONTHS[p[1] - 1].slice(0, 3) + ' ' + p[2];
}
function ktMonthLabel(iso) {
  const p = iso.split('-').map(Number);
  return KT_MONTHS[p[1] - 1] + ' ' + p[0];
}
function ktMonthName(key) {
  const p = key.split('-').map(Number);
  return KT_MONTHS[p[1] - 1];
}

/* inline *italic* / **bold** renderer — titles pass emClass for gold-italic emphasis */
function ktInline(text, emClass) {
  if (typeof text !== 'string') return text;
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const out = [];
  let last = 0, m, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const s = m[0];
    if (s.indexOf('**') === 0) out.push(<strong key={'b' + (k++)}>{s.slice(2, -2)}</strong>);
    else out.push(<em key={'i' + (k++)} className={emClass}>{s.slice(1, -1)}</em>);
    last = m.index + s.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
function ktPlain(text) { return String(text).split('*').join(''); }

const KT_POSTS_SORTED = KT_POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));

Object.assign(window, {
  KT_BLOG_CATS, KT_POSTS, KT_POSTS_SORTED,
  ktFormatDate, ktShortDate, ktMonthLabel, ktMonthName, ktInline, ktPlain,
});
