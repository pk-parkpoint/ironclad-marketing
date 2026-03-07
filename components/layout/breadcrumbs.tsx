import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  currentPath?: string;
};

function toAbsoluteUrl(baseUrl: string, href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  const normalized = href.startsWith("/") ? href : `/${href}`;
  return new URL(normalized, baseUrl).toString();
}

export function Breadcrumbs({ items, currentPath }: BreadcrumbsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ironcladtexas.com";
  const breadcrumbItems = items.length > 0 ? items : [{ label: "Home", href: "/" }];

  const itemListElement = breadcrumbItems.map((item, index) => {
    const isLast = index === breadcrumbItems.length - 1;
    const itemHref = item.href || (isLast ? currentPath || "/" : "/");

    return {
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: toAbsoluteUrl(baseUrl, itemHref),
    };
  });

  const schemaPayload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="m-0 flex list-none items-center gap-2 overflow-x-auto whitespace-nowrap p-0 text-sm text-muted [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li className="flex min-w-0 items-center gap-2" key={`${item.label}-${item.href || "current"}`}>
                {item.href && !isLast ? (
                  <Link className="focus-ring max-w-[9rem] truncate hover:text-ink sm:max-w-none" href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="max-w-[12rem] truncate font-semibold text-ink sm:max-w-none">
                    {item.label}
                  </span>
                )}
                {!isLast ? (
                  <span aria-hidden="true" className="text-muted/70">
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPayload) }}
        suppressHydrationWarning
        type="application/ld+json"
      />
    </>
  );
}
