import Link from "next/link";

type ServiceGridTileProps = {
  href: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "card" | "compact";
};

function DefaultIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="20"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </svg>
  );
}

export function ServiceGridTile({
  href,
  title,
  description,
  icon,
  variant = "card",
}: ServiceGridTileProps) {
  const isCompact = variant === "compact";

  return (
    <Link
      className={`focus-ring group block rounded-[var(--radius-card)] border border-border bg-background transition-all duration-200 hover:-translate-y-1 hover:border-cta-blue hover:shadow-[var(--shadow-card-hover)] ${
        isCompact ? "px-4 py-4 md:px-5" : "p-6 md:p-7"
      }`}
      href={href}
    >
      <div className={`flex ${isCompact ? "items-center gap-3" : "items-start gap-4"}`}>
        <span
          aria-hidden="true"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft-background text-cta-blue"
        >
          {icon || <DefaultIcon />}
        </span>
        <div>
          <h3 className={`font-semibold text-ink transition-colors group-hover:text-cta-blue ${isCompact ? "text-base" : "text-lg"}`}>
            {title}
          </h3>
          {!isCompact && description ? (
            <p className="mt-2 text-sm text-muted md:text-base">{description}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
