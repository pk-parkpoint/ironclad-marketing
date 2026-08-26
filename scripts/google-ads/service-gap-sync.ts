import { desiredAd, ensureAdGroupsKeywordsAndAds } from "./ad-groups";
import {
  GENERAL_SERVICE_ROUTING_NEGATIVES,
  SERVICE_CAMPAIGN_ROUTING_NEGATIVES,
  SERVICE_GAP_GROUP_NAMES,
} from "./campaigns-service-gaps";
import { CUSTOMER_ID, mutate, query, resourceId } from "./client";
import { CAMPAIGNS } from "./manifest";
import type { AdGroupSpec, CampaignSpec, KeywordSpec } from "./types";
import { validateManifest } from "./validate";

type CampaignRow = {
  campaign: { name: string; resourceName: string; status: string };
  campaignBudget: { amountMicros: string };
};
type GroupRow = { adGroup: { campaign: string; name: string; resourceName: string; status: string } };
type CriterionRow = {
  adGroup: { name: string; resourceName: string };
  adGroupCriterion: { keyword?: { matchType: string; text: string }; negative: boolean };
};
type CampaignNegativeRow = {
  campaign: { resourceName: string };
  campaignCriterion: { keyword: { matchType: string; text: string } };
};
type SharedNegativeRow = {
  sharedCriterion: { keyword: { matchType: string; text: string } };
};
type ImageRow = { adGroupAsset: { resourceName: string }; campaign: { id: string } };
type Snapshot = {
  budgets: Map<string, string>;
  campaignNegatives: Set<string>;
  campaigns: Map<string, string>;
  groups: GroupRow[];
  imageLinks: number;
  sharedNegatives: Set<string>;
};
function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function keywordKey(keyword: Pick<KeywordSpec, "matchType" | "text">): string {
  return `${keyword.matchType}:${keyword.text.trim().toLowerCase()}`;
}
function serviceGroups(): Array<{ campaign: CampaignSpec; group: AdGroupSpec }> {
  return CAMPAIGNS.flatMap((campaign) => campaign.adGroups
    .filter((group) => SERVICE_GAP_GROUP_NAMES.includes(group.name as typeof SERVICE_GAP_GROUP_NAMES[number]))
    .map((group) => ({ campaign, group })));
}
async function snapshot(): Promise<Snapshot> {
  const campaignRows = await query<CampaignRow>(`
    SELECT campaign.resource_name, campaign.name, campaign.status,
      campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.status != 'REMOVED'
      AND campaign.advertising_channel_type = 'SEARCH'
  `);
  const campaigns = new Map<string, string>();
  const budgets = new Map<string, string>();
  for (const spec of CAMPAIGNS) {
    const row = campaignRows.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
    requireCondition(row, `managed campaign missing: ${spec.name}`);
    requireCondition(row.campaign.status === "PAUSED", `campaign must remain paused: ${spec.name}/${row.campaign.status}`);
    campaigns.set(spec.key, row.campaign.resourceName);
    budgets.set(spec.key, row.campaignBudget.amountMicros);
  }
  const ids = [...campaigns.values()].map(resourceId).join(",");
  const groups = await query<GroupRow>(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.status, ad_group.campaign
    FROM ad_group WHERE campaign.id IN (${ids}) AND ad_group.status != 'REMOVED'
  `);
  const campaignNegativeRows = await query<CampaignNegativeRow>(`
    SELECT campaign.resource_name, campaign_criterion.keyword.text,
      campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign.id IN (${ids}) AND campaign_criterion.type = 'KEYWORD'
      AND campaign_criterion.negative = TRUE AND campaign_criterion.status != 'REMOVED'
  `);
  const sharedRows = await query<SharedNegativeRow>(`
    SELECT shared_criterion.keyword.text, shared_criterion.keyword.match_type
    FROM shared_criterion WHERE shared_set.name = 'IRONCLAD-Account-Block'
  `);
  const imageRows = await query<ImageRow>(`
    SELECT campaign.id, ad_group_asset.resource_name FROM ad_group_asset
    WHERE campaign.id IN (${ids}) AND ad_group_asset.field_type = 'AD_IMAGE'
      AND ad_group_asset.status != 'REMOVED'
  `);
  return {
    budgets,
    campaignNegatives: new Set(campaignNegativeRows.map((row) =>
      `${row.campaign.resourceName}:${keywordKey(row.campaignCriterion.keyword)}`)),
    campaigns,
    groups,
    imageLinks: imageRows.length,
    sharedNegatives: new Set(sharedRows.map((row) => keywordKey(row.sharedCriterion.keyword))),
  };
}
async function preflight(state: Snapshot) {
  const services = serviceGroups();
  requireCondition(services.length === 2, `service group count=${services.length}, expected=2`);
  const general = state.campaigns.get("general-city")!;
  const proxy = state.groups.find((row) => row.adGroup.campaign === general);
  requireCondition(proxy, "General & City proxy ad group missing");
  const missing = services.filter(({ group }) => !state.groups.some((row) =>
    row.adGroup.campaign === general && row.adGroup.name.toLowerCase() === group.name.toLowerCase()));
  if (missing.length) await mutate("adGroups", missing.map(({ group }) => ({ create: {
    campaign: general, name: group.name, status: "ENABLED", type: "SEARCH_STANDARD",
  } })), { validateOnly: true });
  const criteria = services.flatMap(({ group }) => [
    ...group.keywords.map((keyword) => ({ create: {
      adGroup: proxy.adGroup.resourceName,
      keyword: { matchType: keyword.matchType, text: keyword.text }, status: "ENABLED",
    } })),
    ...(group.negativeKeywords || []).map((keyword) => ({ create: {
      adGroup: proxy.adGroup.resourceName,
      keyword: { matchType: keyword.matchType, text: keyword.text }, negative: true, status: "ENABLED",
    } })),
  ]);
  criteria.push(...GENERAL_SERVICE_ROUTING_NEGATIVES.map((keyword) => ({ create: {
    adGroup: proxy.adGroup.resourceName,
    keyword: { matchType: keyword.matchType, text: keyword.text }, negative: true, status: "ENABLED",
  } })));
  await mutate("adGroupCriteria", criteria, { validateOnly: true });
  await mutate("adGroupAds", services.map(({ campaign, group }) => ({ create: {
    ad: desiredAd(campaign, group), adGroup: proxy.adGroup.resourceName, status: "ENABLED",
  } })), { validateOnly: true });
  console.log(`Service validation passed: groups=${services.length} missing=${missing.length} keywords=${services.reduce((sum, item) => sum + item.group.keywords.length, 0)} negatives=${services.reduce((sum, item) => sum + (item.group.negativeKeywords || []).length, 0)}`);
}
async function addRoutingCampaignNegatives(state: Snapshot) {
  const operations: Array<Record<string, unknown>> = [];
  for (const [campaignKey, negatives] of Object.entries(SERVICE_CAMPAIGN_ROUTING_NEGATIVES)) {
    const campaign = state.campaigns.get(campaignKey)!;
    for (const text of negatives) {
      const key = `${campaign}:PHRASE:${text}`;
      if (!state.campaignNegatives.has(key)) operations.push({ create: {
        campaign, keyword: { matchType: "PHRASE", text }, negative: true,
      } });
    }
  }
  if (operations.length) {
    await mutate("campaignCriteria", operations, { validateOnly: true });
    await mutate("campaignCriteria", operations);
  }
  console.log(`Routing negatives added=${operations.length}`);
}

async function verify(before: Snapshot) {
  const after = await snapshot();
  requireCondition(JSON.stringify([...after.budgets]) === JSON.stringify([...before.budgets]), "budget changed during service sync");
  requireCondition(after.imageLinks === before.imageLinks, "image links changed during service sync");
  requireCondition(JSON.stringify([...after.sharedNegatives].sort()) === JSON.stringify([...before.sharedNegatives].sort()), "shared negatives changed during service sync");
  for (const key of before.campaignNegatives) requireCondition(after.campaignNegatives.has(key), `existing campaign negative removed: ${key}`);
  for (const [campaignKey, negatives] of Object.entries(SERVICE_CAMPAIGN_ROUTING_NEGATIVES)) {
    const campaign = after.campaigns.get(campaignKey)!;
    for (const text of negatives) requireCondition(after.campaignNegatives.has(`${campaign}:PHRASE:${text}`), `routing negative missing: ${campaignKey}/${text}`);
  }
  const general = after.campaigns.get("general-city")!;
  const generalGroups = CAMPAIGNS.find((campaign) => campaign.key === "general-city")!.adGroups;
  const resources = new Map(generalGroups.map((group) => {
    const row = after.groups.find((candidate) => candidate.adGroup.campaign === general
      && candidate.adGroup.name.toLowerCase() === group.name.toLowerCase());
    requireCondition(row, `ad group missing after apply: ${group.name}`);
    return [row.adGroup.resourceName, group];
  }));
  const ids = [...resources.keys()].map(resourceId).join(",");
  const rows = await query<CriterionRow>(`
    SELECT ad_group.resource_name, ad_group.name, ad_group_criterion.negative,
      ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
    FROM ad_group_criterion WHERE ad_group.id IN (${ids})
      AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED'
  `);
  for (const [resource, group] of resources) {
    const actualPositive = rows.filter((row) => row.adGroup.resourceName === resource && !row.adGroupCriterion.negative)
      .map((row) => keywordKey(row.adGroupCriterion.keyword!)).sort();
    const actualNegative = rows.filter((row) => row.adGroup.resourceName === resource && row.adGroupCriterion.negative)
      .map((row) => keywordKey(row.adGroupCriterion.keyword!)).sort();
    requireCondition(JSON.stringify(actualPositive) === JSON.stringify(group.keywords.map(keywordKey).sort()), `positive keyword mismatch: ${group.name}`);
    requireCondition(JSON.stringify(actualNegative) === JSON.stringify((group.negativeKeywords || []).map(keywordKey).sort()), `negative keyword mismatch: ${group.name}`);
  }
  console.log(`Service readback passed: generalGroups=${resources.size} imageLinks=${after.imageLinks} sharedNegatives=${after.sharedNegatives.size} campaignsPaused=${CAMPAIGNS.length}`);
}

async function main() {
  validateManifest();
  const mode = process.argv[2] || "plan";
  requireCondition(mode === "plan" || mode === "apply", `unknown service-sync mode: ${mode}`);
  const before = await snapshot();
  await preflight(before);
  if (mode === "plan") return;
  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  requireCondition(confirmation === CUSTOMER_ID, `service apply requires --confirm-customer=${CUSTOMER_ID}`);
  await ensureAdGroupsKeywordsAndAds(before.campaigns, CAMPAIGNS);
  await addRoutingCampaignNegatives(before);
  await verify(before);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
