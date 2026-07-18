import { readFileSync } from "node:fs";
import path from "node:path";
import { buildSitemapGroups, getSitemapBaseUrl, toAbsoluteSitemapUrl } from "../lib/sitemap-data";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY_FILE = "cd1d9f44c00041489490a85b5ed2a327.txt";

function fail(message: string): never {
  console.error(`IndexNow submission failed: ${message}`);
  process.exit(1);
}

function getCanonicalUrls(): string[] {
  const groups = buildSitemapGroups();
  return [
    ...new Set(
      Object.values(groups)
        .flat()
        .map((entry) => toAbsoluteSitemapUrl(entry.path)),
    ),
  ].sort();
}

async function main() {
  const host = new URL(getSitemapBaseUrl()).host;
  const key = readFileSync(path.join(process.cwd(), "public", INDEXNOW_KEY_FILE), "utf8").trim();
  const urlList = getCanonicalUrls();

  if (!/^[a-f0-9-]{8,128}$/i.test(key)) {
    fail("public key file is missing or malformed");
  }

  console.log(`IndexNow plan: ${urlList.length} canonical URLs for ${host}`);
  if (process.env.INDEXNOW_EXECUTE !== "1") {
    console.log("Dry run only. Use npm run indexnow:submit to send the batch.");
    return;
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${getSitemapBaseUrl()}/${INDEXNOW_KEY_FILE}`,
      urlList,
    }),
  });

  if (!response.ok) {
    fail(`endpoint returned ${response.status} ${response.statusText}`);
  }

  console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${response.status})`);
}

void main();
