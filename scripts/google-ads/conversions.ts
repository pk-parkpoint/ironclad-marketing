import { CUSTOMER_ID, mutate, query } from "./client";

type ConversionActionRow = {
  conversionAction: {
    category: string;
    name: string;
    primaryForGoal: boolean;
    resourceName: string;
    status: string;
    tagSnippets?: Array<{ eventSnippet?: string; type?: string }>;
    type: string;
  };
};

export type ConversionResources = {
  booking: string;
  callsFromAds: string;
  callsFromWebsite: string;
  customGoal: string;
};

const BOOKING_NAME = "Booking confirmed";
const WEBSITE_CALL_NAME = "Calls from website (60 seconds)";
const CUSTOM_GOAL_NAME = "Ironclad Qualified Calls & Bookings";

async function conversionActions(): Promise<ConversionActionRow[]> {
  return query<ConversionActionRow>(`
    SELECT
      conversion_action.resource_name,
      conversion_action.name,
      conversion_action.type,
      conversion_action.category,
      conversion_action.status,
      conversion_action.primary_for_goal,
      conversion_action.tag_snippets
    FROM conversion_action
    WHERE conversion_action.status != 'REMOVED'
  `);
}

async function createConversion(create: Record<string, unknown>, validateOnly: boolean): Promise<string> {
  const results = await mutate("conversionActions", [{ create }], { validateOnly });
  const resourceName = results[0]?.resourceName as string | undefined;
  if (validateOnly) return `customers/${CUSTOMER_ID}/conversionActions/VALIDATED`;
  if (!resourceName) throw new Error(`conversion creation returned no resource: ${String(create.name)}`);
  return resourceName;
}

async function updateConversion(
  resourceName: string,
  fields: Record<string, unknown>,
  updateMask: string,
  validateOnly: boolean,
) {
  await mutate("conversionActions", [{ update: { resourceName, ...fields }, updateMask }], { validateOnly });
}

export async function ensureConversions(validateOnly = false): Promise<ConversionResources> {
  let rows = await conversionActions();
  let booking = rows.find((row) => row.conversionAction.name === BOOKING_NAME)?.conversionAction.resourceName;
  let websiteCall = rows.find((row) => row.conversionAction.name === WEBSITE_CALL_NAME)?.conversionAction.resourceName;
  const callsFromAds = rows.find((row) => row.conversionAction.type === "AD_CALL")?.conversionAction.resourceName;
  if (!callsFromAds) throw new Error("Calls from ads conversion action is missing");

  if (!booking) {
    booking = await createConversion({
      category: "BOOK_APPOINTMENT",
      countingType: "ONE_PER_CLICK",
      name: BOOKING_NAME,
      primaryForGoal: true,
      status: "ENABLED",
      type: "WEBPAGE",
      valueSettings: { alwaysUseDefaultValue: true, defaultCurrencyCode: "USD", defaultValue: 1 },
    }, validateOnly);
  } else {
    await updateConversion(booking, {
      category: "BOOK_APPOINTMENT",
      countingType: "ONE_PER_CLICK",
      primaryForGoal: true,
      status: "ENABLED",
    }, "category,countingType,primaryForGoal,status", validateOnly);
  }

  if (!websiteCall) {
    websiteCall = await createConversion({
      category: "PHONE_CALL_LEAD",
      countingType: "ONE_PER_CLICK",
      name: WEBSITE_CALL_NAME,
      phoneCallDurationSeconds: "60",
      primaryForGoal: true,
      status: "ENABLED",
      type: "WEBSITE_CALL",
      valueSettings: { alwaysUseDefaultValue: true, defaultCurrencyCode: "USD", defaultValue: 1 },
    }, validateOnly);
  } else {
    await updateConversion(websiteCall, {
      category: "PHONE_CALL_LEAD",
      countingType: "ONE_PER_CLICK",
      phoneCallDurationSeconds: "60",
      primaryForGoal: true,
      status: "ENABLED",
    }, "category,countingType,phoneCallDurationSeconds,primaryForGoal,status", validateOnly);
  }

  await updateConversion(callsFromAds, {
    phoneCallDurationSeconds: "60",
    primaryForGoal: true,
    status: "ENABLED",
  }, "phoneCallDurationSeconds,primaryForGoal,status", validateOnly);

  if (!validateOnly) {
    rows = await conversionActions();
    const primaryResources = new Set([booking, websiteCall, callsFromAds]);
    const secondaryOperations = rows
      .filter((row) => ["WEBPAGE", "CLICK_TO_CALL"].includes(row.conversionAction.type))
      .filter((row) => row.conversionAction.primaryForGoal && !primaryResources.has(row.conversionAction.resourceName))
      .map((row) => ({
        update: { resourceName: row.conversionAction.resourceName, primaryForGoal: false },
        updateMask: "primaryForGoal",
      }));
    if (secondaryOperations.length) await mutate("conversionActions", secondaryOperations);
  }

  const customGoals = await query<{ customConversionGoal: { name: string; resourceName: string } }>(`
    SELECT custom_conversion_goal.resource_name, custom_conversion_goal.name
    FROM custom_conversion_goal
    WHERE custom_conversion_goal.status != 'REMOVED'
  `);
  let customGoal = customGoals.find((row) => row.customConversionGoal.name === CUSTOM_GOAL_NAME)?.customConversionGoal.resourceName;
  const goalFields = { conversionActions: [booking, websiteCall, callsFromAds], name: CUSTOM_GOAL_NAME, status: "ENABLED" };
  if (customGoal) {
    await mutate("customConversionGoals", [{
      update: { resourceName: customGoal, ...goalFields },
      updateMask: "conversionActions,name,status",
    }], { validateOnly });
  } else {
    const results = await mutate("customConversionGoals", [{ create: goalFields }], { validateOnly });
    customGoal = validateOnly
      ? `customers/${CUSTOMER_ID}/customConversionGoals/VALIDATED`
      : results[0]?.resourceName as string | undefined;
  }
  if (!customGoal) throw new Error("custom conversion goal creation returned no resource");

  return { booking, callsFromAds, callsFromWebsite: websiteCall, customGoal };
}

export async function conversionLabels(): Promise<{ booking?: string; websiteCall?: string }> {
  const rows = await conversionActions();
  const labelFrom = (name: string, type: string) => {
    const snippet = rows.find((row) => row.conversionAction.name === name)?.conversionAction.tagSnippets
      ?.find((candidate) => candidate.type === type)?.eventSnippet;
    if (!snippet) return undefined;
    return snippet.match(/AW-\d+\/([A-Za-z0-9_-]+)/)?.[1];
  };
  return {
    booking: labelFrom(BOOKING_NAME, "WEBPAGE"),
    websiteCall: labelFrom(WEBSITE_CALL_NAME, "WEBSITE_CALL"),
  };
}
