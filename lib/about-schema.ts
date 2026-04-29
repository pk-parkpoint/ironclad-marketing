import { getPublicContactInfo } from "@/lib/contact";
import { CANONICAL_ORIGIN } from "@/lib/site-url";

type JsonLd = Record<string, unknown>;

function absolute(path: string): string {
  return path === "/" ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildAboutPageSchema(): JsonLd {
  const contactInfo = getPublicContactInfo();

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${CANONICAL_ORIGIN}/about#aboutpage`,
    name: "About Ironclad Plumbing",
    url: absolute("/about"),
    description:
      "Ironclad Plumbing is an Austin residential plumbing company built around published pricing guidance, written guarantees, and clear homeowner education.",
    about: {
      "@id": `${CANONICAL_ORIGIN}#organization`,
      "@type": "Organization",
      name: "Ironclad Plumbing",
      telephone: contactInfo.phoneHref.replace(/^tel:/, ""),
      url: CANONICAL_ORIGIN,
    },
    isPartOf: {
      "@id": `${CANONICAL_ORIGIN}#website`,
      "@type": "WebSite",
      name: "Ironclad Plumbing",
      url: CANONICAL_ORIGIN,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absolute("/og/ironclad-default.png"),
    },
  };
}

export function buildResponsibleMasterPlumberSchema(): JsonLd | null {
  const name = process.env.NEXT_PUBLIC_RESPONSIBLE_MASTER_PLUMBER_NAME?.trim();
  if (!name) {
    return null;
  }

  const license = process.env.NEXT_PUBLIC_RESPONSIBLE_MASTER_PLUMBER_LICENSE?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${CANONICAL_ORIGIN}/about#responsible-master-plumber`,
    name,
    jobTitle: "Responsible Master Plumber",
    worksFor: {
      "@id": `${CANONICAL_ORIGIN}#organization`,
      "@type": "Organization",
      name: "Ironclad Plumbing",
      url: CANONICAL_ORIGIN,
    },
    ...(license
      ? {
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Texas Responsible Master Plumber license",
            identifier: license,
          },
        }
      : {}),
  };
}
