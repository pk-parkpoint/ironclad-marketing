import type { LocalCityPageData, LocalNeighborhoodPageData } from "@/content/local-pages";
import { getAustinNeighborhoodLinks, getNearbyCities, getNearbyNeighborhoods } from "@/content/local-pages";
import { GuaranteeStrip, LocalHero } from "./local-page-shared";
import {
  CoverageSection,
  FaqSection,
  FinalCta,
  LocalKnowledgeSection,
  NearbySection,
  NumberedRowsSection,
  ProcessSection,
  ReviewsSection,
  ServicesSection,
  StatsStrip,
  WhySection,
} from "./local-page-sections";

type LocalPageBodyProps = {
  page: LocalCityPageData | LocalNeighborhoodPageData;
  bookingHref: string;
  phoneDisplay: string;
  phoneHref: string;
};

function isNeighborhoodPage(
  page: LocalCityPageData | LocalNeighborhoodPageData,
): page is LocalNeighborhoodPageData {
  return "pockets" in page;
}

export function LocalPageBody({ bookingHref, page, phoneDisplay, phoneHref }: LocalPageBodyProps) {
  const isNeighborhood = isNeighborhoodPage(page);
  const austinNeighborhoodLinks = getAustinNeighborhoodLinks();
  const nearbyPages = isNeighborhood
    ? getNearbyNeighborhoods(page.slug).map((nearby) => ({ name: nearby.name, path: nearby.path }))
    : getNearbyCities(page.slug).map((nearby) => ({ name: `${nearby.name}, TX`, path: nearby.path }));
  const areaItems =
    !isNeighborhood && page.slug === "austin-tx"
      ? austinNeighborhoodLinks.map((link) => link.label)
      : isNeighborhood
        ? page.pockets
        : page.neighborhoods;
  const areaLinks = !isNeighborhood && page.slug === "austin-tx" ? austinNeighborhoodLinks : undefined;
  const areaTitle = isNeighborhood
    ? `Streets & Pockets We Serve in ${page.name}`
    : `Neighborhoods We Serve in ${page.name}`;
  const areaBody = isNeighborhood
    ? `From established blocks to newer additions, we cover every corner of ${page.name} and the communities nearby.`
    : `From established streets to newer builds, we cover the whole ${page.name} area and the communities right next door.`;

  return (
    <main className="local-page">
      <LocalHero
        bookingHref={bookingHref}
        eyebrow={isNeighborhood ? `Neighborhood Guide - ${page.name}` : `Service Area - ${page.name}, TX`}
        intro={page.intro}
        parentLink={isNeighborhood ? { href: page.parentHref, label: page.parent } : undefined}
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        title={page.h1}
      />
      {isNeighborhood ? <LocalKnowledgeSection body={page.local} name={page.name} traits={page.traits} /> : null}
      <GuaranteeStrip />
      <NumberedRowsSection
        items={page.challenges}
        lead={page.challengesLead}
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        title={isNeighborhood ? `Common on ${page.name} Streets` : `Plumbing Built for ${page.name} Homes`}
      />
      <ServicesSection cityName={page.name} services={page.services} />
      <ProcessSection cityName={page.name} />
      <WhySection cityName={page.name} />
      <StatsStrip />
      <ReviewsSection cityName={page.name} reviews={page.reviews} />
      <CoverageSection body={areaBody} items={areaItems} links={areaLinks} title={areaTitle} />
      <NearbySection
        label={isNeighborhood ? "Nearby Austin Neighborhoods" : "Nearby Service Areas"}
        pages={nearbyPages}
      />
      <FaqSection faqs={page.faqs} title={`${page.name} Plumbing Questions, Answered`} />
      <FinalCta
        body="Same-day appointments, 24/7 emergency service, and upfront pricing from a team your neighbors already trust."
        bookingHref={bookingHref}
        phoneHref={phoneHref}
        title={`Need a Plumber in ${page.name}? Call Ironclad.`}
      />
    </main>
  );
}
