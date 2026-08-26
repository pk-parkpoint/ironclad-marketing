import { CUSTOMER_ID, mutate, mutateCustomer, query, resourceId } from "./client";
import { TARGET_CITIES } from "./manifest-shared";
import type { CampaignSpec } from "./types";

type CampaignRow = {
  campaign: {
    advertisingChannelType: string;
    campaignBudget: string;
    id: string;
    name: string;
    resourceName: string;
    status: string;
  };
};

type BudgetRow = {
  campaignBudget: {
    amountMicros: string;
    name: string;
    resourceName: string;
  };
};

const campaignFields = (spec: CampaignSpec, budget: string, status = "PAUSED") => ({
  advertisingChannelType: "SEARCH",
  aiMaxSetting: { enableAiMax: false },
  assetAutomationSettings: [
    { assetAutomationStatus: "OPTED_OUT", assetAutomationType: "TEXT_ASSET_AUTOMATION" },
    { assetAutomationStatus: "OPTED_OUT", assetAutomationType: "FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION" },
  ],
  campaignBudget: budget,
  containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
  geoTargetTypeSetting: {
    positiveGeoTargetType: "PRESENCE",
  },
  name: spec.name,
  networkSettings: {
    targetContentNetwork: false,
    targetGoogleSearch: true,
    targetPartnerSearchNetwork: false,
    targetSearchNetwork: false,
  },
  status,
  ...(spec.targetCpaMicros
    ? { maximizeConversions: { targetCpaMicros: spec.targetCpaMicros } }
    : { targetSpend: { cpcBidCeilingMicros: spec.cpcCapMicros } }),
});

async function allCampaigns(): Promise<CampaignRow[]> {
  return query<CampaignRow>(`
    SELECT campaign.resource_name, campaign.id, campaign.name, campaign.status,
      campaign.advertising_channel_type, campaign.campaign_budget
    FROM campaign
    WHERE campaign.status != 'REMOVED'
  `);
}

async function allBudgets(): Promise<BudgetRow[]> {
  return query<BudgetRow>(`
    SELECT campaign_budget.resource_name, campaign_budget.name, campaign_budget.amount_micros
    FROM campaign_budget
    WHERE campaign_budget.status != 'REMOVED'
  `);
}

async function ensureBudget(spec: CampaignSpec, existingCampaign?: CampaignRow): Promise<string> {
  const desiredName = `Ironclad - ${spec.name} - Daily Budget`;
  const budgets = await allBudgets();
  const resourceName = existingCampaign?.campaign.campaignBudget
    || budgets.find((row) => row.campaignBudget.name === desiredName)?.campaignBudget.resourceName;
  if (resourceName) {
    await mutate("campaignBudgets", [{
      update: {
        amountMicros: spec.budgetMicros,
        ...(existingCampaign ? {} : { name: desiredName }),
        resourceName,
      },
      updateMask: existingCampaign ? "amountMicros" : "amountMicros,name",
    }]);
    return resourceName;
  }
  const results = await mutate("campaignBudgets", [{ create: {
    amountMicros: spec.budgetMicros,
    explicitlyShared: false,
    name: desiredName,
  } }]);
  const created = results[0]?.resourceName as string | undefined;
  if (!created) throw new Error(`budget creation failed for ${spec.name}`);
  return created;
}

export async function ensureCampaigns(specs: CampaignSpec[]): Promise<Map<string, string>> {
  const existing = await allCampaigns();
  const resources = new Map<string, string>();
  for (const spec of specs) {
    const match = existing.find((row) =>
      row.campaign.advertisingChannelType === "SEARCH"
      && row.campaign.name.toLowerCase() === spec.name.toLowerCase(),
    ) || (spec.key === "emergency"
      ? existing.find((row) => row.campaign.id === "24029332280")
      : undefined);
    const budget = await ensureBudget(spec, match);
    if (match) {
      const resourceName = match.campaign.resourceName;
      await mutate("campaigns", [{
        update: { resourceName, ...campaignFields(spec, budget) },
        updateMask: [
          "name,status,campaignBudget",
          spec.targetCpaMicros ? "maximizeConversions.targetCpaMicros" : "targetSpend.cpcBidCeilingMicros",
          "networkSettings.targetGoogleSearch,networkSettings.targetSearchNetwork,networkSettings.targetContentNetwork,networkSettings.targetPartnerSearchNetwork",
          "geoTargetTypeSetting.positiveGeoTargetType,aiMaxSetting.enableAiMax,assetAutomationSettings",
        ].join(","),
      }]);
      resources.set(spec.key, resourceName);
      continue;
    }
    const results = await mutate("campaigns", [{ create: campaignFields(spec, budget) }]);
    const resourceName = results[0]?.resourceName as string | undefined;
    if (!resourceName) throw new Error(`campaign creation failed for ${spec.name}`);
    resources.set(spec.key, resourceName);
  }
  return resources;
}

type GeoRow = {
  geoTargetConstant: {
    canonicalName: string;
    countryCode: string;
    name: string;
    resourceName: string;
    status: string;
    targetType: string;
  };
};

async function resolveGeoTargets(): Promise<Map<string, string>> {
  const targetableCities = TARGET_CITIES.filter((name) => name !== "Rollingwood");
  const names = targetableCities.map((name) => `'${name.replaceAll("'", "\\'")}'`).join(",");
  const rows = await query<GeoRow>(`
    SELECT geo_target_constant.resource_name, geo_target_constant.name,
      geo_target_constant.canonical_name, geo_target_constant.country_code,
      geo_target_constant.target_type, geo_target_constant.status
    FROM geo_target_constant
    WHERE geo_target_constant.name IN (${names})
      AND geo_target_constant.country_code = 'US'
      AND geo_target_constant.status = 'ENABLED'
  `);
  const targets = new Map<string, string>();
  for (const city of targetableCities) {
    const candidates = rows.filter((row) => row.geoTargetConstant.name === city);
    const texas = candidates.find((row) => row.geoTargetConstant.canonicalName.includes("Texas"));
    const chosen = texas || candidates[0];
    if (!chosen) throw new Error(`no Google geo target found for ${city}`);
    targets.set(city, chosen.geoTargetConstant.resourceName);
  }
  return targets;
}

type CriterionRow = {
  campaign: { resourceName: string };
  campaignCriterion: {
    location?: { geoTargetConstant?: string };
    negative: boolean;
    resourceName: string;
    type: string;
  };
};

export async function ensureLocations(campaigns: Map<string, string>) {
  const geoTargets = await resolveGeoTargets();
  const desired = new Set(geoTargets.values());
  const campaignNames = [...campaigns.values()].map((resource) => `'${resourceId(resource)}'`).join(",");
  const rows = await query<CriterionRow>(`
    SELECT campaign.resource_name, campaign_criterion.resource_name,
      campaign_criterion.type, campaign_criterion.negative,
      campaign_criterion.location.geo_target_constant
    FROM campaign_criterion
    WHERE campaign.id IN (${campaignNames})
      AND campaign_criterion.type = 'LOCATION'
  `);

  for (const campaign of campaigns.values()) {
    const current = rows.filter((row) => row.campaign.resourceName === campaign && !row.campaignCriterion.negative);
    const remove = current
      .filter((row) => !desired.has(row.campaignCriterion.location?.geoTargetConstant || ""))
      .map((row) => ({ remove: row.campaignCriterion.resourceName }));
    if (remove.length) await mutate("campaignCriteria", remove);
    const present = new Set(current.map((row) => row.campaignCriterion.location?.geoTargetConstant));
    const create = [...desired]
      .filter((resourceName) => !present.has(resourceName))
      .map((resourceName) => ({ create: { campaign, location: { geoTargetConstant: resourceName }, negative: false } }));
    if (create.length) await mutate("campaignCriteria", create);
  }

  const proximityRows = await query<{
    campaign: { resourceName: string };
    campaignCriterion: {
      proximity?: {
        geoPoint?: { latitudeInMicroDegrees?: string; longitudeInMicroDegrees?: string };
        radius?: number;
        radiusUnits?: string;
      };
      resourceName: string;
    };
  }>(`
    SELECT campaign.resource_name, campaign_criterion.resource_name,
      campaign_criterion.proximity.geo_point.latitude_in_micro_degrees,
      campaign_criterion.proximity.geo_point.longitude_in_micro_degrees,
      campaign_criterion.proximity.radius, campaign_criterion.proximity.radius_units
    FROM campaign_criterion
    WHERE campaign.id IN (${campaignNames})
      AND campaign_criterion.type = 'PROXIMITY'
  `);
  const rollingwood = {
    geoPoint: { latitudeInMicroDegrees: "30273745", longitudeInMicroDegrees: "-97786549" },
    radius: 2,
    radiusUnits: "MILES",
  };
  for (const campaign of campaigns.values()) {
    const current = proximityRows.filter((row) => row.campaign.resourceName === campaign);
    const matching = current.find((row) =>
      row.campaignCriterion.proximity?.geoPoint?.latitudeInMicroDegrees === rollingwood.geoPoint.latitudeInMicroDegrees
      && row.campaignCriterion.proximity?.geoPoint?.longitudeInMicroDegrees === rollingwood.geoPoint.longitudeInMicroDegrees
      && row.campaignCriterion.proximity?.radius === rollingwood.radius
      && row.campaignCriterion.proximity?.radiusUnits === rollingwood.radiusUnits,
    );
    const remove = current
      .filter((row) => row.campaignCriterion.resourceName !== matching?.campaignCriterion.resourceName)
      .map((row) => ({ remove: row.campaignCriterion.resourceName }));
    if (remove.length) await mutate("campaignCriteria", remove);
    if (!matching) {
      await mutate("campaignCriteria", [{ create: { campaign, negative: false, proximity: rollingwood } }]);
    }
  }
}

export async function applyCustomGoal(campaigns: Map<string, string>, customGoal: string) {
  const ids = [...campaigns.values()].map((resource) => `'${resourceId(resource)}'`).join(",");
  const rows = await query<{
    campaign: { resourceName: string };
    conversionGoalCampaignConfig: { resourceName: string };
  }>(`
    SELECT campaign.resource_name, conversion_goal_campaign_config.resource_name
    FROM conversion_goal_campaign_config
    WHERE campaign.id IN (${ids})
  `);
  const operations = rows.map((row) => ({
    update: { resourceName: row.conversionGoalCampaignConfig.resourceName, customConversionGoal: customGoal },
    updateMask: "customConversionGoal",
  }));
  if (operations.length !== campaigns.size) {
    throw new Error(`conversion goal configs found=${operations.length}, campaigns=${campaigns.size}`);
  }
  await mutate("conversionGoalCampaignConfigs", operations);
}

export async function setLaunchStatuses(campaigns: Map<string, string>, specs: CampaignSpec[]) {
  const operations = specs.map((spec) => ({
    update: {
      resourceName: campaigns.get(spec.key),
      status: spec.launchEnabled ? "ENABLED" : "PAUSED",
    },
    updateMask: "status",
  }));
  await mutate("campaigns", operations);
}

export async function enableCallReporting(callsFromAds: string) {
  await mutateCustomer({
    update: {
      callReportingSetting: {
        callConversionAction: callsFromAds,
        callConversionReportingEnabled: true,
        callReportingEnabled: true,
      },
      resourceName: `customers/${CUSTOMER_ID}`,
    },
    updateMask: "callReportingSetting.callReportingEnabled,callReportingSetting.callConversionReportingEnabled,callReportingSetting.callConversionAction",
  });
}
