import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CORE_PROCESS,
  IRONCLAD_REVIEWS,
  LOCATION_PAGES,
  PLUMBING_FAQS,
  PLUMBING_SERVICES,
  SERVICE_AREA_HUB_INTRO,
} from "../../../frontend/lib/ironclad-data";
import { BLOG_POSTS } from "../content/blog-posts";
import { LOCATIONS } from "../content/locations";
import { SERVICES } from "../content/services";

type SanityDocument = Record<string, unknown>;

type Ref = {
  _type: "reference";
  _ref: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, "../content/cms-seed");
const ndjsonPath = path.join(outDir, "ironclad-seed.ndjson");
const summaryPath = path.join(outDir, "seed-summary.json");

const legacyServiceSlugMap: Record<string, string> = {
  "gas-lines": "gas-line-services",
  "sewer-lines": "sewer-services",
  "fixture-installation": "fixtures",
  "water-filtration": "water-treatment",
  "garbage-disposals": "drain-cleaning",
};

const serviceTypeMap: Record<string, string> = {
  "Leak Detection": "leak-detection",
  "Water Heater": "water-heaters",
  "Drain Cleaning": "drain-cleaning",
  "Plumbing Repairs": "repairs",
  "Fixture Installation": "fixtures",
  "Sewer Lines": "sewer-services",
  "Water Filtration": "water-treatment",
  "Tankless Water Heaters": "tankless-water-heaters",
};

const cityToLocationSlug: Record<string, string> = {
  Austin: "austin-tx",
  "Round Rock": "round-rock-tx",
  Georgetown: "georgetown-tx",
  Pflugerville: "pflugerville-tx",
  "Cedar Park": "cedar-park-tx",
  Leander: "leander-tx",
  Lakeway: "lakeway-tx",
  "Bee Cave": "bee-cave-tx",
  "West Lake Hills": "west-lake-hills-tx",
  Rollingwood: "rollingwood-tx",
  "Dripping Springs": "dripping-springs-tx",
  Buda: "buda-tx",
  Kyle: "kyle-tx",
  Manor: "manor-tx",
  Hutto: "hutto-tx",
  Taylor: "taylor-tx",
  "Liberty Hill": "liberty-hill-tx",
  "Lago Vista": "lago-vista-tx",
  Spicewood: "spicewood-tx",
};

const locationCoordinates: Record<string, { latitude: number; longitude: number }> = {
  "austin-tx": { latitude: 30.2672, longitude: -97.7431 },
  "round-rock-tx": { latitude: 30.5083, longitude: -97.6789 },
  "georgetown-tx": { latitude: 30.6333, longitude: -97.6772 },
  "pflugerville-tx": { latitude: 30.4394, longitude: -97.62 },
  "cedar-park-tx": { latitude: 30.5052, longitude: -97.8203 },
  "leander-tx": { latitude: 30.5788, longitude: -97.8531 },
  "lakeway-tx": { latitude: 30.3541, longitude: -97.9961 },
  "bee-cave-tx": { latitude: 30.3097, longitude: -97.9414 },
  "west-lake-hills-tx": { latitude: 30.2975, longitude: -97.8025 },
  "rollingwood-tx": { latitude: 30.2769, longitude: -97.7911 },
  "dripping-springs-tx": { latitude: 30.1902, longitude: -98.0867 },
  "buda-tx": { latitude: 30.0852, longitude: -97.8403 },
  "kyle-tx": { latitude: 29.9891, longitude: -97.8772 },
  "manor-tx": { latitude: 30.3408, longitude: -97.5569 },
  "hutto-tx": { latitude: 30.5427, longitude: -97.5467 },
  "taylor-tx": { latitude: 30.5708, longitude: -97.4094 },
  "liberty-hill-tx": { latitude: 30.6646, longitude: -97.9225 },
  "lago-vista-tx": { latitude: 30.4619, longitude: -97.9889 },
  "spicewood-tx": { latitude: 30.4816, longitude: -98.1617 },
};

const serviceId = (slug: string) => `service.${slug}`;
const locationId = (slug: string) => `location.${slug}`;
const reviewId = (id: string) => `review.${id}`;
const faqId = (question: string) => `faq.${slugify(question).slice(0, 90)}`;
const blogId = (slug: string) => `blogPost.${slug}`;
const offerId = (slug: string) => `specialOffer.${slug}`;
const teamMemberId = (slug: string) => `teamMember.${slug}`;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toRef(id: string): Ref {
  return { _type: "reference", _ref: id };
}

function safeCanonicalServiceSlug(rawSlug: string): string {
  const mapped = legacyServiceSlugMap[rawSlug] ?? rawSlug;
  const exists = SERVICES.some((service) => service.slug === mapped);
  return exists ? mapped : "repairs";
}

function processToSteps(seed = "General") {
  return CORE_PROCESS.map((title, index) => ({
    _type: "processStep",
    _key: `step-${index + 1}`,
    number: `${index + 1}`,
    title,
    description:
      title === "Schedule"
        ? `Book online or call and choose a window that works for your ${seed.toLowerCase()} needs.`
        : title === "On-site diagnosis"
          ? "A licensed technician inspects the issue and confirms the root cause."
          : title === "Upfront pricing"
            ? "You get clear options before any work starts, with no surprise charges."
            : "Work is completed, tested, and documented before closeout.",
  }));
}

function faqCategory(question: string, answer: string): string {
  const text = `${question} ${answer}`.toLowerCase();

  if (/emergency|gas smell|urgent|24\/7|immediately/.test(text)) {
    return "emergency";
  }
  if (/water heater|tankless|hot water/.test(text)) {
    return "water-heaters";
  }
  if (/drain|sewer|clog|backup/.test(text)) {
    return "drains-sewers";
  }
  if (/leak|slab|moisture|water bill/.test(text)) {
    return "leaks";
  }
  if (/hard water|filter|filtration|water quality|scale/.test(text)) {
    return "water-quality";
  }
  if (/schedule|availability|online|appointment|same-day/.test(text)) {
    return "scheduling";
  }
  if (/price|estimate|upfront|cost/.test(text)) {
    return "pricing";
  }
  return "general";
}

function bodyBlocks(text: string) {
  return [
    {
      _type: "block",
      _key: `block-${slugify(text).slice(0, 24) || "content"}`,
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "span-1",
          text,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ];
}

function main() {
  const docs: SanityDocument[] = [];

  const plumbingServiceMap = new Map(PLUMBING_SERVICES.map((item) => [safeCanonicalServiceSlug(item.slug), item]));

  SERVICES.forEach((service, index) => {
    const source = plumbingServiceMap.get(service.slug);
    const related = SERVICES.filter((candidate) => candidate.slug !== service.slug)
      .slice(index % 3, index % 3 + 3)
      .map((entry) => toRef(serviceId(entry.slug)));

    docs.push({
      _id: serviceId(service.slug),
      _type: "service",
      title: service.title,
      slug: { _type: "slug", current: service.slug },
      seo: {
        _type: "seo",
        titleTag: service.titleTag,
        metaDescription: service.metaDescription,
      },
      hero: {
        h1: service.h1,
        description: source?.heroSubtitle ?? service.metaDescription,
      },
      symptoms: {
        heading: `Signs You Need ${service.title}`,
        items: source?.signs ?? [
          "Unexpected changes in plumbing performance",
          "Recurring issues in fixtures or drains",
          "Visible signs of moisture or wear",
        ],
      },
      solutions: {
        heading: "What We Do",
        items: source?.includes ?? ["Diagnosis", "Clear options", "Code-compliant repair"],
      },
      austinNote: {
        title: "Austin-specific context",
        body: `In Austin, hard-water scale and seasonal soil movement both impact ${service.title.toLowerCase()} outcomes. We scope solutions with those local conditions in mind.`,
      },
      process: {
        heading: "What to Expect",
        steps: processToSteps(service.title),
      },
      trustPoints: [
        {
          _type: "trustPoint",
          _key: "trust-1",
          title: "Licensed local technicians",
          description: "Work is performed by licensed, insured plumbers familiar with Austin-area systems.",
        },
        {
          _type: "trustPoint",
          _key: "trust-2",
          title: "Upfront options",
          description: "We provide clear, written pricing options before work begins.",
        },
        {
          _type: "trustPoint",
          _key: "trust-3",
          title: "Warranty-backed workmanship",
          description: "Completed work is documented and covered by our workmanship warranty.",
        },
      ],
      faqs:
        source?.faqs.map((item, faqIndex) => ({
          _type: "faqItem",
          _key: `faq-${faqIndex + 1}`,
          question: item.question,
          answer: item.answer,
        })) ?? [],
      relatedServices: related,
      bookingCtaText: `Book ${service.title}`,
      icon: service.slug,
      shortDescription: source?.heroSubtitle ?? service.metaDescription,
      sortOrder: index,
      showInNav: true,
      showInHomepageGrid: index < 8,
    });
  });

  IRONCLAD_REVIEWS.forEach((review, index) => {
    const mappedServiceSlug = serviceTypeMap[review.serviceType] ?? "repairs";
    const city = review.location.replace(/^South\s+/i, "");
    const locationSlug = cityToLocationSlug[city];

    docs.push({
      _id: reviewId(review.id),
      _type: "review",
      reviewerName: review.reviewerName,
      location: review.location,
      rating: review.rating,
      text: review.quote,
      serviceType: toRef(serviceId(mappedServiceSlug)),
      date: `2026-01-${String(index + 10).padStart(2, "0")}`,
      source: "google",
      verified: true,
      featured: Boolean(review.featured),
      showOnHomepage: Boolean(review.featured),
      showOnServicePage: [toRef(serviceId(mappedServiceSlug))],
      showOnLocationPage: locationSlug ? [toRef(locationId(locationSlug))] : [],
    });
  });

  LOCATION_PAGES.forEach((location, index) => {
    const seo = LOCATIONS.find((entry) => entry.slug === location.slug);
    const coords = locationCoordinates[location.slug] ?? { latitude: 30.2672, longitude: -97.7431 };

    docs.push({
      _id: locationId(location.slug),
      _type: "location",
      cityName: location.cityName,
      state: location.state,
      county: location.county,
      slug: { _type: "slug", current: location.slug },
      seo: {
        _type: "seo",
        titleTag: seo?.titleTag ?? `${location.cityName} Plumbing | Ironclad Plumbing`,
        metaDescription:
          seo?.metaDescription ?? `${location.cityName} plumbing service with upfront pricing and modern dispatch communication.`,
      },
      hero: {
        h1: location.heroTitle,
        description: location.heroSubtitle,
      },
      localProof: {
        reviewCount: location.localProof.reviewCount,
        averageRating: location.localProof.averageRating,
        featuredReview: toRef(reviewId(location.localProof.featuredReview.id)),
        recentJobs: location.localProof.recentJobs,
      },
      commonIssues: {
        heading: location.commonIssues.heading,
        body: location.commonIssues.body,
        linkedServices: location.commonIssues.linkedServiceSlugs.map((slug) => toRef(serviceId(safeCanonicalServiceSlug(slug)))),
      },
      whyChooseUs: location.whyChooseUs.map((card, whyIndex) => ({
        _key: `why-${whyIndex + 1}`,
        icon: "shield-check",
        title: card.title,
        description: card.description,
      })),
      faqs: location.faqs.map((faq, faqIndex) => ({
        _type: "faqItem",
        _key: `faq-${faqIndex + 1}`,
        question: faq.question,
        answer: faq.answer,
      })),
      featuredServices: location.featuredServiceSlugs.map((slug) => toRef(serviceId(safeCanonicalServiceSlug(slug)))),
      nearbyLocations: location.nearbyLocationSlugs.map((slug) => toRef(locationId(slug))),
      sortOrder: index,
      showInHomepageGrid: index < 6,
      showInNavPreview: index < 6,
      latitude: coords.latitude,
      longitude: coords.longitude,
      serviceRadius: 35,
    });
  });

  const faqAccumulator = new Map<
    string,
    {
      question: string;
      answer: string;
      relatedServiceSlug?: string;
      relatedLocationSlug?: string;
    }
  >();

  PLUMBING_FAQS.forEach((faq) => {
    faqAccumulator.set(faq.question.toLowerCase(), {
      question: faq.question,
      answer: faq.answer,
    });
  });

  PLUMBING_SERVICES.forEach((service) => {
    service.faqs.forEach((faq) => {
      faqAccumulator.set(faq.question.toLowerCase(), {
        question: faq.question,
        answer: faq.answer,
        relatedServiceSlug: safeCanonicalServiceSlug(service.slug),
      });
    });
  });

  LOCATION_PAGES.forEach((location) => {
    location.faqs.forEach((faq) => {
      faqAccumulator.set(`${location.slug}:${faq.question.toLowerCase()}`, {
        question: faq.question,
        answer: faq.answer,
        relatedLocationSlug: location.slug,
      });
    });
  });

  Array.from(faqAccumulator.values()).forEach((faq, index) => {
    docs.push({
      _id: faqId(faq.question),
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      category: faqCategory(faq.question, faq.answer),
      ...(faq.relatedServiceSlug ? { relatedService: toRef(serviceId(faq.relatedServiceSlug)) } : {}),
      ...(faq.relatedLocationSlug ? { relatedLocation: toRef(locationId(faq.relatedLocationSlug)) } : {}),
      sortOrder: index,
      showOnFaqHub: true,
      ...(faq.relatedServiceSlug ? { showOnServicePage: [toRef(serviceId(faq.relatedServiceSlug))] } : {}),
      ...(faq.relatedLocationSlug ? { showOnLocationPage: [toRef(locationId(faq.relatedLocationSlug))] } : {}),
    });
  });

  BLOG_POSTS.forEach((post, index) => {
    docs.push({
      _id: blogId(post.slug),
      _type: "blogPost",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      seo: {
        _type: "seo",
        titleTag: post.titleTag,
        metaDescription: post.metaDescription,
      },
      excerpt: post.metaDescription,
      body: bodyBlocks(`${post.h1}. Additional article body content can be expanded from the v3 copy pack.`),
      readTimeMinutes: 6,
      category: "Maintenance Tips",
      tags: ["austin", "plumbing"],
      relatedServices: [toRef(serviceId("repairs"))],
      relatedLocations: [toRef(locationId("austin-tx"))],
      relatedPosts: [],
      author: "Ironclad Plumbing Team",
      publishDate: `2026-02-${String(index + 1).padStart(2, "0")}T09:00:00.000Z`,
      status: "published",
      featured: index === 0,
    });
  });

  docs.push(
    {
      _id: offerId("first-service-50-off"),
      _type: "specialOffer",
      title: "$50 Off First Service",
      description: "New customers receive $50 off their first completed plumbing service.",
      terms: "Valid for first-time customers on services above $200. Cannot be combined with other offers.",
      code: "WELCOME50",
      validFrom: "2026-01-01T00:00:00.000Z",
      validUntil: "2026-12-31T23:59:59.000Z",
      active: true,
      applicableServices: [toRef(serviceId("repairs")), toRef(serviceId("drain-cleaning"))],
      newCustomersOnly: true,
      sortOrder: 0,
    },
    {
      _id: offerId("water-heater-upgrade-credit"),
      _type: "specialOffer",
      title: "Water Heater Upgrade Credit",
      description: "Apply a service-call credit toward qualifying water heater replacements.",
      terms: "Credit applies only to complete replacement projects and expires after diagnostic appointment.",
      code: "HEATERCREDIT",
      validFrom: "2026-01-01T00:00:00.000Z",
      validUntil: "2026-12-31T23:59:59.000Z",
      active: true,
      applicableServices: [toRef(serviceId("water-heaters")), toRef(serviceId("tankless-water-heaters"))],
      newCustomersOnly: false,
      sortOrder: 1,
    },
  );

  docs.push(
    {
      _id: teamMemberId("michael-rivera"),
      _type: "teamMember",
      name: "Michael Rivera",
      role: "Master Plumber",
      bio: "Leads complex diagnostics and mentorship across the field team.",
      licenseNumber: "MPL-10293",
      sortOrder: 0,
      showOnAboutPage: true,
    },
    {
      _id: teamMemberId("alyssa-nguyen"),
      _type: "teamMember",
      name: "Alyssa Nguyen",
      role: "Service Manager",
      bio: "Owns customer communication and handoff quality from booking through closeout.",
      sortOrder: 1,
      showOnAboutPage: true,
    },
    {
      _id: teamMemberId("devin-martinez"),
      _type: "teamMember",
      name: "Devin Martinez",
      role: "Senior Technician",
      bio: "Specializes in leak detection and water-quality system optimization.",
      licenseNumber: "SP-88421",
      sortOrder: 2,
      showOnAboutPage: true,
    },
  );

  docs.push({
    _id: "companyInfo",
    _type: "companyInfo",
    name: "Ironclad Plumbing",
    phone: "(512) XXX-XXXX",
    textNumber: "(512) XXX-XXXX",
    email: "hello@ironcladplumbing.com",
    address: {
      street: "1234 Congress Ave",
      city: "Austin",
      state: "TX",
      zip: "78701",
      latitude: 30.2672,
      longitude: -97.7431,
    },
    hours: {
      weekday: "7:00 AM - 6:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Emergency only",
      emergency: "24/7",
    },
    license: {
      number: "M-45678",
      board: "Texas State Board of Plumbing Examiners",
    },
    insurance: {
      generalLiability: true,
      workersComp: true,
    },
    serviceAreasText: SERVICE_AREA_HUB_INTRO,
    bookingPrompt: "Book online in under 60 seconds and we will confirm your arrival window quickly.",
  });

  mkdirSync(outDir, { recursive: true });

  const ndjson = docs.map((document) => JSON.stringify(document)).join("\n") + "\n";
  writeFileSync(ndjsonPath, ndjson, "utf-8");

  const summary = {
    generatedAt: new Date().toISOString(),
    documentCount: docs.length,
    byType: docs.reduce<Record<string, number>>((acc, doc) => {
      const type = String(doc._type);
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    }, {}),
  };

  writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + "\n", "utf-8");

  console.log(`Wrote ${summary.documentCount} documents to ${ndjsonPath}`);
  console.log(summary.byType);
}

main();
