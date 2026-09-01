import { desiredAd, ensureAdGroupsKeywordsAndAds } from "./ad-groups";
import { applyCustomGoal, ensureLocations, setLaunchStatuses } from "./campaigns";
import { CUSTOMER_ID, mutate, mutateAll, query } from "./client";
import { CAMPAIGNS } from "./manifest";
import { RESIDENTIAL_NEGATIVES, SHARED_NEGATIVES } from "./manifest-shared";
import { attachMaxClicksPilotAssets } from "./max-clicks-pilot-assets";
import { auditMaxClicksPilot } from "./max-clicks-pilot-audit";
import {
  MAX_CLICKS_PILOT,
  MAX_CLICKS_PILOT_NAME,
  validateMaxClicksPilot,
} from "./max-clicks-pilot";
import { ensureNegatives } from "./negatives";

type CampaignRow = {
  campaign: {
    advertisingChannelType: string;
    campaignBudget: string;
    name: string;
    resourceName: string;
    status: string;
  };
  campaignBudget: { amountMicros: string; name: string; resourceName: string };
};

const PILOT_BUDGET_NAME = `Ironclad - ${MAX_CLICKS_PILOT_NAME} - Daily Budget`;

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function campaignFields(budget: string, status = "PAUSED") {
  return {
    advertisingChannelType: "SEARCH",
    aiMaxSetting: { enableAiMax: false },
    assetAutomationSettings: [
      { assetAutomationStatus: "OPTED_OUT", assetAutomationType: "TEXT_ASSET_AUTOMATION" },
      { assetAutomationStatus: "OPTED_OUT", assetAutomationType: "FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION" },
    ],
    campaignBudget: budget,
    containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
    geoTargetTypeSetting: { positiveGeoTargetType: "PRESENCE" },
    name: MAX_CLICKS_PILOT.name,
    networkSettings: {
      targetContentNetwork: false,
      targetGoogleSearch: true,
      targetPartnerSearchNetwork: false,
      targetSearchNetwork: false,
    },
    status,
    targetSpend: { cpcBidCeilingMicros: MAX_CLICKS_PILOT.cpcCapMicros },
  };
}

const campaignUpdateMask = [
  "name,status,campaignBudget,targetSpend.cpcBidCeilingMicros",
  "networkSettings.targetGoogleSearch,networkSettings.targetSearchNetwork,networkSettings.targetContentNetwork,networkSettings.targetPartnerSearchNetwork",
  "geoTargetTypeSetting.positiveGeoTargetType,aiMaxSetting.enableAiMax,assetAutomationSettings",
].join(",");

async function campaignRows(): Promise<CampaignRow[]> {
  return query<CampaignRow>(`
    SELECT campaign.resource_name, campaign.name, campaign.status,
      campaign.advertising_channel_type, campaign.campaign_budget,
      campaign_budget.resource_name, campaign_budget.name, campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.status != 'REMOVED'
  `);
}

async function preflightCampaign(existing?: CampaignRow) {
  if (existing) {
    await mutate("campaignBudgets", [{
      update: { amountMicros: MAX_CLICKS_PILOT.budgetMicros, resourceName: existing.campaignBudget.resourceName },
      updateMask: "amountMicros",
    }], { validateOnly: true });
    await mutate("campaigns", [{
      update: { resourceName: existing.campaign.resourceName, ...campaignFields(existing.campaignBudget.resourceName) },
      updateMask: campaignUpdateMask,
    }], { validateOnly: true });
    return;
  }
  const budgets = await query<{ campaignBudget: { name: string; resourceName: string } }>(`
    SELECT campaign_budget.resource_name, campaign_budget.name FROM campaign_budget
    WHERE campaign_budget.status != 'REMOVED'
  `);
  const budget = budgets.find((row) => row.campaignBudget.name === PILOT_BUDGET_NAME)?.campaignBudget.resourceName;
  if (budget) {
    await mutate("campaigns", [{ create: campaignFields(budget) }], { validateOnly: true });
    return;
  }
  const temporaryBudget = `customers/${CUSTOMER_ID}/campaignBudgets/-1`;
  const temporaryCampaign = `customers/${CUSTOMER_ID}/campaigns/-2`;
  await mutateAll([
    { campaignBudgetOperation: { create: {
      amountMicros: MAX_CLICKS_PILOT.budgetMicros,
      explicitlyShared: false,
      name: PILOT_BUDGET_NAME,
      resourceName: temporaryBudget,
    } } },
    { campaignOperation: { create: {
      ...campaignFields(temporaryBudget),
      resourceName: temporaryCampaign,
    } } },
  ], { validateOnly: true });
}

async function preflightGroups() {
  const proxies = await query<{ adGroup: { resourceName: string } }>(`
    SELECT ad_group.resource_name FROM ad_group
    WHERE ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'
    LIMIT 1
  `);
  const adGroup = proxies[0]?.adGroup.resourceName;
  requireCondition(adGroup, "enabled proxy ad group missing for API validation");
  for (const group of MAX_CLICKS_PILOT.adGroups) {
    const criteria = [
      ...group.keywords.map((keyword) => ({ create: {
        adGroup,
        ...(keyword.finalUrl ? { finalUrls: [keyword.finalUrl] } : {}),
        keyword: { matchType: keyword.matchType, text: keyword.text },
        status: "ENABLED",
      } })),
      ...(group.negativeKeywords || []).map((keyword) => ({ create: {
        adGroup,
        keyword: { matchType: keyword.matchType, text: keyword.text },
        negative: true,
        status: "ENABLED",
      } })),
    ];
    await mutate("adGroupCriteria", criteria, { validateOnly: true });
    await mutate("adGroupAds", [{ create: {
      ad: desiredAd(MAX_CLICKS_PILOT, group),
      adGroup,
      status: "ENABLED",
    } }], { validateOnly: true });
  }
}

async function preflight() {
  validateMaxClicksPilot();
  const rows = await campaignRows();
  const matches = rows.filter((row) => row.campaign.name.toLowerCase() === MAX_CLICKS_PILOT_NAME.toLowerCase());
  requireCondition(matches.length <= 1, `duplicate pilot campaigns found=${matches.length}`);
  await preflightCampaign(matches[0]);
  await preflightGroups();
  const shared = await query<{ sharedCriterion: { resourceName: string } }>(`
    SELECT shared_criterion.resource_name FROM shared_criterion
    WHERE shared_set.name = 'IRONCLAD-Account-Block'
  `);
  requireCondition(shared.length === SHARED_NEGATIVES.length, `shared negative count=${shared.length}, expected=${SHARED_NEGATIVES.length}`);
  const perGroupCoverage = MAX_CLICKS_PILOT.adGroups.map((group) =>
    SHARED_NEGATIVES.length + RESIDENTIAL_NEGATIVES.length + MAX_CLICKS_PILOT.crossNegatives.length
      + (group.negativeKeywords || []).length);
  console.log(`Pilot validation passed: existing=${Boolean(matches[0])} budget=$20/day cpcCap=$10 exactKeywords=6 negativeCoverage=${perGroupCoverage.join("/")}`);
}

async function ensurePilotCampaign(): Promise<string> {
  const rows = await campaignRows();
  const existing = rows.find((row) => row.campaign.name.toLowerCase() === MAX_CLICKS_PILOT_NAME.toLowerCase());
  let budget = existing?.campaignBudget.resourceName;
  if (!budget) {
    const budgets = await query<{ campaignBudget: { name: string; resourceName: string } }>(`
      SELECT campaign_budget.resource_name, campaign_budget.name FROM campaign_budget
      WHERE campaign_budget.status != 'REMOVED'
    `);
    budget = budgets.find((row) => row.campaignBudget.name === PILOT_BUDGET_NAME)?.campaignBudget.resourceName;
  }
  if (budget) {
    await mutate("campaignBudgets", [{
      update: { amountMicros: MAX_CLICKS_PILOT.budgetMicros, resourceName: budget },
      updateMask: "amountMicros",
    }]);
  } else {
    const result = await mutate("campaignBudgets", [{ create: {
      amountMicros: MAX_CLICKS_PILOT.budgetMicros,
      explicitlyShared: false,
      name: PILOT_BUDGET_NAME,
    } }]);
    budget = result[0]?.resourceName as string | undefined;
  }
  requireCondition(budget, "pilot budget creation failed");
  if (existing) {
    await mutate("campaigns", [{
      update: { resourceName: existing.campaign.resourceName, ...campaignFields(budget) },
      updateMask: campaignUpdateMask,
    }]);
    return existing.campaign.resourceName;
  }
  const result = await mutate("campaigns", [{ create: campaignFields(budget) }]);
  const campaign = result[0]?.resourceName as string | undefined;
  requireCondition(campaign, "pilot campaign creation failed");
  return campaign;
}

async function customGoal(): Promise<string> {
  const rows = await query<{ customConversionGoal: { name: string; resourceName: string } }>(`
    SELECT custom_conversion_goal.resource_name, custom_conversion_goal.name
    FROM custom_conversion_goal WHERE custom_conversion_goal.status != 'REMOVED'
  `);
  const goal = rows.find((row) => row.customConversionGoal.name === "Ironclad Qualified Calls & Bookings");
  requireCondition(goal, "Ironclad custom conversion goal missing");
  return goal.customConversionGoal.resourceName;
}

async function coreSnapshot(): Promise<string> {
  const rows = await query<{
    campaign: { biddingStrategy?: string; name: string; resourceName: string; status: string };
    campaignBudget: { amountMicros: string; resourceName: string };
  }>(`
    SELECT campaign.resource_name, campaign.name, campaign.status, campaign.bidding_strategy,
      campaign_budget.resource_name, campaign_budget.amount_micros
    FROM campaign WHERE campaign.status != 'REMOVED'
  `);
  const liveNames = new Set(CAMPAIGNS.filter((campaign) => campaign.launchEnabled).map((campaign) => campaign.name));
  return JSON.stringify(rows.filter((row) => liveNames.has(row.campaign.name)).map((row) => [
    row.campaign.name, row.campaign.status, row.campaign.biddingStrategy,
    row.campaignBudget.resourceName, row.campaignBudget.amountMicros,
  ]).sort());
}

async function apply() {
  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  requireCondition(confirmation === CUSTOMER_ID, `pilot apply requires --confirm-customer=${CUSTOMER_ID}`);
  const before = await coreSnapshot();
  console.log("1/6 paused pilot campaign and budget");
  const campaign = await ensurePilotCampaign();
  const campaigns = new Map([[MAX_CLICKS_PILOT.key, campaign]]);
  console.log("2/6 locations and negative-keyword layers");
  await ensureLocations(campaigns);
  await ensureNegatives(campaigns, [MAX_CLICKS_PILOT]);
  console.log("3/6 exact keywords and responsive search ads");
  const adGroups = await ensureAdGroupsKeywordsAndAds(campaigns, [MAX_CLICKS_PILOT]);
  console.log("4/6 campaign assets and conversion measurement");
  await attachMaxClicksPilotAssets(campaign);
  await applyCustomGoal(campaigns, await customGoal());
  requireCondition(await coreSnapshot() === before, "core campaign status, budget, or bidding changed during pilot setup");
  console.log("5/6 enable pilot after complete setup");
  await setLaunchStatuses(campaigns, [MAX_CLICKS_PILOT]);
  console.log("6/6 live readback audit");
  await auditMaxClicksPilot();
  console.log(`Pilot enabled: ${MAX_CLICKS_PILOT_NAME}`);
  void adGroups;
}

async function main() {
  const mode = process.argv[2] || "plan";
  requireCondition(["plan", "apply", "audit"].includes(mode), `unknown pilot mode: ${mode}`);
  if (mode === "audit") return auditMaxClicksPilot();
  await preflight();
  if (mode === "apply") await apply();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
