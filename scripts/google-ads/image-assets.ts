import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { mutate, query } from "./client";

export type ManagedImageAsset = { fieldType: "AD_IMAGE"; resourceName: string };

export const MANAGED_IMAGE_SPECS = [
  ["supplied-square-crew-truck", "assets/google-ads/supplied/square/crew-truck-1200.jpg"],
  ["supplied-square-outdoor-shower", "assets/google-ads/supplied/square/outdoor-shower-1200.jpg"],
  ["supplied-square-double-vanity-1", "assets/google-ads/supplied/square/double-vanity-1-1200.jpg"],
  ["supplied-square-service-truck-home", "assets/google-ads/supplied/square/service-truck-home-1200.jpg"],
  ["supplied-square-double-vanity-2", "assets/google-ads/supplied/square/double-vanity-2-1200.jpg"],
  ["supplied-square-outdoor-gas-appliances", "assets/google-ads/supplied/square/outdoor-gas-appliances-1200.jpg"],
  ["supplied-square-water-heater-install", "assets/google-ads/supplied/square/water-heater-install-1200.jpg"],
  ["supplied-square-double-vanity-3", "assets/google-ads/supplied/square/double-vanity-3-1200.jpg"],
  ["supplied-landscape-crew-truck", "assets/google-ads/supplied/landscape/crew-truck-1200x628.jpg"],
  ["supplied-landscape-outdoor-shower", "assets/google-ads/supplied/landscape/outdoor-shower-1200x628.jpg"],
  ["supplied-landscape-double-vanity-1", "assets/google-ads/supplied/landscape/double-vanity-1-1200x628.jpg"],
  ["supplied-landscape-service-truck-home", "assets/google-ads/supplied/landscape/service-truck-home-1200x628.jpg"],
  ["supplied-landscape-double-vanity-2", "assets/google-ads/supplied/landscape/double-vanity-2-1200x628.jpg"],
  ["supplied-landscape-outdoor-gas-appliances", "assets/google-ads/supplied/landscape/outdoor-gas-appliances-1200x628.jpg"],
  ["supplied-landscape-water-heater-install", "assets/google-ads/supplied/landscape/water-heater-install-1200x628.jpg"],
  ["supplied-landscape-double-vanity-3", "assets/google-ads/supplied/landscape/double-vanity-3-1200x628.jpg"],
] as const;

type AssetRow = {
  asset: {
    name?: string;
    policySummary?: { approvalStatus?: string; reviewStatus?: string };
    resourceName: string;
  };
};
export type ImageLinkRow = {
  adGroup: { resourceName: string };
  adGroupAsset: { asset: string; fieldType: string; resourceName: string; status: string };
};

function assetName(key: string): string {
  return `IRONCLAD | Supplied Image | ${key} | 2026-08-26`;
}

function imageData(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath)).toString("base64");
}

function createOperation(key: string, relativePath: string) {
  return { create: { imageAsset: { data: imageData(relativePath) }, name: assetName(key) } };
}

export function validateManagedImageFiles() {
  for (const [key, relativePath] of MANAGED_IMAGE_SPECS) {
    const size = statSync(path.join(process.cwd(), relativePath)).size;
    if (size === 0 || size > 5 * 1024 * 1024) throw new Error(`invalid image file size: ${key}/${size}`);
  }
}

async function imageAssetRows(): Promise<AssetRow[]> {
  return query<AssetRow>(`
    SELECT asset.resource_name, asset.name, asset.policy_summary.approval_status,
      asset.policy_summary.review_status
    FROM asset
    WHERE asset.type = 'IMAGE'
  `);
}

export async function validateImageAssetUploads(): Promise<number> {
  validateManagedImageFiles();
  const rows = await imageAssetRows();
  const missing = MANAGED_IMAGE_SPECS.filter(([key]) => !rows.some((row) => row.asset.name === assetName(key)));
  if (missing.length) await mutate("assets", missing.map(([key, file]) => createOperation(key, file)), { validateOnly: true });
  return missing.length;
}

export async function ensureImageAssets(): Promise<Map<string, ManagedImageAsset>> {
  validateManagedImageFiles();
  let rows = await imageAssetRows();
  const missing = MANAGED_IMAGE_SPECS.filter(([key]) => !rows.some((row) => row.asset.name === assetName(key)));
  if (missing.length) {
    await mutate("assets", missing.map(([key, file]) => createOperation(key, file)));
    rows = await imageAssetRows();
  }
  return new Map(MANAGED_IMAGE_SPECS.map(([key]) => {
    const row = rows.find((candidate) => candidate.asset.name === assetName(key));
    if (!row) throw new Error(`image asset missing after upload: ${key}`);
    return [key, { fieldType: "AD_IMAGE", resourceName: row.asset.resourceName }];
  }));
}

export async function loadImageLinks(adGroups: string[]): Promise<ImageLinkRow[]> {
  const ids = adGroups.map((name) => name.split("/").pop()).join(",");
  return query<ImageLinkRow>(`
    SELECT ad_group.id, ad_group.resource_name, ad_group_asset.resource_name, ad_group_asset.asset,
      ad_group_asset.field_type, ad_group_asset.status
    FROM ad_group_asset
    WHERE ad_group.id IN (${ids}) AND ad_group_asset.field_type = 'AD_IMAGE'
      AND ad_group_asset.status != 'REMOVED'
  `);
}

export async function reconcileAdGroupImages(
  adGroups: string[],
  assets: Map<string, ManagedImageAsset>,
  validateOnly = false,
): Promise<{ creates: number; removes: number; updates: number }> {
  const desired = [...assets.values()];
  const rows = await loadImageLinks(adGroups);
  const operations: Array<Record<string, unknown>> = [];
  let creates = 0;
  let removes = 0;
  let updates = 0;
  for (const adGroup of adGroups) {
    const current = rows.filter((row) => row.adGroup.resourceName === adGroup);
    for (const row of current.filter((candidate) => !desired.some((asset) => asset.resourceName === candidate.adGroupAsset.asset))) {
      operations.push({ remove: row.adGroupAsset.resourceName });
      removes += 1;
    }
    for (const asset of desired) {
      const existing = current.find((row) => row.adGroupAsset.asset === asset.resourceName);
      if (!existing) {
        operations.push({ create: { adGroup, asset: asset.resourceName, fieldType: "AD_IMAGE", status: "ENABLED" } });
        creates += 1;
      } else if (existing.adGroupAsset.status !== "ENABLED") {
        operations.push({
          update: { resourceName: existing.adGroupAsset.resourceName, status: "ENABLED" },
          updateMask: "status",
        });
        updates += 1;
      }
    }
  }
  if (operations.length) await mutate("adGroupAssets", operations, { validateOnly });
  return { creates, removes, updates };
}

export async function managedImagePolicySummary() {
  const rows = await imageAssetRows();
  return MANAGED_IMAGE_SPECS.map(([key]) => {
    const row = rows.find((candidate) => candidate.asset.name === assetName(key));
    return {
      approval: row?.asset.policySummary?.approvalStatus || "UNKNOWN",
      key,
      review: row?.asset.policySummary?.reviewStatus || "UNKNOWN",
    };
  });
}
