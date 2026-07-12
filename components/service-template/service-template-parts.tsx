import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Home,
  ImageIcon,
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
  motion = false,
}: {
  children: React.ReactNode;
  href: string;
  variant: ButtonVariant;
  icon?: "phone" | "arrow";
  motion?: boolean;
}) {
  const className = `dc-btn dc-btn--${variant}${motion ? " ic-cta" : ""}`;
  const trackIntent = icon === "phone" ? "phone" : href.startsWith("/book") ? "book" : undefined;
  const content = (
    <>
      {motion ? <span aria-hidden="true" className="ic-sheen" /> : null}
      {icon === "phone" ? <Phone aria-hidden="true" className="dc-btn-icon" /> : null}
      <span>{children}</span>
      {icon === "arrow" ? <ArrowRight aria-hidden="true" className="dc-btn-arrow" /> : null}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link className={className} data-track-intent={trackIntent} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <a className={className} data-track-intent={trackIntent} href={href}>
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

export function GoogleRatingBadge({ label = "4.9 out of 5 · 142 reviews", simple = false }: { label?: string; simple?: boolean }) {
  return (
    <Link className="dc-google-badge" href="/reviews">
      {simple ? (
        <span>{`\u2605 ${label}`}</span>
      ) : (
        <>
          <GoogleGIcon />
          <StarRating variant="google" />
        </>
      )}
      {simple ? null : <span>{label}</span>}
      {simple ? null : <ChevronDownIcon className="dc-google-chevron" />}
    </Link>
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

export function HeroSubtitle({
  pun,
  punFirst,
  supportLine,
  valueLine,
}: {
  pun?: string;
  punFirst?: boolean;
  supportLine?: string;
  valueLine: string;
}) {
  const punNode = pun ? <span className="dc-hero-pun">{pun}</span> : null;

  return (
    <p className="dc-hero-subtitle" data-slot="hero-subtitle">
      {punNode && punFirst ? (
        <>
          {punNode} {valueLine}
        </>
      ) : (
        <>
          {valueLine}
          {punNode ? <> {punNode}</> : null}
        </>
      )}
      {supportLine ? (
        <>
          {" "}
          <br />
          {supportLine}
        </>
      ) : null}
    </p>
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

export function SignsCallout({
  body,
  phoneDisplay,
  phoneHref,
  title,
}: {
  body: string;
  phoneDisplay: string;
  phoneHref: string;
  title: string;
}) {
  return (
    <div className="dc-signs-callout">
      <div className="dc-signs-callout-copy">
        <span className="dc-signs-callout-icon">
          <AlertTriangle aria-hidden="true" />
        </span>
        <div>
          <p className="dc-callout-title">{title}</p>
          <p className="dc-callout-sub">{body}</p>
        </div>
      </div>
      <TemplateButton href={phoneHref} icon="phone" variant="call">
        Call {phoneDisplay}
      </TemplateButton>
    </div>
  );
}

export function ImageSlot({ caption, imageSrc, title }: { caption?: string; imageSrc?: string; title: string }) {
  if (imageSrc) {
    return (
      <div className="dc-image-slot dc-image-slot--photo">
        <Image
          alt={caption ?? title}
          className="dc-service-card-img"
          decoding="async"
          fill
          loading="lazy"
          sizes="(min-width: 1080px) 360px, (min-width: 720px) 45vw, 100vw"
          src={imageSrc}
        />
      </div>
    );
  }

  return (
    <div aria-label={`${title} photo pending`} className="dc-image-slot" role="img">
      <ImageIcon aria-hidden="true" />
      {caption ? <span>{caption}</span> : null}
    </div>
  );
}

export function ServiceCard({
  body,
  caption,
  imageSrc,
  title,
}: {
  body: string;
  caption?: string;
  imageSrc?: string;
  title: string;
}) {
  return (
    <article className="dc-service-card" data-reveal>
      <ImageSlot caption={caption} imageSrc={imageSrc} title={title} />
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
    <div className="dc-why-item" data-reveal>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
}

export function StatCell({ value, label }: { value: string; label: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);

  return (
    <div className="dc-stat-cell">
      <div className="dc-stat-number">
        {match ? <span data-count={match[1]}>{match[1]}</span> : value}
        {match?.[2]}
      </div>
      <div className="dc-stat-label">{label}</div>
    </div>
  );
}

export function ProcessStep({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="dc-process-step" data-reveal>
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
    <details className="dc-faq-item" name="dc-service-faq" open={open}>
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
