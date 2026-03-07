export type LocationEntry = {
  slug: string;
  cityName: string;
  titleTag: string;
  metaDescription: string;
  h1: string;
};

export const LOCATIONS: LocationEntry[] = [
  {
    slug: "austin-tx",
    cityName: "Austin",
    titleTag: "Austin Plumber | Ironclad Plumbing",
    metaDescription:
      "Serving Austin neighborhoods from downtown to the suburbs with same-day availability and upfront pricing.",
    h1: "Your Austin Plumber - Professional Service, Every Neighborhood",
  },
  {
    slug: "round-rock-tx",
    cityName: "Round Rock",
    titleTag: "Plumber in Round Rock, TX | Ironclad Plumbing",
    metaDescription:
      "Fast, professional plumbing service in Round Rock for repairs, installations, and emergencies.",
    h1: "Round Rock Plumbing - Reliable Service Close to Home",
  },
  {
    slug: "georgetown-tx",
    cityName: "Georgetown",
    titleTag: "Plumber in Georgetown, TX | Ironclad Plumbing",
    metaDescription:
      "Georgetown plumbing service including water heaters, drain cleaning, and slab leak detection.",
    h1: "Georgetown Plumbing - Modern Service for a Growing City",
  },
  {
    slug: "pflugerville-tx",
    cityName: "Pflugerville",
    titleTag: "Plumber in Pflugerville, TX | Ironclad Plumbing",
    metaDescription:
      "Pflugerville plumbing repairs, installations, and emergency service with no pricing surprises.",
    h1: "Pflugerville Plumbing - No Surprises, Just Solutions",
  },
  {
    slug: "cedar-park-tx",
    cityName: "Cedar Park",
    titleTag: "Plumber in Cedar Park, TX | Ironclad Plumbing",
    metaDescription:
      "Cedar Park drain cleaning, water heaters, leak detection, and full-service plumbing.",
    h1: "Cedar Park Plumbing - Done Right, On Time",
  },
  {
    slug: "leander-tx",
    cityName: "Leander",
    titleTag: "Plumber in Leander, TX | Ironclad Plumbing",
    metaDescription:
      "Professional plumbing for Leander's fast-growing homes and neighborhoods.",
    h1: "Leander Plumbing - Keeping Up with Your Growing Community",
  },
  {
    slug: "lakeway-tx",
    cityName: "Lakeway",
    titleTag: "Plumber in Lakeway, TX | Ironclad Plumbing",
    metaDescription:
      "Premium plumbing service for Lakeway homes, from fixtures to slab leak diagnostics.",
    h1: "Lakeway Plumbing - Precision Service for Lake-Area Homes",
  },
  {
    slug: "bee-cave-tx",
    cityName: "Bee Cave",
    titleTag: "Plumber in Bee Cave, TX | Ironclad Plumbing",
    metaDescription:
      "Licensed and insured Bee Cave plumbing service for repairs, gas lines, and emergencies.",
    h1: "Bee Cave Plumbing - Licensed, Insured, Ready to Help",
  },
  {
    slug: "west-lake-hills-tx",
    cityName: "West Lake Hills",
    titleTag: "Plumber in West Lake Hills, TX | Ironclad Plumbing",
    metaDescription:
      "West Lake Hills plumbing built around transparency, precision, and respect for your home.",
    h1: "West Lake Hills Plumbing - A Higher Standard",
  },
  {
    slug: "rollingwood-tx",
    cityName: "Rollingwood",
    titleTag: "Plumber in Rollingwood, TX | Ironclad Plumbing",
    metaDescription:
      "Rollingwood repairs, installations, and water treatment with written workmanship warranty.",
    h1: "Rollingwood Plumbing - Professional Service, Personal Attention",
  },
  {
    slug: "dripping-springs-tx",
    cityName: "Dripping Springs",
    titleTag: "Plumber in Dripping Springs, TX | Ironclad Plumbing",
    metaDescription:
      "Dripping Springs plumbing support for Hill Country homes, water treatment, and septic-aware service.",
    h1: "Dripping Springs Plumbing - Built for Hill Country Living",
  },
  {
    slug: "buda-tx",
    cityName: "Buda",
    titleTag: "Plumber in Buda, TX | Ironclad Plumbing",
    metaDescription:
      "Buda plumbing repairs, water heaters, drain cleaning, and sewer service with same-day options.",
    h1: "Buda Plumbing - Fast Service, Fair Pricing",
  },
  {
    slug: "kyle-tx",
    cityName: "Kyle",
    titleTag: "Plumber in Kyle, TX | Ironclad Plumbing",
    metaDescription:
      "Kyle plumbing repairs, installations, and emergency support for one of Central Texas's fastest-growing communities.",
    h1: "Kyle Plumbing - Ready When You Are",
  },
  {
    slug: "manor-tx",
    cityName: "Manor",
    titleTag: "Plumber in Manor, TX | Ironclad Plumbing",
    metaDescription:
      "Manor plumbing done professionally with upfront pricing and reliable scheduling.",
    h1: "Manor Plumbing - Honest Work, Fair Price",
  },
  {
    slug: "hutto-tx",
    cityName: "Hutto",
    titleTag: "Plumber in Hutto, TX | Ironclad Plumbing",
    metaDescription:
      "Hutto plumbing service for new construction support, repairs, and emergency response.",
    h1: "Hutto Plumbing - Growing With Your Community",
  },
  {
    slug: "taylor-tx",
    cityName: "Taylor",
    titleTag: "Plumber in Taylor, TX | Ironclad Plumbing",
    metaDescription:
      "Taylor water heater, drain, and sewer work from a licensed and insured Austin-area plumber.",
    h1: "Taylor Plumbing - Dependable Service, Every Time",
  },
  {
    slug: "liberty-hill-tx",
    cityName: "Liberty Hill",
    titleTag: "Plumber in Liberty Hill, TX | Ironclad Plumbing",
    metaDescription:
      "Liberty Hill plumbing for new builds and established homes, including well-water treatment and leak detection.",
    h1: "Liberty Hill Plumbing - New Builds and Established Homes",
  },
  {
    slug: "lago-vista-tx",
    cityName: "Lago Vista",
    titleTag: "Plumber in Lago Vista, TX | Ironclad Plumbing",
    metaDescription:
      "Lago Vista plumbing services including water heaters, fixtures, leaks, and emergency support.",
    h1: "Lago Vista Plumbing - Lake-Area Service You Can Count On",
  },
  {
    slug: "spicewood-tx",
    cityName: "Spicewood",
    titleTag: "Plumber in Spicewood, TX | Ironclad Plumbing",
    metaDescription:
      "Spicewood Hill Country plumbing from professionals who understand hard water and long service runs.",
    h1: "Spicewood Plumbing - Hill Country Expertise",
  },
];

export const LOCATION_SLUG_SET = new Set(LOCATIONS.map((location) => location.slug));
