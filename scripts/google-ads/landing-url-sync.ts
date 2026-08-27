import { CUSTOMER_ID, mutate, query, resourceId } from "./client";
import { CAMPAIGNS } from "./manifest";
import type { KeywordSpec } from "./types";
import { validateManifest } from "./validate";

type CampaignRow = {
  campaign: { name: string; resourceName: string; status: string };
  campaignBudget: { amountMicros: string; resourceName: string };
};

type AdGroupRow = {
  adGroup: { campaign: string; name: string; resourceName: string; status: string };
};

type KeywordRow = {
  adGroup: { resourceName: string };
  adGroupCriterion: {
    finalUrls?: string[];
    keyword?: { matchType: string; text: string };
    negative: boolean;
    resourceName: string;
    status: string;
  };
};

type AccountSnapshot = {
  budgets: Map<string, string>;
  campaigns: Map<string, CampaignRow>;
};

type DesiredRoute = {
  adGroup: string;
  campaignName: string;
  groupName: string;
  keyword: KeywordSpec & { finalUrl: string };
};

function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function keywordKey(keyword: Pick<KeywordSpec, "matchType" | "text">): string {
  return `${keyword.matchType}:${keyword.text.trim().toLowerCase()}`;
}

async function snapshot(): Promise<AccountSnapshot> {
  const rows = await query<CampaignRow>(`
    SELECT campaign.resource_name, campaign.name, campaign.status,
      campaign_budget.resource_name, campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.status != 'REMOVED'
      AND campaign.advertising_channel_type = 'SEARCH'
  `);
  const campaigns = new Map<string, CampaignRow>();
  const budgets = new Map<string, string>();
  for (const spec of CAMPAIGNS) {
    const row = rows.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
    requireCondition(row, `managed campaign missing: ${spec.name}`);
    const expectedStatus = spec.launchEnabled ? "ENABLED" : "PAUSED";
    requireCondition(row.campaign.status === expectedStatus, `campaign status mismatch: ${spec.name}/${row.campaign.status}/${expectedStatus}`);
    campaigns.set(spec.key, row);
    budgets.set(row.campaignBudget.resourceName, row.campaignBudget.amountMicros);
  }
  return { budgets, campaigns };
}

async function desiredRoutes(state: AccountSnapshot): Promise<DesiredRoute[]> {
  const liveCampaigns = CAMPAIGNS.filter((campaign) => campaign.launchEnabled);
  const campaignResources = new Map(liveCampaigns.map((campaign) => [
    campaign.key,
    state.campaigns.get(campaign.key)!.campaign.resourceName,
  ]));
  const campaignIds = [...campaignResources.values()].map(resourceId).join(",");
  const groups = await query<AdGroupRow>(`
    SELECT ad_group.resource_name, ad_group.name, ad_group.status, ad_group.campaign
    FROM ad_group
    WHERE campaign.id IN (${campaignIds})
      AND ad_group.status != 'REMOVED'
  `);

  return liveCampaigns.flatMap((campaign) => campaign.adGroups.flatMap((group) => {
    const campaignResource = campaignResources.get(campaign.key)!;
    const row = groups.find((candidate) => candidate.adGroup.campaign === campaignResource
      && candidate.adGroup.name.toLowerCase() === group.name.toLowerCase());
    requireCondition(row, `managed ad group missing: ${campaign.name}/${group.name}`);
    requireCondition(row.adGroup.status === "ENABLED", `managed ad group not enabled: ${campaign.name}/${group.name}`);
    return group.keywords.flatMap((keyword) => keyword.finalUrl ? [{
      adGroup: row.adGroup.resourceName,
      campaignName: campaign.name,
      groupName: group.name,
      keyword: { ...keyword, finalUrl: keyword.finalUrl },
    }] : []);
  }));
}

async function loadKeywords(routes: DesiredRoute[]): Promise<KeywordRow[]> {
  const adGroupIds = [...new Set(routes.map((route) => resourceId(route.adGroup)))].join(",");
  return query<KeywordRow>(`
    SELECT ad_group.resource_name, ad_group_criterion.resource_name,
      ad_group_criterion.status, ad_group_criterion.negative,
      ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
      ad_group_criterion.final_urls
    FROM keyword_view
    WHERE ad_group.id IN (${adGroupIds})
      AND ad_group_criterion.status != 'REMOVED'
  `);
}

function routeOperations(routes: DesiredRoute[], rows: KeywordRow[]) {
  return routes.flatMap((route) => {
    const matches = rows.filter((row) => row.adGroup.resourceName === route.adGroup
      && !row.adGroupCriterion.negative
      && row.adGroupCriterion.keyword
      && keywordKey(row.adGroupCriterion.keyword) === keywordKey(route.keyword));
    requireCondition(matches.length === 1, `keyword row count=${matches.length}: ${route.campaignName}/${route.groupName}/${keywordKey(route.keyword)}`);
    const [row] = matches;
    requireCondition(row.adGroupCriterion.status === "ENABLED", `keyword not enabled: ${route.campaignName}/${route.groupName}/${route.keyword.text}`);
    const finalUrls = [route.keyword.finalUrl];
    return JSON.stringify(row.adGroupCriterion.finalUrls || []) === JSON.stringify(finalUrls) ? [] : [{
      update: { finalUrls, resourceName: row.adGroupCriterion.resourceName },
      updateMask: "finalUrls",
    }];
  });
}

function assertAccountUnchanged(before: AccountSnapshot, after: AccountSnapshot) {
  requireCondition(JSON.stringify([...after.budgets].sort()) === JSON.stringify([...before.budgets].sort()), "budget changed during landing URL sync");
  for (const spec of CAMPAIGNS) {
    requireCondition(
      after.campaigns.get(spec.key)?.campaign.status === before.campaigns.get(spec.key)?.campaign.status,
      `campaign status changed during landing URL sync: ${spec.name}`,
    );
  }
}

async function main() {
  validateManifest();
  const mode = process.argv[2] || "plan";
  requireCondition(mode === "plan" || mode === "apply", `unknown landing URL sync mode: ${mode}`);
  const before = await snapshot();
  const routes = await desiredRoutes(before);
  const rows = await loadKeywords(routes);
  const operations = routeOperations(routes, rows);
  if (operations.length) await mutate("adGroupCriteria", operations, { validateOnly: true });
  console.log(`Landing URL validation passed: explicitRoutes=${routes.length} updates=${operations.length}`);
  if (mode === "plan") return;

  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  requireCondition(confirmation === CUSTOMER_ID, `landing URL apply requires --confirm-customer=${CUSTOMER_ID}`);
  if (operations.length) await mutate("adGroupCriteria", operations);

  const verifiedRows = await loadKeywords(routes);
  requireCondition(routeOperations(routes, verifiedRows).length === 0, "landing URL readback mismatch");
  assertAccountUnchanged(before, await snapshot());
  console.log(`Landing URL apply passed: explicitRoutes=${routes.length} updated=${operations.length} budgetsUnchanged=${before.budgets.size}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
