import { CAMPAIGNS } from "./manifest";
import { RESIDENTIAL_NEGATIVES, SHARED_NEGATIVES, TARGET_CITIES } from "./manifest-shared";
import { query } from "./client";
import { CURRENT_BUSINESS_LOGO_PREFIX } from "./assets";
import {
  CORE_LAUNCH_KEYS,
  CPC_BID_CEILING_MICROS,
  PORTFOLIO_STRATEGY_NAME,
  SHARED_BUDGET_MICROS,
  SHARED_BUDGET_NAME,
  TARGET_CPA_MICROS,
  usesLaunchPortfolio,
} from "./launch-config";

type CampaignAuditRow = {
  campaign: {
    advertisingChannelType: string;
    aiMaxSetting?: { enableAiMax?: boolean };
    assetAutomationSettings?: Array<{ assetAutomationStatus: string; assetAutomationType: string }>;
    geoTargetTypeSetting?: { positiveGeoTargetType?: string };
    biddingStrategyType: string;
    maximizeConversions?: { targetCpaMicros?: string };
    name: string;
    networkSettings?: {
      targetContentNetwork?: boolean;
      targetGoogleSearch?: boolean;
      targetPartnerSearchNetwork?: boolean;
      targetSearchNetwork?: boolean;
    };
    resourceName: string;
    status: string;
    targetSpend?: { cpcBidCeilingMicros?: string };
    biddingStrategy?: string;
  };
  campaignBudget: {
    alignedBiddingStrategyId?: string;
    amountMicros: string;
    explicitlyShared: boolean;
    name: string;
    resourceName: string;
  };
};

type PortfolioAuditRow = {
  biddingStrategy: {
    alignedCampaignBudgetId?: string;
    campaignCount: string;
    maximizeConversions?: { cpcBidCeilingMicros?: string; targetCpaMicros?: string };
    name: string;
    resourceName: string;
    status: string;
    type: string;
  };
};

type GoalConfigRow = {
  conversionGoalCampaignConfig: { campaign: string; customConversionGoal?: string };
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`AUDIT FAILED: ${message}`);
}

export async function auditAccount(expectLaunch: boolean) {
  const rows = await query<CampaignAuditRow>(`
    SELECT campaign.resource_name, campaign.name, campaign.status,
      campaign.advertising_channel_type, campaign.target_spend.cpc_bid_ceiling_micros,
      campaign.bidding_strategy, campaign.bidding_strategy_type,
      campaign.network_settings.target_google_search,
      campaign.network_settings.target_search_network,
      campaign.network_settings.target_content_network,
      campaign.network_settings.target_partner_search_network,
      campaign.geo_target_type_setting.positive_geo_target_type,
      campaign.ai_max_setting.enable_ai_max,
      campaign.asset_automation_settings,
      campaign_budget.resource_name, campaign_budget.name, campaign_budget.amount_micros,
      campaign_budget.explicitly_shared, campaign_budget.aligned_bidding_strategy_id
    FROM campaign
    WHERE campaign.status != 'REMOVED'
  `);
  const managed = new Map<string, CampaignAuditRow>();
  for (const spec of CAMPAIGNS) {
    const row = rows.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
    assert(row, `campaign missing: ${spec.name}`);
    managed.set(spec.key, row);
    const expectedStatus = expectLaunch && spec.launchEnabled ? "ENABLED" : "PAUSED";
    assert(row.campaign.status === expectedStatus, `${spec.name} status=${row.campaign.status}, expected=${expectedStatus}`);
    if (usesLaunchPortfolio(spec.key)) {
      assert(row.campaignBudget.name === SHARED_BUDGET_NAME, `${spec.name} is not on the shared budget`);
      assert(row.campaignBudget.amountMicros === SHARED_BUDGET_MICROS, `${spec.name} shared budget mismatch`);
      assert(row.campaignBudget.explicitlyShared === true, `${spec.name} budget is not explicitly shared`);
      assert(row.campaign.biddingStrategyType === "MAXIMIZE_CONVERSIONS", `${spec.name} is not conversion bidding`);
    } else {
      assert(row.campaignBudget.amountMicros === spec.budgetMicros, `${spec.name} budget mismatch`);
      assert(row.campaign.targetSpend?.cpcBidCeilingMicros === spec.cpcCapMicros, `${spec.name} CPC cap mismatch`);
    }
    assert(row.campaign.advertisingChannelType === "SEARCH", `${spec.name} is not Search`);
    assert(row.campaign.networkSettings?.targetGoogleSearch === true, `${spec.name} Google Search disabled`);
    assert(row.campaign.networkSettings?.targetSearchNetwork === false, `${spec.name} Search Partners enabled`);
    assert(row.campaign.networkSettings?.targetContentNetwork === false, `${spec.name} Display enabled`);
    assert(row.campaign.networkSettings?.targetPartnerSearchNetwork === false, `${spec.name} partner network enabled`);
    assert(row.campaign.geoTargetTypeSetting?.positiveGeoTargetType === "PRESENCE", `${spec.name} is not presence-only`);
    assert(row.campaign.aiMaxSetting?.enableAiMax === false, `${spec.name} AI Max enabled`);
    const automation = new Map((row.campaign.assetAutomationSettings || [])
      .map((setting) => [setting.assetAutomationType, setting.assetAutomationStatus]));
    assert(automation.get("TEXT_ASSET_AUTOMATION") === "OPTED_OUT", `${spec.name} text automation not opted out`);
    assert(automation.get("FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION") === "OPTED_OUT", `${spec.name} final URL expansion not opted out`);
  }

  const strategyRows = await query<PortfolioAuditRow>(`
    SELECT bidding_strategy.resource_name, bidding_strategy.name, bidding_strategy.status,
      bidding_strategy.type, bidding_strategy.campaign_count,
      bidding_strategy.aligned_campaign_budget_id,
      bidding_strategy.maximize_conversions.target_cpa_micros,
      bidding_strategy.maximize_conversions.cpc_bid_ceiling_micros
    FROM bidding_strategy
    WHERE bidding_strategy.status != 'REMOVED'
  `);
  const portfolio = strategyRows.find((row) => row.biddingStrategy.name === PORTFOLIO_STRATEGY_NAME);
  assert(portfolio, `portfolio strategy missing: ${PORTFOLIO_STRATEGY_NAME}`);
  assert(portfolio.biddingStrategy.type === "MAXIMIZE_CONVERSIONS", "portfolio strategy type mismatch");
  assert(portfolio.biddingStrategy.maximizeConversions?.targetCpaMicros === TARGET_CPA_MICROS, "portfolio target CPA mismatch");
  assert(portfolio.biddingStrategy.maximizeConversions?.cpcBidCeilingMicros === CPC_BID_CEILING_MICROS, "portfolio CPC ceiling mismatch");
  assert(Number(portfolio.biddingStrategy.campaignCount) === CORE_LAUNCH_KEYS.length, "portfolio campaign count mismatch");
  const portfolioCampaigns = CORE_LAUNCH_KEYS.map((key) => managed.get(key)!);
  const sharedBudget = portfolioCampaigns[0].campaignBudget;
  assert(portfolioCampaigns.every((row) => row.campaignBudget.resourceName === sharedBudget.resourceName), "core campaigns do not share one budget");
  assert(portfolioCampaigns.every((row) => row.campaign.biddingStrategy === portfolio.biddingStrategy.resourceName), "core campaigns do not share one strategy");
  assert(portfolio.biddingStrategy.alignedCampaignBudgetId === sharedBudget.resourceName.split("/").pop(), "strategy is not aligned to shared budget");
  assert(sharedBudget.alignedBiddingStrategyId === portfolio.biddingStrategy.resourceName.split("/").pop(), "shared budget is not aligned to strategy");

  const ids = [...managed.values()].map((row) => row.campaign.resourceName.split("/").pop()).join(",");
  const goalRows = await query<GoalConfigRow>(`
    SELECT campaign.id, conversion_goal_campaign_config.campaign,
      conversion_goal_campaign_config.custom_conversion_goal
    FROM conversion_goal_campaign_config
    WHERE campaign.id IN (${ids})
  `);
  for (const spec of CAMPAIGNS) {
    const campaign = managed.get(spec.key)!.campaign.resourceName;
    const goal = goalRows.find((row) => row.conversionGoalCampaignConfig.campaign === campaign);
    assert(Boolean(goal?.conversionGoalCampaignConfig.customConversionGoal), `${spec.name} custom goal missing`);
  }
  const groupRows = await query<{ campaign: { name: string }; adGroup: { name: string; resourceName: string; status: string } }>(`
    SELECT campaign.id, campaign.name, ad_group.resource_name, ad_group.name, ad_group.status
    FROM ad_group
    WHERE campaign.id IN (${ids}) AND ad_group.status != 'REMOVED'
  `);
  const keywordRows = await query<{
    campaign: { name: string };
    adGroup: { name: string };
    adGroupCriterion: { keyword?: { matchType: string; text: string }; negative: boolean; status: string };
  }>(`
    SELECT campaign.id, campaign.name, ad_group.name, ad_group_criterion.status,
      ad_group_criterion.negative, ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type
    FROM keyword_view
    WHERE campaign.id IN (${ids})
      AND ad_group.status != 'REMOVED'
      AND ad_group_criterion.status != 'REMOVED'
  `);
  const adRows = await query<{
    adGroup: { resourceName: string };
    adGroupAd: {
      primaryStatus?: string;
      policySummary?: { approvalStatus?: string };
      status: string;
    };
  }>(`
    SELECT campaign.id, ad_group.resource_name, ad_group_ad.status,
      ad_group_ad.primary_status, ad_group_ad.policy_summary.approval_status
    FROM ad_group_ad
    WHERE campaign.id IN (${ids})
      AND ad_group.status != 'REMOVED'
      AND ad_group_ad.status != 'REMOVED'
  `);
  const negativeRows = await query<{
    campaign: { name: string };
    adGroup: { name: string };
    adGroupCriterion: { keyword?: { matchType: string; text: string } };
  }>(`
    SELECT campaign.id, campaign.name, ad_group.name, ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type
    FROM ad_group_criterion
    WHERE campaign.id IN (${ids})
      AND ad_group_criterion.type = 'KEYWORD'
      AND ad_group_criterion.negative = TRUE
      AND ad_group_criterion.status != 'REMOVED'
  `);
  let transitionAdGroups = 0;
  for (const spec of CAMPAIGNS) {
    const groups = groupRows.filter((row) => row.campaign.name === spec.name);
    assert(groups.length === spec.adGroups.length, `${spec.name} ad group count=${groups.length}, expected=${spec.adGroups.length}`);
    const keywords = keywordRows.filter((row) => row.campaign.name === spec.name && !row.adGroupCriterion.negative);
    const expectedKeywords = spec.adGroups.reduce((sum, group) => sum + group.keywords.length, 0);
    assert(keywords.length === expectedKeywords, `${spec.name} keyword count=${keywords.length}, expected=${expectedKeywords}`);
    assert(keywords.every((row) => ["EXACT", "PHRASE"].includes(row.adGroupCriterion.keyword?.matchType || "")), `${spec.name} has broad keywords`);
    for (const group of spec.adGroups) {
      const groupRow = groups.find((row) => row.adGroup.name === group.name);
      assert(groupRow, `${spec.name}/${group.name} ad group missing`);
      const enabledAds = adRows.filter((row) => row.adGroup.resourceName === groupRow.adGroup.resourceName
        && row.adGroupAd.status === "ENABLED");
      assert(enabledAds.length >= 1 && enabledAds.length <= 2, `${spec.name}/${group.name} enabled RSA count=${enabledAds.length}`);
      assert(enabledAds.some((row) => row.adGroupAd.policySummary?.approvalStatus === "APPROVED"), `${spec.name}/${group.name} has no approved RSA`);
      if (expectLaunch && spec.launchEnabled) {
        assert(enabledAds.some((row) => row.adGroupAd.primaryStatus === "ELIGIBLE"), `${spec.name}/${group.name} has no eligible RSA`);
      }
      if (enabledAds.length === 2) transitionAdGroups += 1;
      const actual = negativeRows
        .filter((row) => row.campaign.name === spec.name && row.adGroup.name === group.name)
        .map((row) => `${row.adGroupCriterion.keyword?.matchType}:${row.adGroupCriterion.keyword?.text.toLowerCase()}`)
        .sort();
      const expected = (group.negativeKeywords || [])
        .map((keyword) => `${keyword.matchType}:${keyword.text.toLowerCase()}`)
        .sort();
      assert(JSON.stringify(actual) === JSON.stringify(expected), `${spec.name}/${group.name} negative keyword mismatch`);
    }
  }

  const campaignLogoRows = await query<{
    asset: { name?: string };
    campaign: { name: string };
    campaignAsset: { status: string };
  }>(`
    SELECT campaign.id, campaign.name, campaign_asset.status, asset.name
    FROM campaign_asset
    WHERE campaign.id IN (${ids})
      AND campaign_asset.field_type = 'BUSINESS_LOGO'
      AND campaign_asset.status != 'REMOVED'
  `);
  assert(campaignLogoRows.length === CAMPAIGNS.length, "managed campaign business logo count mismatch");
  assert(campaignLogoRows.every((row) => row.asset.name?.startsWith(CURRENT_BUSINESS_LOGO_PREFIX)), "old campaign business logo still attached");
  const customerLogoRows = await query<{
    asset: { name?: string };
    customerAsset: { status: string };
  }>(`
    SELECT customer_asset.status, asset.name
    FROM customer_asset
    WHERE customer_asset.field_type = 'BUSINESS_LOGO'
      AND customer_asset.status != 'REMOVED'
  `);
  assert(customerLogoRows.length === 1, "account business logo count mismatch");
  assert(customerLogoRows[0].asset.name?.startsWith(CURRENT_BUSINESS_LOGO_PREFIX), "old account business logo still attached");

  const locationRows = await query<{ campaign: { name: string }; campaignCriterion: { negative: boolean; type: string } }>(`
    SELECT campaign.id, campaign.name, campaign_criterion.type, campaign_criterion.negative
    FROM campaign_criterion
    WHERE campaign.id IN (${ids})
      AND campaign_criterion.type IN ('LOCATION', 'PROXIMITY')
  `);
  for (const spec of CAMPAIGNS) {
    const count = locationRows.filter((row) => row.campaign.name === spec.name && !row.campaignCriterion.negative).length;
    assert(count === TARGET_CITIES.length, `${spec.name} location/proximity count=${count}, expected=${TARGET_CITIES.length}`);
  }

  const campaignNegativeRows = await query<{
    campaign: { name: string };
    campaignCriterion: { keyword?: { matchType: string; text: string } };
  }>(`
    SELECT campaign.id, campaign.name, campaign_criterion.keyword.text,
      campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign.id IN (${ids})
      AND campaign_criterion.type = 'KEYWORD'
      AND campaign_criterion.negative = TRUE
      AND campaign_criterion.status != 'REMOVED'
  `);
  for (const spec of CAMPAIGNS) {
    const actual = campaignNegativeRows
      .filter((row) => row.campaign.name === spec.name)
      .map((row) => `${row.campaignCriterion.keyword?.matchType}:${row.campaignCriterion.keyword?.text.toLowerCase()}`)
      .sort();
    const expected = [
      ...spec.crossNegatives.map((text) => `PHRASE:${text.toLowerCase()}`),
      ...(spec.exactCrossNegatives || []).map((text) => `EXACT:${text.toLowerCase()}`),
      ...(spec.residentialFilter ? RESIDENTIAL_NEGATIVES : []).map((text) => `PHRASE:${text.toLowerCase()}`),
    ].sort();
    assert(JSON.stringify(actual) === JSON.stringify(expected), `${spec.name} campaign negative mismatch`);
  }

  const sharedCriteria = await query<{ sharedCriterion: { keyword?: { matchType: string; text: string } } }>(`
    SELECT shared_criterion.keyword.text, shared_criterion.keyword.match_type
    FROM shared_criterion
    WHERE shared_set.name = 'IRONCLAD-Account-Block'
  `);
  assert(sharedCriteria.length === SHARED_NEGATIVES.length, `shared negative count=${sharedCriteria.length}, expected=${SHARED_NEGATIVES.length}`);
  assert(sharedCriteria.every((row) => row.sharedCriterion.keyword?.matchType === "PHRASE"), "shared negatives must be phrase match");

  console.log(`Google Ads audit passed: campaigns=${CAMPAIGNS.length} adGroups=${groupRows.length} transitionAdGroups=${transitionAdGroups} keywords=${keywordRows.filter((row) => !row.adGroupCriterion.negative).length} campaignNegatives=${campaignNegativeRows.length} adGroupNegatives=${negativeRows.length} locationsPerCampaign=${TARGET_CITIES.length} launch=${expectLaunch}`);
}
