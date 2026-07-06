import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { ChevronDownIcon, GoogleGIcon, StarIcon } from "./service-template-icons";

type ButtonVariant = "call" | "outline" | "ink" | "schedule" | "white" | "stickyCall" | "stickySchedule";

export function TemplateButton({
  children,
  href,
  variant,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  variant: ButtonVariant;
  icon?: "phone" | "arrow";
}) {
  const className = `dc-btn dc-btn--${variant}`;
  const content = (
    <>
      {icon === "phone" ? <Phone aria-hidden="true" className="dc-btn-icon" /> : null}
      <span>{children}</span>
      {icon === "arrow" ? <ArrowRight aria-hidden="true" className="dc-btn-arrow" /> : null}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link className={className} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <a className={className} href={href}>
      {content}
    </a>
  );
}

export function StarRating({ variant }: { variant: "google" | "review" }) {
  return (
    <span aria-label="5 out of 5 stars" className={`dc-stars dc-stars--${variant}`} role="img">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon className="dc-star" key={index} />
      ))}
    </span>
  );
}

export function GoogleRatingBadge() {
  return (
    <a className="dc-google-badge" href="/reviews">
      <GoogleGIcon />
      <StarRating variant="google" />
      <span>4.9 out of 5 · 142 reviews</span>
      <ChevronDownIcon className="dc-google-chevron" />
    </a>
  );
}

export function TrustRow() {
  return (
    <div className="dc-hero-trust">
      <span>
        <Home aria-hidden="true" />
        Locally Owned &amp; Operated
      </span>
      <span>
        <ShieldCheck aria-hidden="true" />
        Licensed &amp; Insured
      </span>
    </div>
  );
}

export function GuaranteeItem({ label, proof }: { label: string; proof: string }) {
  return (
    <div className="dc-guarantee-item" data-reveal>
      <ShieldCheck aria-hidden="true" />
      <div>
        <p className="dc-guarantee-label">{label}</p>
        <p className="dc-guarantee-proof">{proof}</p>
      </div>
    </div>
  );
}

export function SignRow({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="dc-sign-row">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
}

export function SignsCallout({ phoneDisplay, phoneHref }: { phoneDisplay: string; phoneHref: string }) {
  return (
    <div className="dc-signs-callout">
      <div className="dc-signs-callout-copy">
        <span className="dc-signs-callout-icon">
          <AlertTriangle aria-hidden="true" />
        </span>
        <div>
          <p className="dc-callout-title">Seeing these signs, or backing up right now?</p>
          <p className="dc-callout-sub">We answer 24/7 and offer same-day drain cleaning across Austin.</p>
        </div>
      </div>
      <TemplateButton href={phoneHref} icon="phone" variant="call">
        Call {phoneDisplay}
      </TemplateButton>
    </div>
  );
}

export function ImageSlot({ title }: { title: string }) {
  return <div aria-label={`${title} photo pending`} className="dc-image-slot" role="img" />;
}

export function ServiceCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="dc-service-card">
      <ImageSlot title={title} />
      <div className="dc-service-card-copy">
        <h3 className="dc-service-card-title">{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

export function ReviewCard({
  initial,
  name,
  quote,
  time,
}: {
  initial: string;
  name: string;
  quote: string;
  time: string;
}) {
  return (
    <article className="dc-review-card" data-reveal>
      <StarRating variant="review" />
      <p className="dc-review-quote">{quote}</p>
      <footer className="dc-review-footer">
        <span className="dc-review-avatar">{initial}</span>
        <div>
          <p className="dc-review-name">{name}</p>
          <p className="dc-review-time">{time}</p>
        </div>
      </footer>
    </article>
  );
}

export function Eyebrow({ children, variant }: { children: React.ReactNode; variant: "ink" | "navy" }) {
  return (
    <div className={`dc-eyebrow dc-eyebrow--${variant}`}>
      <span />
      {children}
    </div>
  );
}

export function WhyItem({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="dc-why-item">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
}

export function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="dc-stat-cell">
      <div className="dc-stat-number" data-count-to={value}>
        {value}
      </div>
      <div className="dc-stat-label">{label}</div>
    </div>
  );
}

export function ProcessStep({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="dc-process-step">
      <span className="dc-process-dot" />
      <div className="dc-process-number">{String(index + 1).padStart(2, "0")}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function AreaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="dc-area-chip" data-reveal>
      {children}
    </span>
  );
}

export function RadarGraphic() {
  return (
    <div aria-hidden="true" className="dc-radar" data-reveal>
      <span className="dc-radar-ring dc-radar-ring--outer" />
      <span className="dc-radar-ring dc-radar-ring--middle" />
      <span className="dc-radar-ring dc-radar-ring--inner" />
      <span className="dc-radar-pulse" />
      <span className="dc-radar-dot dc-radar-dot--one" />
      <span className="dc-radar-dot dc-radar-dot--two" />
      <span className="dc-radar-dot dc-radar-dot--three" />
      <span className="dc-radar-dot dc-radar-dot--four" />
      <span className="dc-radar-center">
        <span>
          <MapPin aria-hidden="true" />
        </span>
        Austin
      </span>
    </div>
  );
}

export function FAQItem({ answer, open, question }: { answer: string; open?: boolean; question: string }) {
  return (
    <details className="dc-faq-item" open={open}>
      <summary>
        {question}
        <ChevronDownIcon className="dc-faq-chevron" />
      </summary>
      <div>{answer}</div>
    </details>
  );
}

export function InlineLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link className="dc-inline-link" href={href}>
      {children}
    </Link>
  );
}
