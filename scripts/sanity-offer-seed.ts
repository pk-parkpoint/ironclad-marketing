import { DRAIN_CLEANING_OFFER, STANDARD_NEW_CUSTOMER_OFFER } from "../content/offers";

type SanityDocument = Record<string, unknown>;

const offerId = (slug: string) => `specialOffer.${slug}`;
const serviceRef = (slug: string) => ({ _type: "reference", _ref: `service.${slug}` });

export function buildSpecialOfferSeedDocuments(serviceSlugs: string[]): SanityDocument[] {
  return [
    {
      _id: offerId("first-service-50-off"),
      _type: "specialOffer",
      title: "15% Off First Service",
      description: STANDARD_NEW_CUSTOMER_OFFER.sentence,
      terms: "Valid for first-time customers. Maximum discount is $300. Cannot be combined with other offers.",
      code: "WELCOME15",
      validFrom: "2026-01-01T00:00:00.000Z",
      validUntil: "2026-12-31T23:59:59.000Z",
      active: true,
      applicableServices: serviceSlugs.filter((slug) => slug !== "drain-clearing").map(serviceRef),
      newCustomersOnly: true,
      sortOrder: 0,
    },
    {
      _id: offerId("water-heater-upgrade-credit"),
      _type: "specialOffer",
      title: "Water Heater Upgrade Credit",
      description: "Apply a service-call credit toward qualifying water heater replacements.",
      terms: "Retired in favor of the standard new-customer offer.",
      code: "HEATERCREDIT",
      validFrom: "2026-01-01T00:00:00.000Z",
      validUntil: "2026-12-31T23:59:59.000Z",
      active: false,
      applicableServices: [serviceRef("water-heaters"), serviceRef("tankless-water-heaters")],
      newCustomersOnly: false,
      sortOrder: 1,
    },
    {
      _id: offerId("drain-cleaning-89"),
      _type: "specialOffer",
      title: DRAIN_CLEANING_OFFER.short,
      description: "Residential drain cleaning for $89.",
      terms: "Valid for qualifying residential drain-cleaning service. Cannot be combined with other offers.",
      code: "DRAIN89",
      validFrom: "2026-01-01T00:00:00.000Z",
      validUntil: "2026-12-31T23:59:59.000Z",
      active: true,
      applicableServices: [serviceRef("drain-clearing")],
      newCustomersOnly: false,
      sortOrder: 2,
    },
  ];
}
