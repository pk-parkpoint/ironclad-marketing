import { GUIDES_DROPDOWN_LINKS } from "@/content/guides";
import { STATIC_PAGES } from "@/content/static-pages";
import { LOCATIONS } from "@/content/locations";
import { AUSTIN_NEIGHBORHOOD_LINKS } from "@/content/austin-neighborhoods";

export type NavChildLink = {
  href: string;
  label: string;
  children?: NavChildLink[];
};

export type TopNavLink = {
  href: string;
  label: string;
  children?: NavChildLink[];
};

const PLUMBING_DROPDOWN_LINKS: NavChildLink[] = [
  { href: "/plumbing/emergency", label: "Emergency Plumbing" },
  {
    href: "/plumbing/repairs",
    label: "Repairs",
    children: [
      { href: "/plumbing/repairs", label: "Plumbing Repairs" },
      { href: "/plumbing/water-pressure", label: "Water Pressure / Pressure Regulator" },
      { href: "/plumbing/repiping", label: "Repiping" },
      { href: "/plumbing/burst-pipe-repair", label: "Burst Pipe Repair" },
      { href: "/plumbing/frozen-pipe-repair", label: "Frozen Pipe Repair" },
    ],
  },
  {
    href: "/plumbing/leak-repair",
    label: "Leaks",
    children: [
      { href: "/plumbing/leak-repair", label: "Leak Repair" },
      { href: "/plumbing/leak-detection", label: "Leak Detection" },
    ],
  },
  {
    href: "/plumbing/water-heaters",
    label: "Water Heaters",
    children: [
      { href: "/plumbing/water-heaters", label: "Water Heaters" },
      { href: "/plumbing/water-heater-repair", label: "Water Heater Repair" },
      { href: "/plumbing/water-heater-installation", label: "Water Heater Installation" },
      { href: "/plumbing/water-heater-tune-up", label: "Water Heater Tune-Up" },
      { href: "/plumbing/tankless-water-heaters", label: "Tankless Water Heaters" },
    ],
  },
  { href: "/plumbing/sump-pump-services", label: "Sump Pump Services" },
  {
    href: "/plumbing/fixtures",
    label: "Fixtures",
    children: [
      { href: "/plumbing/fixtures", label: "Fixtures" },
      { href: "/plumbing/faucet-sink-services", label: "Faucet & Sink Services" },
      { href: "/plumbing/toilet-repair-installation", label: "Toilet Repair & Installation" },
      { href: "/plumbing/garbage-disposal-services", label: "Garbage Disposal Services" },
    ],
  },
  {
    href: "/plumbing/kitchen-bathroom-plumbing-repair",
    label: "Kitchen & Bathroom Plumbing",
    children: [
      { href: "/plumbing/kitchen-bathroom-plumbing-repair", label: "Kitchen & Bathroom Plumbing Repair" },
      {
        href: "/plumbing/kitchen-bathroom-plumbing-installation",
        label: "Kitchen & Bathroom Plumbing Installation",
      },
      { href: "/plumbing/bathroom-plumbing", label: "Bathroom Plumbing" },
    ],
  },
  {
    href: "/plumbing/gas-line-services",
    label: "Gas Lines",
    children: [
      { href: "/plumbing/gas-line-services", label: "Gas Line Services" },
      { href: "/plumbing/gas-leak-repair", label: "Gas Leak Detection & Repair" },
    ],
  },
  {
    href: "/plumbing/water-treatment",
    label: "Water Quality & Supply",
    children: [
      { href: "/plumbing/water-treatment", label: "Water Treatment" },
      { href: "/plumbing/water-filtration", label: "Water Filtration" },
      { href: "/plumbing/well-pump-services", label: "Well Pump & Pressure Tank" },
      { href: "/plumbing/backflow-prevention", label: "Backflow Prevention & Testing" },
    ],
  },
  { href: "/plumbing/plumbing-inspection", label: "Plumbing Inspection" },
  { href: "/plumbing", label: "All Plumbing Services" },
];

const DRAINS_DROPDOWN_LINKS: NavChildLink[] = [
  { href: "/plumbing/drain-clearing", label: "Drain Clearing" },
  { href: "/plumbing/clogged-drain", label: "Clogged Drain" },
  { href: "/plumbing/hydro-jetting", label: "Hydro Jetting" },
  {
    href: "/plumbing/sewer-services",
    label: "Sewer Lines",
    children: [
      { href: "/plumbing/sewer-services", label: "Sewer Line Services" },
      { href: "/plumbing/sewer-camera-inspection", label: "Sewer Camera Inspection" },
      { href: "/plumbing/trenchless-sewer-repair", label: "Trenchless Sewer Repair" },
    ],
  },
  { href: "/plumbing/water-line-repair", label: "Water Lines" },
  { href: "/plumbing/slab-leak-repair", label: "Slab Leak Detection & Repair" },
];

const SERVICE_AREA_DROPDOWN_LINKS: NavChildLink[] = [
  ...LOCATIONS.slice(0, 10).map((location) => ({
    href: `/service-area/${location.slug}`,
    label: location.cityName,
  })),
  {
    href: "/service-area/austin-tx",
    label: "Austin Neighborhoods",
    children: AUSTIN_NEIGHBORHOOD_LINKS,
  },
  { href: "/service-area", label: "View All Areas" },
];

const ABOUT_DROPDOWN_LINKS: NavChildLink[] = [
  { href: "/reviews", label: "Our Reviews" },
  { href: "/guarantees", label: "Our Guarantees" },
  { href: "/site-map", label: "Site Map" },
  { href: "/careers", label: "Careers" },
  { href: "/about", label: "About Us" },
];

export const TOP_NAV_LINKS: TopNavLink[] = [
  { href: "/plumbing", label: "Plumbing", children: PLUMBING_DROPDOWN_LINKS },
  { href: "/plumbing/drain-clearing", label: "Drains", children: DRAINS_DROPDOWN_LINKS },
  { href: "/service-area", label: "Service Areas", children: SERVICE_AREA_DROPDOWN_LINKS },
  { href: "/guides", label: "Guides", children: GUIDES_DROPDOWN_LINKS },
  { href: "/about", label: "About Us", children: ABOUT_DROPDOWN_LINKS },
];

export const DEDICATED_MARKETING_PATHS = new Set([
  "book",
  "blog",
  "faq",
  "faq/plumbing",
  "guarantees",
  "guides",
  "plumbing",
  "plumbing-guides",
  "reviews",
  "service-area",
]);

export const STATIC_ROUTE_PATHS = STATIC_PAGES.map((entry) => entry.path);
