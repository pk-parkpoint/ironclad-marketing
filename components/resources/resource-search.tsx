"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BLOG_POSTS } from "@/content/blog-posts";

export function ResourceSearch() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return BLOG_POSTS;
    return BLOG_POSTS.filter((post) =>
      `${post.title} ${post.metaDescription}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <input
        className="w-full rounded-[8px] border border-border bg-background px-4 py-3 text-sm text-ink focus:border-cta-blue focus:outline-none focus:ring-2 focus:ring-[rgba(37,99,235,0.2)]"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by problem, fixture, or service..."
        type="search"
        value={query}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <Link className="focus-ring card-shell block p-6 hover:no-underline" href={`/blog/${post.slug}`} key={post.slug}>
            <h2 className="text-lg font-semibold text-ink">{post.title}</h2>
            <p className="mt-2 text-sm text-muted md:text-base">{post.metaDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
