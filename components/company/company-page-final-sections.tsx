import { ChevronDown, Phone } from "lucide-react";
import type { CompanyPageConfig } from "./company-page-types";
import styles from "./company-page.module.css";

type CompanyPageFinalProps = {
  config: CompanyPageConfig;
  phoneDisplay: string;
  phoneHref: string;
};

export function CompanyFaq({ config }: { config: CompanyPageConfig }) {
  const accordionName = `company-faq-${config.slug}`;

  return (
    <section className={styles.faqSection} data-company-section="faq">
      <div className={styles.faqInner}>
        <h2>{config.faqHeading}</h2>
        <div className={styles.faqList}>
          {config.faqs.map((faq, index) => (
            <details className={styles.faqItem} key={faq.question} name={accordionName} open={index === 0}>
              <summary>
                {faq.question}
                <ChevronDown aria-hidden="true" className={styles.faqChevron} size={20} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CompanyFinalCta({ config, phoneDisplay, phoneHref }: CompanyPageFinalProps) {
  return (
    <section className={styles.finalSection} data-company-section="final">
      <div className={styles.finalInner}>
        <span className={styles.finalBadge}>{config.final.badge}</span>
        <h2>{config.final.heading}</h2>
        <p>{config.final.body}</p>
        <div className={styles.finalActions}>
          <a className={styles.finalPrimary} data-track-intent="book" href={config.final.action.href}>
            {config.final.action.label}
          </a>
          <a className={styles.finalPhone} data-track-intent="phone" href={phoneHref}>
            <Phone aria-hidden="true" size={18} />Call {phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
