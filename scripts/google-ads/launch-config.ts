export const CORE_LAUNCH_KEYS = [
  "emergency",
  "water-heater",
  "drain-sewer",
  "leaks-lines",
  "general-city",
] as const;

export const CORE_LAUNCH_KEY_SET = new Set<string>(CORE_LAUNCH_KEYS);
export const SHARED_BUDGET_NAME = "Ironclad Core Search | $60 Shared Budget";
export const SHARED_BUDGET_MICROS = "60000000";
export const PORTFOLIO_STRATEGY_NAME = "Ironclad Core Search | Max Conversions | $50 CPA | $25 CPC";
export const LEGACY_PORTFOLIO_STRATEGY_NAMES = [
  "Ironclad Core Search | Max Conversions | $40 CPA | $15 CPC",
] as const;
export const TARGET_CPA_MICROS = "50000000";
export const CPC_BID_CEILING_MICROS = "25000000";

export function usesLaunchPortfolio(key: string): boolean {
  return CORE_LAUNCH_KEY_SET.has(key);
}
