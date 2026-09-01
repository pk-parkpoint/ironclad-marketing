import { campaignSitelinkAssetName } from "./campaign-sitelinks";
import { mutate, query, resourceId } from "./client";

const SITELINK_ASSET_NAMES = [
  "IRONCLAD | Sitelink | Book Online",
  campaignSitelinkAssetName("general-city", "Plumbing Repairs"),
  campaignSitelinkAssetName("general-city", "Austin Plumber"),
  campaignSitelinkAssetName("general-city", "Greater Austin Areas"),
  campaignSitelinkAssetName("water-heater", "Heater Replacement"),
  campaignSitelinkAssetName("water-heater", "Tankless Water Heaters"),
] as const;

type CampaignAssetRow = {
  campaign: { name: string; resourceName: string };
  campaignAsset: { asset: string; fieldType: string; resourceName: string; status: string };
};

type AssetRow = { asset: { name?: string; resourceName: string; type: string } };

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export async function attachMaxClicksPilotAssets(campaign: string) {
  const sourceRows = await query<CampaignAssetRow>(`
    SELECT campaign.id, campaign.resource_name, campaign.name, campaign_asset.resource_name,
      campaign_asset.asset, campaign_asset.field_type, campaign_asset.status
    FROM campaign_asset
    WHERE campaign_asset.status != 'REMOVED'
  `);
  const common = sourceRows.filter((row) => row.campaign.name === "General & City"
    && row.campaignAsset.status === "ENABLED"
    && row.campaignAsset.fieldType !== "SITELINK");
  const assets = await query<AssetRow>(`
    SELECT asset.resource_name, asset.name, asset.type FROM asset
  `);
  const sitelinks = SITELINK_ASSET_NAMES.map((name) => {
    const row = assets.find((candidate) => candidate.asset.name === name);
    requireCondition(row, `pilot sitelink asset missing: ${name}`);
    return { asset: row.asset.resourceName, fieldType: "SITELINK" };
  });
  const desiredByKey = new Map([
    ...common.map((row) => [`${row.campaignAsset.fieldType}:${row.campaignAsset.asset}`, {
      asset: row.campaignAsset.asset,
      fieldType: row.campaignAsset.fieldType,
    }] as const),
    ...sitelinks.map((asset) => [`${asset.fieldType}:${asset.asset}`, asset] as const),
  ]);
  for (const type of ["CALL", "CALLOUT", "STRUCTURED_SNIPPET", "BUSINESS_NAME", "BUSINESS_LOGO", "SITELINK"]) {
    requireCondition([...desiredByKey.values()].some((asset) => asset.fieldType === type), `pilot ${type} asset missing`);
  }

  const current = sourceRows.filter((row) => row.campaign.resourceName === campaign);
  const managedTypes = new Set([...desiredByKey.values()].map((asset) => asset.fieldType));
  const operations: Array<Record<string, unknown>> = current
    .filter((row) => managedTypes.has(row.campaignAsset.fieldType)
      && !desiredByKey.has(`${row.campaignAsset.fieldType}:${row.campaignAsset.asset}`))
    .map((row) => ({ remove: row.campaignAsset.resourceName }));
  for (const desired of desiredByKey.values()) {
    if (!current.some((row) => row.campaignAsset.asset === desired.asset
      && row.campaignAsset.fieldType === desired.fieldType
      && row.campaignAsset.status === "ENABLED")) {
      operations.push({ create: { campaign, ...desired, status: "ENABLED" } });
    }
  }
  if (operations.length) await mutate("campaignAssets", operations);

  const readback = await query<CampaignAssetRow>(`
    SELECT campaign.id, campaign.resource_name, campaign.name, campaign_asset.resource_name,
      campaign_asset.asset, campaign_asset.field_type, campaign_asset.status
    FROM campaign_asset
    WHERE campaign.id = ${resourceId(campaign)}
      AND campaign_asset.status != 'REMOVED'
  `);
  const enabled = new Set(readback.filter((row) => row.campaignAsset.status === "ENABLED")
    .map((row) => `${row.campaignAsset.fieldType}:${row.campaignAsset.asset}`));
  requireCondition([...desiredByKey].every(([key]) => enabled.has(key)), "pilot campaign asset readback mismatch");
  return { links: desiredByKey.size, sitelinks: sitelinks.length };
}
