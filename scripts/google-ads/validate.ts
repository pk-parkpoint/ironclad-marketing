import { CAMPAIGNS } from "./manifest";
import { desiredAd } from "./ad-groups";
import { CORE_LAUNCH_KEYS, TARGET_CPA_MICROS } from "./launch-config";
import {
  CALLOUTS,
  LICENSE_DESCRIPTION,
  RESIDENTIAL_NEGATIVES,
  SHARED_NEGATIVES,
  SITELINKS,
  STANDARD_HEADLINES,
  STANDARD_AVAILABILITY_HEADLINE,
  STANDARD_AVAILABILITY_DESCRIPTION,
  STANDARD_OUTCOME_DESCRIPTION,
  TARGET_CITIES,
} from "./manifest-shared";

const PHONE_PATTERN = /(?:\+?1\s*)?\(?512\)?[\s.-]*516[\s.-]*2470/;
const OPERATIONAL_DETAIL_PATTERN = /\b(?:permit|price|pricing|financing)\b/i;
const FORBIDDEN_COPY_PATTERN = /\b(?:act fast|experts who|qualifying|schedule anytime)\b/i;

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function validateManifest() {
  requireCondition(CAMPAIGNS.length === 7, "manifest must contain seven campaigns");
  const launchCampaigns = CAMPAIGNS.filter((campaign) => campaign.launchEnabled);
  requireCondition(launchCampaigns.length === CORE_LAUNCH_KEYS.length, "exactly five core campaigns must launch");
  requireCondition(JSON.stringify(launchCampaigns.map((campaign) => campaign.key).sort()) === JSON.stringify([...CORE_LAUNCH_KEYS].sort()), "launch campaign set drifted");
  requireCondition(launchCampaigns.every((campaign) => campaign.targetCpaMicros === TARGET_CPA_MICROS), "launch campaigns must target a $40 CPA");
  requireCondition(TARGET_CITIES.length === 19, "target city list must contain 19 locations");
  requireCondition(SHARED_NEGATIVES.length > 30, "shared negative list is incomplete");
  requireCondition(RESIDENTIAL_NEGATIVES.length >= 20, "residential/commercial negative list is incomplete");
  requireCondition(SITELINKS.length === 6, "six sitelinks are required");
  requireCondition(CALLOUTS.length === 8, "eight callouts are required");
  requireCondition(LICENSE_DESCRIPTION.length <= 90, "license description exceeds 90 characters");
  for (const callout of CALLOUTS) {
    requireCondition(!FORBIDDEN_COPY_PATTERN.test(callout), `forbidden callout copy: ${callout}`);
  }

  const campaignNames = new Set<string>();
  for (const campaign of CAMPAIGNS) {
    requireCondition(!campaignNames.has(campaign.name.toLowerCase()), `duplicate campaign: ${campaign.name}`);
    campaignNames.add(campaign.name.toLowerCase());
    const phraseCrossNegatives = new Set(campaign.crossNegatives.map((text) => text.toLowerCase()));
    const exactCrossNegatives = new Set((campaign.exactCrossNegatives || []).map((text) => text.toLowerCase()));
    requireCondition(phraseCrossNegatives.size === campaign.crossNegatives.length, `${campaign.name}: duplicate phrase cross negative`);
    requireCondition(exactCrossNegatives.size === (campaign.exactCrossNegatives || []).length, `${campaign.name}: duplicate exact cross negative`);
    requireCondition([...exactCrossNegatives].every((text) => !phraseCrossNegatives.has(text)), `${campaign.name}: cross negative has two match types`);
    requireCondition(campaign.descriptions[0] === LICENSE_DESCRIPTION, `${campaign.name}: description 1 must be the license line`);
    requireCondition(campaign.descriptions.length === 4, `${campaign.name}: simple formula requires four descriptions`);
    requireCondition(campaign.descriptions[1] === STANDARD_OUTCOME_DESCRIPTION, `${campaign.name}: fallback outcome description drifted`);
    requireCondition(campaign.descriptions[2] === STANDARD_AVAILABILITY_DESCRIPTION, `${campaign.name}: availability description drifted`);
    requireCondition(JSON.stringify(campaign.headlines) === JSON.stringify(STANDARD_HEADLINES), `${campaign.name}: standard headline formula drifted`);
    requireCondition(STANDARD_AVAILABILITY_HEADLINE.length <= 30, "availability headline exceeds 30 characters");
    requireCondition(Boolean(campaign.promotionHeadline), `${campaign.name}: promotion headline is required`);
    if (campaign.promotionHeadline) {
      requireCondition(campaign.promotionHeadline.length <= 30, `${campaign.name}: promotion headline exceeds 30 characters`);
      requireCondition(!PHONE_PATTERN.test(campaign.promotionHeadline), `${campaign.name}: phone number found in promotion headline`);
      requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(campaign.promotionHeadline), `${campaign.name}: operational detail found in promotion headline`);
      requireCondition(!FORBIDDEN_COPY_PATTERN.test(campaign.promotionHeadline), `${campaign.name}: forbidden copy found in promotion headline`);
    }
    for (const headline of campaign.headlines) {
      requireCondition(headline.length <= 30, `${campaign.name}: headline exceeds 30 characters: ${headline}`);
      requireCondition(!PHONE_PATTERN.test(headline), `${campaign.name}: phone number found in headline`);
      requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(headline), `${campaign.name}: operational detail found in headline: ${headline}`);
      requireCondition(!FORBIDDEN_COPY_PATTERN.test(headline), `${campaign.name}: forbidden copy found in headline: ${headline}`);
    }
    for (const description of campaign.descriptions) {
      requireCondition(description.length <= 90, `${campaign.name}: description exceeds 90 characters: ${description}`);
      requireCondition(!PHONE_PATTERN.test(description), `${campaign.name}: phone number found in ad description`);
      requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(description), `${campaign.name}: operational detail found in description: ${description}`);
      requireCondition(!FORBIDDEN_COPY_PATTERN.test(description), `${campaign.name}: forbidden copy found in description: ${description}`);
    }

    const groupNames = new Set<string>();
    for (const group of campaign.adGroups) {
      const promotionHeadline = group.promotionHeadline || campaign.promotionHeadline;
      const descriptions = [...campaign.descriptions];
      const headlines = [
        group.primaryHeadline,
        promotionHeadline,
        STANDARD_AVAILABILITY_HEADLINE,
        ...campaign.headlines,
        ...(group.additionalHeadlines || []),
      ].filter((headline): headline is string => Boolean(headline));
      descriptions[1] = group.outcomeDescription;
      if (group.promotionDescription) descriptions[descriptions.length - 1] = group.promotionDescription;
      requireCondition(!groupNames.has(group.name.toLowerCase()), `${campaign.name}: duplicate ad group ${group.name}`);
      groupNames.add(group.name.toLowerCase());
      requireCondition(Boolean(group.promotionHeadline) === Boolean(group.promotionDescription), `${campaign.name}/${group.name}: promotion headline and description overrides must be paired`);
      requireCondition(Boolean(promotionHeadline), `${campaign.name}/${group.name}: promotion headline is required`);
      requireCondition(campaign.launchEnabled ? headlines.length === 15 : headlines.length <= 15, `${campaign.name}/${group.name}: responsive search ad headline count=${headlines.length}`);
      requireCondition(!campaign.launchEnabled || group.additionalHeadlines?.length === 8, `${campaign.name}/${group.name}: live ad group requires eight relevance headlines`);
      requireCondition(new Set(headlines.map((headline) => headline.toLowerCase())).size === headlines.length, `${campaign.name}/${group.name}: duplicate responsive search ad headline`);
      const generatedAd = desiredAd(campaign, group).responsiveSearchAd;
      requireCondition(generatedAd.headlines.length === headlines.length, `${campaign.name}/${group.name}: generated headline count drifted`);
      requireCondition(generatedAd.descriptions.length === 4, `${campaign.name}/${group.name}: generated description count drifted`);
      requireCondition(generatedAd.headlines.every((headline) => !("pinnedField" in headline)), `${campaign.name}/${group.name}: generated headline is pinned`);
      requireCondition(generatedAd.descriptions.every((description) => !("pinnedField" in description)), `${campaign.name}/${group.name}: generated description is pinned`);
      for (const headline of headlines) {
        requireCondition(headline.length <= 30 || headline.startsWith("{LOCATION("), `${campaign.name}/${group.name}: headline exceeds 30 characters: ${headline}`);
        requireCondition(!PHONE_PATTERN.test(headline), `${campaign.name}/${group.name}: phone number found in headline`);
        requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(headline), `${campaign.name}/${group.name}: operational detail found in headline`);
        requireCondition(!FORBIDDEN_COPY_PATTERN.test(headline), `${campaign.name}/${group.name}: forbidden copy found in headline`);
      }
      requireCondition(Boolean(group.outcomeDescription), `${campaign.name}/${group.name}: outcome description is required`);
      for (const description of descriptions) {
        requireCondition(description.length <= 90, `${campaign.name}/${group.name}: description exceeds 90 characters: ${description}`);
        requireCondition(!PHONE_PATTERN.test(description), `${campaign.name}/${group.name}: phone number found in ad description`);
        requireCondition(!OPERATIONAL_DETAIL_PATTERN.test(description), `${campaign.name}/${group.name}: operational detail found in description: ${description}`);
        requireCondition(!FORBIDDEN_COPY_PATTERN.test(description), `${campaign.name}/${group.name}: forbidden copy found in description: ${description}`);
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
      const negativeKeys = new Set<string>();
      for (const negative of group.negativeKeywords || []) {
        requireCondition(negative.matchType === "EXACT" || negative.matchType === "PHRASE", `${campaign.name}/${group.name}: broad negative ${negative.text}`);
        const key = `${negative.matchType}:${negative.text.toLowerCase()}`;
        requireCondition(!negativeKeys.has(key), `${campaign.name}/${group.name}: duplicate negative ${key}`);
        requireCondition(!keywordKeys.has(key), `${campaign.name}/${group.name}: keyword is also negative ${key}`);
        negativeKeys.add(key);
      }
      for (const keyword of group.keywords) {
        const blocked = (group.negativeKeywords || []).some((negative) =>
          negative.matchType === "EXACT"
            ? negative.text.toLowerCase() === keyword.text.toLowerCase()
            : keyword.text.toLowerCase().includes(negative.text.toLowerCase()));
        requireCondition(!blocked, `${campaign.name}/${group.name}: negative blocks keyword ${keyword.text}`);
      }
      if (group.strictServiceIntent) {
        requireCondition(group.keywords.every((keyword) => keyword.matchType === "EXACT"), `${campaign.name}/${group.name}: strict service keywords must be exact match`);
        requireCondition(group.keywords.every((keyword) => /\b(?:repair|installation|installer|replacement|plumber)\b/i.test(keyword.text)), `${campaign.name}/${group.name}: unqualified strict service keyword`);
        requireCondition((group.negativeKeywords || []).length >= 20, `${campaign.name}/${group.name}: strict service negative list is incomplete`);
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
