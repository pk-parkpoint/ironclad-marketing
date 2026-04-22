"use client";

import { FormEvent, useState } from "react";
import { trackLeadSubmitSuccess } from "@/lib/analytics";

const SERVICE_OPTIONS = [
  "Plumbing Repairs",
  "Drain Cleaning",
  "Sewer Line Services",
  "Water Heaters",
  "Leak Detection",
  "Gas Line Services",
  "Fixture Installation",
  "Emergency Plumbing",
  "Other",
];

const inputClass =
  "w-full rounded-[6px] border border-[#D1D5DB] bg-white px-4 py-3 font-sans text-sm text-[#111827] placeholder:text-[#9CA3AF] transition-[border-color,box-shadow] duration-150 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[rgba(37,99,235,0.2)]";
const labelClass = "mb-1.5 block text-[13px] font-medium text-[#374151]";

type ContactFormProps = {
  idPrefix?: string;
  pageType?: string;
  serviceArea?: string;
  serviceInterest?: string;
  urgent?: boolean;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

function getQueryValue(searchParams: URLSearchParams, key: string): string {
  return searchParams.get(key)?.trim() ?? "";
}

export function ContactForm({
  idPrefix = "cf",
  pageType = "contact",
  serviceArea = "",
  serviceInterest = "",
  urgent = false,
}: ContactFormProps) {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  const hiddenFields = {
    page_url: "",
    page_type: pageType,
    service_interest: serviceInterest,
    service_area: serviceArea,
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    gclid: "",
    fbclid: "",
    msclkid: "",
    entry_timestamp: "",
    urgent: urgent ? "1" : "",
  };

  function validate(form: FormData): Record<string, string> {
    const errs: Record<string, string> = {};
    const name = (form.get("name") as string)?.trim();
    const phone = (form.get("phone") as string)?.trim();
    const email = (form.get("email") as string)?.trim();
    if (!name) errs.name = "Full Name is required";
    if (!phone || phone.replace(/[^\d]/g, "").length < 10) errs.phone = "Valid phone is required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address";
    return errs;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmissionState("submitting");

    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      formData.set("page_url", `${window.location.pathname}${window.location.search}`);
      formData.set("service_area", formData.get("service_area")?.toString() || getQueryValue(search, "location"));
      formData.set("utm_source", getQueryValue(search, "utm_source"));
      formData.set("utm_medium", getQueryValue(search, "utm_medium"));
      formData.set("utm_campaign", getQueryValue(search, "utm_campaign"));
      formData.set("gclid", getQueryValue(search, "gclid"));
      formData.set("fbclid", getQueryValue(search, "fbclid"));
      formData.set("msclkid", getQueryValue(search, "msclkid"));
    }
    formData.set("entry_timestamp", new Date().toISOString());

    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);

    if (!response?.ok) {
      setSubmissionState("error");
      return;
    }

    trackLeadSubmitSuccess({
      city: serviceArea,
      formType: "contact_form",
      service: String(formData.get("service") || serviceInterest || ""),
    });
    setSubmissionState("success");
  }

  if (submissionState === "success") {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <p className="text-center text-base font-medium text-[#16a34a]">
          Thanks! We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="page_url" value={hiddenFields.page_url} />
      <input type="hidden" name="page_type" value={hiddenFields.page_type} />
      <input type="hidden" name="service_interest" value={hiddenFields.service_interest} />
      <input type="hidden" name="service_area" value={hiddenFields.service_area} />
      <input type="hidden" name="utm_source" value={hiddenFields.utm_source} />
      <input type="hidden" name="utm_medium" value={hiddenFields.utm_medium} />
      <input type="hidden" name="utm_campaign" value={hiddenFields.utm_campaign} />
      <input type="hidden" name="gclid" value={hiddenFields.gclid} />
      <input type="hidden" name="fbclid" value={hiddenFields.fbclid} />
      <input type="hidden" name="msclkid" value={hiddenFields.msclkid} />
      <input type="hidden" name="entry_timestamp" value={hiddenFields.entry_timestamp} />
      <input type="hidden" name="urgent" value={hiddenFields.urgent} />
      <input
        aria-hidden="true"
        autoComplete="off"
        className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
        name="honeypot"
        tabIndex={-1}
        type="text"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={fieldId("name")}>
            Full Name *
          </label>
          <input className={inputClass} id={fieldId("name")} name="name" placeholder="Full Name" type="text" />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor={fieldId("address")}>
            Address
          </label>
          <input className={inputClass} id={fieldId("address")} name="address" placeholder="Address" type="text" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={fieldId("email")}>
            Email
          </label>
          <input className={inputClass} id={fieldId("email")} name="email" placeholder="Email" type="email" />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor={fieldId("phone")}>
            Phone *
          </label>
          <input className={inputClass} id={fieldId("phone")} name="phone" placeholder="Phone" type="tel" />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor={fieldId("service")}>
          Choose Service
        </label>
        <div className="relative">
          <select
            className={`${inputClass} appearance-none pr-10`}
            defaultValue={serviceInterest || ""}
            id={fieldId("service")}
            name="service"
          >
            <option disabled value="">
              Choose Service
            </option>
            {SERVICE_OPTIONS.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor={fieldId("message")}>
          Message
        </label>
        <textarea
          className={`${inputClass} min-h-[100px] resize-y`}
          id={fieldId("message")}
          name="message"
          placeholder="Message"
        />
      </div>

      {submissionState === "error" ? (
        <p className="text-sm text-red-600">We could not submit your request. Please call or try again.</p>
      ) : null}

      <button
        className="mt-2 w-full rounded-[6px] bg-[#2563EB] px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={submissionState === "submitting"}
        type="submit"
      >
        {submissionState === "submitting" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
