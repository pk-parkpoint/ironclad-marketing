import { CAMPAIGNS } from "./manifest";
import { SITELINKS, SITE_ORIGIN } from "./manifest-shared";
import { query, resourceId } from "./client";

type Destination = { sources: string[]; url: string };

function sourceDestinations(): Destination[] {
  const byUrl = new Map<string, Set<string>>();
  const add = (url: string, source: string) => {
    const sources = byUrl.get(url) || new Set<string>();
    sources.add(source);
    byUrl.set(url, sources);
  };
  for (const campaign of CAMPAIGNS) {
    for (const group of campaign.adGroups) {
      add(group.finalUrl, `ad:${campaign.name}/${group.name}`);
      for (const keyword of group.keywords) {
        if (keyword.finalUrl) add(keyword.finalUrl, `keyword:${campaign.name}/${group.name}/${keyword.text}`);
      }
    }
  }
  for (const sitelink of SITELINKS) add(sitelink.finalUrl, `sitelink:${sitelink.text}`);
  return [...byUrl].map(([url, sources]) => ({ sources: [...sources].sort(), url })).sort((a, b) => a.url.localeCompare(b.url));
}

async function liveDestinations(): Promise<Destination[]> {
  const campaigns = await query<{ campaign: { name: string; resourceName: string } }>(`
    SELECT campaign.resource_name, campaign.name FROM campaign
    WHERE campaign.status != 'REMOVED' AND campaign.advertising_channel_type = 'SEARCH'
  `);
  const managed = CAMPAIGNS.map((spec) => {
    const row = campaigns.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
    if (!row) throw new Error(`live campaign missing: ${spec.name}`);
    return row.campaign.resourceName;
  });
  const ids = managed.map(resourceId).join(",");
  const [ads, keywords, sitelinks] = await Promise.all([
    query<{ adGroup: { name: string }; adGroupAd: { ad: { finalUrls?: string[] } }; campaign: { name: string } }>(`
      SELECT campaign.id, campaign.name, ad_group.name, ad_group_ad.ad.final_urls FROM ad_group_ad
      WHERE campaign.id IN (${ids}) AND ad_group_ad.status != 'REMOVED'
    `),
    query<{ adGroup: { name: string }; adGroupCriterion: { finalUrls?: string[]; keyword?: { text: string } }; campaign: { name: string } }>(`
      SELECT campaign.id, campaign.name, ad_group.name, ad_group_criterion.keyword.text,
        ad_group_criterion.final_urls FROM ad_group_criterion
      WHERE campaign.id IN (${ids}) AND ad_group_criterion.type = 'KEYWORD'
        AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status != 'REMOVED'
    `),
    query<{ asset: { finalUrls?: string[]; name?: string }; campaign: { name: string } }>(`
      SELECT campaign.id, campaign.name, asset.name, asset.final_urls FROM campaign_asset
      WHERE campaign.id IN (${ids}) AND campaign_asset.field_type = 'SITELINK'
        AND campaign_asset.status != 'REMOVED'
    `),
  ]);
  const byUrl = new Map<string, Set<string>>();
  const add = (url: string, source: string) => {
    const sources = byUrl.get(url) || new Set<string>();
    sources.add(source);
    byUrl.set(url, sources);
  };
  for (const row of ads) for (const url of row.adGroupAd.ad.finalUrls || []) add(url, `live-ad:${row.campaign.name}/${row.adGroup.name}`);
  for (const row of keywords) for (const url of row.adGroupCriterion.finalUrls || []) add(url, `live-keyword:${row.campaign.name}/${row.adGroup.name}/${row.adGroupCriterion.keyword?.text}`);
  for (const row of sitelinks) for (const url of row.asset.finalUrls || []) add(url, `live-sitelink:${row.campaign.name}/${row.asset.name}`);
  return [...byUrl].map(([url, sources]) => ({ sources: [...sources].sort(), url })).sort((a, b) => a.url.localeCompare(b.url));
}

async function check(destination: Destination) {
  const response = await fetch(destination.url, {
    headers: { "user-agent": "Ironclad-Google-Ads-Landing-Page-Audit/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();
  const finalUrl = new URL(response.url);
  const expectedHost = new URL(SITE_ORIGIN).hostname;
  if (response.status !== 200) throw new Error(`${destination.url}: HTTP ${response.status}`);
  if (finalUrl.hostname !== expectedHost) throw new Error(`${destination.url}: redirected off-domain to ${response.url}`);
  if (!contentType.includes("text/html")) throw new Error(`${destination.url}: unexpected content-type ${contentType}`);
  if (!/ironclad plumbing/i.test(body)) throw new Error(`${destination.url}: Ironclad Plumbing page marker missing`);
  return { ...destination, finalUrl: response.url, status: response.status };
}

async function main() {
  const expected = sourceDestinations();
  const desired = process.argv.includes("--live") ? await liveDestinations() : expected;
  if (process.argv.includes("--live")) {
    const expectedUrls = new Set(expected.map((item) => item.url));
    const actualUrls = new Set(desired.map((item) => item.url));
    const sourceOnly = [...expectedUrls].filter((url) => !actualUrls.has(url));
    const liveOnly = [...actualUrls].filter((url) => !expectedUrls.has(url));
    console.log(`Live/source URL variance: sourceOnly=${sourceOnly.length} liveOnly=${liveOnly.length}`);
  }
  const results = await Promise.all(desired.map(check));
  for (const result of results) {
    const redirect = result.finalUrl === result.url ? "" : ` -> ${result.finalUrl}`;
    console.log(`PASS ${result.status} ${result.url}${redirect} [${result.sources.length} source${result.sources.length === 1 ? "" : "s"}]`);
  }
  console.log(`Landing-page audit passed: mode=${process.argv.includes("--live") ? "live" : "source"} uniqueUrls=${results.length} linkedSources=${results.reduce((sum, result) => sum + result.sources.length, 0)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
