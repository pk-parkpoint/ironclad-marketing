import Link from "next/link";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { CtaBanner } from "@/components/layout/cta-banner";
import { Hero, type HeroAction, type HeroBackgroundType } from "@/components/layout/hero";
import { getPublicContactInfo } from "@/lib/contact";

type PageScaffoldProps = {
  title: string;
  description: string;
  eyebrow?: string;
  pathLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
  hero?: {
    backgroundType: HeroBackgroundType;
    backgroundSrc?: string;
    alignment: "center" | "left";
    actions?: HeroAction[];
    trustChips?: string[];
    locationBadge?: { text: string };
    eyebrow?: string;
  };
  children?: React.ReactNode;
};

function toTitleCaseLabel(segment: string): string {
  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildBreadcrumbsFromPath(pathLabel: string): BreadcrumbItem[] {
  const segments = pathLabel
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean);

  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  let pathAccumulator = "";

  segments.forEach((segment, index) => {
    pathAccumulator += `/${segment}`;
    const isLast = index === segments.length - 1;
    items.push({
      label: toTitleCaseLabel(decodeURIComponent(segment)),
      href: isLast ? undefined : pathAccumulator,
    });
  });

  return items;
}

export function PageScaffold({
  title,
  description,
  eyebrow,
  pathLabel,
  breadcrumbs,
  hero,
  children,
}: PageScaffoldProps) {
  const contactInfo = getPublicContactInfo();
  const resolvedBreadcrumbs = breadcrumbs || (pathLabel ? buildBreadcrumbsFromPath(pathLabel) : []);
  const defaultHeroActions: HeroAction[] = [
    { href: "/book", label: "Book Service", variant: "primary" },
    { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
    { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
  ];

  return (
    <main>
      {resolvedBreadcrumbs.length > 1 ? (
        <section className="bg-soft-background pt-6">
          <div className="container-shell">
            <Breadcrumbs currentPath={pathLabel} items={resolvedBreadcrumbs} />
          </div>
        </section>
      ) : null}
      {hero ? (
        <Hero
          actions={hero.actions || defaultHeroActions}
          alignment={hero.alignment}
          backgroundSrc={hero.backgroundSrc}
          backgroundType={hero.backgroundType}
          eyebrow={hero.eyebrow || eyebrow}
          heading={title}
          locationBadge={hero.locationBadge}
          subtitle={description}
          trustChips={hero.trustChips}
        />
      ) : (
        <section className="section-block bg-soft-background">
          <div className="container-shell space-y-4">
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">{eyebrow}</p>
            ) : null}
            <h1 className="h1-display max-w-[var(--max-readable-width)]">{title}</h1>
            <p className="body-large max-w-[var(--max-readable-width)] text-muted">{description}</p>
            {pathLabel ? (
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">Route: {pathLabel}</p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Link className="focus-ring primary-button" href="/book">
                Book Service
              </Link>
              <Link className="focus-ring secondary-button" href="/contact">
                Contact Team
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="section-block">
        <div className="container-shell card-shell p-6 md:p-8">
          {children}
        </div>
      </section>
      <CtaBanner
        actions={[
          { href: "/book", label: "Book Service", variant: "primary" },
          { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
          { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
        ]}
        heading="Ready to get it fixed?"
        subtitle="Book online in under a minute, or contact our team directly by phone or text."
        variant="light"
      />
    </main>
  );
}
