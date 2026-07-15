import Link from "next/link";

export function DataDeskBreadcrumbs({ current }: { current?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-body">
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        <li><Link className="font-medium text-cta-blue hover:underline" href="/">Home</Link></li>
        <li aria-hidden="true">/</li>
        <li><Link className="font-medium text-cta-blue hover:underline" href="/guides">Guides</Link></li>
        <li aria-hidden="true">/</li>
        {current ? (
          <>
            <li><Link className="font-medium text-cta-blue hover:underline" href="/data">Austin Home Data Desk</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{current}</li>
          </>
        ) : (
          <li aria-current="page" className="text-ink">Austin Home Data Desk</li>
        )}
      </ol>
    </nav>
  );
}
