import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBanner } from "@/components/layout/cta-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getPublicContactInfo } from "@/lib/contact";

export default function NotFound() {
  const contactInfo = getPublicContactInfo();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="section-block">
          <div className="container-shell">
            <div className="card-shell space-y-6 p-6 md:p-8">
              <Breadcrumbs
                currentPath="/404"
                items={[
                  { label: "Home", href: "/" },
                  { label: "Not Found" },
                ]}
              />
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">404</p>
                <h1 className="h2-display">We could not find that page.</h1>
                <p className="max-w-[46ch] text-sm text-muted md:text-base">
                  Jump to a high-traffic route to keep moving.
                </p>
              </div>
              <form action="/plumbing" className="flex flex-col gap-3 sm:flex-row" role="search">
                <label className="sr-only" htmlFor="q">
                  Find a service
                </label>
                <input
                  className="focus-ring min-h-11 flex-1 rounded-xl border border-border px-4"
                  id="q"
                  name="q"
                  placeholder="Browse services or enter a keyword"
                  type="search"
                />
                <button className="focus-ring primary-button justify-center" type="submit">
                  Go
                </button>
              </form>
              <ul className="grid gap-3 text-sm md:grid-cols-3">
                <li>
                  <Link className="focus-ring" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="focus-ring" href="/plumbing">
                    Plumbing Services
                  </Link>
                </li>
                <li>
                  <Link className="focus-ring" href="/contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <CtaBanner
          actions={[
            { href: "/book", label: "Book Service", variant: "primary" },
            { href: contactInfo.phoneHref, label: `Call ${contactInfo.phoneDisplay}`, variant: "secondary" },
            { href: contactInfo.smsHref, label: "Text Us", variant: "text" },
          ]}
          heading="Need urgent plumbing help?"
          subtitle="If you cannot find the page, our team can still help you get scheduled quickly."
          variant="light"
        />
      </main>
      <SiteFooter />
    </>
  );
}
