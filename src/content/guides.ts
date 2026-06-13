export type City = {
  id: string
  name: string
  price: string
  drive: string
  transit: string
  schools: string
  bestFor: string
  paras: string[]
}

export type Guide = {
  eyebrow: string
  title: string
  sub: string
  slotId: string
  placeholder: string
  cities: City[]
}

const ALAMEDA_CITIES: City[] = [
  {
    id: "pleasanton",
    name: "Pleasanton",
    price: "~$1.6M – $3.5M+",
    drive: "Drive to SF: 45–60 min",
    transit: "BART: West Dublin/Pleasanton · ACE train downtown",
    schools: "Schools: Pleasanton USD — Amador Valley and Foothill are two of the strongest high schools in the East Bay.",
    bestFor: "Families who want top schools with a real downtown, move-up buyers, and anyone planning to stay ten years.",
    paras: [
      "Pleasanton is the anchor of the Tri-Valley, and the reason is simple: it has the things people move to the suburbs for, all in one place. Main Street is genuine — a weekly farmers’ market, restaurants that fill up without a reservation app, and a calendar of small-town events that people actually attend. The neighborhoods around downtown are established and tree-lined, and the whole city reads as cared-for.",
      "The housing stock runs from mid-century ranchers near downtown to newer executive homes and the gated estates of Ruby Hill. Schools drive demand here more than any other factor — homes inside the most sought-after attendance areas carry a measurable premium, and inventory stays tight through spring. Buyers should come prepared to move quickly on well-priced homes; the good ones rarely sit.",
    ],
  },
  {
    id: "dublin",
    name: "Dublin",
    price: "~$1.2M – $2.4M",
    drive: "Drive to SF: 40–55 min",
    transit: "BART: Dublin/Pleasanton & West Dublin — the best train access in the Tri-Valley",
    schools: "Schools: Dublin USD — newer campuses, growing quickly alongside the city.",
    bestFor: "BART commuters, buyers who prefer newer construction, and first or first-move-up buyers entering the Tri-Valley.",
    paras: [
      "Dublin is the youngest city in the Tri-Valley, and most of it has been built in the last twenty-five years. East Dublin in particular is planned-community living done well: newer homes, wide parks, Emerald Glen’s aquatic center, and shopping that was designed alongside the housing rather than bolted on after. If you want a 2010s-or-newer home in this valley, this is where the inventory is.",
      "The practical case for Dublin is value and the commute. Two BART stations put San Francisco and Oakland within a train ride, and pricing sits noticeably below Pleasanton and San Ramon for comparable square footage. The trade-offs: lots run smaller, HOAs are common in the newer villages, and the city is still growing into its downtown. For many buyers, that math works strongly in Dublin’s favor.",
    ],
  },
  {
    id: "livermore",
    name: "Livermore",
    price: "~$1.1M – $2.5M+",
    drive: "Drive to SF: 50–70 min",
    transit: "ACE train · I-580 · wine country at the edge of town",
    schools: "Schools: Livermore Valley Joint USD — Granada and Livermore High are both well regarded.",
    bestFor: "Buyers who want the most house for the money, lab and engineering professionals, and anyone who likes wine country on a weeknight.",
    paras: [
      "Livermore is the easternmost of the Tri-Valley cities and the one with the strongest identity of its own. Downtown First Street has been thoughtfully revived — a working theater, tasting rooms, breweries, and restaurants with actual range. The national laboratories anchor a deep base of scientists and engineers, which gives the town a grounded, unpretentious character that buyers tend to either get immediately or not at all.",
      "South Livermore is the surprise for newcomers: vineyards, olive rows, and estate properties that feel closer to Sonoma than to a freeway suburb. Closer in, the stock runs from 1950s ranchers to brand-new builds, with a clear price gradient as you move south and west. Dollar for dollar, Livermore buys more home than anywhere else in the valley — the trade is a longer drive to San Francisco.",
    ],
  },
  {
    id: "fremont",
    name: "Fremont",
    price: "~$1.3M – $3M+",
    drive: "Drive to SF: 50–65 min · South Bay: 20–35 min",
    transit: "BART: Fremont & Warm Springs",
    schools: "Schools: Fremont USD — the Mission San Jose and Irvington attendance areas are among the most sought-after in the Bay Area.",
    bestFor: "South Bay tech commuters, buyers who put schools above everything else, and multigenerational households.",
    paras: [
      "Fremont is where East Bay pricing meets Silicon Valley paychecks. For anyone working in San Jose, Sunnyvale, or the Peninsula’s southern reaches, it offers a meaningfully shorter commute than the Tri-Valley with schools that compete with any district in the state. It is a large, varied city — less a single market than a collection of distinct districts, each with its own pricing logic.",
      "Micro-markets matter here more than anywhere else in this guide. Mission San Jose carries a significant premium driven almost entirely by its schools; Irvington and Niles trade lower with their own loyal followings, and Warm Springs has added newer townhome and condo stock near BART. Buyers should decide on an attendance area first and a house second — in Fremont, the boundary line is most of the price.",
    ],
  },
  {
    id: "castro-valley",
    name: "Castro Valley",
    price: "~$1.0M – $1.8M",
    drive: "Drive to SF: 35–50 min",
    transit: "BART: Castro Valley · I-580",
    schools: "Schools: Castro Valley USD — the standout district of the inner East Bay.",
    bestFor: "Buyers priced out of the Tri-Valley who won’t compromise on schools, first-time buyers, and anyone who wants canyon quiet near a BART stop.",
    paras: [
      "Castro Valley is the quiet overachiever of this list. It is unincorporated — no city hall, no flashy downtown — and that low profile keeps it off many buyers’ radar. What it has is the inner East Bay’s strongest school district, its own BART station, and a commute to San Francisco that beats everything east of the hills. The boulevard is modest, but the essentials are all here.",
      "The housing stock is mostly mid-century, with larger and more private properties tucked into Palomares Canyon and the hills above town. Pricing sits a full tier below Pleasanton and Dublin, which makes Castro Valley the natural answer for buyers who need schools and commute but have a hard ceiling on budget. Homes in the flats near BART move quickly; the canyon properties reward patient searching.",
    ],
  },
]

const CONTRA_COSTA_CITIES: City[] = [
  {
    id: "san-ramon",
    name: "San Ramon",
    price: "~$1.4M – $2.8M",
    drive: "Drive to SF: 45–60 min",
    transit: "I-680 corridor · Bishop Ranch / City Center",
    schools: "Schools: San Ramon Valley USD — consistently among the top districts in California.",
    bestFor: "Families optimizing for schools and newer homes, and dual-career households working along the 680 corridor.",
    paras: [
      "San Ramon is the planned city that delivers on the plan. Bishop Ranch keeps tens of thousands of jobs inside the city limits, City Center gives it a modern downtown, and the parks and trail network are genuinely excellent. It is not the place for buyers chasing character and quirk — it is the place for buyers who want everything to work, and it does.",
      "The east side — Windemere and Gale Ranch — holds most of the newer construction, with homes from the 2000s and 2010s on planned streets close to newer school campuses. The west side, near the original town, trades newer finishes for larger lots and mature trees. Either way, the school district is the engine of demand here, and resale values have historically reflected that stability.",
    ],
  },
  {
    id: "danville",
    name: "Danville",
    price: "~$1.8M – $4M+",
    drive: "Drive to SF: 45–60 min",
    transit: "I-680 · downtown on the Iron Horse Trail",
    schools: "Schools: San Ramon Valley USD — Monte Vista and San Ramon Valley High are both excellent.",
    bestFor: "Established families, move-up buyers who want charm and schools in the same purchase, and anyone who will pay for a walkable downtown.",
    paras: [
      "Danville is what most people picture when they imagine the 680 corridor at its best: an oak-lined, genuinely charming downtown, a farmers’ market, the Iron Horse Trail running through the middle of it all, and some of the strongest schools in the state. It is the kind of town where the hardware store and the boutique coffee shop coexist, and neither feels out of place.",
      "The housing runs from Westside Danville’s large flat lots — the most coveted dirt in town — to the gated golf-course communities of Blackhawk to the east. Pricing starts above San Ramon and climbs steeply for location and lot. Inventory is perennially thin; well-presented homes near downtown or inside the favorite school boundaries draw immediate, competitive attention.",
    ],
  },
  {
    id: "alamo",
    name: "Alamo",
    price: "~$2.5M – $5M+",
    drive: "Drive to SF: 40–55 min",
    transit: "I-680, between Danville and Walnut Creek",
    schools: "Schools: San Ramon Valley USD — feeding Monte Vista High.",
    bestFor: "Buyers who want acreage and privacy without leaving the 680 corridor, horse properties, and true forever homes.",
    paras: [
      "Alamo is the corridor’s quiet luxury address. Unincorporated by choice, it has no real downtown and likes it that way — what it offers instead is land. Half-acre lots are the starting point, full acres are common, and the west side’s lanes hold estates that simply do not exist in the neighboring towns. The atmosphere is semi-rural: mature oaks, low fences, horses within town limits.",
      "Buyers here are usually trading up from Danville or Walnut Creek for privacy and scale, and the market behaves accordingly — fewer transactions, longer searches, and properties that vary enormously parcel to parcel. Round Hill Country Club anchors the east side with its own community feel. If the brief is land, trees, schools, and a 680 commute, Alamo is the answer.",
    ],
  },
  {
    id: "walnut-creek",
    name: "Walnut Creek",
    price: "~$950K – $2.5M+",
    drive: "Drive to SF: 35–50 min",
    transit: "BART: Walnut Creek & Pleasant Hill",
    schools: "Schools: split among Walnut Creek SD, Mt. Diablo USD, and Acalanes UHSD — boundaries matter, so check per address.",
    bestFor: "Buyers who want urban amenities with suburban housing, downsizers, and BART commuters.",
    paras: [
      "Walnut Creek is the downtown of the entire 680 corridor. Broadway Plaza’s shopping, a real restaurant scene, the Lesher Center’s arts calendar, and a BART station within walking distance of it all — no other town in this guide offers this much city in a suburban package. The energy is noticeably different from its neighbors: younger downtown, busier sidewalks, more variety.",
      "The market spans an unusually wide range, from condos near BART that suit first-time buyers and downsizers alike, to the established family neighborhoods of Northgate under Mt. Diablo. That breadth makes the schools picture more complicated than in San Ramon or Danville — three districts serve the city, and the attendance boundary should be verified for any specific address before falling in love with it.",
    ],
  },
  {
    id: "lafayette",
    name: "Lafayette",
    price: "~$1.8M – $4M",
    drive: "Drive to SF: 25–40 min",
    transit: "BART: Lafayette",
    schools: "Schools: Lafayette SD and Acalanes UHSD — Acalanes High is a major draw.",
    bestFor: "San Francisco commuters who want top schools and a semi-rural feel, and buyers trading the city for trees without giving up BART.",
    paras: [
      "Lafayette is the center of gravity of Lamorinda — the three-town pocket west of the 680 corridor where the hills close in, the lots get bigger, and San Francisco gets closer. Its downtown is compact but real: good restaurants, a beloved bookstore, and a Saturday morning rhythm of trailheads and coffee lines. The reservoir trail is the town’s living room.",
      "Housing here means space and setting — wooded hillsides, ridge views, and the flat, walk-to-town streets of Happy Valley that command the town’s strongest premiums. With BART in the middle of town and a commute to San Francisco that can beat much of the East Bay, Lafayette is the rare market that serves city careers and top-tier schools at once. Pricing reflects exactly that.",
    ],
  },
  {
    id: "orinda",
    name: "Orinda",
    price: "~$1.7M – $3.5M+",
    drive: "Drive to SF: 20–35 min",
    transit: "BART: Orinda — the shortest school-town commute to the city",
    schools: "Schools: Orinda USD and Acalanes UHSD — feeding Miramonte High.",
    bestFor: "City commuters who want the shortest drive to top schools, and buyers who prefer wooded privacy over flat lawns.",
    paras: [
      "Orinda is the first town through the Caldecott Tunnel, which makes it the closest of the top-school suburbs to San Francisco — a fact that quietly drives its entire market. The village is split in two by the highway, with the landmark Orinda Theatre on one side and everyday errands on the other. It is small, calm, and intentionally low-key.",
      "The homes are tucked into wooded hills, and that is the essential trade: privacy, trees, and views in exchange for flat yards and sidewalk culture. Lots vary enormously — sun, slope, and access matter as much as square footage, and two homes a street apart can live completely differently. Buyers who walk the property at different hours of the day choose better here.",
    ],
  },
  {
    id: "moraga",
    name: "Moraga",
    price: "~$1.6M – $3M",
    drive: "Drive to SF: 35–50 min",
    transit: "Via Lafayette or Orinda BART · Canyon roads",
    schools: "Schools: Moraga SD and Acalanes UHSD — Campolindo is one of the top high schools in the state.",
    bestFor: "Families who want the quietest corner of Lamorinda, Campolindo-or-bust buyers, and ranch-house renovators.",
    paras: [
      "Moraga is the most tucked-away town in this guide, and for its residents that is precisely the point. Saint Mary’s College gives it a leafy collegiate anchor, the Commons hosts the summer concert series, and the surrounding ridgelines keep the outside world at a comfortable distance. Of the three Lamorinda towns, it is the most family-dense and the most unhurried.",
      "The housing stock is dominated by 1960s and ’70s ranchers on generous lots — a renovator’s opportunity, and increasingly a showcase for thoughtful remodels. Campolindo High is the market’s magnet, pulling families who plan their entire purchase around it. The trade-off is distance: no BART station of its own and winding roads out of town. In exchange, Moraga offers Lamorinda’s gentlest pricing and its deepest quiet.",
    ],
  },
]

export const ALAMEDA_GUIDE: Guide = {
  eyebrow: "Client Resources · Neighborhood Guide",
  title: "Alameda County Neighborhood Guide",
  sub: "Pleasanton, Dublin, Livermore, Fremont, or Castro Valley? Start here.",
  slotId: "guide-alameda-hero",
  placeholder: "Tri-Valley hills or Pleasanton Main Street",
  cities: ALAMEDA_CITIES,
}

export const CONTRA_COSTA_GUIDE: Guide = {
  eyebrow: "Client Resources · Neighborhood Guide",
  title: "Contra Costa County Neighborhood Guide",
  sub: "From San Ramon to Lamorinda — the 680 corridor, town by town.",
  slotId: "guide-contracosta-hero",
  placeholder: "Mt. Diablo or the 680 corridor hills",
  cities: CONTRA_COSTA_CITIES,
}
