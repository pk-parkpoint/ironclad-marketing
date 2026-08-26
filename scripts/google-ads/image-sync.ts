import { CUSTOMER_ID, query, resourceId } from "./client";
import {
  ensureImageAssets,
  loadImageLinks,
  managedImagePolicySummary,
  MANAGED_IMAGE_SPECS,
  reconcileAdGroupImages,
  validateImageAssetUploads,
} from "./image-assets";
import { CAMPAIGNS } from "./manifest";
import { validateManifest } from "./validate";

type CampaignRow = {
  campaign: { name: string; resourceName: string; status: string };
  campaignBudget: { amountMicros: string };
};
type AdGroupRow = { adGroup: { campaign: string; name: string; resourceName: string; status: string } };
type CriterionRow = {
  adGroupCriterion?: { keyword: { matchType: string; text: string }; negative: boolean; resourceName: string; status: string };
  campaignCriterion?: { keyword: { matchType: string; text: string }; negative: boolean; resourceName: string; status: string };
  sharedCriterion?: { keyword: { matchType: string; text: string }; resourceName: string };
};
type ManagedState = { adGroups: string[]; campaignIds: string; campaigns: string[] };
type GuardSnapshot = { adGroupKeywords: string; budgets: string; campaignKeywords: string; sharedNegatives: string };

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function loadManagedState(): Promise<ManagedState> {
  const rows = await query<CampaignRow>(`
    SELECT campaign.resource_name, campaign.name, campaign.status, campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.status != 'REMOVED' AND campaign.advertising_channel_type = 'SEARCH'
  `);
  const campaigns = CAMPAIGNS.map((spec) => {
    const row = rows.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
    requireCondition(row, `managed campaign missing: ${spec.name}`);
    requireCondition(row.campaign.status === "PAUSED", `campaign must remain paused: ${spec.name}/${row.campaign.status}`);
    return row.campaign.resourceName;
  });
  const campaignIds = campaigns.map(resourceId).join(",");
  const groupRows = await query<AdGroupRow>(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.status, ad_group.campaign
    FROM ad_group WHERE campaign.id IN (${campaignIds}) AND ad_group.status != 'REMOVED'
  `);
  const adGroups = CAMPAIGNS.flatMap((campaign) => campaign.adGroups.map((group) => {
    const campaignResource = campaigns[CAMPAIGNS.indexOf(campaign)];
    const row = groupRows.find((candidate) => candidate.adGroup.campaign === campaignResource
      && candidate.adGroup.name.toLowerCase() === group.name.toLowerCase());
    requireCondition(row, `managed ad group missing: ${campaign.name}/${group.name}`);
    requireCondition(row.adGroup.status === "ENABLED", `managed ad group not enabled: ${campaign.name}/${group.name}`);
    return row.adGroup.resourceName;
  }));
  return { adGroups, campaignIds, campaigns };
}

function signature(rows: CriterionRow[]): string {
  return JSON.stringify(rows.map((row) => row.adGroupCriterion || row.campaignCriterion || row.sharedCriterion)
    .sort((left, right) => (left?.resourceName || "").localeCompare(right?.resourceName || "")));
}

async function guardSnapshot(state: ManagedState): Promise<GuardSnapshot> {
  const campaignRows = await query<CampaignRow>(`
    SELECT campaign.resource_name, campaign.name, campaign.status, campaign_budget.amount_micros
    FROM campaign WHERE campaign.id IN (${state.campaignIds})
  `);
  const adGroupIds = state.adGroups.map(resourceId).join(",");
  const [adGroupKeywords, campaignKeywords, sharedNegatives] = await Promise.all([
    query<CriterionRow>(`
      SELECT ad_group_criterion.resource_name, ad_group_criterion.status, ad_group_criterion.negative,
        ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
      FROM ad_group_criterion WHERE ad_group.id IN (${adGroupIds})
        AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED'
    `),
    query<CriterionRow>(`
      SELECT campaign_criterion.resource_name, campaign_criterion.status, campaign_criterion.negative,
        campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
      FROM campaign_criterion WHERE campaign.id IN (${state.campaignIds})
        AND campaign_criterion.type = 'KEYWORD' AND campaign_criterion.status != 'REMOVED'
    `),
    query<CriterionRow>(`
      SELECT shared_criterion.resource_name, shared_criterion.keyword.text,
        shared_criterion.keyword.match_type
      FROM shared_criterion WHERE shared_set.name = 'IRONCLAD-Account-Block'
    `),
  ]);
  return {
    adGroupKeywords: signature(adGroupKeywords),
    budgets: JSON.stringify(campaignRows.map((row) => [
      row.campaign.resourceName, row.campaign.status, row.campaignBudget.amountMicros,
    ]).sort()),
    campaignKeywords: signature(campaignKeywords),
    sharedNegatives: signature(sharedNegatives),
  };
}

function verifyGuards(before: GuardSnapshot, after: GuardSnapshot) {
  requireCondition(after.budgets === before.budgets, "campaign status or budget changed during image sync");
  requireCondition(after.adGroupKeywords === before.adGroupKeywords, "ad-group keywords changed during image sync");
  requireCondition(after.campaignKeywords === before.campaignKeywords, "campaign negatives changed during image sync");
  requireCondition(after.sharedNegatives === before.sharedNegatives, "shared negatives changed during image sync");
}

async function verifyImages(state: ManagedState) {
  const assets = await ensureImageAssets();
  const desiredResources = new Set([...assets.values()].map((asset) => asset.resourceName));
  const rows = await loadImageLinks(state.adGroups);
  const expected = state.adGroups.length * assets.size;
  requireCondition(rows.length === expected, `image-link count mismatch: ${rows.length}/${expected}`);
  for (const adGroup of state.adGroups) {
    const links = rows.filter((row) => row.adGroup.resourceName === adGroup);
    requireCondition(links.length === assets.size, `image-link count mismatch for ${adGroup}: ${links.length}/${assets.size}`);
    requireCondition(links.every((row) => desiredResources.has(row.adGroupAsset.asset)
      && row.adGroupAsset.status === "ENABLED"), `unexpected or disabled image link: ${adGroup}`);
  }
  const policy = await managedImagePolicySummary();
  const policyCounts = policy.reduce<Record<string, number>>((counts, item) => {
    const key = `${item.review}/${item.approval}`;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  console.log(`Image readback passed: assets=${assets.size} adGroups=${state.adGroups.length} links=${rows.length}`);
  console.log(`Image policy state: ${JSON.stringify(policyCounts)}`);
}

async function main() {
  validateManifest();
  const mode = process.argv[2] || "plan";
  requireCondition(mode === "plan" || mode === "apply", `unknown image-sync mode: ${mode}`);
  const state = await loadManagedState();
  const before = await guardSnapshot(state);
  const missing = await validateImageAssetUploads();
  console.log(`Image validation passed: files=${MANAGED_IMAGE_SPECS.length} missingUploads=${missing} adGroups=${state.adGroups.length} campaignsPaused=${state.campaigns.length}`);
  if (mode === "plan") return;
  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  requireCondition(confirmation === CUSTOMER_ID, `image apply requires --confirm-customer=${CUSTOMER_ID}`);
  const assets = await ensureImageAssets();
  const validated = await reconcileAdGroupImages(state.adGroups, assets, true);
  console.log(`Exact link validation passed: ${JSON.stringify(validated)}`);
  const applied = await reconcileAdGroupImages(state.adGroups, assets);
  console.log(`Image links applied: ${JSON.stringify(applied)}`);
  verifyGuards(before, await guardSnapshot(state));
  console.log("Image safety guard passed: paused campaign budgets and all keyword/negative sets unchanged");
  await verifyImages(state);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
