import { CAMPAIGNS } from "./manifest";
import { RESIDENTIAL_NEGATIVES, SHARED_NEGATIVES, TARGET_CITIES } from "./manifest-shared";
import { query } from "./client";

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
  };
  campaignBudget: { amountMicros: string };
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
      campaign.bidding_strategy_type, campaign.maximize_conversions.target_cpa_micros,
      campaign.network_settings.target_google_search,
      campaign.network_settings.target_search_network,
      campaign.network_settings.target_content_network,
      campaign.network_settings.target_partner_search_network,
      campaign.geo_target_type_setting.positive_geo_target_type,
      campaign.ai_max_setting.enable_ai_max,
      campaign.asset_automation_settings,
      campaign_budget.amount_micros
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
    assert(row.campaignBudget.amountMicros === spec.budgetMicros, `${spec.name} budget mismatch`);
    if (spec.targetCpaMicros) {
      assert(row.campaign.biddingStrategyType === "MAXIMIZE_CONVERSIONS", `${spec.name} is not conversion bidding`);
      assert(row.campaign.maximizeConversions?.targetCpaMicros === spec.targetCpaMicros, `${spec.name} target CPA mismatch`);
    } else {
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

  const ids = [...managed.values()].map((row) => row.campaign.resourceName.split("/").pop()).join(",");
  const goalRows = await query<GoalConfigRow>(`
    SELECT conversion_goal_campaign_config.campaign,
      conversion_goal_campaign_config.custom_conversion_goal
    FROM conversion_goal_campaign_config
    WHERE campaign.id IN (${ids})
  `);
  for (const spec of CAMPAIGNS) {
    const campaign = managed.get(spec.key)!.campaign.resourceName;
    const goal = goalRows.find((row) => row.conversionGoalCampaignConfig.campaign === campaign);
    assert(Boolean(goal?.conversionGoalCampaignConfig.customConversionGoal), `${spec.name} custom goal missing`);
  }
  const groupRows = await query<{ campaign: { name: string }; adGroup: { name: string; status: string } }>(`
    SELECT campaign.name, ad_group.name, ad_group.status
    FROM ad_group
    WHERE campaign.id IN (${ids}) AND ad_group.status != 'REMOVED'
  `);
  const keywordRows = await query<{
    campaign: { name: string };
    adGroup: { name: string };
    adGroupCriterion: { keyword?: { matchType: string; text: string }; negative: boolean; status: string };
  }>(`
    SELECT campaign.name, ad_group.name, ad_group_criterion.status,
      ad_group_criterion.negative, ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type
    FROM keyword_view
    WHERE campaign.id IN (${ids})
      AND ad_group.status != 'REMOVED'
      AND ad_group_criterion.status != 'REMOVED'
  `);
  const adRows = await query<{ adGroup: { resourceName: string }; adGroupAd: { status: string } }>(`
    SELECT ad_group.resource_name, ad_group_ad.status
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
    SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type
    FROM ad_group_criterion
    WHERE campaign.id IN (${ids})
      AND ad_group_criterion.type = 'KEYWORD'
      AND ad_group_criterion.negative = TRUE
      AND ad_group_criterion.status != 'REMOVED'
  `);
  for (const spec of CAMPAIGNS) {
    const groups = groupRows.filter((row) => row.campaign.name === spec.name);
    assert(groups.length === spec.adGroups.length, `${spec.name} ad group count=${groups.length}, expected=${spec.adGroups.length}`);
    const keywords = keywordRows.filter((row) => row.campaign.name === spec.name && !row.adGroupCriterion.negative);
    const expectedKeywords = spec.adGroups.reduce((sum, group) => sum + group.keywords.length, 0);
    assert(keywords.length === expectedKeywords, `${spec.name} keyword count=${keywords.length}, expected=${expectedKeywords}`);
    assert(keywords.every((row) => ["EXACT", "PHRASE"].includes(row.adGroupCriterion.keyword?.matchType || "")), `${spec.name} has broad keywords`);
    for (const group of spec.adGroups) {
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
  assert(adRows.filter((row) => row.adGroupAd.status === "ENABLED").length === groupRows.length, "each ad group must have one enabled RSA");

  const locationRows = await query<{ campaign: { name: string }; campaignCriterion: { negative: boolean; type: string } }>(`
    SELECT campaign.name, campaign_criterion.type, campaign_criterion.negative
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
    SELECT campaign.name, campaign_criterion.keyword.text,
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

  console.log(`Google Ads audit passed: campaigns=${CAMPAIGNS.length} adGroups=${groupRows.length} keywords=${keywordRows.filter((row) => !row.adGroupCriterion.negative).length} campaignNegatives=${campaignNegativeRows.length} adGroupNegatives=${negativeRows.length} locationsPerCampaign=${TARGET_CITIES.length} launch=${expectLaunch}`);
}
