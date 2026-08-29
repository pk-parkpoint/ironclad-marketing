import { auditAccount } from "./audit";
import { CUSTOMER_ID, mutate, query } from "./client";
import {
  CORE_LAUNCH_KEYS,
  CPC_BID_CEILING_MICROS,
  LEGACY_PORTFOLIO_STRATEGY_NAMES,
  PORTFOLIO_STRATEGY_NAME,
  SHARED_BUDGET_MICROS,
  TARGET_CPA_MICROS,
} from "./launch-config";
import { CAMPAIGNS } from "./manifest";
import { validateManifest } from "./validate";

type CampaignRow = {
  campaign: {
    advertisingChannelType: string;
    biddingStrategy?: string;
    biddingStrategyType: string;
    name: string;
    networkSettings?: {
      targetContentNetwork?: boolean;
      targetGoogleSearch?: boolean;
      targetPartnerSearchNetwork?: boolean;
      targetSearchNetwork?: boolean;
    };
    resourceName: string;
    status: string;
  };
  campaignBudget: {
    amountMicros: string;
    explicitlyShared: boolean;
    resourceName: string;
  };
};

type StrategyRow = {
  biddingStrategy: {
    maximizeConversions?: { cpcBidCeilingMicros?: string; targetCpaMicros?: string };
    name: string;
    resourceName: string;
    type: string;
  };
};

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function campaignRows(): Promise<CampaignRow[]> {
  return query<CampaignRow>(`
    SELECT campaign.resource_name, campaign.name, campaign.status,
      campaign.advertising_channel_type, campaign.bidding_strategy,
      campaign.bidding_strategy_type,
      campaign.network_settings.target_google_search,
      campaign.network_settings.target_search_network,
      campaign.network_settings.target_content_network,
      campaign.network_settings.target_partner_search_network,
      campaign_budget.resource_name, campaign_budget.amount_micros,
      campaign_budget.explicitly_shared
    FROM campaign
    WHERE campaign.status != 'REMOVED'
  `);
}

async function strategyRows(): Promise<StrategyRow[]> {
  return query<StrategyRow>(`
    SELECT bidding_strategy.resource_name, bidding_strategy.name,
      bidding_strategy.type,
      bidding_strategy.maximize_conversions.target_cpa_micros,
      bidding_strategy.maximize_conversions.cpc_bid_ceiling_micros
    FROM bidding_strategy
    WHERE bidding_strategy.status != 'REMOVED'
  `);
}

function managedRows(rows: CampaignRow[]): CampaignRow[] {
  return CAMPAIGNS.map((spec) => {
    const row = rows.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
    requireCondition(row, `campaign missing: ${spec.name}`);
    const expectedStatus = spec.launchEnabled ? "ENABLED" : "PAUSED";
    requireCondition(row.campaign.status === expectedStatus, `${spec.name} status=${row.campaign.status}, expected=${expectedStatus}`);
    requireCondition(row.campaign.advertisingChannelType === "SEARCH", `${spec.name} is not Search`);
    requireCondition(row.campaign.networkSettings?.targetGoogleSearch === true, `${spec.name} Google Search disabled`);
    requireCondition(row.campaign.networkSettings?.targetSearchNetwork === false, `${spec.name} Search Partners enabled`);
    requireCondition(row.campaign.networkSettings?.targetContentNetwork === false, `${spec.name} Display enabled`);
    requireCondition(row.campaign.networkSettings?.targetPartnerSearchNetwork === false, `${spec.name} partner network enabled`);
    return row;
  });
}

function stableCampaignState(rows: CampaignRow[]): string {
  return JSON.stringify(rows.map((row) => ({
    budget: row.campaignBudget,
    campaign: row.campaign,
  })).sort((left, right) => left.campaign.resourceName.localeCompare(right.campaign.resourceName)));
}

function activePortfolio(rows: CampaignRow[]) {
  const activeNames = new Set(CAMPAIGNS.filter((spec) => spec.launchEnabled).map((spec) => spec.name.toLowerCase()));
  const active = rows.filter((row) => activeNames.has(row.campaign.name.toLowerCase()));
  requireCondition(active.length === CORE_LAUNCH_KEYS.length, `enabled core campaign count=${active.length}`);
  const strategy = active[0].campaign.biddingStrategy;
  const budget = active[0].campaignBudget.resourceName;
  requireCondition(strategy, "core portfolio strategy missing");
  requireCondition(active.every((row) => row.campaign.biddingStrategy === strategy), "core campaigns do not share one strategy");
  requireCondition(active.every((row) => row.campaign.biddingStrategyType === "MAXIMIZE_CONVERSIONS"), "core campaign is not on Maximize Conversions");
  requireCondition(active.every((row) => row.campaignBudget.resourceName === budget), "core campaigns do not share one budget");
  requireCondition(active.every((row) => row.campaignBudget.amountMicros === SHARED_BUDGET_MICROS), "shared daily budget is not $60");
  requireCondition(active.every((row) => row.campaignBudget.explicitlyShared), "core budget is not explicitly shared");
  return strategy;
}

async function currentStrategy(resourceName: string): Promise<StrategyRow["biddingStrategy"]> {
  const row = (await strategyRows()).find((candidate) => candidate.biddingStrategy.resourceName === resourceName);
  requireCondition(row, "active portfolio strategy resource missing");
  const allowedNames: readonly string[] = [PORTFOLIO_STRATEGY_NAME, ...LEGACY_PORTFOLIO_STRATEGY_NAMES];
  requireCondition(allowedNames.includes(row.biddingStrategy.name), `unexpected portfolio strategy name: ${row.biddingStrategy.name}`);
  requireCondition(row.biddingStrategy.type === "MAXIMIZE_CONVERSIONS", "portfolio strategy is not Maximize Conversions");
  return row.biddingStrategy;
}

function updateOperation(resourceName: string) {
  return {
    update: {
      maximizeConversions: {
        cpcBidCeilingMicros: CPC_BID_CEILING_MICROS,
        targetCpaMicros: TARGET_CPA_MICROS,
      },
      name: PORTFOLIO_STRATEGY_NAME,
      resourceName,
    },
    updateMask: "name,maximizeConversions.targetCpaMicros,maximizeConversions.cpcBidCeilingMicros",
  };
}

async function main() {
  validateManifest();
  const mode = process.argv[2] || "plan";
  requireCondition(mode === "plan" || mode === "apply", `unknown bidding-sync mode: ${mode}`);

  const beforeRows = managedRows(await campaignRows());
  const beforeState = stableCampaignState(beforeRows);
  const strategyResource = activePortfolio(beforeRows);
  const beforeStrategy = await currentStrategy(strategyResource);
  await mutate("biddingStrategies", [updateOperation(strategyResource)], { validateOnly: true });
  console.log(`Bidding preflight passed: current=${beforeStrategy.name} desired=${PORTFOLIO_STRATEGY_NAME}`);
  if (mode === "plan") return;

  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  requireCondition(confirmation === CUSTOMER_ID, `bidding update requires --confirm-customer=${CUSTOMER_ID}`);
  await mutate("biddingStrategies", [updateOperation(strategyResource)]);

  const afterRows = managedRows(await campaignRows());
  requireCondition(stableCampaignState(afterRows) === beforeState, "campaign status, budget, strategy attachment, or network settings changed");
  const afterStrategy = await currentStrategy(strategyResource);
  requireCondition(afterStrategy.name === PORTFOLIO_STRATEGY_NAME, "portfolio strategy name mismatch");
  requireCondition(afterStrategy.maximizeConversions?.targetCpaMicros === TARGET_CPA_MICROS, "portfolio target CPA mismatch");
  requireCondition(afterStrategy.maximizeConversions?.cpcBidCeilingMicros === CPC_BID_CEILING_MICROS, "portfolio CPC ceiling mismatch");
  await auditAccount(true);
  console.log("Bidding update verified: targetCPA=$50 cpcCeiling=$25 budget=$60/day networks=Google-Search-only");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
