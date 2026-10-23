/** Visible issue choices expected for the published service links. No production mapper import. */
const expectedChoices = [
  ["Emergency Service", "burst-pipe-repair emergency frozen-pipe-repair gas-leak-repair"],
  ["Water Heater", "water-heaters water-heater-repair water-heater-installation water-heater-tune-up tankless tankless-water-heaters"],
  ["Clear a Blockage", "clogged-drain drain-clearing drain-cleaning hydro-jetting"],
  ["Sewer / Main Line Service", "sewer sewer-camera sewer-camera-inspection sewer-services trenchless-sewer-repair"],
  ["Fix a Leak", "leak-detection leak-repair slab-leak slab-leak-repair water-line-repair"],
  ["Fixture (sink, toilet, etc.)", "bathroom-plumbing faucet-sink-repair-installation faucet-sink-services fixtures garbage-disposal-repair-installation garbage-disposal-services kitchen-bathroom-plumbing-installation kitchen-bathroom-plumbing-repair toilet-repair toilet-repair-installation toilet-replacement"],
  ["Other Installation", "backflow-prevention commercial-plumbing gas-line-services gas-lines repiping sump-pump-services water-filtration water-treatment water-softener-repair well-pump-services"],
  ["Other Issue", "inspection plumbing plumbing-inspection repairs water-pressure"],
] as const;

export function expectedIssueChoice(service: string): string {
  const match = expectedChoices.find(([, services]) => services.split(" ").includes(service));
  if (!match) throw new Error(`Published booking service has no reviewed expectation: ${service}`);
  return match[0];
}
