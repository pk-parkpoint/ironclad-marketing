import { execFileSync } from "node:child_process";

if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
}

export const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID?.replace(/-/g, "") || "4803572715";
export const LOGIN_CUSTOMER_ID = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, "") || "4573375000";
const API_VERSION = process.env.GOOGLE_ADS_API_VERSION || "v24";
const API_ROOT = `https://googleads.googleapis.com/${API_VERSION}`;
let cachedAccessToken = "";
let cachedDeveloperToken = "";

function command(commandName: string, args: string[]): string {
  return execFileSync(commandName, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function accessToken(): string {
  cachedAccessToken ||= process.env.GOOGLE_ADS_ACCESS_TOKEN?.trim()
    || command("gcloud", ["auth", "application-default", "print-access-token"]);
  return cachedAccessToken;
}

function developerToken(): string {
  cachedDeveloperToken ||= process.env.GOOGLE_ADS_DEVELOPER_TOKEN?.trim()
    || command("gcloud", [
      "secrets", "versions", "access", "latest",
      "--secret=google-ads-developer-token",
      "--project=conduit-external-dev",
    ]);
  return cachedDeveloperToken;
}

async function request(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_ROOT}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken()}`,
      "Content-Type": "application/json",
      "developer-token": developerToken(),
      "login-customer-id": LOGIN_CUSTOMER_ID,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) {
    const safePayload = JSON.stringify(payload, null, 2);
    throw new Error(`Google Ads API ${response.status} for ${path}: ${safePayload}`);
  }
  return payload;
}

export async function query<T = Record<string, unknown>>(gaql: string): Promise<T[]> {
  const payload = await request(`/customers/${CUSTOMER_ID}/googleAds:searchStream`, { query: gaql });
  const chunks = payload as unknown as Array<{ results?: T[] }>;
  return chunks.flatMap((chunk) => chunk.results || []);
}

export async function mutate(
  service: string,
  operations: Array<Record<string, unknown>>,
  options: { validateOnly?: boolean; responseContentType?: "MUTABLE_RESOURCE" | "RESOURCE_NAME_ONLY" } = {},
): Promise<Array<Record<string, unknown>>> {
  if (operations.length === 0) return [];
  const payload = await request(`/customers/${CUSTOMER_ID}/${service}:mutate`, {
    operations,
    responseContentType: options.responseContentType || "RESOURCE_NAME_ONLY",
    validateOnly: options.validateOnly || false,
  });
  return (payload.results as Array<Record<string, unknown>> | undefined) || [];
}

export async function mutateCustomer(operation: Record<string, unknown>): Promise<Record<string, unknown>> {
  return request(`/customers/${CUSTOMER_ID}:mutate`, {
    operation,
    responseContentType: "RESOURCE_NAME_ONLY",
    validateOnly: false,
  });
}

export function resourceId(resourceName: string): string {
  return resourceName.split("/").pop() || "";
}
