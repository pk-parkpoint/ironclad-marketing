import Link from "next/link";
import type { BlogEntry } from "@/content/blog-posts";

type CityRelatedGuidesProps = {
  guides: BlogEntry[];
  cityName: string;
};

export function CityRelatedGuides({ guides, cityName }: CityRelatedGuidesProps) {
  return (
    <section className="section-block bg-soft-background">
      <div className="container-shell">
        <h2 className="h2-display">Guides for {cityName} Homeowners</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              className="focus-ring card-shell block p-6 transition-colors hover:border-cta-blue hover:no-underline"
              href={`/blog/${guide.slug}`}
              key={guide.slug}
            >
              <h3 className="text-lg font-semibold text-ink">{guide.title}</h3>
              <p className="mt-2 text-sm text-muted md:text-base">{guide.metaDescription}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
