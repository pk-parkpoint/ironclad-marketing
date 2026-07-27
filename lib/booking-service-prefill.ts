export type BookingServiceIssuePrefill = {
  serviceCategory: string;
  serviceDetail: string | null;
};

const EMERGENCY_SERVICES = new Set([
  "burst-pipe-repair",
  "emergency",
  "frozen-pipe-repair",
  "gas-leak-repair",
]);

function includesAny(value: string, fragments: string[]): boolean {
  return fragments.some((fragment) => value.includes(fragment));
}

export function getBookingServiceIssuePrefill(
  serviceSlug: string | null | undefined,
): BookingServiceIssuePrefill | null {
  const normalized = serviceSlug?.trim().toLowerCase();
  if (!normalized) return null;

  if (EMERGENCY_SERVICES.has(normalized)) {
    return { serviceCategory: "emergency", serviceDetail: null };
  }

  if (includesAny(normalized, ["water-heater", "tankless"])) {
    return {
      serviceCategory: "installations-replacements",
      serviceDetail: "water-heater",
    };
  }

  if (includesAny(normalized, ["drain", "clog", "hydro-jet"])) {
    return {
      serviceCategory: "leaks-blockages-sewer",
      serviceDetail: "clear-a-blockage",
    };
  }

  if (includesAny(normalized, ["sewer", "trenchless"])) {
    return {
      serviceCategory: "leaks-blockages-sewer",
      serviceDetail: "sewer-main-line",
    };
  }

  if (includesAny(normalized, ["leak", "water-line"])) {
    return {
      serviceCategory: "leaks-blockages-sewer",
      serviceDetail: "fix-a-leak",
    };
  }

  if (
    includesAny(normalized, [
      "bathroom",
      "faucet",
      "fixture",
      "garbage-disposal",
      "kitchen",
      "sink",
      "toilet",
    ])
  ) {
    return {
      serviceCategory: "installations-replacements",
      serviceDetail: "fixture",
    };
  }

  if (
    includesAny(normalized, [
      "backflow",
      "commercial",
      "filtration",
      "gas-line",
      "installation",
      "repiping",
      "sump-pump",
      "treatment",
      "well-pump",
    ])
  ) {
    return {
      serviceCategory: "installations-replacements",
      serviceDetail: "other-installation",
    };
  }

  return {
    serviceCategory: "leaks-blockages-sewer",
    serviceDetail: "other-issue",
  };
}
