// Contra Costa County Neighborhood Guide — city data + page render
// NOTE: price ranges / commute times are working drafts for Kalyani to verify.

const CONTRA_COSTA_CITIES = [
  {
    id: 'san-ramon',
    name: 'San Ramon',
    price: '~$1.4M \u2013 $2.8M',
    drive: 'Drive to SF: 45\u201360 min',
    transit: 'I-680 corridor \u00b7 Bishop Ranch / City Center',
    schools: 'Schools: San Ramon Valley USD \u2014 consistently among the top districts in California.',
    bestFor: 'Families optimizing for schools and newer homes, and dual-career households working along the 680 corridor.',
    paras: [
      'San Ramon is the planned city that delivers on the plan. Bishop Ranch keeps tens of thousands of jobs inside the city limits, City Center gives it a modern downtown, and the parks and trail network are genuinely excellent. It is not the place for buyers chasing character and quirk \u2014 it is the place for buyers who want everything to work, and it does.',
      'The east side \u2014 Windemere and Gale Ranch \u2014 holds most of the newer construction, with homes from the 2000s and 2010s on planned streets close to newer school campuses. The west side, near the original town, trades newer finishes for larger lots and mature trees. Either way, the school district is the engine of demand here, and resale values have historically reflected that stability.',
    ],
  },
  {
    id: 'danville',
    name: 'Danville',
    price: '~$1.8M \u2013 $4M+',
    drive: 'Drive to SF: 45\u201360 min',
    transit: 'I-680 \u00b7 downtown on the Iron Horse Trail',
    schools: 'Schools: San Ramon Valley USD \u2014 Monte Vista and San Ramon Valley High are both excellent.',
    bestFor: 'Established families, move-up buyers who want charm and schools in the same purchase, and anyone who will pay for a walkable downtown.',
    paras: [
      'Danville is what most people picture when they imagine the 680 corridor at its best: an oak-lined, genuinely charming downtown, a farmers\u2019 market, the Iron Horse Trail running through the middle of it all, and some of the strongest schools in the state. It is the kind of town where the hardware store and the boutique coffee shop coexist, and neither feels out of place.',
      'The housing runs from Westside Danville\u2019s large flat lots \u2014 the most coveted dirt in town \u2014 to the gated golf-course communities of Blackhawk to the east. Pricing starts above San Ramon and climbs steeply for location and lot. Inventory is perennially thin; well-presented homes near downtown or inside the favorite school boundaries draw immediate, competitive attention.',
    ],
  },
  {
    id: 'alamo',
    name: 'Alamo',
    price: '~$2.5M \u2013 $5M+',
    drive: 'Drive to SF: 40\u201355 min',
    transit: 'I-680, between Danville and Walnut Creek',
    schools: 'Schools: San Ramon Valley USD \u2014 feeding Monte Vista High.',
    bestFor: 'Buyers who want acreage and privacy without leaving the 680 corridor, horse properties, and true forever homes.',
    paras: [
      'Alamo is the corridor\u2019s quiet luxury address. Unincorporated by choice, it has no real downtown and likes it that way \u2014 what it offers instead is land. Half-acre lots are the starting point, full acres are common, and the west side\u2019s lanes hold estates that simply do not exist in the neighboring towns. The atmosphere is semi-rural: mature oaks, low fences, horses within town limits.',
      'Buyers here are usually trading up from Danville or Walnut Creek for privacy and scale, and the market behaves accordingly \u2014 fewer transactions, longer searches, and properties that vary enormously parcel to parcel. Round Hill Country Club anchors the east side with its own community feel. If the brief is land, trees, schools, and a 680 commute, Alamo is the answer.',
    ],
  },
  {
    id: 'walnut-creek',
    name: 'Walnut Creek',
    price: '~$950K \u2013 $2.5M+',
    drive: 'Drive to SF: 35\u201350 min',
    transit: 'BART: Walnut Creek & Pleasant Hill',
    schools: 'Schools: split among Walnut Creek SD, Mt. Diablo USD, and Acalanes UHSD \u2014 boundaries matter, so check per address.',
    bestFor: 'Buyers who want urban amenities with suburban housing, downsizers, and BART commuters.',
    paras: [
      'Walnut Creek is the downtown of the entire 680 corridor. Broadway Plaza\u2019s shopping, a real restaurant scene, the Lesher Center\u2019s arts calendar, and a BART station within walking distance of it all \u2014 no other town in this guide offers this much city in a suburban package. The energy is noticeably different from its neighbors: younger downtown, busier sidewalks, more variety.',
      'The market spans an unusually wide range, from condos near BART that suit first-time buyers and downsizers alike, to the established family neighborhoods of Northgate under Mt. Diablo. That breadth makes the schools picture more complicated than in San Ramon or Danville \u2014 three districts serve the city, and the attendance boundary should be verified for any specific address before falling in love with it.',
    ],
  },
  {
    id: 'lafayette',
    name: 'Lafayette',
    price: '~$1.8M \u2013 $4M',
    drive: 'Drive to SF: 25\u201340 min',
    transit: 'BART: Lafayette',
    schools: 'Schools: Lafayette SD and Acalanes UHSD \u2014 Acalanes High is a major draw.',
    bestFor: 'San Francisco commuters who want top schools and a semi-rural feel, and buyers trading the city for trees without giving up BART.',
    paras: [
      'Lafayette is the center of gravity of Lamorinda \u2014 the three-town pocket west of the 680 corridor where the hills close in, the lots get bigger, and San Francisco gets closer. Its downtown is compact but real: good restaurants, a beloved bookstore, and a Saturday morning rhythm of trailheads and coffee lines. The reservoir trail is the town\u2019s living room.',
      'Housing here means space and setting \u2014 wooded hillsides, ridge views, and the flat, walk-to-town streets of Happy Valley that command the town\u2019s strongest premiums. With BART in the middle of town and a commute to San Francisco that can beat much of the East Bay, Lafayette is the rare market that serves city careers and top-tier schools at once. Pricing reflects exactly that.',
    ],
  },
  {
    id: 'orinda',
    name: 'Orinda',
    price: '~$1.7M \u2013 $3.5M+',
    drive: 'Drive to SF: 20\u201335 min',
    transit: 'BART: Orinda \u2014 the shortest school-town commute to the city',
    schools: 'Schools: Orinda USD and Acalanes UHSD \u2014 feeding Miramonte High.',
    bestFor: 'City commuters who want the shortest drive to top schools, and buyers who prefer wooded privacy over flat lawns.',
    paras: [
      'Orinda is the first town through the Caldecott Tunnel, which makes it the closest of the top-school suburbs to San Francisco \u2014 a fact that quietly drives its entire market. The village is split in two by the highway, with the landmark Orinda Theatre on one side and everyday errands on the other. It is small, calm, and intentionally low-key.',
      'The homes are tucked into wooded hills, and that is the essential trade: privacy, trees, and views in exchange for flat yards and sidewalk culture. Lots vary enormously \u2014 sun, slope, and access matter as much as square footage, and two homes a street apart can live completely differently. Buyers who walk the property at different hours of the day choose better here.',
    ],
  },
  {
    id: 'moraga',
    name: 'Moraga',
    price: '~$1.6M \u2013 $3M',
    drive: 'Drive to SF: 35\u201350 min',
    transit: 'Via Lafayette or Orinda BART \u00b7 Canyon roads',
    schools: 'Schools: Moraga SD and Acalanes UHSD \u2014 Campolindo is one of the top high schools in the state.',
    bestFor: 'Families who want the quietest corner of Lamorinda, Campolindo-or-bust buyers, and ranch-house renovators.',
    paras: [
      'Moraga is the most tucked-away town in this guide, and for its residents that is precisely the point. Saint Mary\u2019s College gives it a leafy collegiate anchor, the Commons hosts the summer concert series, and the surrounding ridgelines keep the outside world at a comfortable distance. Of the three Lamorinda towns, it is the most family-dense and the most unhurried.',
      'The housing stock is dominated by 1960s and \u201970s ranchers on generous lots \u2014 a renovator\u2019s opportunity, and increasingly a showcase for thoughtful remodels. Campolindo High is the market\u2019s magnet, pulling families who plan their entire purchase around it. The trade-off is distance: no BART station of its own and winding roads out of town. In exchange, Moraga offers Lamorinda\u2019s gentlest pricing and its deepest quiet.',
    ],
  },
];

ReactDOM.createRoot(document.getElementById('root')).render(
  <GuidePage
    eyebrow="Client Resources · Neighborhood Guide"
    title="Contra Costa County Neighborhood Guide"
    sub="From San Ramon to Lamorinda — the 680 corridor, town by town."
    slotId="guide-contracosta-hero"
    placeholder="Drop hero image — Mt. Diablo or the 680 corridor hills"
    cities={CONTRA_COSTA_CITIES}></GuidePage>
);
