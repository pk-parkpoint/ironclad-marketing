"use client";

import { FormEvent, useState } from "react";

const fieldClass =
  "w-full rounded-[6px] border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[rgba(37,99,235,0.2)]";
const labelClass = "mb-1.5 block text-[13px] font-medium text-[#374151]";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function CommercialRequestForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setState("submitting");
    const formData = new FormData(event.currentTarget);
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      formData.set("page_url", `${window.location.pathname}${window.location.search}`);
      formData.set("utm_source", search.get("utm_source") ?? "");
      formData.set("utm_medium", search.get("utm_medium") ?? "");
      formData.set("utm_campaign", search.get("utm_campaign") ?? "");
      formData.set("gclid", search.get("gclid") ?? "");
      formData.set("fbclid", search.get("fbclid") ?? "");
      formData.set("msclkid", search.get("msclkid") ?? "");
    }
    formData.set("entry_timestamp", new Date().toISOString());

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    }).catch(() => null);

    if (!response?.ok) {
      setState("error");
      setError("We could not submit your request. Please call us directly.");
      return;
    }

    setState("success");
  }

  if (state === "success") {
    return <p className="text-sm font-semibold text-[#15803D]">Commercial request sent. We will follow up shortly.</p>;
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="page_type" value="commercial" />
      <input type="hidden" name="service" value="Commercial Plumbing" />
      <input type="hidden" name="service_interest" value="Commercial Plumbing" />
      <input type="hidden" name="page_url" value="" />
      <input type="hidden" name="utm_source" value="" />
      <input type="hidden" name="utm_medium" value="" />
      <input type="hidden" name="utm_campaign" value="" />
      <input type="hidden" name="gclid" value="" />
      <input type="hidden" name="fbclid" value="" />
      <input type="hidden" name="msclkid" value="" />
      <input type="hidden" name="entry_timestamp" value="" />
      <input
        aria-hidden="true"
        autoComplete="off"
        className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
        name="honeypot"
        tabIndex={-1}
        type="text"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="commercial-name">
            Contact Name *
          </label>
          <input className={fieldClass} id="commercial-name" name="name" required type="text" />
        </div>
        <div>
          <label className={labelClass} htmlFor="commercial-phone">
            Phone *
          </label>
          <input className={fieldClass} id="commercial-phone" name="phone" required type="tel" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="commercial-email">
            Email
          </label>
          <input className={fieldClass} id="commercial-email" name="email" type="email" />
        </div>
        <div>
          <label className={labelClass} htmlFor="commercial-business-name">
            Business Name *
          </label>
          <input className={fieldClass} id="commercial-business-name" name="business_name" required type="text" />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="commercial-site-address">
          Site Address *
        </label>
        <input className={fieldClass} id="commercial-site-address" name="site_address" required type="text" />
      </div>

      <div>
        <label className={labelClass} htmlFor="commercial-notes">
          Project Notes
        </label>
        <textarea className={`${fieldClass} min-h-[110px] resize-y`} id="commercial-notes" name="message" />
      </div>

      {state === "error" ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        className="rounded-[6px] bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] disabled:opacity-60"
        disabled={state === "submitting"}
        type="submit"
      >
        {state === "submitting" ? "Submitting..." : "Submit Commercial Request"}
      </button>
    </form>
  );
}
