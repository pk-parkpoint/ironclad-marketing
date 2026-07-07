import Image from "next/image";
import { DRAIN_CLEANING_TEMPLATE as content } from "./drain-cleaning-data";
import { ReferenceChrome } from "./reference-chrome";
import { ServiceTemplateEffects } from "./service-template-effects";
import {
  AreaChip,
  Eyebrow,
  FAQItem,
  GoogleRatingBadge,
  GuaranteeItem,
  InlineLink,
  ProcessStep,
  RadarGraphic,
  ReviewCard,
  ServiceCard,
  SignRow,
  SignsCallout,
  StatCell,
  TemplateButton,
  TrustRow,
  WhyItem,
} from "./service-template-parts";

type DrainCleaningPageProps = {
  phoneDisplay: string;
  phoneHref: string;
};

const BOOKING_HREF = "/book?service=drain-cleaning";

export function DrainCleaningPage({ phoneDisplay, phoneHref }: DrainCleaningPageProps) {
  return (
    <div className="dc-root" id="dc-root">
      <ReferenceChrome phoneDisplay={phoneDisplay} phoneHref={phoneHref}>
        <ServiceTemplateEffects />
        <main>
          <section className="dc-hero" id="hero-section">
        <Image
          alt={content.hero.imageAlt}
          className="dc-hero-img"
          data-slot="hero-image"
          fill
          priority
          sizes="100vw"
          src={content.hero.image}
          unoptimized
        />
        <div className="dc-hero-scrim" />
        <div className="dc-hero-glow" />
        <div className="dc-hero-inner">
          <GoogleRatingBadge />
          <h1 data-slot="hero-title">{content.hero.title}</h1>
          <p className="dc-hero-subtitle" data-slot="hero-subtitle">
            24/7 help from our licensed plumbers, with clear pricing <br />
            and an ironclad warranty
          </p>
          <TrustRow />
          <div className="dc-hero-ctas">
            <TemplateButton href={phoneHref} icon="phone" variant="call">
              {phoneDisplay}
            </TemplateButton>
            <TemplateButton href={BOOKING_HREF} variant="outline">
              Schedule Now
            </TemplateButton>
          </div>
        </div>
          </section>

          <section className="dc-guarantee" id="guarantees">
        <div className="dc-container dc-container--guarantee">
          <h2 className="dc-section-title-md">Our Ironclad Guarantee</h2>
          <div className="dc-guarantee-grid" data-reveal-group>
            {content.guarantees.map(([label, proof]) => (
              <GuaranteeItem key={label} label={label} proof={proof} />
            ))}
          </div>
        </div>
          </section>

          <section className="dc-signs">
        <div className="dc-container dc-container--signs">
          <h2 className="dc-section-title-lg" data-slot="signs-title">
            {content.signs.title}
          </h2>
          <p className="dc-section-intro" data-slot="signs-intro">
            {content.signs.intro}
          </p>
          <div className="dc-sign-list">
            {content.signs.items.map(([title, body], index) => (
              <SignRow body={body} index={index} key={title} title={title} />
            ))}
          </div>
          <SignsCallout phoneDisplay={phoneDisplay} phoneHref={phoneHref} />
        </div>
          </section>

          <section className="dc-services">
        <div className="dc-container dc-container--services">
          <h2 className="dc-section-title-lg" data-slot="services-title">
            {content.services.title}
          </h2>
          <p className="dc-section-intro" data-slot="services-intro">
            {content.services.intro}
          </p>
          <div className="dc-service-grid">
            {content.services.cards.map(([title, body, caption]) => (
              <ServiceCard body={body} caption={caption} key={title} title={title} />
            ))}
          </div>
          <div className="dc-ink-button-row">
            <TemplateButton href={BOOKING_HREF} icon="arrow" variant="ink">
              Schedule drain cleaning
            </TemplateButton>
          </div>
        </div>
          </section>

          <section className="dc-container dc-container--reviews" id="reviews">
        <div className="dc-reviews-header">
          <div>
            <h2 className="dc-section-title-md">Austin Homeowners Trust Ironclad</h2>
            <div className="dc-review-meta">4.9 / 5 · 142 Google reviews</div>
          </div>
          <InlineLink href="/reviews">Read all reviews →</InlineLink>
        </div>
        <div className="dc-reviews-grid" data-reveal-group>
          {content.reviews.map(([name, initial, time, quote]) => (
            <ReviewCard initial={initial} key={name} name={name} quote={quote} time={time} />
          ))}
        </div>
          </section>

          <section className="dc-why">
        <div className="dc-container dc-container--why">
          <div className="dc-why-split">
            <div className="dc-why-left">
              <Eyebrow variant="ink">The Ironclad Difference</Eyebrow>
              <h2 className="dc-display-title">Why Austin Calls Ironclad</h2>
              <p>Anyone can clear a clog. We&apos;re built so you never have to make this call twice.</p>
            </div>
            <div className="dc-why-list">
              {content.why.map(([title, body], index) => (
                <WhyItem body={body} index={index} key={title} title={title} />
              ))}
            </div>
          </div>
        </div>
        <div className="dc-stat-strip">
          {content.stats.map(([value, label]) => (
            <StatCell key={label} label={label} value={value} />
          ))}
        </div>
          </section>

          <section className="dc-process">
        <div className="dc-container dc-container--process">
          <div className="dc-process-header">
            <Eyebrow variant="navy">Our Process</Eyebrow>
            <h2 className="dc-process-title">What to Expect</h2>
          </div>
          <div className="dc-process-grid">
            {content.process.map(([title, body], index) => (
              <ProcessStep body={body} index={index} key={title} title={title} />
            ))}
          </div>
        </div>
          </section>

          <section className="dc-container dc-container--areas" id="areas">
        <div className="dc-area-split">
          <RadarGraphic />
          <div className="dc-area-copy">
            <h2 className="dc-section-title-md" data-slot="areas-title">
              Drain Cleaning in Austin and Nearby Areas
            </h2>
            <p>Same-day drain cleaning across Austin and the surrounding metro.</p>
            <div className="dc-area-chips" data-reveal-group>
              {content.areas.map((area) => (
                <AreaChip key={area}>{area}</AreaChip>
              ))}
            </div>
            <TemplateButton href={BOOKING_HREF} variant="schedule">
              Schedule Drain Cleaning Near You
            </TemplateButton>
          </div>
        </div>
          </section>

          <section className="dc-faq-section">
        <div className="dc-container dc-container--faq">
          <h2 className="dc-section-title-md">Drain Cleaning FAQ</h2>
          <div className="dc-faq-list">
            {content.faqs.map(([question, answer], index) => (
              <FAQItem answer={answer} key={question} open={index === 0} question={question} />
            ))}
          </div>
        </div>
          </section>

          <section className="dc-final-cta">
        <div className="dc-container dc-container--cta">
          <span className="dc-cta-badge">10% off your first service</span>
          <h2 className="dc-section-title-md" data-slot="cta-title">
            Ready to Clear Your Drain?
          </h2>
          <p>Book online in 60 seconds or call for fast drain cleaning in Austin.</p>
          <div className="dc-cta-buttons">
            <TemplateButton href={BOOKING_HREF} variant="schedule">
              Schedule Drain Cleaning
            </TemplateButton>
            <TemplateButton href={phoneHref} icon="phone" variant="white">
              Call {phoneDisplay}
            </TemplateButton>
          </div>
        </div>
          </section>
        </main>
      </ReferenceChrome>

      <div className="dc-sticky-cta">
        <TemplateButton href={phoneHref} icon="phone" variant="stickyCall">
          {phoneDisplay}
        </TemplateButton>
        <TemplateButton href={BOOKING_HREF} variant="stickySchedule">
          Schedule Online
        </TemplateButton>
      </div>
    </div>
  );
}
