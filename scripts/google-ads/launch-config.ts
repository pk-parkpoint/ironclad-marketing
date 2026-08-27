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
export const PORTFOLIO_STRATEGY_NAME = "Ironclad Core Search | Max Conversions | $40 CPA | $15 CPC";
export const TARGET_CPA_MICROS = "40000000";
export const CPC_BID_CEILING_MICROS = "15000000";

export function usesLaunchPortfolio(key: string): boolean {
  return CORE_LAUNCH_KEY_SET.has(key);
}
