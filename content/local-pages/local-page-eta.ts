export type LocalEta = {
  short: string;
  detail: string;
};

const CITY_ETA_BY_SLUG: Record<string, LocalEta> = {
  "austin-tx": {
    short: "Austin ETA: 60-120 min",
    detail: "Central Austin calls are routed through daily north, central, and south dispatch lanes.",
  },
  "round-rock-tx": {
    short: "Round Rock ETA: 75-150 min",
    detail: "Round Rock is handled on a regular Williamson County same-day corridor.",
  },
  "georgetown-tx": {
    short: "Georgetown ETA: 90-180 min",
    detail: "Georgetown calls are scheduled through northern route windows with urgent calls prioritized.",
  },
  "pflugerville-tx": {
    short: "Pflugerville ETA: 75-150 min",
    detail: "Pflugerville remains one of the closest same-day northeast dispatch zones.",
  },
  "cedar-park-tx": {
    short: "Cedar Park ETA: 75-150 min",
    detail: "Cedar Park routes run daily, including peak evening windows when available.",
  },
  "leander-tx": {
    short: "Leander ETA: 90-180 min",
    detail: "Leander calls are routed through north and northwest dispatch lanes.",
  },
  "lakeway-tx": {
    short: "Lakeway ETA: 90-180 min",
    detail: "Lakeway appointments use dedicated west-side arrival windows.",
  },
  "bee-cave-tx": {
    short: "Bee Cave ETA: 90-180 min",
    detail: "Bee Cave calls are staged through the western dispatch lane.",
  },
  "west-lake-hills-tx": {
    short: "West Lake Hills ETA: 60-120 min",
    detail: "West Lake Hills sits close to central-west routes for tight communication windows.",
  },
  "rollingwood-tx": {
    short: "Rollingwood ETA: 45-120 min",
    detail: "Rollingwood is covered by central dispatch teams with short travel times.",
  },
  "dripping-springs-tx": {
    short: "Dripping Springs ETA: 2-4 hr",
    detail: "Dripping Springs service is scheduled with Hill Country route windows.",
  },
  "buda-tx": {
    short: "Buda ETA: 90-180 min",
    detail: "Buda remains on a daily south corridor with strong same-day coverage.",
  },
  "kyle-tx": {
    short: "Kyle ETA: 2-4 hr",
    detail: "Kyle calls use planned south-corridor windows with emergency prioritization.",
  },
  "san-marcos-tx": {
    short: "San Marcos ETA: next available",
    detail: "San Marcos calls are scheduled through the southern I-35 corridor, with urgent issues prioritized.",
  },
  "manor-tx": {
    short: "Manor ETA: 90-180 min",
    detail: "Manor is routed through east-side dispatch schedules.",
  },
  "hutto-tx": {
    short: "Hutto ETA: 90-180 min",
    detail: "Hutto is included in daily Williamson County routes.",
  },
  "taylor-tx": {
    short: "Taylor ETA: 2-4 hr",
    detail: "Taylor jobs are planned in dedicated route blocks for reliable arrival windows.",
  },
  "liberty-hill-tx": {
    short: "Liberty Hill ETA: 2-4 hr",
    detail: "Liberty Hill is covered through northern dispatch lanes each service day.",
  },
  "lago-vista-tx": {
    short: "Lago Vista ETA: 2-4 hr",
    detail: "Lago Vista visits use dedicated western route windows.",
  },
  "spicewood-tx": {
    short: "Spicewood ETA: 2-4 hr",
    detail: "Spicewood service is available through planned Hill Country dispatch windows.",
  },
};

export function cityEta(slug: string): LocalEta {
  return CITY_ETA_BY_SLUG[slug] ?? {
    short: "ETA: next available window",
    detail: "We confirm the clearest available arrival window when you book.",
  };
}

export function neighborhoodEta(name: string): LocalEta {
  return {
    short: "Austin ETA: 60-120 min",
    detail: `${name} calls are routed through the Austin same-day dispatch lane.`,
  };
}
