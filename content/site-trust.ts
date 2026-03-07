import { LOCATIONS } from "@/content/locations";

export const TRUST_FIELDS = {
  masterPlumberLicense: "Texas Responsible Master Plumber License #M-XXXXX",
  insuredStatus: "Fully licensed and insured",
  writtenWarranty: "Written workmanship warranty on every completed job",
  serviceArea: "Greater Austin and surrounding Central Texas cities",
  financing: "Financing options available for qualified projects",
  sameDayEmergency: "Same-day and emergency service available",
  backgroundCheckedTeam: "Background-checked technicians",
} as const;

export const BUSINESS_SERVICE_TYPES = [
  "Residential plumbing",
  "Drain cleaning",
  "Water heater service",
  "Tankless water heater service",
  "Sewer line diagnostics and repair",
  "Leak detection",
  "Gas line service",
  "Fixture installation and repair",
  "Water treatment",
  "Emergency plumbing",
] as const;

export function buildAreaServedList(): string[] {
  return LOCATIONS.map((location) => `${location.cityName}, TX`);
}
