import Image from "next/image";
import Link from "next/link";
import { getPublicContactInfo } from "@/lib/contact";
import { ContactForm } from "./contact-form";

type FooterLink = {
  href: string;
  label: string;
};

/* ------------------------------------------------------------------ */
/*  SVG icons (inline to avoid extra dependencies)                     */
/* ------------------------------------------------------------------ */

function PhoneIcon() {
  return (
    <svg fill="none" height="20" stroke="#2563EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg fill="none" height="20" stroke="#2563EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <polyline points="22,7 12,13 2,7" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg fill="#FBBC04" height="16" viewBox="0 0 24 24" width="16">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function GoogleGIcon() {
  return (
    <svg height="20" viewBox="0 0 24 24" width="20">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

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
  { href: "/plumbing/drain-cleaning", label: "Drain Cleaning" },
  { href: "/plumbing/sewer-services", label: "Sewer Line Services" },
  { href: "/plumbing/water-heaters", label: "Water Heaters" },
  { href: "/plumbing/leak-detection", label: "Leak Detection" },
  { href: "/plumbing/emergency", label: "Emergency Plumbing" },
  { href: "/plumbing/slab-leak-repair", label: "Slab Leak Repair" },
  { href: "/plumbing/hydro-jetting", label: "Hydro Jetting" },
  { href: "/plumbing", label: "View All Services →" },
];

const GOOGLE_MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220440.45684492782!2d-97.89517099062068!3d30.307609929908208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0cc032f%3A0x5d9b464bd469d57a!2sAustin%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";
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
              <Link className="inline-flex items-center gap-2 text-lg font-semibold text-white hover:no-underline" href="/">
                <Image
                  alt="Ironclad Plumbing logo"
                  className="h-8 w-8"
                  height={32}
                  src="/media/ip-logo.svg"
                  width={32}
                />
                Ironclad Plumbing
              </Link>
              <p className="mt-4 text-[13px] text-[#9CA3AF]">
                Austin&apos;s Most Trusted Plumber
              </p>
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
                &copy; {year} Ironclad Plumbing. All rights reserved.
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
