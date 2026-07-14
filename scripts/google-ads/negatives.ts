import { mutate, query, resourceId } from "./client";
import { RESIDENTIAL_NEGATIVES, SHARED_NEGATIVES } from "./manifest-shared";
import type { CampaignSpec } from "./types";

const SHARED_SET_NAME = "IRONCLAD-Account-Block";

async function ensureSharedSet(): Promise<string> {
  const rows = await query<{ sharedSet: { name: string; resourceName: string; type: string } }>(`
    SELECT shared_set.resource_name, shared_set.name, shared_set.type
    FROM shared_set
    WHERE shared_set.status != 'REMOVED'
  `);
  const existing = rows.find((row) => row.sharedSet.name === SHARED_SET_NAME && row.sharedSet.type === "NEGATIVE_KEYWORDS");
  if (existing) return existing.sharedSet.resourceName;
  const results = await mutate("sharedSets", [{ create: { name: SHARED_SET_NAME, type: "NEGATIVE_KEYWORDS" } }]);
  const resourceName = results[0]?.resourceName as string | undefined;
  if (!resourceName) throw new Error("shared negative set creation failed");
  return resourceName;
}

async function reconcileSharedCriteria(sharedSet: string) {
  const rows = await query<{
    sharedCriterion: { keyword?: { matchType: string; text: string }; resourceName: string };
  }>(`
    SELECT shared_criterion.resource_name, shared_criterion.keyword.text,
      shared_criterion.keyword.match_type
    FROM shared_criterion
    WHERE shared_set.id = ${resourceId(sharedSet)}
  `);
  const desired = new Set(SHARED_NEGATIVES.map((text) => text.toLowerCase()));
  const remove = rows
    .filter((row) => !row.sharedCriterion.keyword
      || row.sharedCriterion.keyword.matchType !== "PHRASE"
      || !desired.has(row.sharedCriterion.keyword.text.toLowerCase()))
    .map((row) => ({ remove: row.sharedCriterion.resourceName }));
  if (remove.length) await mutate("sharedCriteria", remove);
  const present = new Set(rows
    .filter((row) => row.sharedCriterion.keyword?.matchType === "PHRASE")
    .map((row) => row.sharedCriterion.keyword!.text.toLowerCase()));
  const create = SHARED_NEGATIVES
    .filter((text) => !present.has(text.toLowerCase()))
    .map((text) => ({ create: { keyword: { matchType: "PHRASE", text }, sharedSet } }));
  if (create.length) await mutate("sharedCriteria", create);
}

async function attachSharedSet(sharedSet: string, campaigns: Map<string, string>) {
  const campaignIds = [...campaigns.values()].map(resourceId).join(",");
  const rows = await query<{
    campaign: { resourceName: string };
    campaignSharedSet: { resourceName: string; sharedSet: string; status: string };
  }>(`
    SELECT campaign.resource_name, campaign_shared_set.resource_name,
      campaign_shared_set.shared_set, campaign_shared_set.status
    FROM campaign_shared_set
    WHERE campaign.id IN (${campaignIds})
  `);
  const create = [...campaigns.values()]
    .filter((campaign) => !rows.some((row) => row.campaign.resourceName === campaign
      && row.campaignSharedSet.sharedSet === sharedSet
      && row.campaignSharedSet.status === "ENABLED"))
    .map((campaign) => ({ create: { campaign, sharedSet } }));
  if (create.length) await mutate("campaignSharedSets", create);
}

export async function ensureNegatives(campaigns: Map<string, string>, specs: CampaignSpec[]) {
  const sharedSet = await ensureSharedSet();
  await reconcileSharedCriteria(sharedSet);
  await attachSharedSet(sharedSet, campaigns);

  const campaignIds = [...campaigns.values()].map(resourceId).join(",");
  const rows = await query<{
    campaign: { resourceName: string };
    campaignCriterion: {
      keyword?: { matchType: string; text: string };
      negative: boolean;
      resourceName: string;
      type: string;
    };
  }>(`
    SELECT campaign.resource_name, campaign_criterion.resource_name,
      campaign_criterion.type, campaign_criterion.negative,
      campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign.id IN (${campaignIds})
      AND campaign_criterion.type = 'KEYWORD'
      AND campaign_criterion.negative = TRUE
  `);

  for (const spec of specs) {
    const campaign = campaigns.get(spec.key);
    if (!campaign) throw new Error(`campaign resource missing for ${spec.name}`);
    const desired = new Set([
      ...spec.crossNegatives,
      ...(spec.residentialFilter ? RESIDENTIAL_NEGATIVES : []),
    ].map((text) => text.toLowerCase()));
    const current = rows.filter((row) => row.campaign.resourceName === campaign);
    const remove = current
      .filter((row) => !row.campaignCriterion.keyword
        || row.campaignCriterion.keyword.matchType !== "PHRASE"
        || !desired.has(row.campaignCriterion.keyword.text.toLowerCase()))
      .map((row) => ({ remove: row.campaignCriterion.resourceName }));
    if (remove.length) await mutate("campaignCriteria", remove);
    const present = new Set(current
      .filter((row) => row.campaignCriterion.keyword?.matchType === "PHRASE")
      .map((row) => row.campaignCriterion.keyword!.text.toLowerCase()));
    const create = [...desired]
      .filter((text) => !present.has(text))
      .map((text) => ({ create: { campaign, keyword: { matchType: "PHRASE", text }, negative: true } }));
    if (create.length) await mutate("campaignCriteria", create);
  }
}
