import { mutate, query, resourceId } from "./client";
import type { CampaignSpec, KeywordSpec } from "./types";

type NegativeRow = {
  adGroup: { resourceName: string };
  adGroupCriterion: {
    keyword?: { matchType: string; text: string };
    resourceName: string;
  };
};

function keywordKey(keyword: Pick<KeywordSpec, "matchType" | "text">): string {
  return `${keyword.matchType}:${keyword.text.trim().toLowerCase()}`;
}

export async function reconcileAdGroupNegatives(
  adGroups: Map<string, string>,
  specs: CampaignSpec[],
) {
  const adGroupIds = [...adGroups.values()].map(resourceId).join(",");
  const rows = await query<NegativeRow>(`
    SELECT ad_group.resource_name, ad_group_criterion.resource_name,
      ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type
    FROM ad_group_criterion
    WHERE ad_group.id IN (${adGroupIds})
      AND ad_group_criterion.type = 'KEYWORD'
      AND ad_group_criterion.negative = TRUE
      AND ad_group_criterion.status != 'REMOVED'
  `);

  for (const campaign of specs) {
    const operations: Array<Record<string, unknown>> = [];
    for (const group of campaign.adGroups) {
      const adGroup = adGroups.get(`${campaign.key}:${group.name}`)!;
      const desired = new Map((group.negativeKeywords || [])
        .map((keyword) => [keywordKey(keyword), keyword]));
      const current = rows.filter((row) => row.adGroup.resourceName === adGroup);
      const currentByKey = new Map<string, NegativeRow[]>();
      for (const row of current) {
        if (!row.adGroupCriterion.keyword) {
          operations.push({ remove: row.adGroupCriterion.resourceName });
          continue;
        }
        const key = keywordKey(row.adGroupCriterion.keyword as KeywordSpec);
        if (!desired.has(key)) {
          operations.push({ remove: row.adGroupCriterion.resourceName });
          continue;
        }
        currentByKey.set(key, [...(currentByKey.get(key) || []), row]);
      }
      for (const [key, keyword] of desired) {
        const [existing, ...duplicates] = currentByKey.get(key) || [];
        operations.push(...duplicates.map((row) => ({ remove: row.adGroupCriterion.resourceName })));
        if (!existing) operations.push({ create: {
          adGroup,
          keyword: { matchType: keyword.matchType, text: keyword.text },
          negative: true,
          status: "ENABLED",
        } });
      }
    }
    if (operations.length) await mutate("adGroupCriteria", operations);
  }
}
