import { query, resourceId } from "./client";
import { RESIDENTIAL_NEGATIVES, SHARED_NEGATIVES } from "./manifest-shared";
import {
  MAX_CLICKS_PILOT,
  MAX_CLICKS_PILOT_BUDGET_MICROS,
  MAX_CLICKS_PILOT_CPC_CAP_MICROS,
  MAX_CLICKS_PILOT_NAME,
  validateMaxClicksPilot,
} from "./max-clicks-pilot";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`PILOT AUDIT FAILED: ${message}`);
}

function sorted(values: string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export async function auditMaxClicksPilot() {
  validateMaxClicksPilot();
  const campaignRows = await query<{
    campaign: {
      advertisingChannelType: string;
      aiMaxSetting?: { enableAiMax?: boolean };
      assetAutomationSettings?: Array<{ assetAutomationStatus: string; assetAutomationType: string }>;
      biddingStrategyType: string;
      geoTargetTypeSetting?: { positiveGeoTargetType?: string };
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
    campaignBudget: { amountMicros: string; explicitlyShared: boolean; resourceName: string };
  }>(`
    SELECT campaign.resource_name, campaign.name, campaign.status,
      campaign.advertising_channel_type, campaign.bidding_strategy_type,
      campaign.target_spend.cpc_bid_ceiling_micros,
      campaign.network_settings.target_google_search,
      campaign.network_settings.target_search_network,
      campaign.network_settings.target_content_network,
      campaign.network_settings.target_partner_search_network,
      campaign.geo_target_type_setting.positive_geo_target_type,
      campaign.ai_max_setting.enable_ai_max, campaign.asset_automation_settings,
      campaign_budget.resource_name, campaign_budget.amount_micros,
      campaign_budget.explicitly_shared
    FROM campaign
    WHERE campaign.status != 'REMOVED'
  `);
  const matches = campaignRows.filter((row) => row.campaign.name.toLowerCase() === MAX_CLICKS_PILOT_NAME.toLowerCase());
  assert(matches.length === 1, `campaign count=${matches.length}`);
  const row = matches[0];
  const campaign = row.campaign.resourceName;
  assert(row.campaign.status === "ENABLED", `status=${row.campaign.status}`);
  assert(row.campaign.advertisingChannelType === "SEARCH", "campaign is not Search");
  assert(row.campaignBudget.amountMicros === MAX_CLICKS_PILOT_BUDGET_MICROS, `budget=${row.campaignBudget.amountMicros}`);
  assert(row.campaignBudget.explicitlyShared === false, "budget is shared");
  assert(row.campaign.targetSpend?.cpcBidCeilingMicros === MAX_CLICKS_PILOT_CPC_CAP_MICROS, `CPC cap=${row.campaign.targetSpend?.cpcBidCeilingMicros}`);
  assert(row.campaign.networkSettings?.targetGoogleSearch === true, "Google Search disabled");
  assert(row.campaign.networkSettings?.targetSearchNetwork === false, "Search network expansion enabled");
  assert(row.campaign.networkSettings?.targetContentNetwork === false, "Display enabled");
  assert(row.campaign.networkSettings?.targetPartnerSearchNetwork === false, "Search partners enabled");
  assert(row.campaign.geoTargetTypeSetting?.positiveGeoTargetType === "PRESENCE", "location intent is not presence-only");
  assert(row.campaign.aiMaxSetting?.enableAiMax === false, "AI Max enabled");
  const automation = new Map((row.campaign.assetAutomationSettings || [])
    .map((setting) => [setting.assetAutomationType, setting.assetAutomationStatus]));
  assert(automation.get("TEXT_ASSET_AUTOMATION") === "OPTED_OUT", "text automation not opted out");
  assert(automation.get("FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION") === "OPTED_OUT", "final URL expansion not opted out");

  const id = resourceId(campaign);
  const groupRows = await query<{
    adGroup: { name: string; resourceName: string; status: string };
  }>(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.status FROM ad_group
    WHERE campaign.id = ${id} AND ad_group.status != 'REMOVED'
  `);
  assert(groupRows.length === MAX_CLICKS_PILOT.adGroups.length, `ad group count=${groupRows.length}`);
  assert(groupRows.every((group) => group.adGroup.status === "ENABLED"), "disabled pilot ad group");

  const criteria = await query<{
    adGroup: { name: string };
    adGroupCriterion: {
      keyword?: { matchType: string; text: string };
      negative: boolean;
      status: string;
    };
  }>(`
    SELECT ad_group.name, ad_group_criterion.status, ad_group_criterion.negative,
      ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
    FROM ad_group_criterion
    WHERE campaign.id = ${id} AND ad_group_criterion.type = 'KEYWORD'
      AND ad_group_criterion.status != 'REMOVED'
  `);
  for (const group of MAX_CLICKS_PILOT.adGroups) {
    const actualPositive = sorted(criteria.filter((criterion) => criterion.adGroup.name === group.name
      && !criterion.adGroupCriterion.negative)
      .map((criterion) => `${criterion.adGroupCriterion.keyword?.matchType}:${criterion.adGroupCriterion.keyword?.text.toLowerCase()}`));
    const expectedPositive = sorted(group.keywords.map((keyword) => `${keyword.matchType}:${keyword.text.toLowerCase()}`));
    assert(JSON.stringify(actualPositive) === JSON.stringify(expectedPositive), `${group.name} positive keyword mismatch`);
    const actualNegative = sorted(criteria.filter((criterion) => criterion.adGroup.name === group.name
      && criterion.adGroupCriterion.negative)
      .map((criterion) => `${criterion.adGroupCriterion.keyword?.matchType}:${criterion.adGroupCriterion.keyword?.text.toLowerCase()}`));
    const expectedNegative = sorted((group.negativeKeywords || []).map((keyword) => `${keyword.matchType}:${keyword.text.toLowerCase()}`));
    assert(JSON.stringify(actualNegative) === JSON.stringify(expectedNegative), `${group.name} negative keyword mismatch`);
  }

  const campaignCriteria = await query<{
    campaignCriterion: {
      keyword?: { matchType: string; text: string };
      location?: { geoTargetConstant?: string };
      negative: boolean;
      proximity?: Record<string, unknown>;
      type: string;
    };
  }>(`
    SELECT campaign_criterion.type, campaign_criterion.negative,
      campaign_criterion.keyword.text, campaign_criterion.keyword.match_type,
      campaign_criterion.location.geo_target_constant,
      campaign_criterion.proximity.geo_point.latitude_in_micro_degrees,
      campaign_criterion.proximity.radius
    FROM campaign_criterion
    WHERE campaign.id = ${id} AND campaign_criterion.status != 'REMOVED'
  `);
  const campaignNegatives = sorted(campaignCriteria.filter((criterion) => criterion.campaignCriterion.type === "KEYWORD"
    && criterion.campaignCriterion.negative)
    .map((criterion) => `${criterion.campaignCriterion.keyword?.matchType}:${criterion.campaignCriterion.keyword?.text.toLowerCase()}`));
  const expectedCampaignNegatives = sorted([
    ...MAX_CLICKS_PILOT.crossNegatives.map((text) => `PHRASE:${text.toLowerCase()}`),
    ...RESIDENTIAL_NEGATIVES.map((text) => `PHRASE:${text.toLowerCase()}`),
  ]);
  assert(JSON.stringify(campaignNegatives) === JSON.stringify(expectedCampaignNegatives), "campaign negative mismatch");
  assert(campaignCriteria.filter((criterion) => criterion.campaignCriterion.type === "LOCATION"
    && !criterion.campaignCriterion.negative).length === 18, "city location count mismatch");
  assert(campaignCriteria.filter((criterion) => criterion.campaignCriterion.type === "PROXIMITY"
    && !criterion.campaignCriterion.negative).length === 1, "Rollingwood proximity missing");

  const sharedLinks = await query<{ campaignSharedSet: { sharedSet: string; status: string } }>(`
    SELECT campaign_shared_set.shared_set, campaign_shared_set.status
    FROM campaign_shared_set WHERE campaign.id = ${id}
  `);
  const sharedCriteria = await query<{ sharedCriterion: { resourceName: string } }>(`
    SELECT shared_criterion.resource_name FROM shared_criterion
    WHERE shared_set.name = 'IRONCLAD-Account-Block'
  `);
  assert(sharedLinks.some((link) => link.campaignSharedSet.status === "ENABLED"), "shared negative set not attached");
  assert(sharedCriteria.length === SHARED_NEGATIVES.length, `shared negative count=${sharedCriteria.length}`);

  const ads = await query<{
    adGroup: { name: string };
    adGroupAd: { policySummary?: { approvalStatus?: string; reviewStatus?: string }; status: string };
  }>(`
    SELECT ad_group.name, ad_group_ad.status,
      ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status
    FROM ad_group_ad WHERE campaign.id = ${id} AND ad_group_ad.status != 'REMOVED'
  `);
  for (const group of MAX_CLICKS_PILOT.adGroups) {
    assert(ads.some((ad) => ad.adGroup.name === group.name && ad.adGroupAd.status === "ENABLED"), `${group.name} has no enabled RSA`);
  }
  const assetRows = await query<{ campaignAsset: { fieldType: string; status: string } }>(`
    SELECT campaign_asset.field_type, campaign_asset.status FROM campaign_asset
    WHERE campaign.id = ${id} AND campaign_asset.status != 'REMOVED'
  `);
  const enabledAssetTypes = assetRows.filter((asset) => asset.campaignAsset.status === "ENABLED")
    .map((asset) => asset.campaignAsset.fieldType);
  for (const type of ["CALL", "CALLOUT", "STRUCTURED_SNIPPET", "BUSINESS_NAME", "BUSINESS_LOGO"]) {
    assert(enabledAssetTypes.includes(type), `${type} asset missing`);
  }
  assert(enabledAssetTypes.filter((type) => type === "SITELINK").length === 6, "sitelink count mismatch");
  const goals = await query<{ conversionGoalCampaignConfig: { customConversionGoal?: string } }>(`
    SELECT conversion_goal_campaign_config.custom_conversion_goal
    FROM conversion_goal_campaign_config WHERE campaign.id = ${id}
  `);
  assert(Boolean(goals[0]?.conversionGoalCampaignConfig.customConversionGoal), "custom conversion goal missing");

  const policy = ads.reduce<Record<string, number>>((counts, ad) => {
    const key = `${ad.adGroupAd.policySummary?.reviewStatus || "UNKNOWN"}/${ad.adGroupAd.policySummary?.approvalStatus || "UNKNOWN"}`;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
  console.log(`Pilot audit passed: budget=$20/day cpcCap=$10 strategy=${row.campaign.biddingStrategyType} groups=${groupRows.length} exactKeywords=6 campaignNegatives=${campaignNegatives.length} sharedNegatives=${sharedCriteria.length} ads=${ads.length} policy=${JSON.stringify(policy)}`);
}
