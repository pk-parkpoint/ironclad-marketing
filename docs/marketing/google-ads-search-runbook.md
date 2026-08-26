# Ironclad Google Ads Search Runbook

Last updated: 2026-08-26

## Account and launch contract

- Manager account: `457-337-5000`
- Ironclad customer: `480-357-2715`
- Public phone: `(512) 506-2470`
- License: `RMP #39871`
- Five core Search campaigns: `$15/day` each, 24/7, `$75/day` total
- Freeze: built at `$75/day`, paused until the Austin forecast is below 32°F
- Competitor: built at `$10/day`, paused until explicitly approved
- The legacy Performance Max campaign is excluded from every reconciler mutation and remains paused.
- On 2026-08-26, the paused live budgets for Water Heater, Drain & Sewer, and
  Leaks & Lines were `$30/day`, while the manifest still declares `$15/day`.
  The service-only sync preserves those live values. Do not run the full
  `google-ads:apply` command until the operator confirms which budget contract
  should become canonical.

The checked-in manifest is the source of truth for campaigns, ad groups, keywords, ads, URLs, budgets, CPC caps, locations, negatives, and assets. It uses exact and phrase match only.

## Safe commands

Read-only validation and audit:

```zsh
npm run google-ads:validate
npm run google-ads:plan
npm run google-ads:audit
npm run google-ads:copy-plan
npm run google-ads:services-plan
```

Replace only responsive Search ad copy while requiring every managed campaign
to remain paused. The command creates and verifies each replacement before it
removes the superseded ad; it does not change campaigns, budgets, bids,
keywords, targeting, or image links:

```zsh
npm run google-ads:copy-apply -- --confirm-customer=4803572715
```

Add or reconcile only the tightly qualified water-softener and
garbage-disposal service groups. This command requires all managed campaigns
to remain paused, preserves live budgets and existing shared/campaign
negatives, does not touch image links, and verifies exact-match service terms
plus ad-group negatives after applying:

```zsh
npm run google-ads:services-apply -- --confirm-customer=4803572715
```

Reconcile the build while keeping every managed campaign paused:

```zsh
npm run google-ads:apply -- --confirm-customer=4803572715
```

Enable only the five core campaigns after production verification:

```zsh
npm run google-ads:activate -- --confirm-customer=4803572715
npm run google-ads:audit -- --expect-launch
```

The customer confirmation is required for every write or activation command. The developer token is read from Secret Manager and must never be committed.

## Production verification

Before activation, confirm all of the following:

- Production HTML contains `(512) 506-2470`, `RMP #39871`, and `AW-18207846861`.
- The website-call tag config includes the generated website-call conversion label and `phone_conversion_number` set to `(512) 506-2470`.
- A successful booking emits one booking conversion with the booking ID as `transaction_id`.
- Mobile landing pages show sticky Call and Book Online actions; the emergency page is call-only above the fold.
- Every final URL in the manifest returns a successful landing page after redirects.
- Call reporting is enabled and the Calls from ads conversion requires 60 seconds.
- Booking confirmed, Calls from ads, and Calls from website are the custom campaign goal. Page views and phone taps are not bidding goals.

After activation, inspect the Search Terms and user-location reports daily for the first two weeks. Add negatives for irrelevant intent; do not broaden keyword match types.

## Required UI-only checks

The Google Ads API does not expose reliable write controls for every account UI setting. Verify these in the manager UI before and after launch:

- Expert mode is active.
- Every auto-apply recommendation category is off.
- Automatically created account assets are off.
- Dynamic business assets and dynamic sitelinks are off.
- The Google Business Profile location asset is linked and shows `(512) 506-2470`.
- Call recording, where available and legally appropriate, is configured in the UI.

Campaign-level AI Max, final URL expansion/text automation, Search Partners, Display, presence-only location targeting, CPC limits, and custom conversion goals are API-managed and audit-enforced.

## Known image-asset checkpoint

Six source-managed image assets, one older team image, and the square business
logo are uploaded. On 2026-08-26, Google Ads API v24 accepted all 203 proposed
`AD_IMAGE` links across the 29 managed ad groups in `validateOnly` mode; the
earlier `UNSUPPORTED_FIELD_TYPE` eligibility error is no longer present. There
are still zero live image links. Before applying any, replace the current
all-images-to-all-groups behavior with service-relevant mappings and verify
policy review after creation. Do not enable Display or Performance Max as a
workaround.
