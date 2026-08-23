import { CAMPAIGNS } from "./manifest";
import {
  CALLOUTS,
  LICENSE_DESCRIPTION,
  SHARED_NEGATIVES,
  SITELINKS,
  STANDARD_HEADLINES,
  STANDARD_SCHEDULE_DESCRIPTION,
  TARGET_CITIES,
} from "./manifest-shared";

const PHONE_PATTERN = /(?:\+?1\s*)?\(?512\)?[\s.-]*516[\s.-]*2470/;
const OPERATIONAL_DETAIL_PATTERN = /\b(?:permit|price|pricing|financing)\b/i;

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function validateManifest() {
  requireCondition(CAMPAIGNS.length === 7, "manifest must contain seven campaigns");
  requireCondition(CAMPAIGNS.filter((campaign) => campaign.launchEnabled).length === 5, "exactly five campaigns must launch");
  requireCondition(TARGET_CITIES.length === 19, "target city list must contain 19 locations");
  requireCondition(SHARED_NEGATIVES.length > 30, "shared negative list is incomplete");
  requireCondition(SITELINKS.length === 6, "six sitelinks are required");
  requireCondition(CALLOUTS.length === 8, "eight callouts are required");
  requireCondition(LICENSE_DESCRIPTION.length <= 90, "license description exceeds 90 characters");

  const campaignNames = new Set<string>();
  for (const campaign of CAMPAIGNS) {
    requireCondition(!campaignNames.has(campaign.name.toLowerCase()), `duplicate campaign: ${campaign.name}`);
    campaignNames.add(campaign.name.toLowerCase());
    requireCondition(campaign.descriptions[0] === LICENSE_DESCRIPTION, `${campaign.name}: description 1 must be the license line`);
    requireCondition(campaign.descriptions.length === 4, `${campaign.name}: simple formula requires four descriptions`);
    requireCondition(campaign.descriptions[2] === STANDARD_SCHEDULE_DESCRIPTION, `${campaign.name}: schedule description drifted`);
    requireCondition(JSON.stringify(campaign.headlines) === JSON.stringify(STANDARD_HEADLINES), `${campaign.name}: standard headline formula drifted`);
    requireCondition(Boolean(campaign.pinnedHeadline2), `${campaign.name}: promotion must be pinned to headline 2`);
    requireCondition(campaign.headlines.length + (campaign.pinnedHeadline2 ? 2 : 1) <= 15, `${campaign.name}: responsive search ad exceeds 15 headlines`);
    if (campaign.pinnedHeadline2) {
      requireCondition(campaign.pinnedHeadline2.length <= 30, `${campaign.name}: pinned headline 2 exceeds 30 characters`);
      requireCondition(!PHONE_PATTERN.test(campaign.pinnedHeadline2), `${campaign.name}: phone number found in pinned headline 2`);
      requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(campaign.pinnedHeadline2), `${campaign.name}: operational detail found in pinned headline 2`);
    }
    for (const headline of campaign.headlines) {
      requireCondition(headline.length <= 30, `${campaign.name}: headline exceeds 30 characters: ${headline}`);
      requireCondition(!PHONE_PATTERN.test(headline), `${campaign.name}: phone number found in headline`);
      requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(headline), `${campaign.name}: operational detail found in headline: ${headline}`);
    }
    for (const description of campaign.descriptions) {
      requireCondition(description.length <= 90, `${campaign.name}: description exceeds 90 characters: ${description}`);
      requireCondition(!PHONE_PATTERN.test(description), `${campaign.name}: phone number found in ad description`);
      requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(description), `${campaign.name}: operational detail found in description: ${description}`);
    }

    const groupNames = new Set<string>();
    for (const group of campaign.adGroups) {
      const pinnedHeadline2 = group.pinnedHeadline2 || campaign.pinnedHeadline2;
      const descriptions = group.promotionDescription
        ? [...campaign.descriptions.slice(0, -1), group.promotionDescription]
        : campaign.descriptions;
      requireCondition(!groupNames.has(group.name.toLowerCase()), `${campaign.name}: duplicate ad group ${group.name}`);
      groupNames.add(group.name.toLowerCase());
      requireCondition(group.pinnedHeadline.length <= 30 || group.pinnedHeadline.startsWith("{LOCATION("), `${campaign.name}/${group.name}: pinned headline exceeds 30 characters`);
      requireCondition(!PHONE_PATTERN.test(group.pinnedHeadline), `${campaign.name}/${group.name}: phone number found in headline`);
      requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(group.pinnedHeadline), `${campaign.name}/${group.name}: operational detail found in headline`);
      requireCondition(Boolean(group.pinnedHeadline2) === Boolean(group.promotionDescription), `${campaign.name}/${group.name}: promotion headline and description overrides must be paired`);
      requireCondition(Boolean(pinnedHeadline2), `${campaign.name}/${group.name}: promotion must be pinned to headline 2`);
      requireCondition((pinnedHeadline2 || "").length <= 30, `${campaign.name}/${group.name}: pinned headline 2 exceeds 30 characters`);
      requireCondition(!PHONE_PATTERN.test(pinnedHeadline2 || ""), `${campaign.name}/${group.name}: phone number found in pinned headline 2`);
      requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(pinnedHeadline2 || ""), `${campaign.name}/${group.name}: operational detail found in pinned headline 2`);
      for (const description of descriptions) {
        requireCondition(description.length <= 90, `${campaign.name}/${group.name}: description exceeds 90 characters: ${description}`);
        requireCondition(!PHONE_PATTERN.test(description), `${campaign.name}/${group.name}: phone number found in ad description`);
        requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(description), `${campaign.name}/${group.name}: operational detail found in description: ${description}`);
      }
      requireCondition(!group.finalUrl.endsWith("/book-online") && !group.finalUrl.endsWith("/book"), `${campaign.name}/${group.name}: booking URL cannot be a search destination`);
      requireCondition(group.keywords.length > 0, `${campaign.name}/${group.name}: no keywords`);
      const keywordKeys = new Set<string>();
      for (const keyword of group.keywords) {
        requireCondition(keyword.matchType === "EXACT" || keyword.matchType === "PHRASE", `${campaign.name}/${group.name}: broad keyword ${keyword.text}`);
        const key = `${keyword.matchType}:${keyword.text.toLowerCase()}`;
        requireCondition(!keywordKeys.has(key), `${campaign.name}/${group.name}: duplicate keyword ${key}`);
        keywordKeys.add(key);
        requireCondition(!keyword.finalUrl?.endsWith("/book-online") && !keyword.finalUrl?.endsWith("/book"), `${campaign.name}/${group.name}: booking keyword URL`);
      }
    }
  }
}

if (process.argv[1]?.endsWith("validate.ts")) {
  validateManifest();
  const groups = CAMPAIGNS.reduce((sum, campaign) => sum + campaign.adGroups.length, 0);
  const keywords = CAMPAIGNS.reduce((sum, campaign) => sum + campaign.adGroups.reduce((inner, group) => inner + group.keywords.length, 0), 0);
  console.log(`Google Ads manifest valid: campaigns=${CAMPAIGNS.length} adGroups=${groups} keywords=${keywords}`);
}
