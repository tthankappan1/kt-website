// Alameda County Neighborhood Guide — city data + page render
// NOTE: price ranges / commute times are working drafts for Kalyani to verify.

const ALAMEDA_CITIES = [
  {
    id: 'pleasanton',
    name: 'Pleasanton',
    price: '~$1.6M \u2013 $3.5M+',
    drive: 'Drive to SF: 45\u201360 min',
    transit: 'BART: West Dublin/Pleasanton \u00b7 ACE train downtown',
    schools: 'Schools: Pleasanton USD \u2014 Amador Valley and Foothill are two of the strongest high schools in the East Bay.',
    bestFor: 'Families who want top schools with a real downtown, move-up buyers, and anyone planning to stay ten years.',
    paras: [
      'Pleasanton is the anchor of the Tri-Valley, and the reason is simple: it has the things people move to the suburbs for, all in one place. Main Street is genuine \u2014 a weekly farmers\u2019 market, restaurants that fill up without a reservation app, and a calendar of small-town events that people actually attend. The neighborhoods around downtown are established and tree-lined, and the whole city reads as cared-for.',
      'The housing stock runs from mid-century ranchers near downtown to newer executive homes and the gated estates of Ruby Hill. Schools drive demand here more than any other factor \u2014 homes inside the most sought-after attendance areas carry a measurable premium, and inventory stays tight through spring. Buyers should come prepared to move quickly on well-priced homes; the good ones rarely sit.',
    ],
  },
  {
    id: 'dublin',
    name: 'Dublin',
    price: '~$1.2M \u2013 $2.4M',
    drive: 'Drive to SF: 40\u201355 min',
    transit: 'BART: Dublin/Pleasanton & West Dublin \u2014 the best train access in the Tri-Valley',
    schools: 'Schools: Dublin USD \u2014 newer campuses, growing quickly alongside the city.',
    bestFor: 'BART commuters, buyers who prefer newer construction, and first or first-move-up buyers entering the Tri-Valley.',
    paras: [
      'Dublin is the youngest city in the Tri-Valley, and most of it has been built in the last twenty-five years. East Dublin in particular is planned-community living done well: newer homes, wide parks, Emerald Glen\u2019s aquatic center, and shopping that was designed alongside the housing rather than bolted on after. If you want a 2010s-or-newer home in this valley, this is where the inventory is.',
      'The practical case for Dublin is value and the commute. Two BART stations put San Francisco and Oakland within a train ride, and pricing sits noticeably below Pleasanton and San Ramon for comparable square footage. The trade-offs: lots run smaller, HOAs are common in the newer villages, and the city is still growing into its downtown. For many buyers, that math works strongly in Dublin\u2019s favor.',
    ],
  },
  {
    id: 'livermore',
    name: 'Livermore',
    price: '~$1.1M \u2013 $2.5M+',
    drive: 'Drive to SF: 50\u201370 min',
    transit: 'ACE train \u00b7 I-580 \u00b7 wine country at the edge of town',
    schools: 'Schools: Livermore Valley Joint USD \u2014 Granada and Livermore High are both well regarded.',
    bestFor: 'Buyers who want the most house for the money, lab and engineering professionals, and anyone who likes wine country on a weeknight.',
    paras: [
      'Livermore is the easternmost of the Tri-Valley cities and the one with the strongest identity of its own. Downtown First Street has been thoughtfully revived \u2014 a working theater, tasting rooms, breweries, and restaurants with actual range. The national laboratories anchor a deep base of scientists and engineers, which gives the town a grounded, unpretentious character that buyers tend to either get immediately or not at all.',
      'South Livermore is the surprise for newcomers: vineyards, olive rows, and estate properties that feel closer to Sonoma than to a freeway suburb. Closer in, the stock runs from 1950s ranchers to brand-new builds, with a clear price gradient as you move south and west. Dollar for dollar, Livermore buys more home than anywhere else in the valley \u2014 the trade is a longer drive to San Francisco.',
    ],
  },
  {
    id: 'fremont',
    name: 'Fremont',
    price: '~$1.3M \u2013 $3M+',
    drive: 'Drive to SF: 50\u201365 min \u00b7 South Bay: 20\u201335 min',
    transit: 'BART: Fremont & Warm Springs',
    schools: 'Schools: Fremont USD \u2014 the Mission San Jose and Irvington attendance areas are among the most sought-after in the Bay Area.',
    bestFor: 'South Bay tech commuters, buyers who put schools above everything else, and multigenerational households.',
    paras: [
      'Fremont is where East Bay pricing meets Silicon Valley paychecks. For anyone working in San Jose, Sunnyvale, or the Peninsula\u2019s southern reaches, it offers a meaningfully shorter commute than the Tri-Valley with schools that compete with any district in the state. It is a large, varied city \u2014 less a single market than a collection of distinct districts, each with its own pricing logic.',
      'Micro-markets matter here more than anywhere else in this guide. Mission San Jose carries a significant premium driven almost entirely by its schools; Irvington and Niles trade lower with their own loyal followings, and Warm Springs has added newer townhome and condo stock near BART. Buyers should decide on an attendance area first and a house second \u2014 in Fremont, the boundary line is most of the price.',
    ],
  },
  {
    id: 'castro-valley',
    name: 'Castro Valley',
    price: '~$1.0M \u2013 $1.8M',
    drive: 'Drive to SF: 35\u201350 min',
    transit: 'BART: Castro Valley \u00b7 I-580',
    schools: 'Schools: Castro Valley USD \u2014 the standout district of the inner East Bay.',
    bestFor: 'Buyers priced out of the Tri-Valley who won\u2019t compromise on schools, first-time buyers, and anyone who wants canyon quiet near a BART stop.',
    paras: [
      'Castro Valley is the quiet overachiever of this list. It is unincorporated \u2014 no city hall, no flashy downtown \u2014 and that low profile keeps it off many buyers\u2019 radar. What it has is the inner East Bay\u2019s strongest school district, its own BART station, and a commute to San Francisco that beats everything east of the hills. The boulevard is modest, but the essentials are all here.',
      'The housing stock is mostly mid-century, with larger and more private properties tucked into Palomares Canyon and the hills above town. Pricing sits a full tier below Pleasanton and Dublin, which makes Castro Valley the natural answer for buyers who need schools and commute but have a hard ceiling on budget. Homes in the flats near BART move quickly; the canyon properties reward patient searching.',
    ],
  },
];

ReactDOM.createRoot(document.getElementById('root')).render(
  <GuidePage
    eyebrow="Client Resources · Neighborhood Guide"
    title="Alameda County Neighborhood Guide"
    sub="Pleasanton, Dublin, Livermore, Fremont, or Castro Valley? Start here."
    slotId="guide-alameda-hero"
    placeholder="Drop hero image — Tri-Valley hills or Pleasanton Main Street"
    cities={ALAMEDA_CITIES}></GuidePage>
);
