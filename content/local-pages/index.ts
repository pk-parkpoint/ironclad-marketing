import rawData from "./data.json";
import { cityEta, neighborhoodEta, type LocalEta } from "./local-page-eta";
import { SAN_MARCOS_CITY_PAGE } from "./san-marcos";
import { AUSTIN_NEIGHBORHOOD_LINKS } from "@/content/austin-neighborhoods";
import { getLocationDetail } from "@/content/location-details";
import { LOCATIONS, type LocationEntry } from "@/content/locations";
import { SERVICES } from "@/content/services";

export type Pair = [string, string];
export type LocalService = [string, string, string];

export type LocalReview = {
  initial: string;
  name: string;
  loc: string;
  text: string;
};

export type { LocalEta } from "./local-page-eta";

export type LocalCityPageData = {
  name: string;
  slug: string;
  path: string;
  eta: LocalEta;
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
  eta: LocalEta;
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
  cities: Array<Omit<LocalCityPageData, "eta">>;
  neighborhoods: Array<Omit<LocalNeighborhoodPageData, "eta">>;
};

const serviceSlugOverrides: Record<string, string> = {
  "Drain Replacement": "drain-clearing",
  "Fixture Installation": "fixtures",
  "Fixture Upgrades": "fixtures",
  "Remodel Rough-In": "repiping",
  "Sewer & Drain Clearing": "drain-clearing",
  "Whole-Home Repiping": "repiping",
};

function serviceTuple(slug: string): LocalService {
  const service = SERVICES.find((entry) => entry.slug === slug) ?? SERVICES[0];
  return [service.title, service.metaDescription, service.slug];
}

function legacyLocationToLocalPage(location: LocationEntry): LocalCityPageData {
  const detail = getLocationDetail(location);
  return {
    name: location.cityName,
    slug: location.slug,
    path: `/service-area/${location.slug}`,
    eta: cityEta(location.slug),
    h1: detail.overviewHeading,
    intro: detail.heroDescription,
    challengesLead: detail.commonIssuesHeading,
    challenges: detail.commonIssues.map((issue) => [issue, `We diagnose this issue in ${location.cityName} homes and quote the repair before work starts.`]),
    services: detail.featuredServiceSlugs.map(serviceTuple),
    neighborhoods: detail.neighborhoods,
    reviews: [
      {
        initial: "I",
        name: "Ironclad customer",
        loc: location.cityName,
        text: `They confirmed the arrival window, explained the work clearly, and handled our ${location.cityName} plumbing issue without surprises.`,
      },
    ],
    faqs: detail.faqs.map(({ answer, question }) => [question, answer]),
  };
}

const canonicalCityPages = [...data.cities, SAN_MARCOS_CITY_PAGE];
const localCitySlugs = new Set(canonicalCityPages.map((page) => page.slug));
const additionalCityPages = LOCATIONS.filter((location) => !localCitySlugs.has(location.slug)).map(legacyLocationToLocalPage);

export const LOCAL_CITY_PAGES: LocalCityPageData[] = [
  ...canonicalCityPages.map((page) => ({ ...page, eta: cityEta(page.slug) })),
  ...additionalCityPages,
];
export const LOCAL_NEIGHBORHOOD_PAGES: LocalNeighborhoodPageData[] = data.neighborhoods.map((page) => ({
  ...page,
  eta: neighborhoodEta(page.name),
}));

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
  if (AUSTIN_NEIGHBORHOOD_LINKS.length !== LOCAL_NEIGHBORHOOD_PAGES.length) {
    throw new Error("Austin neighborhood navigation is out of sync with local page content.");
  }

  return AUSTIN_NEIGHBORHOOD_LINKS.map((link) => {
    const page = LOCAL_NEIGHBORHOOD_PAGES.find((entry) => entry.path === link.href);
    if (!page || page.name !== link.label) {
      throw new Error(`Austin neighborhood navigation entry does not match local page content: ${link.href}`);
    }

    return { ...link, eta: page.eta.short };
  });
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
