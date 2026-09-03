import type { Listing } from './types'

// 553 Covington Way, Livermore — went to market 2026-09-03.
// Facts and description: Kalyani's MLS copy (owner-supplied 2026-09-03). The
// MLS square-footage placeholder "[1,250]" in the description is reconciled to
// the MLS field value (1,130). Photos: JOX Media (Aryeo) 2048px renditions,
// photographer order; owner replaces with originals by overwriting the files.

export const covington553: Listing = {
  slug: '553-covington-way-livermore',
  status: 'active',
  street: '553 Covington Way',
  city: 'Livermore',
  state: 'CA',
  zip: '94551',
  neighborhood: 'Summerset',
  price: 890000,
  beds: 3,
  baths: 2,
  sqft: 1130,
  lotSqft: 6000,
  yearBuilt: 1969,
  garage: 'Attached 2-car, direct interior access',
  propertyType: 'Single-family home',
  listedDate: '2026-09-03',
  headline: `Single-story living in Summerset, one of Livermore's most established neighborhoods.`,
  description: [
    `Three bedrooms, two baths, and approximately 1,130 square feet in a floor plan that has aged well — bedrooms set quietly away from the living areas, kitchen opening to the back of the home, attached garage with direct interior access.`,
    `The lot is level and easy to enjoy, and the setting is the kind that holds its value: minutes from downtown Livermore's restaurants and tasting rooms, the Valley's wineries just beyond, and a straightforward connection to 580.`,
    `Offered as-is — an opportunity for the next owner to update it to their own taste rather than pay for someone else's choices. Disclosures available on request.`,
  ],
  highlights: [
    'Single-story living',
    'Three bedrooms',
    'Two baths',
    'Attached two-car garage',
    'Level 6,000 sq ft lot',
    'Brick fireplace',
    'No HOA',
    'Offered as-is',
  ],
  facts: [
    ['Offered', 'As-is · disclosures available on request'],
    ['HOA', 'None'],
  ],
  // 27 is the sign-free front elevation; 25/26 carry the photographer's
  // "Coming soon" rider in frame, so they stay in the gallery, not the hero.
  hero: '27.jpg',
  photos: [
    // Exterior
    { file: '27.jpg', alt: 'Front elevation with lawn, planting beds and the covered entry', group: 'exterior' },
    { file: '25.jpg', alt: 'Front of the home with two-car garage, driveway and mature trees', group: 'exterior' },
    { file: '26.jpg', alt: 'Front of the home from the driveway, attached garage and lawn under a blue sky', group: 'exterior' },
    // Living room
    { file: '01.jpg', alt: 'Living room with brick fireplace, staged seating and a wide window to the backyard', group: 'living' },
    { file: '05.jpg', alt: 'Open living and dining area with light-toned floors and a view to the backyard', group: 'living' },
    { file: '02.jpg', alt: 'Living room from the entry with the media wall, fireplace and sliding door to the patio', group: 'living' },
    { file: '03.jpg', alt: 'Living room looking toward the kitchen and dining area', group: 'living' },
    { file: '04.jpg', alt: 'Brick fireplace with staged seating and artwork', group: 'living' },
    { file: '10.jpg', alt: 'Living room from the hallway with the front door and staged seating', group: 'living' },
    // Kitchen & dining
    { file: '07.jpg', alt: 'Kitchen with warm wood cabinetry, stainless refrigerator and dishwasher, and a window over the sink', group: 'kitchen' },
    { file: '06.jpg', alt: 'Dining area beside the kitchen with a round table under a pendant light and a garden window', group: 'kitchen' },
    { file: '08.jpg', alt: 'Kitchen with stainless appliances, tile counters and wood cabinets', group: 'kitchen' },
    { file: '09.jpg', alt: 'Dining nook with sliding door to the covered patio and backyard', group: 'kitchen' },
    { file: '24.jpg', alt: 'Kitchen and dining area with stainless appliances and a round table', group: 'kitchen' },
    // Bedrooms
    { file: '14.jpg', alt: 'Primary bedroom with staged bed and the private bath beyond', group: 'bedrooms' },
    { file: '15.jpg', alt: 'Primary bedroom with bedside lamps and framed prints', group: 'bedrooms' },
    { file: '16.jpg', alt: 'Primary bedroom with the en-suite bath visible through the doorway', group: 'bedrooms' },
    { file: '11.jpg', alt: 'Bedroom with a large window, staged bed and artwork', group: 'bedrooms' },
    { file: '12.jpg', alt: 'Bedroom with sliding closet doors and a garden window', group: 'bedrooms' },
    // Baths
    { file: '17.jpg', alt: 'Primary bath with vanity, mirrored cabinet and walk-in shower', group: 'baths' },
    { file: '18.jpg', alt: 'Walk-in shower with glass enclosure in the primary bath', group: 'baths' },
    { file: '13.jpg', alt: 'Hall bath with tub and shower, vanity and light bar', group: 'baths' },
    // Outdoor
    { file: '21.jpg', alt: 'Level backyard with lawn, a mature shade tree and the rear of the home', group: 'outdoor' },
    { file: '19.jpg', alt: 'Backyard lounge seating on a gravel patio under mature trees', group: 'outdoor' },
    { file: '20.jpg', alt: 'Backyard with patio dining, brick chimney and lawn', group: 'outdoor' },
    { file: '23.jpg', alt: 'Backyard shade tree with rock border, patio and the rear elevation', group: 'outdoor' },
    { file: '22.jpg', alt: 'Side yard with fresh fencing and gravel beds', group: 'outdoor' },
  ],
  floorPlans: [
    { file: 'floorplan-1.jpg', alt: 'Floor plan with room dimensions: living room, dining area, kitchen, three bedrooms, two baths and attached garage' },
    { file: 'floorplan-2.jpg', alt: 'Floor plan, alternate rendering' },
  ],
}
