const AI_REFERRER_HOSTS: Array<{ host: string; source: string }> = [
  { host: "chatgpt.com", source: "ChatGPT" },
  { host: "gemini.google.com", source: "Gemini" },
  { host: "perplexity.ai", source: "Perplexity" },
  { host: "claude.ai", source: "Claude" },
  { host: "copilot.microsoft.com", source: "Microsoft Copilot" },
];

export function getAiReferralContext(referrerUrl: string): {
  ai_referrer: boolean;
  ai_referrer_source: string;
  referrer_host: string;
} {
  if (!referrerUrl) {
    return { ai_referrer: false, ai_referrer_source: "", referrer_host: "" };
  }

  try {
    const hostname = new URL(referrerUrl).hostname.replace(/^www\./, "").toLowerCase();
    const match = AI_REFERRER_HOSTS.find(({ host }) => hostname === host || hostname.endsWith(`.${host}`));
    return {
      ai_referrer: Boolean(match),
      ai_referrer_source: match?.source ?? "",
      referrer_host: hostname,
    };
  } catch {
    return { ai_referrer: false, ai_referrer_source: "", referrer_host: "" };
  }
}
