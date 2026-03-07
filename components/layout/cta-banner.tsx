import Link from "next/link";

export type CtaBannerVariant = "dark" | "light";
export type CtaBannerActionVariant = "primary" | "secondary" | "text";

export type CtaBannerAction = {
  label: string;
  href: string;
  variant?: CtaBannerActionVariant;
};

type CtaBannerProps = {
  heading: string;
  subtitle?: string;
  actions: CtaBannerAction[];
  variant?: CtaBannerVariant;
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

function getActionClasses(actionVariant: CtaBannerActionVariant, bannerVariant: CtaBannerVariant): string {
  if (actionVariant === "primary") {
    return "focus-ring primary-button justify-center";
  }

  if (actionVariant === "secondary") {
    if (bannerVariant === "dark") {
      return "focus-ring secondary-button justify-center border-white/40 text-white hover:bg-white/10";
    }
    return "focus-ring secondary-button justify-center";
  }

  if (bannerVariant === "dark") {
    return "focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline";
  }

  return "focus-ring inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-medium text-[#6B7280] underline-offset-4 transition-colors duration-150 hover:text-[#111827] hover:underline";
}

function BannerAction({
  action,
  bannerVariant,
}: {
  action: CtaBannerAction;
  bannerVariant: CtaBannerVariant;
}) {
  const actionVariant = action.variant || "primary";
  const className = getActionClasses(actionVariant, bannerVariant);

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

export function CtaBanner({ heading, subtitle, actions, variant = "light" }: CtaBannerProps) {
  const isDark = variant === "dark";

  return (
    <section className={`section-block ${isDark ? "bg-ink" : "bg-soft-background"}`}>
      <div className="container-shell">
        <div
          className={`rounded-[var(--radius-modal)] px-6 py-8 md:px-10 md:py-12 ${
            isDark ? "bg-[linear-gradient(135deg,var(--color-ink)_0%,#162236_100%)] text-white" : "card-shell"
          }`}
        >
          <h2 className={`font-display text-3xl font-bold tracking-tight md:text-4xl ${isDark ? "text-white" : "text-ink"}`}>
            {heading}
          </h2>
          {subtitle ? (
            <p
              className={`mt-3 max-w-[var(--max-readable-width)] text-sm md:text-base ${
                isDark ? "text-white/75" : "text-muted"
              }`}
            >
              {subtitle}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {actions.map((action) => (
              <BannerAction
                action={action}
                bannerVariant={variant}
                key={`${action.label}-${action.href}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
