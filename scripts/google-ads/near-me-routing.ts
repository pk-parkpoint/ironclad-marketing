import { SITE_ORIGIN } from "./manifest-shared";
import type { CampaignSpec } from "./types";

export const AUSTIN_PLUMBER_NEAR_ME_URL = `${SITE_ORIGIN}/lp/austin-plumber-near-me`;

const PROXIMITY_INTENT_PATTERN = /\b(?:near me|near you|nearby)\b/i;

export function hasProximityIntent(text: string): boolean {
  return PROXIMITY_INTENT_PATTERN.test(text);
}

export function routeNearMeTraffic(campaign: CampaignSpec): CampaignSpec {
  return {
    ...campaign,
    adGroups: campaign.adGroups.map((group) => {
      const dedicatedNearMeGroup = group.name === "Plumber Near Me";
      return {
        ...group,
        finalUrl: dedicatedNearMeGroup ? AUSTIN_PLUMBER_NEAR_ME_URL : group.finalUrl,
        keywords: group.keywords.map((keyword) =>
          dedicatedNearMeGroup || hasProximityIntent(keyword.text)
            ? { ...keyword, finalUrl: AUSTIN_PLUMBER_NEAR_ME_URL }
            : keyword),
      };
    }),
  };
}
