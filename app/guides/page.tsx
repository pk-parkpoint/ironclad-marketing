import Link from "next/link";
import { GuidePlaceholderShell } from "@/components/guides/guide-placeholder-shell";
import { GUIDE_ENTRIES, GUIDE_HUB_GROUPS } from "@/content/guides";
import { buildPageMetadata } from "@/lib/seo";

const GUIDE_PLACEHOLDER_ROBOTS = {
  index: false,
  follow: false,
} as const;

export function generateMetadata() {
  return buildPageMetadata({
    title: "Homeowner Guides | Ironclad Plumbing",
    description:
      "Ironclad Plumbing guide hub scaffold for Austin homeowner education pages. Full guide content is coming soon.",
    path: "/guides",
    ogTemplate: "blog",
    robots: GUIDE_PLACEHOLDER_ROBOTS,
  });
}

export default function GuidesHubPage() {
  return (
    <GuidePlaceholderShell path="/guides" title="Homeowner Guides">
      <div className="space-y-10">
        <p className="body-large max-w-[var(--max-readable-width)] text-muted">
          Route scaffolding is live for all planned guide pages. The reusable guide template and full article content
          land in the next phase.
        </p>

        {GUIDE_HUB_GROUPS.map((group) => {
          const guides = GUIDE_ENTRIES.filter((entry) => entry.hubGroup === group.id);

          return (
            <section className="space-y-4" id={group.anchorId} key={group.id}>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Content Group</p>
                <h2 className="text-2xl font-semibold text-ink">{group.title}</h2>
                <p className="max-w-[var(--max-readable-width)] text-sm text-body md:text-base">
                  {group.description}
                </p>
              </div>

              <ul className="grid gap-3 md:grid-cols-2">
                {guides.map((guide) => (
                  <li className="list-none" key={guide.slug}>
                    <Link
                      className="focus-ring card-shell block rounded-[var(--radius-card)] p-4 transition hover:-translate-y-0.5 hover:no-underline"
                      href={`/guides/${guide.slug}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Content coming soon</p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">{guide.title}</h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </GuidePlaceholderShell>
  );
}
