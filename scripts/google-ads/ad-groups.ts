import { mutate, query, resourceId } from "./client";
import { reconcileAdGroupNegatives } from "./ad-group-negatives";
import { STANDARD_PINNED_HEADLINE_3 } from "./manifest-shared";
import type { AdGroupSpec, CampaignSpec } from "./types";

type AdGroupRow = {
  adGroup: { campaign: string; name: string; resourceName: string; status: string };
};

async function ensureAdGroups(campaigns: Map<string, string>, specs: CampaignSpec[]): Promise<Map<string, string>> {
  const campaignIds = [...campaigns.values()].map(resourceId).join(",");
  const rows = await query<AdGroupRow>(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.status, ad_group.campaign
    FROM ad_group
    WHERE campaign.id IN (${campaignIds})
      AND ad_group.status != 'REMOVED'
  `);
  const resources = new Map<string, string>();
  for (const spec of specs) {
    const campaign = campaigns.get(spec.key)!;
    const desiredNames = new Set(spec.adGroups.map((group) => group.name.toLowerCase()));
    const legacy = rows
      .filter((row) => row.adGroup.campaign === campaign && !desiredNames.has(row.adGroup.name.toLowerCase()))
      .map((row) => ({ remove: row.adGroup.resourceName }));
    if (legacy.length) await mutate("adGroups", legacy);

    for (const group of spec.adGroups) {
      const key = `${spec.key}:${group.name}`;
      const existing = rows.find((row) => row.adGroup.campaign === campaign
        && row.adGroup.name.toLowerCase() === group.name.toLowerCase());
      if (existing) {
        await mutate("adGroups", [{
          update: { name: group.name, resourceName: existing.adGroup.resourceName, status: "ENABLED" },
          updateMask: "name,status",
        }]);
        resources.set(key, existing.adGroup.resourceName);
      } else {
        const results = await mutate("adGroups", [{ create: {
          campaign,
          name: group.name,
          status: "ENABLED",
          type: "SEARCH_STANDARD",
        } }]);
        const resourceName = results[0]?.resourceName as string | undefined;
        if (!resourceName) throw new Error(`ad group creation failed: ${spec.name}/${group.name}`);
        resources.set(key, resourceName);
      }
    }
  }
  return resources;
}

type KeywordRow = {
  adGroup: { resourceName: string };
  adGroupCriterion: {
    finalUrls?: string[];
    keyword?: { matchType: string; text: string };
    negative: boolean;
    resourceName: string;
    status: string;
    type: string;
  };
};

function keywordKey(text: string, matchType: string): string {
  return `${matchType}:${text.trim().toLowerCase()}`;
}

async function reconcileKeywords(adGroups: Map<string, string>, specs: CampaignSpec[]) {
  const adGroupIds = [...adGroups.values()].map(resourceId).join(",");
  const rows = await query<KeywordRow>(`
    SELECT ad_group.resource_name, ad_group_criterion.resource_name,
      ad_group_criterion.type, ad_group_criterion.status, ad_group_criterion.negative,
      ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
      ad_group_criterion.final_urls
    FROM keyword_view
    WHERE ad_group.id IN (${adGroupIds})
      AND ad_group_criterion.status != 'REMOVED'
  `);

  for (const campaign of specs) {
    const operations: Array<Record<string, unknown>> = [];
    for (const group of campaign.adGroups) {
      const adGroup = adGroups.get(`${campaign.key}:${group.name}`)!;
      const desired = new Map(group.keywords.map((keyword) => [keywordKey(keyword.text, keyword.matchType), keyword]));
      const current = rows.filter((row) => row.adGroup.resourceName === adGroup && !row.adGroupCriterion.negative);
      const currentByKey = new Map<string, KeywordRow[]>();
      for (const row of current) {
        if (!row.adGroupCriterion.keyword) {
          operations.push({ remove: row.adGroupCriterion.resourceName });
          continue;
        }
        const key = keywordKey(row.adGroupCriterion.keyword.text, row.adGroupCriterion.keyword.matchType);
        if (!desired.has(key)) {
          operations.push({ remove: row.adGroupCriterion.resourceName });
          continue;
        }
        currentByKey.set(key, [...(currentByKey.get(key) || []), row]);
      }

      for (const [key, keyword] of desired) {
        const [existing, ...duplicates] = currentByKey.get(key) || [];
        operations.push(...duplicates.map((row) => ({ remove: row.adGroupCriterion.resourceName })));
        const finalUrls = keyword.finalUrl ? [keyword.finalUrl] : [];
        if (existing) {
          const currentUrls = existing.adGroupCriterion.finalUrls || [];
          if (existing.adGroupCriterion.status !== "ENABLED" || JSON.stringify(currentUrls) !== JSON.stringify(finalUrls)) {
            operations.push({
              update: { finalUrls, resourceName: existing.adGroupCriterion.resourceName, status: "ENABLED" },
              updateMask: "finalUrls,status",
            });
          }
          continue;
        }
        operations.push({
          create: {
            adGroup,
            ...(finalUrls.length ? { finalUrls } : {}),
            keyword: { matchType: keyword.matchType, text: keyword.text },
            status: "ENABLED",
          },
          ...(keyword.text.toLowerCase() === "high water bill leak" ? {
            exemptPolicyViolationKeys: [{
              policyName: "CLICKBAIT",
              violatingText: keyword.text,
            }],
          } : {}),
        });
      }
    }
    if (operations.length) await mutate("adGroupCriteria", operations);
  }
}

type AdTextAsset = { pinnedField?: string; text: string };
type AdRow = {
  adGroup: { resourceName: string };
  adGroupAd: {
    ad: {
      finalUrls?: string[];
      responsiveSearchAd?: { descriptions?: AdTextAsset[]; headlines?: AdTextAsset[] };
      type: string;
    };
    resourceName: string;
    status: string;
  };
};

export function desiredAd(campaign: CampaignSpec, group: AdGroupSpec) {
  const pinnedHeadline2 = group.pinnedHeadline2 || campaign.pinnedHeadline2;
  const descriptions = [...campaign.descriptions];
  descriptions[1] = group.outcomeDescription;
  if (group.promotionDescription) descriptions[descriptions.length - 1] = group.promotionDescription;
  return {
    finalUrls: [group.finalUrl],
    responsiveSearchAd: {
      descriptions: descriptions.map((text, index) => ({
        ...(index === 0 ? { pinnedField: "DESCRIPTION_1" } : {}),
        ...(index === 1 ? { pinnedField: "DESCRIPTION_2" } : {}),
        text,
      })),
      headlines: [
        { pinnedField: "HEADLINE_1", text: group.pinnedHeadline },
        ...(pinnedHeadline2
          ? [{ pinnedField: "HEADLINE_2", text: pinnedHeadline2 }]
          : []),
        { pinnedField: "HEADLINE_3", text: STANDARD_PINNED_HEADLINE_3 },
        ...campaign.headlines.map((text) => ({ text })),
      ],
    },
  };
}

function normalizeAssets(assets: AdTextAsset[] | undefined): AdTextAsset[] {
  return (assets || []).map(({ pinnedField, text }) => ({ ...(pinnedField ? { pinnedField } : {}), text }));
}

function adMatches(row: AdRow, desired: ReturnType<typeof desiredAd>): boolean {
  const rsa = row.adGroupAd.ad.responsiveSearchAd;
  return row.adGroupAd.ad.type === "RESPONSIVE_SEARCH_AD"
    && JSON.stringify(row.adGroupAd.ad.finalUrls || []) === JSON.stringify(desired.finalUrls)
    && JSON.stringify(normalizeAssets(rsa?.headlines)) === JSON.stringify(desired.responsiveSearchAd.headlines)
    && JSON.stringify(normalizeAssets(rsa?.descriptions)) === JSON.stringify(desired.responsiveSearchAd.descriptions);
}

async function reconcileAds(adGroups: Map<string, string>, specs: CampaignSpec[]) {
  const adGroupIds = [...adGroups.values()].map(resourceId).join(",");
  const rows = await query<AdRow>(`
    SELECT ad_group.resource_name, ad_group_ad.resource_name, ad_group_ad.status,
      ad_group_ad.ad.type, ad_group_ad.ad.final_urls,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_search_ad.descriptions
    FROM ad_group_ad
    WHERE ad_group.id IN (${adGroupIds})
      AND ad_group_ad.status != 'REMOVED'
  `);
  for (const campaign of specs) {
    for (const group of campaign.adGroups) {
      const adGroup = adGroups.get(`${campaign.key}:${group.name}`)!;
      const desired = desiredAd(campaign, group);
      const current = rows.filter((row) => row.adGroup.resourceName === adGroup);
      const matching = current.find((row) => adMatches(row, desired));
      const remove = current
        .filter((row) => row.adGroupAd.resourceName !== matching?.adGroupAd.resourceName)
        .map((row) => ({ remove: row.adGroupAd.resourceName }));
      if (remove.length) await mutate("adGroupAds", remove);
      if (matching) {
        if (matching.adGroupAd.status !== "ENABLED") {
          await mutate("adGroupAds", [{
            update: { resourceName: matching.adGroupAd.resourceName, status: "ENABLED" },
            updateMask: "status",
          }]);
        }
        continue;
      }
      await mutate("adGroupAds", [{ create: { ad: desired, adGroup, status: "ENABLED" } }]);
    }
  }
}

export async function ensureAdGroupsKeywordsAndAds(campaigns: Map<string, string>, specs: CampaignSpec[]) {
  const adGroups = await ensureAdGroups(campaigns, specs);
  await reconcileKeywords(adGroups, specs);
  await reconcileAdGroupNegatives(adGroups, specs);
  await reconcileAds(adGroups, specs);
  return adGroups;
}
