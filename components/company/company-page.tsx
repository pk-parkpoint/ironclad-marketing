import { Schibsted_Grotesk } from "next/font/google";
import { getPublicContactInfo } from "@/lib/contact";
import { CompanyProcess, CompanyReviews, CompanyWhy } from "./company-page-dark-sections";
import { CompanyFaq, CompanyFinalCta } from "./company-page-final-sections";
import { CompanyPageHero } from "./company-page-hero";
import { CompanyCredo, CompanyRoles, CompanyRows } from "./company-page-light-sections";
import type { CompanyPageConfig } from "./company-page-types";
import styles from "./company-page.module.css";

const schibsted = Schibsted_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-company-display",
});

export function CompanyPage({ config }: { config: CompanyPageConfig }) {
  const { phoneDisplay, phoneHref } = getPublicContactInfo();

  return (
    <main className={`${styles.root} ${schibsted.variable}`} data-company-page={config.slug}>
      <CompanyPageHero config={config} phoneDisplay={phoneDisplay} phoneHref={phoneHref} />
      <CompanyRows config={config} />
      <CompanyCredo config={config} />
      <CompanyRoles config={config} />
      <CompanyProcess config={config} />
      <CompanyWhy config={config} />
      <CompanyReviews config={config} />
      <CompanyFaq config={config} />
      <CompanyFinalCta config={config} phoneDisplay={phoneDisplay} phoneHref={phoneHref} />
    </main>
  );
}
