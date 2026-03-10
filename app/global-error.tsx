/* eslint-disable @next/next/no-html-link-for-pages -- global-error renders outside the Next.js layout; <Link> is unavailable */
"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F9FAFB" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#111827", margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "1rem", color: "#6B7280", marginTop: "0.75rem", maxWidth: "36ch" }}>
            We hit an unexpected error. Try reloading the page, or contact us directly.
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                background: "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "12px 28px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "2px solid #2563EB",
                borderRadius: "9999px",
                padding: "12px 28px",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#2563EB",
                textDecoration: "none",
              }}
            >
              Go Home
            </a>
            <a
              href="tel:+18335971932"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#D03E04",
                borderRadius: "9999px",
                padding: "12px 28px",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
                border: "2px solid transparent",
              }}
            >
              Call (833) 597-1932
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
