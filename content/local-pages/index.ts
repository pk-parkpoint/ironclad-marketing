import rawData from "./data.json";

export type Pair = [string, string];
export type LocalService = [string, string, string];

export type LocalReview = {
  initial: string;
  name: string;
  loc: string;
  text: string;
};

export type LocalCityPageData = {
  name: string;
  slug: string;
  path: string;
  h1: string;
  intro: string;
  challengesLead: string;
  challenges: Pair[];
  services: LocalService[];
  neighborhoods: string[];
  reviews: LocalReview[];
  faqs: Pair[];
};

export type LocalNeighborhoodPageData = {
  name: string;
  slug: string;
  parent: string;
  parentHref: string;
  path: string;
  h1: string;
  intro: string;
  local: string;
  traits: Pair[];
  challengesLead: string;
  challenges: Pair[];
  services: LocalService[];
  pockets: string[];
  reviews: LocalReview[];
  faqs: Pair[];
};

const data = rawData as {
  cities: LocalCityPageData[];
  neighborhoods: LocalNeighborhoodPageData[];
};

const serviceSlugOverrides: Record<string, string> = {
  "Drain Replacement": "drain-cleaning",
  "Fixture Installation": "fixtures",
  "Fixture Upgrades": "fixtures",
  "Remodel Rough-In": "repiping",
  "Sewer & Drain Cleaning": "drain-cleaning",
  "Whole-Home Repiping": "repiping",
};

export const LOCAL_CITY_PAGES = data.cities;
export const LOCAL_NEIGHBORHOOD_PAGES = data.neighborhoods;

export function getLocalCityPage(slug: string): LocalCityPageData | undefined {
  return LOCAL_CITY_PAGES.find((page) => page.slug === slug);
}

export function getLocalNeighborhoodPage(slug: string): LocalNeighborhoodPageData | undefined {
  return LOCAL_NEIGHBORHOOD_PAGES.find((page) => page.slug === slug);
}

export function getLocalNeighborhoodStaticParams(): Array<{ neighborhood: string }> {
  return LOCAL_NEIGHBORHOOD_PAGES.map((page) => ({ neighborhood: page.slug }));
}

export function getFaqItems(page: { faqs: Pair[] }): Array<{ question: string; answer: string }> {
  return page.faqs.map(([question, answer]) => ({ question, answer }));
}

export function getServiceHref(service: LocalService): string {
  const [label, , slug] = service;
  const normalizedSlug = serviceSlugOverrides[label] ?? slug;
  return `/plumbing/${normalizedSlug}`;
}

export function getAustinNeighborhoodLinks() {
  return LOCAL_NEIGHBORHOOD_PAGES.map((page) => ({
    href: page.path,
    label: page.name,
  }));
}

export function getNearbyCities(currentSlug: string, count = 6) {
  const currentIndex = LOCAL_CITY_PAGES.findIndex((page) => page.slug === currentSlug);
  const rotated =
    currentIndex < 0
      ? LOCAL_CITY_PAGES
      : [...LOCAL_CITY_PAGES.slice(currentIndex + 1), ...LOCAL_CITY_PAGES.slice(0, currentIndex)];
  return rotated.filter((page) => page.slug !== currentSlug).slice(0, count);
}

export function getNearbyNeighborhoods(currentSlug: string, count = 6) {
  const currentIndex = LOCAL_NEIGHBORHOOD_PAGES.findIndex((page) => page.slug === currentSlug);
  const rotated =
    currentIndex < 0
      ? LOCAL_NEIGHBORHOOD_PAGES
      : [
          ...LOCAL_NEIGHBORHOOD_PAGES.slice(currentIndex + 1),
          ...LOCAL_NEIGHBORHOOD_PAGES.slice(0, currentIndex),
        ];
  return rotated.filter((page) => page.slug !== currentSlug).slice(0, count);
}

export function buildLocalPageTitle(page: LocalCityPageData | LocalNeighborhoodPageData): string {
  if ("parent" in page) {
    return `${page.name} Plumber - Austin, TX | Ironclad Plumbing`;
  }
  return `Plumber in ${page.name}, TX - Licensed & Insured | Ironclad Plumbing`;
}
