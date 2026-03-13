import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getGuidePageData } from "@/content/guide-pages";
import { GUIDE_ENTRIES, GUIDE_ENTRY_BY_SLUG, GUIDE_HUB_GROUPS } from "@/content/guides";
import { buildPageMetadata } from "@/lib/seo";

const START_HERE_SLUGS = [
  "what-plumbing-costs-austin",
  "questions-to-ask-your-plumber",
  "plumber-red-flags",
  "when-diy-vs-call-plumber",
];

const DECISION_SECTION_SLUGS = [
  "water-heater-repair-vs-replace",
  "tank-vs-tankless",
  "sewer-repair-options-compared",
  "signs-water-heater-needs-replacing",
];

const COST_SPOTLIGHT_SLUGS = [
  "drain-cleaning-cost-austin",
  "water-heater-replacement-cost-austin",
  "sewer-repair-cost-austin",
  "leak-detection-cost-austin",
];

export function generateMetadata() {
  return buildPageMetadata({
    title: "Homeowner Guides | Ironclad Plumbing",
    description:
      "Published pricing guides, homeowner checklists, plumbing decision guides, and Austin reference content from Ironclad Plumbing.",
    path: "/guides",
    ogTemplate: "blog",
  });
}

function getPage(slug: string) {
  const page = getGuidePageData(slug);
  if (!page) {
    throw new Error(`Missing guide page data for ${slug}`);
  }
  return page;
}

function buildIndexGroups() {
  return GUIDE_HUB_GROUPS.map((group) => ({
    group,
    entries: GUIDE_ENTRIES.filter((entry) => entry.hubGroup === group.id),
  }));
}

export default function GuidesHubPage() {
  const startHerePages = START_HERE_SLUGS.map(getPage);
  const featuredPage = startHerePages[0];
  const secondaryStartPages = startHerePages.slice(1);
  const decisionPages = DECISION_SECTION_SLUGS.map(getPage);
  const costSpotlights = COST_SPOTLIGHT_SLUGS.map(getPage);
  const browseGroups = buildIndexGroups();
  const toolGroups = GUIDE_HUB_GROUPS.map((group) => ({
    group,
    firstGuide: GUIDE_ENTRIES.find((entry) => entry.hubGroup === group.id),
  })).filter((item) => item.firstGuide);

  return (
    <>
      <SiteHeader />
      <main className="guide-hub-page">
        <section className="guide-hub-hero">
          <div className="guide-hub-hero__inner">
            <span className="guide-hub-hero__eyebrow">Published by Ironclad Plumbing</span>
            <h1>Plumbing tools, guides and calculators for Austin homeowners.</h1>
            <p>
              Price the work, vet the company, compare repair paths, and make decisions without getting boxed into a
              rushed service call.
            </p>
          </div>
        </section>

        <section className="guide-hub-section">
          <div className="guide-hub-container">
            <h2 className="guide-hub-section__title">Plumbing tools, guides and calculators</h2>
            <div className="guide-tool-grid">
              {toolGroups.map(({ group, firstGuide }) => (
                <Link className="guide-hub-tool-card" href={`/guides/${firstGuide!.slug}`} key={group.id}>
                  <span className="guide-hub-tool-card__eyebrow">{group.title.toUpperCase()}</span>
                  <span className="guide-hub-tool-card__icon">{group.id === "pricing" ? "$" : group.id === "reference" ? "ATX" : group.id === "comparisons" ? "VS" : group.id === "cost-guides" ? "C" : group.id === "tools" ? "PDF" : group.id === "replacement-signs" ? "!" : "Q"}</span>
                  <strong>{group.title}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="guide-hub-section guide-hub-section--surface">
          <div className="guide-hub-container">
            <h2 className="guide-hub-section__title">Start here</h2>
            <div className="guide-start-grid">
              <Link className="guide-start-feature" href={`/guides/${featuredPage.slug}`}>
                <div className="guide-start-feature__media">
                  <video autoPlay loop muted playsInline poster="/hero/ironclad-hero-poster.jpg" preload="none">
                    <source src="/hero/ironclad-hero-bg.webm" type="video/webm" />
                    <source src="/media/hero-video.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="guide-start-feature__body">
                  <span>{featuredPage.eyebrow}</span>
                  <h3>{featuredPage.title}</h3>
                  <p>{featuredPage.description}</p>
                  <strong>Read guide</strong>
                </div>
              </Link>

              <div className="guide-start-stack">
                {secondaryStartPages.map((page) => (
                  <Link className="guide-start-card" href={`/guides/${page.slug}`} key={page.slug}>
                    <div className="guide-start-card__media" />
                    <div className="guide-start-card__body">
                      <h3>{page.title}</h3>
                      <p>{page.description}</p>
                      <strong>Read guide</strong>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="guide-hub-section">
          <div className="guide-hub-container">
            <h2 className="guide-hub-section__title">What it costs</h2>
            <div className="guide-cost-grid">
              {costSpotlights.map((page) => (
                <Link className="guide-cost-card" href={`/guides/${page.slug}`} key={page.slug}>
                  <h3>{page.routeLabel}</h3>
                  <p>{page.description}</p>
                  <span>Read more</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="guide-hub-section guide-hub-section--surface">
          <div className="guide-hub-container">
            <h2 className="guide-hub-section__title">Compare the decision paths</h2>
            <div className="guide-decision-grid">
              {decisionPages.map((page) => (
                <Link className="guide-decision-card" href={`/guides/${page.slug}`} key={page.slug}>
                  <h3>{page.title}</h3>
                  <p>{page.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="guide-hub-section">
          <div className="guide-hub-container">
            <div className="guide-hub-index-head">
              <div>
                <h2 className="guide-hub-section__title">Browse the full guide index</h2>
                <p>Every guide stays visible here in grouped lists so homeowners can scan the entire library quickly.</p>
              </div>
              <a className="guide-hub-call-pill" href="tel:+18335971932">
                (833) 597-1932
              </a>
            </div>
            <div className="guide-index-grid">
              {browseGroups.map(({ group, entries }) => (
                <section className="guide-index-card" id={group.anchorId} key={group.id}>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <ul>
                    {entries.map((entry) => (
                      <li key={entry.slug}>
                        <Link href={`/guides/${entry.slug}`}>{GUIDE_ENTRY_BY_SLUG.get(entry.slug)?.routeLabel ?? entry.title}</Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
