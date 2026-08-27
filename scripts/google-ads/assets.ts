import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { mutate, query, resourceId } from "./client";
import { ensureImageAssets, reconcileAdGroupImages } from "./image-assets";
import { CALLOUTS, SITELINKS, STRUCTURED_SNIPPET_VALUES } from "./manifest-shared";

type AssetRow = { asset: { name?: string; resourceName: string; type: string } };
let cachedAssetRows: AssetRow[] | undefined;
export const CURRENT_BUSINESS_LOGO_PREFIX = "IRONCLAD | Business Logo | Current SVG ";

async function assetRows(): Promise<AssetRow[]> {
  cachedAssetRows ||= await query<AssetRow>(`
    SELECT asset.resource_name, asset.name, asset.type
    FROM asset
  `);
  return cachedAssetRows;
}

async function ensureAsset(name: string, body: Record<string, unknown>): Promise<string> {
  const existing = (await assetRows()).find((row) => row.asset.name === name);
  if (existing) return existing.asset.resourceName;
  const results = await mutate("assets", [{ create: { name, ...body } }]);
  const resourceName = results[0]?.resourceName as string | undefined;
  if (!resourceName) throw new Error(`asset creation failed: ${name}`);
  (await assetRows()).push({ asset: { name, resourceName, type: "UNSPECIFIED" } });
  return resourceName;
}

async function currentBusinessLogo() {
  const source = readFileSync(path.join(process.cwd(), "app/icon.svg"));
  const version = createHash("sha256").update(source).digest("hex").slice(0, 12);
  const png = await sharp(source)
    .resize(1200, 1200)
    .flatten({ background: "#ffffff" })
    .png()
    .toBuffer();
  return {
    data: png.toString("base64"),
    name: `${CURRENT_BUSINESS_LOGO_PREFIX}${version}`,
  };
}

async function reconcileCustomerBusinessLogo(asset: string) {
  const rows = await query<{
    customerAsset: { asset: string; fieldType: string; resourceName: string; status: string };
  }>(`
    SELECT customer_asset.resource_name, customer_asset.asset, customer_asset.field_type,
      customer_asset.status
    FROM customer_asset
    WHERE customer_asset.field_type = 'BUSINESS_LOGO'
      AND customer_asset.status != 'REMOVED'
  `);
  const remove = rows
    .filter((row) => row.customerAsset.asset !== asset)
    .map((row) => ({ remove: row.customerAsset.resourceName }));
  if (remove.length) await mutate("customerAssets", remove);
  if (!rows.some((row) => row.customerAsset.asset === asset && row.customerAsset.status === "ENABLED")) {
    await mutate("customerAssets", [{ create: { asset, fieldType: "BUSINESS_LOGO", status: "ENABLED" } }]);
  }
}

export async function reconcileBusinessLogoAssociations(campaigns: string[], asset: string) {
  await reconcileCustomerBusinessLogo(asset);
  const ids = campaigns.map(resourceId).join(",");
  const rows = await query<{
    campaign: { resourceName: string };
    campaignAsset: { asset: string; resourceName: string; status: string };
  }>(`
    SELECT campaign.id, campaign.resource_name, campaign_asset.resource_name, campaign_asset.asset,
      campaign_asset.status
    FROM campaign_asset
    WHERE campaign.id IN (${ids})
      AND campaign_asset.field_type = 'BUSINESS_LOGO'
      AND campaign_asset.status != 'REMOVED'
  `);
  const operations: Array<Record<string, unknown>> = rows
    .filter((row) => row.campaignAsset.asset !== asset)
    .map((row) => ({ remove: row.campaignAsset.resourceName }));
  for (const campaign of campaigns) {
    if (!rows.some((row) => row.campaign.resourceName === campaign
      && row.campaignAsset.asset === asset
      && row.campaignAsset.status === "ENABLED")) {
      operations.push({ create: { asset, campaign, fieldType: "BUSINESS_LOGO", status: "ENABLED" } });
    }
  }
  if (operations.length) await mutate("campaignAssets", operations);
}

export async function ensureAssets(callsFromAds: string): Promise<Map<string, { fieldType: string; resourceName: string }>> {
  const assets = new Map<string, { fieldType: string; resourceName: string }>();
  const call = await ensureAsset("IRONCLAD | Call | 737-204-9967", {
    callAsset: {
      callConversionAction: callsFromAds,
      callConversionReportingState: "USE_RESOURCE_LEVEL_CALL_CONVERSION_ACTION",
      countryCode: "US",
      phoneNumber: "7372049967",
    },
  });
  assets.set("call", { fieldType: "CALL", resourceName: call });

  for (const sitelink of SITELINKS) {
    const resourceName = await ensureAsset(`IRONCLAD | Sitelink | ${sitelink.text}`, {
      finalUrls: [sitelink.finalUrl],
      sitelinkAsset: {
        description1: sitelink.description1,
        description2: sitelink.description2,
        linkText: sitelink.text,
      },
    });
    assets.set(`sitelink:${sitelink.text}`, { fieldType: "SITELINK", resourceName });
  }

  for (const callout of CALLOUTS) {
    const resourceName = await ensureAsset(`IRONCLAD | Callout | ${callout}`, {
      calloutAsset: { calloutText: callout },
    });
    assets.set(`callout:${callout}`, { fieldType: "CALLOUT", resourceName });
  }

  const snippet = await ensureAsset("IRONCLAD | Services Snippet", {
    structuredSnippetAsset: { header: "Services", values: [...STRUCTURED_SNIPPET_VALUES] },
  });
  assets.set("structured-snippet", { fieldType: "STRUCTURED_SNIPPET", resourceName: snippet });

  const businessName = await ensureAsset("IRONCLAD | Business Name", {
    textAsset: { text: "Ironclad Plumbing" },
  });
  assets.set("business-name", { fieldType: "BUSINESS_NAME", resourceName: businessName });

  const currentLogo = await currentBusinessLogo();
  const logo = await ensureAsset(currentLogo.name, {
    imageAsset: { data: currentLogo.data },
  });
  assets.set("business-logo", { fieldType: "BUSINESS_LOGO", resourceName: logo });

  for (const [key, asset] of await ensureImageAssets()) assets.set(key, asset);
  return assets;
}

export async function attachAssets(
  campaigns: Map<string, string>,
  adGroups: Map<string, string>,
  assets: Map<string, { fieldType: string; resourceName: string }>,
) {
  const businessLogo = assets.get("business-logo");
  if (!businessLogo) throw new Error("current business logo asset missing");
  await reconcileBusinessLogoAssociations([...campaigns.values()], businessLogo.resourceName);
  const campaignIds = [...campaigns.values()].map(resourceId).join(",");
  const rows = await query<{
    campaign: { resourceName: string };
    campaignAsset: { asset: string; fieldType: string; resourceName: string; status: string };
  }>(`
    SELECT campaign.id, campaign.resource_name, campaign_asset.resource_name,
      campaign_asset.asset, campaign_asset.field_type, campaign_asset.status
    FROM campaign_asset
    WHERE campaign.id IN (${campaignIds})
      AND campaign_asset.status != 'REMOVED'
  `);
  const desiredAssets = [...assets.values()].filter((asset) => asset.fieldType !== "AD_IMAGE");
  const managedTypes = new Set(desiredAssets.map((asset) => asset.fieldType));
  for (const campaign of campaigns.values()) {
    const current = rows.filter((row) => row.campaign.resourceName === campaign);
    const remove = current
      .filter((row) => managedTypes.has(row.campaignAsset.fieldType)
        && !desiredAssets.some((desired) => desired.fieldType === row.campaignAsset.fieldType
          && desired.resourceName === row.campaignAsset.asset))
      .map((row) => ({ remove: row.campaignAsset.resourceName }));
    if (remove.length) await mutate("campaignAssets", remove);
    const create = desiredAssets
      .filter((desired) => !current.some((row) => row.campaignAsset.asset === desired.resourceName
        && row.campaignAsset.fieldType === desired.fieldType
        && row.campaignAsset.status === "ENABLED"))
      .map((desired) => ({ create: {
        asset: desired.resourceName,
        campaign,
        fieldType: desired.fieldType,
        status: "ENABLED",
      } }));
    if (create.length) await mutate("campaignAssets", create);
  }

  const imageAssets = new Map([...assets].filter(([, asset]) => asset.fieldType === "AD_IMAGE")
    .map(([key, asset]) => [key, { fieldType: "AD_IMAGE" as const, resourceName: asset.resourceName }]));
  await reconcileAdGroupImages([...adGroups.values()], imageAssets);
}
