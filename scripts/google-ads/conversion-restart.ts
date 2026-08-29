import { ensureAssets, reconcileBusinessLogoAssociations } from "./assets";
import { auditAccount } from "./audit";
import { CUSTOMER_ID, mutate, mutateAll, query, resourceId } from "./client";
import {
  CORE_LAUNCH_KEYS,
  CPC_BID_CEILING_MICROS,
  PORTFOLIO_STRATEGY_NAME,
  SHARED_BUDGET_MICROS,
  SHARED_BUDGET_NAME,
  TARGET_CPA_MICROS,
  usesLaunchPortfolio,
} from "./launch-config";
import { ensureLaunchPortfolio, type LaunchPortfolio } from "./launch-portfolio";
import { CAMPAIGNS } from "./manifest";
import { ensureNegatives } from "./negatives";
import type { CampaignSpec } from "./types";
import { validateManifest } from "./validate";

const CALLS_FROM_ADS = "Calls from ads";
const GOAL_NAME = "Ironclad Qualified Calls & Bookings";

type CampaignRow = {
  campaign: {
    biddingStrategy?: string;
    biddingStrategyType: string;
    id: string;
    name: string;
    resourceName: string;
    status: string;
  };
  campaignBudget: {
    amountMicros: string;
    explicitlyShared: boolean;
    name: string;
    resourceName: string;
  };
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
type GoalRow = { customConversionGoal: { conversionActions: string[]; name: string; resourceName: string; status: string } };
type GoalConfigRow = { campaign: { resourceName: string }; conversionGoalCampaignConfig: { customConversionGoal?: string } };
type KeywordRow = { adGroupCriterion: { keyword: { matchType: string; text: string }; resourceName: string; status: string } };
type Guard = { imageLinks: number; positiveKeywords: string };

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
      campaign.bidding_strategy, campaign.bidding_strategy_type,
      campaign_budget.resource_name, campaign_budget.name, campaign_budget.amount_micros,
      campaign_budget.explicitly_shared
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

async function guard(campaigns: CampaignRow[]): Promise<Guard> {
  const campaignIds = campaigns.map((row) => row.campaign.id).join(",");
  const [keywords, imageLinks] = await Promise.all([
    query<KeywordRow>(`
      SELECT campaign.id, ad_group_criterion.resource_name, ad_group_criterion.status,
        ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
      FROM ad_group_criterion WHERE campaign.id IN (${campaignIds})
        AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE
        AND ad_group_criterion.status != 'REMOVED'
    `),
    query<{ adGroupAsset: { resourceName: string } }>(`
      SELECT campaign.id, ad_group_asset.resource_name FROM ad_group_asset
      WHERE campaign.id IN (${campaignIds}) AND ad_group_asset.field_type = 'AD_IMAGE'
        AND ad_group_asset.status != 'REMOVED'
    `),
  ]);
  return {
    imageLinks: imageLinks.length,
    positiveKeywords: JSON.stringify(keywords.map((row) => row.adGroupCriterion)
      .sort((left, right) => left.resourceName.localeCompare(right.resourceName))),
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
    SELECT campaign.id, campaign.resource_name, conversion_goal_campaign_config.custom_conversion_goal
    FROM conversion_goal_campaign_config WHERE campaign.id IN (${ids})
  `);
  requireCondition(configs.length === campaigns.length, "campaign conversion goal config count mismatch");
  requireCondition(configs.every((row) => row.conversionGoalCampaignConfig.customConversionGoal === goal.customConversionGoal.resourceName), "campaign custom conversion goal drifted");
  return { calls: conversions.find((row) => row.conversionAction.name === CALLS_FROM_ADS)! };
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

function portfolioOperations(rows: CampaignRow[], portfolio: LaunchPortfolio): Array<Record<string, unknown>> {
  const operations: Array<Record<string, unknown>> = CAMPAIGNS.map((spec) => {
    const resourceName = managedRow(rows, spec).campaign.resourceName;
    if (!usesLaunchPortfolio(spec.key)) {
      return { campaignOperation: { update: { resourceName, status: "PAUSED" }, updateMask: "status" } };
    }
    return { campaignOperation: { update: {
      biddingStrategy: portfolio.strategy,
      campaignBudget: portfolio.budget,
      resourceName,
      status: "ENABLED",
    }, updateMask: "biddingStrategy,campaignBudget,status" } };
  });
  operations.push(
    { campaignBudgetOperation: { update: {
      alignedBiddingStrategyId: resourceId(portfolio.strategy),
      resourceName: portfolio.budget,
    }, updateMask: "alignedBiddingStrategyId" } },
    { biddingStrategyOperation: { update: {
      alignedCampaignBudgetId: resourceId(portfolio.budget),
      resourceName: portfolio.strategy,
    }, updateMask: "alignedCampaignBudgetId" } },
  );
  return operations;
}

async function verify(before: Guard) {
  const rows = await campaignRows();
  const managed = CAMPAIGNS.map((spec) => ({ row: managedRow(rows, spec), spec }));
  const active = managed.filter(({ row }) => row.campaign.status === "ENABLED");
  requireCondition(active.length === CORE_LAUNCH_KEYS.length, `enabled campaign count=${active.length}`);
  requireCondition(active.every(({ spec }) => usesLaunchPortfolio(spec.key)), "unexpected campaign enabled");
  const first = active[0].row;
  requireCondition(first.campaignBudget.name === SHARED_BUDGET_NAME, "shared budget name mismatch");
  requireCondition(first.campaignBudget.amountMicros === SHARED_BUDGET_MICROS, "shared daily budget is not $60");
  requireCondition(first.campaignBudget.explicitlyShared, "launch budget is not shareable");
  requireCondition(active.every(({ row }) => row.campaignBudget.resourceName === first.campaignBudget.resourceName), "active campaigns do not share one budget");
  requireCondition(active.every(({ row }) => row.campaign.biddingStrategy === first.campaign.biddingStrategy), "active campaigns do not share one strategy");
  requireCondition(active.every(({ row }) => row.campaign.biddingStrategyType === "MAXIMIZE_CONVERSIONS"), "active campaign is not on Maximize Conversions");
  const strategies = await query<{ biddingStrategy: {
    maximizeConversions?: { cpcBidCeilingMicros?: string; targetCpaMicros?: string };
    name: string;
  } }>(`
    SELECT bidding_strategy.name, bidding_strategy.maximize_conversions.target_cpa_micros,
      bidding_strategy.maximize_conversions.cpc_bid_ceiling_micros
    FROM bidding_strategy WHERE bidding_strategy.status != 'REMOVED'
  `);
  const strategy = strategies.find((row) => row.biddingStrategy.name === PORTFOLIO_STRATEGY_NAME);
  requireCondition(strategy?.biddingStrategy.maximizeConversions?.targetCpaMicros === TARGET_CPA_MICROS, "target CPA mismatch");
  requireCondition(strategy.biddingStrategy.maximizeConversions?.cpcBidCeilingMicros === CPC_BID_CEILING_MICROS, "CPC ceiling mismatch");
  const { calls } = await goalResources(managed.map(({ row }) => row));
  requireCondition(calls.conversionAction.countingType === "ONE_PER_CLICK", "Calls from ads counting type mismatch");
  requireCondition(calls.conversionAction.phoneCallDurationSeconds === "60", "Calls from ads duration mismatch");
  const after = await guard(managed.map(({ row }) => row));
  requireCondition(after.positiveKeywords === before.positiveKeywords, "positive keyword set changed during launch");
  requireCondition(after.imageLinks === before.imageLinks, "image links changed during launch");
  await auditAccount(true);
  console.log(`Shared-budget launch verified: campaigns=${active.length} budget=$60/day targetCPA=$50 cpcCeiling=$25 imageLinks=${after.imageLinks}`);
}

async function main() {
  validateManifest();
  const mode = process.argv[2] || "plan";
  requireCondition(mode === "plan" || mode === "apply", `unknown conversion-restart mode: ${mode}`);
  const rows = await campaignRows();
  const managed = CAMPAIGNS.map((spec) => managedRow(rows, spec));
  requireCondition(managed.every((row, index) => row.campaign.status === "PAUSED"
    || (usesLaunchPortfolio(CAMPAIGNS[index].key) && row.campaign.status === "ENABLED")), "unexpected managed campaign status");
  const before = await guard(managed);
  const { calls } = await goalResources(managed);
  await mutate("conversionActions", [callOperation(calls)], { validateOnly: true });
  console.log("Shared-budget launch preflight passed: five core campaigns, $60/day shared, $50 target CPA, $25 CPC ceiling");
  if (mode === "plan") return;
  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  requireCondition(confirmation === CUSTOMER_ID, `conversion restart requires --confirm-customer=${CUSTOMER_ID}`);
  const campaignMap = new Map(CAMPAIGNS.map((spec) => [spec.key, managedRow(rows, spec).campaign.resourceName]));
  await ensureNegatives(campaignMap, CAMPAIGNS);
  const portfolio = await ensureLaunchPortfolio();
  const assets = await ensureAssets(calls.conversionAction.resourceName);
  const logo = assets.get("business-logo");
  requireCondition(logo, "current business logo asset missing");
  await reconcileBusinessLogoAssociations([...campaignMap.values()], logo.resourceName);
  const operations = portfolioOperations(rows, portfolio);
  await mutateAll(operations, { validateOnly: true });
  await mutate("conversionActions", [callOperation(calls)]);
  await mutateAll(operations);
  await verify(before);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
