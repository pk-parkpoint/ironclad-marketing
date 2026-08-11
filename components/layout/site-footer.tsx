import Link from "next/link";
import { getPublicContactInfo } from "@/lib/contact";
import { ContactForm } from "./contact-form";
import { FacebookIcon, GoogleGIcon, InstagramIcon, MailIcon, PhoneIcon, StarIcon } from "./footer-icons";
import { HeadquartersAddress } from "./headquarters-address";
import { SiteLogo } from "./site-logo";

type FooterLink = {
  href: string;
  label: string;
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const QUICK_LINKS: FooterLink[] = [
  { href: "/", label: "Home" },
  { href: "/plumbing", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const SERVICE_AREA_LINKS: FooterLink[] = [
  { href: "/service-area/austin-tx", label: "Austin, TX" },
  { href: "/service-area/round-rock-tx", label: "Round Rock, TX" },
  { href: "/service-area/cedar-park-tx", label: "Cedar Park, TX" },
  { href: "/service-area/pflugerville-tx", label: "Pflugerville, TX" },
  { href: "/service-area/georgetown-tx", label: "Georgetown, TX" },
  { href: "/service-area/bee-cave-tx", label: "Bee Cave, TX" },
];

const SERVICE_LINKS: FooterLink[] = [
  { href: "/plumbing/repairs", label: "Plumbing Repairs" },
  { href: "/plumbing/drain-clearing", label: "Drain Clearing" },
  { href: "/plumbing/sewer-services", label: "Sewer Line Services" },
  { href: "/plumbing/water-heaters", label: "Water Heaters" },
  { href: "/plumbing/leak-detection", label: "Leak Detection" },
  { href: "/plumbing/emergency", label: "Emergency Plumbing" },
  { href: "/plumbing/slab-leak-repair", label: "Slab Leak Repair" },
  { href: "/plumbing/hydro-jetting", label: "Hydro Jetting" },
  { href: "/plumbing", label: "View All Services →" },
];

const GOOGLE_MAPS_EMBED =
  "https://www.google.com/maps?q=1510%20Newning%20Ave%2C%20Austin%2C%20TX%2078704&output=embed";
const FOOTER_WORDMARK = "Ironclad";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SiteFooter() {
  const { phoneDisplay, phoneHref, contactEmail } = getPublicContactInfo();
  const year = new Date().getFullYear();
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim();
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

  return (
    <>
      {/* ── Contact Block (overlaps section above) ── */}
      <div className="relative z-[2] mx-auto -mt-16 max-w-[1100px] px-6">
        <div className="grid grid-cols-1 overflow-hidden rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:grid-cols-2">
          {/* Left card — Get In Touch */}
          <div className="bg-[#F4F5F8] px-10 py-12">
            <h3 className="mb-4 text-[32px] font-bold leading-[1.2] text-[#2563EB]">
              Get In Touch With Us
            </h3>
            <p className="mb-8 text-[15px] leading-relaxed text-[#454F5E]">
              Feel free to reach out to us anytime.
              <br />
              We&apos;re here to help!
            </p>

            {/* Phone */}
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE]">
                <PhoneIcon />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-[#111827]">Phone Number</p>
                <a className="text-[15px] text-[#2563EB] hover:underline" href={phoneHref}>
                  {phoneDisplay}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE]">
                <MailIcon />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-[#111827]">Email</p>
                <a className="text-[15px] text-[#2563EB] hover:underline" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Right card — Send Us a Message */}
          <div className="bg-white px-10 py-12">
            <h3 className="mb-6 text-[32px] font-bold leading-[1.2] text-[#2563EB]">
              Send Us a Message
            </h3>
            <ContactForm idPrefix="footer-contact" />
          </div>
        </div>
      </div>

      {/* ── Footer (dark) ── */}
      <footer className="bg-[#111827] pt-20 text-white">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* 5-column link grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.5fr]">
            {/* Column 1 — Logo */}
            <div>
              <Link
                aria-label="Ironclad Plumbing home"
                className="inline-flex items-center hover:no-underline"
                href="/"
              >
                <SiteLogo className="h-auto w-[220px]" theme="light" />
              </Link>
              <p className="mt-4 text-[13px] text-[#9CA3AF]">
                Austin Plumbing, Backed in Writing
              </p>
              <HeadquartersAddress className="mt-4 text-[13px] leading-5 text-[#9CA3AF]" />
            </div>

            {/* Column 2 — Quick Links */}
            <FooterColumn links={QUICK_LINKS} title="Quick Links" />

            {/* Column 3 — Service Areas */}
            <FooterColumn links={SERVICE_AREA_LINKS} title="Service Areas" />

            {/* Column 4 — Services */}
            <FooterColumn links={SERVICE_LINKS} title="Services" />

            {/* Column 5 — Google Map */}
            <div className="self-start overflow-hidden rounded-lg border border-[#374151] bg-[#0F172A]">
              <iframe
                allowFullScreen
                className="block h-[240px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={GOOGLE_MAPS_EMBED}
                style={{ border: 0 }}
                title="Ironclad Plumbing service area"
                width="100%"
              />
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#1F2937] py-6 md:flex-row md:justify-between">
            {/* Left — Google rating */}
            <div className="flex items-center gap-2">
              <GoogleGIcon />
              <div className="flex items-center gap-0.5">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
            </div>

            {/* Right — Copyright + social */}
            <div className="flex items-center gap-4">
              <p className="text-[13px] text-[#6B7280]">
                &copy; {year} Ironclad Plumbing. All rights reserved. RMP #39871.
              </p>
              <div className="flex items-center gap-3">
                {facebookUrl ? (
                  <a
                    aria-label="Facebook"
                    className="text-[#6B7280] transition-colors duration-150 hover:text-white"
                    href={facebookUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FacebookIcon />
                  </a>
                ) : null}

                {instagramUrl ? (
                  <a
                    aria-label="Instagram"
                    className="text-[#6B7280] transition-colors duration-150 hover:text-white"
                    href={instagramUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <InstagramIcon />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="footer-wordmark-shell">
          <div className="footer-wordmark-track">
            {FOOTER_WORDMARK.split("").map((letter, index) => (
              <span className="footer-wordmark-letter" key={`${letter}-${index}`}>
                {letter}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer column                                                      */
/* ------------------------------------------------------------------ */

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <section aria-label={title}>
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.05em] text-white">
        {title}
      </p>
      <ul className="m-0 list-none space-y-2.5 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="text-sm text-[#9CA3AF] transition-colors duration-150 hover:text-white hover:no-underline"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
