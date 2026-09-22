import { DRAIN_SEWER } from "./campaign-drain";
import { EMERGENCY, WATER_HEATER } from "./campaigns-emergency-water";
import { COMPETITOR, FREEZE, GENERAL_CITY } from "./campaigns-leaks-general";
import { LEAKS_LINES } from "./campaigns-leaks-lines";
import { routeNearMeTraffic } from "./near-me-routing";
import type { CampaignSpec } from "./types";

const CAMPAIGN_DEFINITIONS: CampaignSpec[] = [
  EMERGENCY,
  WATER_HEATER,
  DRAIN_SEWER,
  LEAKS_LINES,
  GENERAL_CITY,
  FREEZE,
  COMPETITOR,
];

export const CAMPAIGNS: CampaignSpec[] = CAMPAIGN_DEFINITIONS.map(routeNearMeTraffic);
