import { GUIDES_DROPDOWN_LINKS } from "@/content/guides";
import { STATIC_PAGES } from "@/content/static-pages";
import { LOCATIONS } from "@/content/locations";
import { SERVICES } from "@/content/services";

export type NavChildLink = {
  href: string;
  label: string;
};

export type TopNavLink = {
  href: string;
  label: string;
  children?: NavChildLink[];
};

const PLUMBING_DROPDOWN_LINKS: NavChildLink[] = SERVICES.map((service) => ({
  href: `/plumbing/${service.slug}`,
  label: service.title,
}));

const SERVICE_AREA_DROPDOWN_LINKS: NavChildLink[] = [
  ...LOCATIONS.slice(0, 10).map((location) => ({
    href: `/service-area/${location.slug}`,
    label: location.cityName,
  })),
  { href: "/service-area", label: "View All Areas" },
];

const ABOUT_DROPDOWN_LINKS: NavChildLink[] = [
  { href: "/reviews", label: "Our Reviews" },
  { href: "/guarantees", label: "Our Guarantees" },
  { href: "/careers", label: "Careers" },
  { href: "/about", label: "About Us" },
];

export const TOP_NAV_LINKS: TopNavLink[] = [
  { href: "/plumbing", label: "Plumbing", children: PLUMBING_DROPDOWN_LINKS },
  { href: "/service-area", label: "Service Areas", children: SERVICE_AREA_DROPDOWN_LINKS },
  { href: "/guides", label: "Guides", children: GUIDES_DROPDOWN_LINKS },
  { href: "/about", label: "About Us", children: ABOUT_DROPDOWN_LINKS },
];

export const DEDICATED_MARKETING_PATHS = new Set([
  "blog",
  "faq",
  "faq/plumbing",
  "guarantees",
  "guides",
  "plumbing",
  "plumbing-guides",
  "service-area",
]);

export const STATIC_ROUTE_PATHS = STATIC_PAGES.map((entry) => entry.path);
