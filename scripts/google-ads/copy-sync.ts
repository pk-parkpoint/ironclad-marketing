import { desiredAd } from "./ad-groups";
import { CUSTOMER_ID, mutate, query, resourceId } from "./client";
import { CAMPAIGNS } from "./manifest";
import type { AdGroupSpec, CampaignSpec } from "./types";
import { validateManifest } from "./validate";

type TextAsset = { pinnedField?: string; text: string };
type CampaignRow = {
  campaign: { name: string; resourceName: string; status: string };
};
type AdGroupRow = {
  adGroup: { campaign: string; name: string; resourceName: string; status: string };
};
type AdRow = {
  adGroup: { resourceName: string };
  adGroupAd: {
    ad: {
      finalUrls?: string[];
      responsiveSearchAd?: { descriptions?: TextAsset[]; headlines?: TextAsset[] };
      type: string;
    };
    primaryStatus?: string;
    policySummary?: { approvalStatus?: string; reviewStatus?: string };
    resourceName: string;
    status: string;
  };
};
type DesiredGroup = {
  adGroup: string;
  campaign: CampaignSpec;
  group: AdGroupSpec;
};

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizeAssets(assets: TextAsset[] | undefined): TextAsset[] {
  return (assets || []).map(({ pinnedField, text }) => ({ ...(pinnedField ? { pinnedField } : {}), text }));
}

function matches(row: AdRow, desired: ReturnType<typeof desiredAd>): boolean {
  const rsa = row.adGroupAd.ad.responsiveSearchAd;
  return row.adGroupAd.ad.type === "RESPONSIVE_SEARCH_AD"
    && JSON.stringify(row.adGroupAd.ad.finalUrls || []) === JSON.stringify(desired.finalUrls)
    && JSON.stringify(normalizeAssets(rsa?.headlines)) === JSON.stringify(desired.responsiveSearchAd.headlines)
    && JSON.stringify(normalizeAssets(rsa?.descriptions)) === JSON.stringify(desired.responsiveSearchAd.descriptions);
}

function adIsReady(row: AdRow): boolean {
  return row.adGroupAd.primaryStatus === "ELIGIBLE"
    && row.adGroupAd.policySummary?.approvalStatus === "APPROVED";
}

function compareServingAds(left: AdRow, right: AdRow): number {
  const assetCounts = (row: AdRow) => {
    const rsa = row.adGroupAd.ad.responsiveSearchAd;
    const assets = [...(rsa?.headlines || []), ...(rsa?.descriptions || [])];
    return {
      headlines: rsa?.headlines?.length || 0,
      pins: assets.filter((asset) => asset.pinnedField).length,
    };
  };
  const leftCounts = assetCounts(left);
  const rightCounts = assetCounts(right);
  return leftCounts.pins - rightCounts.pins
    || rightCounts.headlines - leftCounts.headlines
    || left.adGroupAd.resourceName.localeCompare(right.adGroupAd.resourceName);
}

async function loadDesiredGroups(): Promise<DesiredGroup[]> {
  const campaignRows = await query<CampaignRow>(`
    SELECT campaign.resource_name, campaign.name, campaign.status
    FROM campaign
    WHERE campaign.status != 'REMOVED'
      AND campaign.advertising_channel_type = 'SEARCH'
  `);
  const managedCampaigns = new Map<string, string>();
  for (const spec of CAMPAIGNS) {
    const row = campaignRows.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
    requireCondition(row, `managed campaign missing: ${spec.name}`);
    const expectedStatus = spec.launchEnabled ? "ENABLED" : "PAUSED";
    requireCondition(row.campaign.status === expectedStatus, `campaign status mismatch: ${spec.name}/${row.campaign.status}/${expectedStatus}`);
    managedCampaigns.set(spec.key, row.campaign.resourceName);
  }

  const campaignIds = [...managedCampaigns.values()].map(resourceId).join(",");
  const adGroupRows = await query<AdGroupRow>(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.status, ad_group.campaign
    FROM ad_group
    WHERE campaign.id IN (${campaignIds})
      AND ad_group.status != 'REMOVED'
  `);
  return CAMPAIGNS.filter((campaign) => campaign.launchEnabled).flatMap((campaign) => campaign.adGroups.map((group) => {
    const campaignResource = managedCampaigns.get(campaign.key)!;
    const row = adGroupRows.find((candidate) => candidate.adGroup.campaign === campaignResource
      && candidate.adGroup.name.toLowerCase() === group.name.toLowerCase());
    requireCondition(row, `managed ad group missing: ${campaign.name}/${group.name}`);
    requireCondition(row.adGroup.status === "ENABLED", `managed ad group not enabled: ${campaign.name}/${group.name}`);
    return { adGroup: row.adGroup.resourceName, campaign, group };
  }));
}

async function loadAds(groups: DesiredGroup[]): Promise<AdRow[]> {
  const adGroupIds = groups.map(({ adGroup }) => resourceId(adGroup)).join(",");
  return query<AdRow>(`
    SELECT ad_group.resource_name, ad_group_ad.resource_name, ad_group_ad.status,
      ad_group_ad.primary_status, ad_group_ad.policy_summary.approval_status,
      ad_group_ad.policy_summary.review_status,
      ad_group_ad.ad.type, ad_group_ad.ad.final_urls,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_search_ad.descriptions
    FROM ad_group_ad
    WHERE ad_group.id IN (${adGroupIds})
      AND ad_group_ad.status != 'REMOVED'
  `);
}

async function validateCopy(groups: DesiredGroup[], current: AdRow[]) {
  const creates = groups.flatMap(({ adGroup, campaign, group }) => {
    const desired = desiredAd(campaign, group);
    const exists = current.some((row) => row.adGroup.resourceName === adGroup && matches(row, desired));
    return exists ? [] : [{ create: { ad: desired, adGroup, status: "ENABLED" } }];
  });
  if (creates.length) await mutate("adGroupAds", creates, { validateOnly: true });
  console.log(`Copy validation passed: liveAdGroups=${groups.length} creates=${creates.length} liveCampaigns=${CAMPAIGNS.filter((campaign) => campaign.launchEnabled).length}`);
}

async function applyCopy(groups: DesiredGroup[]) {
  let created = 0;
  let pendingReview = 0;
  let removed = 0;
  let retained = 0;
  for (const item of groups) {
    const desired = desiredAd(item.campaign, item.group);
    let rows = (await loadAds([item])).filter((row) => row.adGroup.resourceName === item.adGroup);
    let matching = rows.find((row) => matches(row, desired));
    if (!matching) {
      await mutate("adGroupAds", [{ create: { ad: desired, adGroup: item.adGroup, status: "ENABLED" } }]);
      created += 1;
      rows = (await loadAds([item])).filter((row) => row.adGroup.resourceName === item.adGroup);
      matching = rows.find((row) => matches(row, desired));
      requireCondition(matching, `created ad failed readback: ${item.campaign.name}/${item.group.name}`);
    }
    if (matching.adGroupAd.status !== "ENABLED") {
      await mutate("adGroupAds", [{
        update: { resourceName: matching.adGroupAd.resourceName, status: "ENABLED" },
        updateMask: "status",
      }]);
    }
    if (!adIsReady(matching)) {
      const servingStale = rows.filter((row) =>
        row.adGroupAd.resourceName !== matching.adGroupAd.resourceName && adIsReady(row));
      const nonServingStale = rows.filter((row) =>
        row.adGroupAd.resourceName !== matching.adGroupAd.resourceName && !adIsReady(row));
      const preferredServing = [...servingStale].sort(compareServingAds)[0];
      const disposable = preferredServing ? [
        ...servingStale.filter((row) => row.adGroupAd.resourceName !== preferredServing.adGroupAd.resourceName),
        ...nonServingStale,
      ] : [];
      if (disposable.length) {
        await mutate("adGroupAds", disposable.map((row) => ({ remove: row.adGroupAd.resourceName })));
        removed += disposable.length;
      }
      pendingReview += 1;
      retained += preferredServing ? 1 : nonServingStale.length;
      continue;
    }
    const stale = rows
      .filter((row) => row.adGroupAd.resourceName !== matching.adGroupAd.resourceName)
      .map((row) => ({ remove: row.adGroupAd.resourceName }));
    if (stale.length) {
      await mutate("adGroupAds", stale);
      removed += stale.length;
    }
  }
  const verifiedGroups = await loadDesiredGroups();
  const verifiedAds = await loadAds(verifiedGroups);
  const matchingCount = verifiedGroups.filter(({ adGroup, campaign, group }) => verifiedAds.some((row) =>
    row.adGroup.resourceName === adGroup && row.adGroupAd.status === "ENABLED" && matches(row, desiredAd(campaign, group)))).length;
  requireCondition(matchingCount === verifiedGroups.length, `live copy readback mismatch: ${matchingCount}/${verifiedGroups.length}`);
  console.log(`Copy apply passed: created=${created} removed=${removed} pendingReview=${pendingReview} retained=${retained} verified=${matchingCount}`);
}

async function main() {
  validateManifest();
  const mode = process.argv[2] || "plan";
  requireCondition(mode === "plan" || mode === "apply", `unknown copy-sync mode: ${mode}`);
  const groups = await loadDesiredGroups();
  const current = await loadAds(groups);
  await validateCopy(groups, current);
  if (mode === "plan") return;
  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  requireCondition(confirmation === CUSTOMER_ID, `copy apply requires --confirm-customer=${CUSTOMER_ID}`);
  await applyCopy(groups);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
