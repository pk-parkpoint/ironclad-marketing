import { mutate, mutateAll, query, resourceId } from "./client";
import {
  CPC_BID_CEILING_MICROS,
  PORTFOLIO_STRATEGY_NAME,
  SHARED_BUDGET_MICROS,
  SHARED_BUDGET_NAME,
  TARGET_CPA_MICROS,
} from "./launch-config";

type BudgetRow = {
  campaignBudget: { explicitlyShared: boolean; name: string; resourceName: string };
};
type StrategyRow = {
  biddingStrategy: { name: string; resourceName: string; type: string };
};
export type LaunchPortfolio = { budget: string; strategy: string };

export async function ensureLaunchPortfolio(): Promise<LaunchPortfolio> {
  const budgets = await query<BudgetRow>(`
    SELECT campaign_budget.resource_name, campaign_budget.name,
      campaign_budget.explicitly_shared
    FROM campaign_budget WHERE campaign_budget.status != 'REMOVED'
  `);
  const existingBudget = budgets.find((row) => row.campaignBudget.name === SHARED_BUDGET_NAME);
  let budget = existingBudget?.campaignBudget.resourceName;
  if (existingBudget) {
    if (!existingBudget.campaignBudget.explicitlyShared) throw new Error(`${SHARED_BUDGET_NAME} is not shareable`);
    await mutate("campaignBudgets", [{
      update: { amountMicros: SHARED_BUDGET_MICROS, resourceName: budget },
      updateMask: "amountMicros",
    }]);
  } else {
    const results = await mutate("campaignBudgets", [{ create: {
      amountMicros: SHARED_BUDGET_MICROS,
      explicitlyShared: true,
      name: SHARED_BUDGET_NAME,
    } }]);
    budget = results[0]?.resourceName as string | undefined;
  }
  if (!budget) throw new Error("shared launch budget creation failed");

  const strategies = await query<StrategyRow>(`
    SELECT bidding_strategy.resource_name, bidding_strategy.name, bidding_strategy.type
    FROM bidding_strategy WHERE bidding_strategy.status != 'REMOVED'
  `);
  const existingStrategy = strategies.find((row) => row.biddingStrategy.name === PORTFOLIO_STRATEGY_NAME);
  let strategy = existingStrategy?.biddingStrategy.resourceName;
  const maximizeConversions = {
    cpcBidCeilingMicros: CPC_BID_CEILING_MICROS,
    targetCpaMicros: TARGET_CPA_MICROS,
  };
  if (existingStrategy) {
    if (existingStrategy.biddingStrategy.type !== "MAXIMIZE_CONVERSIONS") {
      throw new Error(`${PORTFOLIO_STRATEGY_NAME} has type ${existingStrategy.biddingStrategy.type}`);
    }
    await mutate("biddingStrategies", [{
      update: { maximizeConversions, resourceName: strategy },
      updateMask: "maximizeConversions.targetCpaMicros,maximizeConversions.cpcBidCeilingMicros",
    }]);
  } else {
    const results = await mutate("biddingStrategies", [{ create: {
      maximizeConversions,
      name: PORTFOLIO_STRATEGY_NAME,
    } }]);
    strategy = results[0]?.resourceName as string | undefined;
  }
  if (!strategy) throw new Error("launch portfolio strategy creation failed");
  return { budget, strategy };
}

export async function alignLaunchPortfolio(portfolio: LaunchPortfolio, validateOnly = false) {
  await mutateAll([
    { campaignBudgetOperation: { update: {
      alignedBiddingStrategyId: resourceId(portfolio.strategy),
      resourceName: portfolio.budget,
    }, updateMask: "alignedBiddingStrategyId" } },
    { biddingStrategyOperation: { update: {
      alignedCampaignBudgetId: resourceId(portfolio.budget),
      resourceName: portfolio.strategy,
    }, updateMask: "alignedCampaignBudgetId" } },
  ], { validateOnly });
}
