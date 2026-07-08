import Image from "next/image";
import Link from "next/link";
import { HomeHeroVideo } from "@/components/home/home-hero-video";

type HomeHeroProps = {
  reviewCount: number;
  reviewHref: string;
};

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 19a19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[14px] w-[14px]"
      fill="none"
      stroke="#FFFFFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ReviewStar() {
  return (
    <svg
      aria-hidden="true"
      className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px]"
      fill="#FBBC04"
      stroke="#FBBC04"
      strokeWidth="1"
      viewBox="0 0 24 24"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function HomeHero({ reviewCount, reviewHref }: HomeHeroProps) {
  return (
    <section className="relative isolate min-h-[480px] overflow-hidden md:min-h-[580px]">
      <div className="absolute inset-0">
        <Image
          alt="Ironclad Plumbing service van parked in Austin"
          className="object-cover"
          fill
          fetchPriority="high"
          priority
          sizes="100vw"
          src="/hero/ironclad-hero-poster.jpg"
          unoptimized
        />
      </div>

      <HomeHeroVideo />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.225)_0%,rgba(0,0,0,0.525)_100%)]" />

      <div className="relative mx-auto flex min-h-[480px] w-full max-w-[1280px] items-center px-6 py-4 md:min-h-[580px] md:py-8">
        <div className="w-full text-center [font-family:var(--font-inter)] md:max-w-[760px] md:text-left lg:max-w-[78%] xl:max-w-[72%]">
          <Link
            className="focus-ring inline-flex max-w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full bg-[rgba(0,0,0,0.3)] px-4 py-2 text-center text-[#FFFFFF] transition-colors duration-200 hover:bg-[rgba(0,0,0,0.45)] hover:no-underline sm:px-5"
            aria-label={`Five stars. 4.9/5. ${reviewCount} reviews on Google, Yelp, and Nextdoor`}
            href={reviewHref}
            style={{ color: "#FFFFFF" }}
          >
            <span className="flex shrink-0 items-center gap-[2px]">
              <ReviewStar />
              <ReviewStar />
              <ReviewStar />
              <ReviewStar />
              <ReviewStar />
            </span>
            <span className="min-w-0 text-[13px] font-semibold leading-tight text-[#FFFFFF] sm:text-[14px]">
              4.9/5 &middot; {reviewCount} reviews on Google, Yelp, &amp; Nextdoor
            </span>
            <ChevronRightIcon />
          </Link>

          <h1
            className="mt-5 text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-[#FFFFFF] md:text-[52px] lg:text-[56px] xl:text-[64px]"
            style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Leak No Further.
            <br />
            <span className="md:whitespace-nowrap">The Plumber Austin Trusts.</span>
          </h1>
          <p
            className="mt-2.5 text-[18px] font-normal leading-[1.6] text-[rgba(255,255,255,0.9)] md:text-[20px]"
            data-speakable="hero"
            style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Fast response. Fair price. Fixed right, so you never call twice.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <a
              className="focus-ring ic-primary-blue-button inline-flex w-full items-center justify-center gap-2 hover:no-underline sm:w-auto"
              href="tel:+18335971932"
            >
              <PhoneIcon />
              (833) 597-1932
            </a>
            <Link
              className="focus-ring inline-flex w-full items-center justify-center rounded-full border-2 border-white bg-transparent px-7 py-[14px] text-[16px] font-semibold text-white transition-colors hover:bg-white hover:text-[#1E2A38] hover:no-underline sm:w-auto"
              href="/book"
            >
              Schedule Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
