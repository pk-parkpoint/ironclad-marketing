import type { Metadata } from "next";
import Script from "next/script";
import { AnalyticsBootstrap } from "@/components/analytics/analytics-bootstrap";
import { BookingWizardHost } from "@/components/booking/booking-wizard-host";
import { Inter, Schibsted_Grotesk } from "next/font/google";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { BOOKING_PREBOOT_SCRIPT } from "@/lib/booking-preboot-script";
import { CANONICAL_ORIGIN } from "@/lib/site-url";
import { Suspense } from "react";
import "./globals.css";
import "./local-pages.tokens.css";
import "./local-pages.css";
import "./service-page-template.css";
import "./service-page-template.tokens.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim();
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() || "AW-18207846861";
const GOOGLE_ADS_WEBSITE_CALL_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_WEBSITE_CALL_CONVERSION_LABEL?.trim();
const PHONE_CONVERSION_NUMBER =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_TRACKING_PHONE?.trim()
  || process.env.NEXT_PUBLIC_PHONE?.trim()
  || "(512) 506-2470";

function GoogleTagHead() {
  const configCalls = [
    `gtag('config',${JSON.stringify(GOOGLE_ADS_ID)});`,
    GOOGLE_ADS_WEBSITE_CALL_LABEL && !GOOGLE_ADS_WEBSITE_CALL_LABEL.startsWith("replace-with-")
      ? `gtag('config',${JSON.stringify(`${GOOGLE_ADS_ID}/${GOOGLE_ADS_WEBSITE_CALL_LABEL}`)},{phone_conversion_number:${JSON.stringify(PHONE_CONVERSION_NUMBER)}});`
      : "",
    GA4_MEASUREMENT_ID
      ? `gtag('config',${JSON.stringify(GA4_MEASUREMENT_ID)},{send_page_view:false});`
      : "",
  ].join("");

  return (
    <>
      <Script
        id="google-ads-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ADS_ID)}`}
        strategy="lazyOnload"
      />
      <Script
        id="gtag-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());${configCalls}`,
        }}
      />
    </>
  );
}

function AnalyticsHead() {
  if (GTM_ID) {
    return (
      <>
        <Script
          id="gtm-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <GoogleTagHead />
      </>
    );
  }

  return <GoogleTagHead />;
}

function AnalyticsBody() {
  if (!GTM_ID) {
    return (
      <Suspense fallback={null}>
        <AnalyticsBootstrap />
      </Suspense>
    );
  }

  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <Suspense fallback={null}>
        <AnalyticsBootstrap />
      </Suspense>
    </>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
  applicationName: "Ironclad Plumbing",
  title: "Ironclad Plumbing | Austin's Modern Plumbing Company",
  description:
    "Licensed Austin plumber with on-time arrival windows, upfront pricing, and a written workmanship warranty.",
  keywords: [
    "Austin plumber",
    "plumbing services Austin",
    "emergency plumber Austin",
    "water heater repair Austin",
    "drain cleaning Austin",
    "Ironclad Plumbing",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ironclad Plumbing",
    title: "Ironclad Plumbing | Austin's Modern Plumbing Company",
    description:
      "Licensed Austin plumber with on-time arrival windows, upfront pricing, and a written workmanship warranty.",
    url: "/",
    images: [
      {
        url: "/og/ironclad-default.png",
        width: 1200,
        height: 630,
        alt: "Ironclad Plumbing",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ironclad Plumbing | Austin's Modern Plumbing Company",
    description:
      "Licensed Austin plumber with on-time arrival windows, upfront pricing, and a written workmanship warranty.",
    images: ["/og/ironclad-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1E2A38" />
        <meta name="geo.region" content="US-TX" />
        <meta name="geo.placename" content="Austin" />
        <meta name="geo.position" content="30.2672;-97.7431" />
        <meta name="ICBM" content="30.2672, -97.7431" />
        <script
          id="booking-link-preboot"
          dangerouslySetInnerHTML={{ __html: BOOKING_PREBOOT_SCRIPT }}
        />
        <AnalyticsHead />
      </head>
      <body className={`${inter.variable} ${schibstedGrotesk.variable} antialiased pb-24 md:pb-0`}>
        <Suspense fallback={null}>
          <BookingWizardHost />
        </Suspense>
        <AnalyticsBody />
        {children}
        <MobileBottomBar />
      </body>
    </html>
  );
}
