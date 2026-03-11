"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent } from "react";
import { getPublicContactInfo } from "@/lib/contact";
import { TOP_NAV_LINKS } from "@/lib/routes";

function isNavLinkActive(currentPath: string, href: string): boolean {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57a2 2 0 0 1 1.72 2.03Z" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [isElevated, setIsElevated] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const { phoneDisplay, phoneHref } = getPublicContactInfo();
  const navPhoneLabel = phoneDisplay;

  function handleNavItemEnter(event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) {
    const nav = navRef.current;
    if (!nav) return;
    const itemRect = event.currentTarget.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    setHighlightStyle({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      opacity: 1,
    });
  }

  function handleNavLeave() {
    setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
  }

  useEffect(() => {
    function onScroll() {
      setIsElevated(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const root = drawerRef.current;
    if (!root) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    const focusables = Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter(
      (el) => !el.hasAttribute("disabled"),
    );
    focusables[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileNavOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="sticky top-0 z-40">
        <Link
          className="promo-bar flex h-[52px] w-full items-center justify-center px-3 text-[13px] font-bold text-white transition-[filter] duration-150 hover:brightness-105 hover:no-underline md:text-sm"
          data-track-intent="book"
          href="/book"
        >
          <span className="block max-w-full truncate">
            Book Today and Get 10% Off Your First Service →
          </span>
        </Link>

        <header
          className={`border-b border-[#E5E7EB] bg-white ${
            isElevated ? "shadow-[0_6px_20px_rgba(15,23,42,0.08)]" : ""
          }`}
        >
          <div className="mx-auto flex h-[95px] w-full max-w-[1280px] items-center justify-between gap-6 px-6">
            <Link className="focus-ring inline-flex shrink-0 items-center gap-2 text-lg font-semibold text-ink" href="/">
              <Image
                alt="Ironclad Plumbing logo"
                className="h-8 w-8"
                height={32}
                priority
                src="/media/ip-logo.svg"
                width={32}
              />
              <span className="whitespace-nowrap">Ironclad Plumbing</span>
            </Link>

            <nav
              aria-label="Primary"
              className="relative hidden items-center gap-5 text-[15px] font-medium lg:flex"
              onMouseLeave={handleNavLeave}
              ref={navRef}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-md bg-[#F3F4F6]"
                style={{
                  left: highlightStyle.left,
                  width: highlightStyle.width,
                  opacity: highlightStyle.opacity,
                  transition:
                    "left 300ms cubic-bezier(0.4,0,0.2,1), width 300ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease",
                }}
              />

              {TOP_NAV_LINKS.map((link) => {
                const active = isNavLinkActive(pathname, link.href);
                const hasChildren = Boolean(link.children && link.children.length > 0);
                const isPlumbingDropdown = link.href === "/plumbing";
                const isAboutDropdown = link.href === "/about";

                return (
                  <div className="group/nav relative" key={link.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      aria-haspopup={hasChildren ? "menu" : undefined}
                      className={`focus-ring relative z-10 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] transition-colors hover:no-underline ${
                        active ? "font-semibold text-[#111827]" : "text-[#374151] hover:text-[#111827]"
                      }`}
                      href={link.href}
                      onFocus={handleNavItemEnter}
                      onMouseEnter={handleNavItemEnter}
                    >
                      <span className="whitespace-nowrap">{link.label}</span>
                      {hasChildren ? (
                        <ChevronDownIcon className="h-4 w-4 text-[#6B7280] transition-transform duration-200 group-hover/nav:rotate-180 group-focus-within/nav:rotate-180" />
                      ) : null}
                    </Link>

                    {hasChildren ? (
                      <div className="pointer-events-none invisible absolute left-0 top-full z-30 pt-2 opacity-0 delay-150 transition-[opacity,transform] duration-150 ease-out -translate-y-1 group-focus-within/nav:pointer-events-auto group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-focus-within/nav:translate-y-0 group-focus-within/nav:delay-0 group-hover/nav:pointer-events-auto group-hover/nav:visible group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:delay-0">
                        <div
                          className={`rounded-lg border border-[#E5E7EB] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${
                            isPlumbingDropdown
                              ? "w-[min(40rem,72vw)]"
                              : isAboutDropdown
                                ? "w-[min(18rem,32vw)]"
                                : "w-[min(28rem,64vw)]"
                          }`}
                        >
                          <ul
                            aria-label={`${link.label} subpages`}
                            className={`m-0 list-none gap-1 p-0 ${
                              isPlumbingDropdown
                                ? "grid grid-cols-2"
                                : isAboutDropdown
                                  ? "grid grid-cols-1"
                                  : "grid grid-cols-1 sm:grid-cols-2"
                            }`}
                          >
                            {link.children?.map((childLink) => {
                              const childActive = isNavLinkActive(pathname, childLink.href);

                              return (
                                <li key={childLink.href}>
                                  <Link
                                    aria-current={childActive ? "page" : undefined}
                                    className={`focus-ring block rounded px-4 py-2.5 text-sm font-medium transition-colors hover:no-underline ${
                                      childActive
                                        ? "bg-[#F3F4F6] text-[#111827]"
                                        : "text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]"
                                    }`}
                                    href={childLink.href}
                                  >
                                    {childLink.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                className="focus-ring hidden min-h-[44px] items-center justify-center whitespace-nowrap rounded-full border-2 border-[#1E2A38] bg-transparent px-5 py-2.5 text-[14px] font-semibold text-[#1E2A38] transition-colors hover:bg-[#1E2A38] hover:text-white hover:no-underline lg:inline-flex"
                data-track-intent="book"
                href="/book"
              >
                Schedule Online
              </Link>

              <a
                className="focus-ring hidden min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#2563EB] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#D03E04] hover:no-underline lg:inline-flex"
                data-track-intent="phone"
                href={phoneHref}
              >
                <PhoneIcon className="h-4 w-4" />
                {navPhoneLabel}
              </a>

              <button
                aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileNavOpen}
                className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-background text-ink lg:hidden"
                onClick={() => setMobileNavOpen((current) => !current)}
                type="button"
              >
                {mobileNavOpen ? (
                  <span aria-hidden="true" className="text-xl leading-none">
                    ×
                  </span>
                ) : (
                  <span aria-hidden="true" className="flex flex-col gap-1.5">
                    <span className="block h-0.5 w-5 bg-current" />
                    <span className="block h-0.5 w-5 bg-current" />
                    <span className="block h-0.5 w-5 bg-current" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      <div
        aria-hidden={!mobileNavOpen}
        className={`fixed inset-0 z-50 transition-opacity duration-200 motion-reduce:transition-none lg:hidden ${
          mobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        inert={!mobileNavOpen}
      >
        <button
          aria-label="Close navigation menu"
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 motion-reduce:transition-none ${
            mobileNavOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileNavOpen(false)}
          tabIndex={mobileNavOpen ? 0 : -1}
          type="button"
        />

        <div
          aria-label="Mobile navigation"
          aria-modal="true"
          className={`absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-white shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${
            mobileNavOpen ? "translate-x-0" : "translate-x-full"
          }`}
          ref={drawerRef}
          role="dialog"
        >
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-muted">Menu</span>
            <button
              aria-label="Close navigation menu"
              className="focus-ring inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-border text-ink"
              onClick={() => setMobileNavOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>

          <div className="border-b border-[#E5E7EB] px-5 py-4">
            <a
              className="focus-ring inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#1D4ED8] hover:no-underline"
              data-track-intent="phone"
              href={phoneHref}
              onClick={() => setMobileNavOpen(false)}
            >
              <PhoneIcon className="h-4 w-4" />
              {navPhoneLabel}
            </a>
          </div>

          <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="m-0 list-none space-y-1 p-0">
              {TOP_NAV_LINKS.map((link) => {
                const active = isNavLinkActive(pathname, link.href);

                return (
                  <li key={link.href}>
                    <Link
                      aria-current={active ? "page" : undefined}
                      className={`focus-ring block rounded-lg px-4 py-3 text-base font-medium ${
                        active ? "font-semibold text-[#111827]" : "text-[#374151] hover:bg-[#F3F4F6]"
                      }`}
                      href={link.href}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {link.children?.length ? (
                      <ul className="mt-1 m-0 list-none space-y-1 pl-4">
                        {link.children.map((childLink) => {
                          const childActive = isNavLinkActive(pathname, childLink.href);

                          return (
                            <li key={childLink.href}>
                              <Link
                                aria-current={childActive ? "page" : undefined}
                                className={`focus-ring block rounded px-3 py-2 text-sm ${
                                  childActive ? "font-semibold text-[#111827]" : "text-[#374151] hover:bg-[#F3F4F6]"
                                }`}
                                href={childLink.href}
                                onClick={() => setMobileNavOpen(false)}
                              >
                                {childLink.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[#E5E7EB] px-4 py-4">
            <Link
              className="focus-ring flex min-h-[44px] w-full items-center justify-center rounded-lg border-2 border-[#1E2A38] bg-transparent px-5 py-2.5 text-[14px] font-semibold text-[#1E2A38] transition-colors hover:bg-[#1E2A38] hover:text-white hover:no-underline"
              data-track-intent="book"
              href="/book"
              onClick={() => setMobileNavOpen(false)}
            >
              Schedule Online
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
