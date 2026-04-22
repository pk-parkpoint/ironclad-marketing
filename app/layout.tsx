import type { Metadata } from "next";
import Script from "next/script";
import { AnalyticsBootstrap } from "@/components/analytics/analytics-bootstrap";
import { BookingWizardHost } from "@/components/booking/booking-wizard-host";
import { Inter } from "next/font/google";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { CANONICAL_ORIGIN } from "@/lib/site-url";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim();

function AnalyticsHead() {
  if (GTM_ID) {
    return (
      <Script
        id="gtm-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />
    );
  }

  if (GA4_MEASUREMENT_ID) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${GA4_MEASUREMENT_ID}',{send_page_view:false});`,
          }}
        />
      </>
    );
  }

  return (
    <Script
      id="analytics-bootstrap-stub"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html:
          "window.dataLayer = window.dataLayer || [];window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};",
      }}
    />
  );
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
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
        {(GTM_ID || GA4_MEASUREMENT_ID) ? <link rel="preconnect" href="https://www.googletagmanager.com" /> : null}
        <link
          rel="preload"
          as="image"
          href="/hero/ironclad-hero-poster.jpg"
        />
        <AnalyticsHead />
      </head>
      <body className={`${inter.variable} antialiased pb-24 md:pb-0`}>
        <AnalyticsBody />
        {children}
        <Suspense fallback={null}>
          <BookingWizardHost />
        </Suspense>
        <MobileBottomBar />
      </body>
    </html>
  );
}
