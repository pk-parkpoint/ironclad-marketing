import Link from "next/link";

export type HeroBackgroundType = "video" | "image" | "gradient";
export type HeroAlignment = "center" | "left";
export type HeroActionVariant = "primary" | "secondary" | "text";

export type HeroAction = {
  label: string;
  href: string;
  variant?: HeroActionVariant;
};

export type HeroLocationBadge = {
  text: string;
};

type HeroProps = {
  heading: string;
  subtitle?: string;
  eyebrow?: string;
  backgroundType: HeroBackgroundType;
  backgroundSrc?: string;
  alignment: HeroAlignment;
  actions: HeroAction[];
  trustChips?: string[];
  locationBadge?: HeroLocationBadge;
};

function isExternalAction(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:") ||
    href.startsWith("mailto:")
  );
}

function getActionClasses(actionVariant: HeroActionVariant): string {
  if (actionVariant === "primary") {
    return "focus-ring primary-button justify-center";
  }

  if (actionVariant === "secondary") {
    return "focus-ring secondary-button justify-center border-white/40 text-white hover:bg-white/10";
  }

  return "focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-medium text-[#6B7280] underline-offset-4 transition-colors duration-150 hover:text-[#111827] hover:underline";
}

function HeroActionLink({ action }: { action: HeroAction }) {
  const actionVariant = action.variant || "primary";
  const className = getActionClasses(actionVariant);

  if (isExternalAction(action.href)) {
    return (
      <a className={className} href={action.href}>
        {action.label}
      </a>
    );
  }

  return (
    <Link className={className} href={action.href}>
      {action.label}
    </Link>
  );
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="M12 21s7-6.58 7-11a7 7 0 1 0-14 0c0 4.42 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function Hero({
  heading,
  subtitle,
  eyebrow,
  backgroundType,
  backgroundSrc,
  alignment,
  actions,
  trustChips,
  locationBadge,
}: HeroProps) {
  const centered = alignment === "center";

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-ink)_0%,#162236_100%)]">
      {backgroundType === "image" && backgroundSrc ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundSrc})` }}
        />
      ) : null}

      {backgroundType === "video" && backgroundSrc ? (
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
        >
          <source src={backgroundSrc} />
        </video>
      ) : null}

      <div
        aria-hidden="true"
        className={`absolute inset-0 ${
          backgroundType === "gradient"
            ? "bg-transparent"
            : "bg-[linear-gradient(135deg,rgba(30,42,56,0.86)_0%,rgba(22,34,54,0.86)_100%)]"
        }`}
      />

      <div className={`container-shell relative py-16 md:py-24 ${centered ? "text-center" : ""}`}>
        <div className={`space-y-5 ${centered ? "mx-auto max-w-[52rem]" : "max-w-[46rem]"}`}>
          {locationBadge ? (
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold text-white ${
                centered ? "mx-auto" : ""
              }`}
            >
              <MapPinIcon />
              {locationBadge.text}
            </div>
          ) : null}
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{eyebrow}</p>
          ) : null}
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">{heading}</h1>
          {subtitle ? (
            <p className={`text-base text-white/80 md:text-lg ${centered ? "mx-auto max-w-[40rem]" : "max-w-[38rem]"}`}>
              {subtitle}
            </p>
          ) : null}
          <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${centered ? "justify-center" : ""}`}>
            {actions.map((action) => (
              <HeroActionLink action={action} key={`${action.label}-${action.href}`} />
            ))}
          </div>
          {trustChips && trustChips.length > 0 ? (
            <ul className={`m-0 flex list-none flex-wrap gap-2 p-0 text-sm ${centered ? "justify-center" : ""}`}>
              {trustChips.map((chip) => (
                <li
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1 font-medium text-white/90"
                  key={chip}
                >
                  {chip}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
