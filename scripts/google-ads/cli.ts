import { writeFileSync } from "node:fs";
import { ensureAdGroupsKeywordsAndAds } from "./ad-groups";
import { attachAssets, ensureAssets } from "./assets";
import { auditAccount } from "./audit";
import { CAMPAIGNS } from "./manifest";
import { applyCustomGoal, enableCallReporting, ensureCampaigns, ensureLocations, setLaunchStatuses } from "./campaigns";
import { CUSTOMER_ID, query } from "./client";
import { conversionLabels, ensureConversions } from "./conversions";
import { ensureNegatives } from "./negatives";
import { validateManifest } from "./validate";

async function plan() {
  validateManifest();
  const current = await query<{ campaign: { name: string; status: string } }>(`
    SELECT campaign.name, campaign.status
    FROM campaign
    WHERE campaign.status != 'REMOVED'
  `);
  console.log("Desired campaigns:");
  for (const campaign of CAMPAIGNS) {
    const found = current.find((row) => row.campaign.name.toLowerCase() === campaign.name.toLowerCase());
    console.log(`- ${campaign.name}: ${found ? `existing/${found.campaign.status}` : "create"}, budget=$${Number(campaign.budgetMicros) / 1_000_000}/day, launch=${campaign.launchEnabled}`);
  }
  console.log("Legacy Performance Max is excluded from every mutation.");
}

function requireConfirmation(action: string) {
  const confirmation = process.argv.find((arg) => arg.startsWith("--confirm-customer="))?.split("=")[1]?.replace(/-/g, "");
  if (confirmation !== CUSTOMER_ID) throw new Error(`${action} requires --confirm-customer=${CUSTOMER_ID}`);
}

async function apply() {
  requireConfirmation("apply");
  validateManifest();
  console.log("1/8 conversion actions and custom goal");
  const conversions = await ensureConversions();
  console.log("2/8 call reporting");
  await enableCallReporting(conversions.callsFromAds);
  console.log("3/8 budgets and paused campaigns");
  const campaigns = await ensureCampaigns(CAMPAIGNS);
  console.log("4/8 locations and negatives");
  await ensureLocations(campaigns);
  await ensureNegatives(campaigns, CAMPAIGNS);
  console.log("5/8 ad groups, keywords, and RSAs");
  const adGroups = await ensureAdGroupsKeywordsAndAds(campaigns, CAMPAIGNS);
  console.log("6/8 assets");
  const assets = await ensureAssets(conversions.callsFromAds);
  await attachAssets(campaigns, adGroups, assets);
  console.log("7/8 campaign conversion goal");
  await applyCustomGoal(campaigns, conversions.customGoal);
  console.log("8/8 conversion label export and paused audit");
  const labels = await conversionLabels();
  if (!labels.booking || !labels.websiteCall) throw new Error("conversion labels unavailable after creation");
  writeFileSync(".env.google-ads.generated", [
    "NEXT_PUBLIC_GOOGLE_ADS_ID=AW-18207846861",
    `NEXT_PUBLIC_GOOGLE_ADS_BOOKING_CONVERSION_LABEL=${labels.booking}`,
    `NEXT_PUBLIC_GOOGLE_ADS_WEBSITE_CALL_CONVERSION_LABEL=${labels.websiteCall}`,
    "NEXT_PUBLIC_PHONE=(512) 506-2470",
    "NEXT_PUBLIC_TEXT_NUMBER=(512) 506-2470",
    "NEXT_PUBLIC_TX_LICENSE=RMP #39871",
    "",
  ].join("\n"), { mode: 0o600 });
  await auditAccount(false);
  console.log("Build complete. Campaigns remain paused pending production tag verification.");
}

async function activate() {
  requireConfirmation("activate");
  const rows = await query<{ campaign: { name: string; resourceName: string } }>(`
    SELECT campaign.resource_name, campaign.name
    FROM campaign
    WHERE campaign.status != 'REMOVED' AND campaign.advertising_channel_type = 'SEARCH'
  `);
  const campaigns = new Map<string, string>();
  for (const spec of CAMPAIGNS) {
    const row = rows.find((candidate) => candidate.campaign.name.toLowerCase() === spec.name.toLowerCase());
    if (!row) throw new Error(`campaign missing before activation: ${spec.name}`);
    campaigns.set(spec.key, row.campaign.resourceName);
  }
  await setLaunchStatuses(campaigns, CAMPAIGNS);
  await auditAccount(true);
  console.log("Five core campaigns enabled at $15/day; Freeze and Competitor remain paused.");
}

async function main() {
  const command = process.argv[2] || "plan";
  if (command === "validate") {
    validateManifest();
    console.log("Google Ads manifest valid");
  } else if (command === "plan") {
    await plan();
  } else if (command === "apply") {
    await apply();
  } else if (command === "audit") {
    await auditAccount(process.argv.includes("--expect-launch"));
  } else if (command === "activate") {
    await activate();
  } else {
    throw new Error(`unknown command: ${command}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
