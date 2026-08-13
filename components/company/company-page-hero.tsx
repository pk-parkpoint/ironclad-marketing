import { House, Phone, ShieldCheck, Star } from "lucide-react";
import { CriticalHeroPicture } from "@/components/media/critical-hero-picture";
import type { CompanyPageConfig } from "./company-page-types";
import styles from "./company-page.module.css";

type CompanyPageHeroProps = {
  config: CompanyPageConfig;
  phoneDisplay: string;
  phoneHref: string;
};

function RatingStars() {
  return (
    <span aria-label="5 out of 5 stars" className={styles.heroStars} role="img">
      {Array.from({ length: 5 }, (_, index) => (
        <Star aria-hidden="true" fill="currentColor" key={index} size={15} strokeWidth={0} />
      ))}
    </span>
  );
}

export function CompanyPageHero({ config, phoneDisplay, phoneHref }: CompanyPageHeroProps) {
  return (
    <>
      <section className={styles.hero} data-company-section="hero">
        <CriticalHeroPicture
          alt="The Ironclad Plumbing team beside their service truck"
          avifSrcSet="/media/company/ironclad-team-hero-fast-640.avif 640w, /media/company/ironclad-team-hero-fast-1080.avif 1080w, /media/company/ironclad-team-hero-fast-1920.avif 1920w"
          className={styles.heroImage}
          fallbackSrc="/media/company/ironclad-team-hero-fallback.jpg"
          height={1080}
          sizes="100vw"
          width={1920}
        />
        <div aria-hidden="true" className={styles.heroOverlay} />
        <div aria-hidden="true" className={styles.heroGlow} />

        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroEyebrow}>{config.eyebrow}</span>
            <span aria-hidden="true" className={styles.badgeDivider} />
            <RatingStars />
            <span className={styles.ratingCopy}>4.9/5 · 142 reviews on Google, Yelp, &amp; Nextdoor</span>
          </div>

          <h1 className={styles.heroHeading}>{config.heading}</h1>
          <p className={styles.heroIntro}>{config.intro}</p>

          <div className={styles.trustRow}>
            <span><House aria-hidden="true" size={17} />Locally Owned &amp; Operated</span>
            <span><ShieldCheck aria-hidden="true" size={17} />Licensed &amp; Insured</span>
          </div>

          <div className={styles.heroActions}>
            <a className={styles.callButton} data-track-intent="phone" href={phoneHref}>
              <Phone aria-hidden="true" size={19} />
              {phoneDisplay}
            </a>
            <a className={styles.heroSecondary} data-track-intent="book" href={config.heroSecondary.href}>
              {config.heroSecondary.label}
            </a>
          </div>
        </div>
      </section>

      <section className={styles.pillars} data-company-section="pillars">
        <div className={styles.pillarInner}>
          <h2>{config.pillarHeading}</h2>
          <div className={styles.pillarGrid}>
            {config.pillars.map((pillar) => (
              <article className={styles.pillar} key={pillar.title}>
                <ShieldCheck aria-hidden="true" size={30} />
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
