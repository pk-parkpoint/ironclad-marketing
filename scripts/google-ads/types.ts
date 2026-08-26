export type MatchType = "EXACT" | "PHRASE";

export type KeywordSpec = {
  text: string;
  matchType: MatchType;
  finalUrl?: string;
};

export type AdGroupSpec = {
  name: string;
  finalUrl: string;
  pinnedHeadline: string;
  outcomeDescription: string;
  negativeKeywords?: KeywordSpec[];
  pinnedHeadline2?: string;
  promotionDescription?: string;
  strictServiceIntent?: boolean;
  keywords: KeywordSpec[];
};

export type CampaignSpec = {
  key: string;
  name: string;
  budgetMicros: string;
  cpcCapMicros: string;
  launchEnabled: boolean;
  crossNegatives: string[];
  exactCrossNegatives?: string[];
  residentialFilter: boolean;
  pinnedHeadline2?: string;
  headlines: string[];
  descriptions: string[];
  adGroups: AdGroupSpec[];
};

export type SitelinkSpec = {
  text: string;
  description1: string;
  description2: string;
  finalUrl: string;
};

export function exact(...texts: string[]): KeywordSpec[] {
  return texts.map((text) => ({ matchType: "EXACT", text }));
}

export function phrase(...texts: string[]): KeywordSpec[] {
  return texts.map((text) => ({ matchType: "PHRASE", text }));
}
