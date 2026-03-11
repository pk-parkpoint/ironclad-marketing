import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type GuidePlaceholderShellProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export function GuidePlaceholderShell({ title, path, children }: GuidePlaceholderShellProps) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section-block bg-soft-background">
          <div className="container-shell space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Guides</p>
            <h1 className="h1-display max-w-[var(--max-readable-width)]">{title}</h1>
            <p className="body-large max-w-[var(--max-readable-width)] text-muted">
              This guide section is scaffolded and ready for content implementation.
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">Route: {path}</p>
            <div className="flex flex-wrap gap-3">
              <Link className="focus-ring primary-button" href="/guides">
                Browse Guides Hub
              </Link>
              <Link className="focus-ring secondary-button" href="/book">
                Schedule Online
              </Link>
            </div>
          </div>
        </section>
        <section className="section-block">
          <div className="container-shell card-shell p-6 md:p-8">{children}</div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
