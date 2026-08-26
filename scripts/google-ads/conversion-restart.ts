import { CUSTOMER_ID, mutate, query, resourceId } from "./client";
import { CAMPAIGNS } from "./manifest";
import type { CampaignSpec } from "./types";
import { validateManifest } from "./validate";

const CALLS_FROM_ADS = "Calls from ads";
const GOAL_NAME = "Ironclad Qualified Calls & Bookings";

type CampaignRow = {
  campaign: {
    biddingStrategyType: string;
    id: string;
    maximizeConversions?: { targetCpaMicros?: string };
    name: string;
    resourceName: string;
    status: string;
  };
  campaignBudget: { amountMicros: string; resourceName: string };
};
type ConversionRow = {
  conversionAction: {
    countingType: string;
    name: string;
    phoneCallDurationSeconds: string;
    primaryForGoal: boolean;
    resourceName: string;
    status: string;
  };
};
type GoalRow = {
  customConversionGoal: { conversionActions: string[]; name: string; resourceName: string; status: string };
};
type GoalConfigRow = {
  campaign: { resourceName: string };
  conversionGoalCampaignConfig: { customConversionGoal?: string };
};
type CriterionRow = {
  adGroupCriterion?: { keyword: { matchType: string; text: string }; negative: boolean; resourceName: string; status: string };
  campaignCriterion?: { keyword: { matchType: string; text: string }; negative: boolean; resourceName: string; status: string };
  sharedCriterion?: { keyword: { matchType: string; text: string }; resourceName: string };
};
type Guard = { criteria: string; imageLinks: number };

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function managedRow(rows: CampaignRow[], spec: CampaignSpec): CampaignRow {
  const row = rows.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
  requireCondition(row, `managed campaign missing: ${spec.name}`);
  return row;
}

async function campaignRows(): Promise<CampaignRow[]> {
  return query<CampaignRow>(`
    SELECT campaign.id, campaign.resource_name, campaign.name, campaign.status,
      campaign.bidding_strategy_type, campaign.maximize_conversions.target_cpa_micros,
      campaign_budget.resource_name, campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.status != 'REMOVED' AND campaign.advertising_channel_type = 'SEARCH'
  `);
}

async function conversionRows(): Promise<ConversionRow[]> {
  return query<ConversionRow>(`
    SELECT conversion_action.resource_name, conversion_action.name, conversion_action.status,
      conversion_action.counting_type, conversion_action.phone_call_duration_seconds,
      conversion_action.primary_for_goal
    FROM conversion_action WHERE conversion_action.status != 'REMOVED'
  `);
}

function criterionSignature(rows: CriterionRow[]): string {
  return JSON.stringify(rows.map((row) => row.adGroupCriterion || row.campaignCriterion || row.sharedCriterion)
    .sort((left, right) => (left?.resourceName || "").localeCompare(right?.resourceName || "")));
}

async function guard(campaigns: CampaignRow[]): Promise<Guard> {
  const campaignIds = campaigns.map((row) => row.campaign.id).join(",");
  const [adGroupCriteria, campaignCriteria, sharedCriteria, imageLinks] = await Promise.all([
    query<CriterionRow>(`
      SELECT campaign.id, ad_group.id, ad_group_criterion.resource_name, ad_group_criterion.status,
        ad_group_criterion.negative, ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type
      FROM ad_group_criterion WHERE campaign.id IN (${campaignIds})
        AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED'
    `),
    query<CriterionRow>(`
      SELECT campaign.id, campaign_criterion.resource_name, campaign_criterion.status,
        campaign_criterion.negative, campaign_criterion.keyword.text,
        campaign_criterion.keyword.match_type
      FROM campaign_criterion WHERE campaign.id IN (${campaignIds})
        AND campaign_criterion.type = 'KEYWORD' AND campaign_criterion.status != 'REMOVED'
    `),
    query<CriterionRow>(`
      SELECT shared_criterion.resource_name, shared_criterion.keyword.text,
        shared_criterion.keyword.match_type
      FROM shared_criterion WHERE shared_set.name = 'IRONCLAD-Account-Block'
    `),
    query<{ campaign: { id: string }; adGroupAsset: { resourceName: string } }>(`
      SELECT campaign.id, ad_group_asset.resource_name FROM ad_group_asset
      WHERE campaign.id IN (${campaignIds}) AND ad_group_asset.field_type = 'AD_IMAGE'
        AND ad_group_asset.status != 'REMOVED'
    `),
  ]);
  return {
    criteria: [criterionSignature(adGroupCriteria), criterionSignature(campaignCriteria), criterionSignature(sharedCriteria)].join("|"),
    imageLinks: imageLinks.length,
  };
}

async function goalResources(campaigns: CampaignRow[]) {
  const conversions = await conversionRows();
  const desiredNames = ["Booking confirmed", "Calls from website (60 seconds)", CALLS_FROM_ADS];
  const desiredActions = desiredNames.map((name) => {
    const row = conversions.find((candidate) => candidate.conversionAction.name === name);
    requireCondition(row, `conversion action missing: ${name}`);
    return row.conversionAction.resourceName;
  }).sort();
  const goals = await query<GoalRow>(`
    SELECT custom_conversion_goal.resource_name, custom_conversion_goal.name,
      custom_conversion_goal.status, custom_conversion_goal.conversion_actions
    FROM custom_conversion_goal WHERE custom_conversion_goal.status != 'REMOVED'
  `);
  const goal = goals.find((row) => row.customConversionGoal.name === GOAL_NAME);
  requireCondition(goal, `custom conversion goal missing: ${GOAL_NAME}`);
  requireCondition(JSON.stringify([...goal.customConversionGoal.conversionActions].sort()) === JSON.stringify(desiredActions), "custom conversion goal actions drifted");
  const ids = campaigns.map((row) => resourceId(row.campaign.resourceName)).join(",");
  const configs = await query<GoalConfigRow>(`
    SELECT campaign.resource_name, conversion_goal_campaign_config.custom_conversion_goal
    FROM conversion_goal_campaign_config WHERE campaign.id IN (${ids})
  `);
  requireCondition(configs.length === campaigns.length, "campaign conversion goal config count mismatch");
  requireCondition(configs.every((row) => row.conversionGoalCampaignConfig.customConversionGoal === goal.customConversionGoal.resourceName), "campaign custom conversion goal drifted");
  return { calls: conversions.find((row) => row.conversionAction.name === CALLS_FROM_ADS)! };
}

function budgetOperations(rows: CampaignRow[]) {
  return CAMPAIGNS.map((spec) => ({ update: {
    amountMicros: spec.budgetMicros,
    resourceName: managedRow(rows, spec).campaignBudget.resourceName,
  }, updateMask: "amountMicros" }));
}

function campaignOperations(rows: CampaignRow[]) {
  return CAMPAIGNS.map((spec) => {
    const resourceName = managedRow(rows, spec).campaign.resourceName;
    if (!spec.launchEnabled) return { update: { resourceName, status: "PAUSED" }, updateMask: "status" };
    return {
      update: {
        maximizeConversions: { targetCpaMicros: spec.targetCpaMicros },
        resourceName,
        status: "ENABLED",
      },
      updateMask: "maximizeConversions.targetCpaMicros,status",
    };
  });
}

function callOperation(call: ConversionRow) {
  return { update: {
    countingType: "ONE_PER_CLICK",
    phoneCallDurationSeconds: "60",
    primaryForGoal: true,
    resourceName: call.conversionAction.resourceName,
    status: "ENABLED",
  }, updateMask: "countingType,phoneCallDurationSeconds,primaryForGoal,status" };
}

async function verify(before: Guard) {
  const rows = await campaignRows();
  const managed = CAMPAIGNS.map((spec) => ({ row: managedRow(rows, spec), spec }));
  const active = managed.filter(({ row }) => row.campaign.status === "ENABLED");
  requireCondition(active.length === 2, `enabled campaign count=${active.length}, expected=2`);
  requireCondition(active.every(({ spec }) => spec.launchEnabled), "unexpected campaign enabled");
  requireCondition(active.reduce((sum, { row }) => sum + Number(row.campaignBudget.amountMicros), 0) === 40_000_000, "enabled daily budget is not $40");
  for (const { row, spec } of managed) {
    requireCondition(row.campaignBudget.amountMicros === spec.budgetMicros, `budget mismatch: ${spec.name}`);
    requireCondition(row.campaign.status === (spec.launchEnabled ? "ENABLED" : "PAUSED"), `status mismatch: ${spec.name}`);
    if (spec.launchEnabled) {
      requireCondition(row.campaign.biddingStrategyType === "MAXIMIZE_CONVERSIONS", `conversion bidding missing: ${spec.name}`);
      requireCondition(row.campaign.maximizeConversions?.targetCpaMicros === spec.targetCpaMicros, `target CPA mismatch: ${spec.name}`);
    }
  }
  const { calls } = await goalResources(managed.map(({ row }) => row));
  requireCondition(calls.conversionAction.countingType === "ONE_PER_CLICK", "Calls from ads counting type mismatch");
  requireCondition(calls.conversionAction.phoneCallDurationSeconds === "60", "Calls from ads duration mismatch");
  const after = await guard(managed.map(({ row }) => row));
  requireCondition(after.criteria === before.criteria, "keyword or negative set changed during conversion restart");
  requireCondition(after.imageLinks === before.imageLinks, "image links changed during conversion restart");
  console.log(`Conversion restart verified: active=${active.map(({ spec }) => spec.name).join(" + ")} budget=$40/day targetCPA=$40 imageLinks=${after.imageLinks}`);
}

async function main() {
  validateManifest();
  const mode = process.argv[2] || "plan";
  requireCondition(mode === "plan" || mode === "apply", `unknown conversion-restart mode: ${mode}`);
  const rows = await campaignRows();
  const managed = CAMPAIGNS.map((spec) => managedRow(rows, spec));
  requireCondition(managed.every((row, index) => row.campaign.status === "PAUSED" || (CAMPAIGNS[index].launchEnabled && row.campaign.status === "ENABLED")), "unexpected managed campaign status");
  const before = await guard(managed);
  const { calls } = await goalResources(managed);
  await mutate("conversionActions", [callOperation(calls)], { validateOnly: true });
  await mutate("campaignBudgets", budgetOperations(rows), { validateOnly: true });
  await mutate("campaigns", campaignOperations(rows), { validateOnly: true });
  console.log("Conversion restart validation passed: Drain & Sewer=$20/day, Water Heater=$20/day, target CPA=$40, five campaigns paused");
  if (mode === "plan") return;
  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  requireCondition(confirmation === CUSTOMER_ID, `conversion restart requires --confirm-customer=${CUSTOMER_ID}`);
  await mutate("conversionActions", [callOperation(calls)]);
  await mutate("campaignBudgets", budgetOperations(rows));
  await mutate("campaigns", campaignOperations(rows));
  await verify(before);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
